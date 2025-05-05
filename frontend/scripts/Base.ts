import { ethers } from "ethers";

// Replace these with your actual contract ABIs and addresses
import HelpersABI from "../Helpers.json";
import FdcHubABI from "../IFdcHub.json";
import FdcRequestFeeConfigurationsABI from "../IFdcRequestFeeConfigurations.json";
import FlareSystemsManagerABI from "../IFlareSystemsManager.json";
import IRelayABI from "../IRelay.json";

const HelpersAddress = "0x05D9232816110357024cb949a6EF7d61A29D0af2"; // Replace with actual address

async function getHelpers(signer: any) {
    return new ethers.Contract(HelpersAddress, HelpersABI.abi, signer);
}

function toHex(data: string) {
    let result = "";
    for (let i = 0; i < data.length; i++) {
        result += data.charCodeAt(i).toString(16);
    }
    return result.padEnd(64, "0");
}

function toUtf8HexString(data: string) {
    return "0x" + toHex(data);
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getFdcHub(signer: any) {
    const helpers = await getHelpers(signer);
    const fdcHubAddress = await helpers.getFdcHub();
    return new ethers.Contract(fdcHubAddress, FdcHubABI.abi, signer);
}

async function getFlareSystemsManager(provider: ethers.BrowserProvider) {
    const helpers = await getHelpers(provider);
    const flareSystemsManagerAddress = await helpers.getFlareSystemsManager();
    return new ethers.Contract(flareSystemsManagerAddress, FlareSystemsManagerABI.abi, provider);
}

async function getFdcRequestFee(provider: ethers.BrowserProvider, abiEncodedRequest: string) {
    const helpers = await getHelpers(provider);
    const fdcRequestFeeConfigurationsAddress = await helpers.getFdcRequestFeeConfigurations();
    const fdcRequestFeeConfigurations = new ethers.Contract(
        fdcRequestFeeConfigurationsAddress,
        FdcRequestFeeConfigurationsABI.abi,
        provider
    );
    return await fdcRequestFeeConfigurations.getRequestFee(abiEncodedRequest);
}

async function getRelay(signer: any) {
    const helpers = await getHelpers(signer);
    const relayAddress = await helpers.getRelay();
    return new ethers.Contract(relayAddress, IRelayABI.abi, signer);
}

async function prepareAttestationRequestBase(
    url: string,
    apiKey: string,
    attestationTypeBase: string,
    sourceIdBase: string,
    requestBody: any
) {
    console.log("Url:", url, "\n");
    const attestationType = toUtf8HexString(attestationTypeBase);
    const sourceId = toUtf8HexString(sourceIdBase);

    const request = {
        attestationType: attestationType,
        sourceId: sourceId,
        requestBody: requestBody,
    };
    console.log("Prepared request:\n", request, "\n");

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "X-API-KEY": apiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
    if (response.status != 200) {
        throw new Error(`Response status is not OK, status ${response.status} ${response.statusText}\n`);
    }
    console.log("Response status is OK\n");

    return await response.json();
}

async function calculateRoundId(provider: ethers.BrowserProvider, transaction: any) {
    const blockNumber = transaction.receipt.blockNumber || transaction.blockNumber;
    const block = await provider.getBlock(blockNumber);
    if (!block) {
        throw new Error("Block not found");
    }
    const blockTimestamp = BigInt(block.timestamp);

    const flareSystemsManager = await getFlareSystemsManager(provider);
    const firsVotingRoundStartTs = BigInt(await flareSystemsManager.firstVotingRoundStartTs());
    const votingEpochDurationSeconds = BigInt(await flareSystemsManager.votingEpochDurationSeconds());

    console.log("Block timestamp:", blockTimestamp, "\n");
    console.log("First voting round start ts:", firsVotingRoundStartTs, "\n");
    console.log("Voting epoch duration seconds:", votingEpochDurationSeconds, "\n");

    const roundId = Number((blockTimestamp - firsVotingRoundStartTs) / votingEpochDurationSeconds);
    console.log("Calculated round id:", roundId, "\n");
    console.log("Received round id:", Number(await flareSystemsManager.getCurrentVotingEpochId()), "\n");
    return roundId;
}

async function submitAttestationRequest(signer: any, abiEncodedRequest: string, ethersProvider: any) {
    const fdcHub = await getFdcHub(signer);
    console.log("Fdc hub:", fdcHub);
    const requestFee = await getFdcRequestFee(ethersProvider, abiEncodedRequest);
    console.log("Request fee:", requestFee);
    const transaction = await fdcHub.requestAttestation(abiEncodedRequest, {
        value: requestFee,
    });
    await transaction.wait();
    console.log("Submitted request:", transaction, "\n");

    // Wait for the transaction to be mined and get the receipt
    try {
        const receipt = await transaction.wait();
        // Pass the receipt to calculateRoundId
        const roundId = await calculateRoundId(ethersProvider, { receipt });
        console.log(
            `Check round progress at: https://coston2-systems-explorer.flare.rocks/voting-epoch/${roundId}?tab=fdc\n`
        );
        return roundId;
    } catch (error) {
        console.error("Error waiting for transaction receipt:", error);
        throw error;
    }
}

async function postRequestToDALayer(url: string, request: any, watchStatus: boolean = false) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
    if (watchStatus && response.status != 200) {
        throw new Error(`Response status is not OK, status ${response.status} ${response.statusText}\n`);
    } else if (watchStatus) {
        console.log("Response status is OK\n");
    }
    return await response.json();
}

async function retrieveDataAndProofBase(url: string, abiEncodedRequest: string, roundId: number, provider: ethers.BrowserProvider) {
    console.log("Waiting for the round to finalize...");
    // We check every 10 seconds if the round is finalized
    const relay = await getRelay(provider);
    while (!(await relay.isFinalized(200, roundId))) {
        await sleep(30000);
    }
    console.log("Round finalized!\n");

    const request = {
        votingRoundId: roundId,
        requestBytes: abiEncodedRequest,
    };
    console.log("Prepared request:\n", request, "\n");

    await sleep(10000);
    let proof = await postRequestToDALayer(url, request, true);
    console.log("Waiting for the DA Layer to generate the proof...");
    while (proof.response_hex == undefined) {
        await sleep(10000);
        proof = await postRequestToDALayer(url, request, false);
    }
    console.log("Proof generated!\n");

    console.log("Proof:", proof, "\n");
    return proof;
}

export {
    toUtf8HexString,
    sleep,
    prepareAttestationRequestBase,
    submitAttestationRequest,
    retrieveDataAndProofBase,
    getFdcHub,
    getFdcRequestFee,
    getRelay,
    calculateRoundId,
    postRequestToDALayer,
};