import {
    prepareAttestationRequestBase,
    submitAttestationRequest,
    retrieveDataAndProofBaseWithRetry,
  } from "./fdc";
import { ethers } from "ethers";
import { insuredFlightsAgencyAddress } from "~/utils";
import insuredFlightsAgencyAbi from 'insuredFlightsAgency.json';
// import IJsonApiVerificationAbi from 'IJsonApiVerification.json';
import Web3 from 'web3';
import IWeb2JsonVerification from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IWeb2JsonVerification.sol/IWeb2JsonVerification.json";

import dotenv from 'dotenv';

// Load environment variables at the top
dotenv.config();

// use ABI
const abi = IWeb2JsonVerification.abi;

const web3 = new Web3();

const FLIGHT_API_KEY = process.env.FLIGHT_API_KEY;
const COSTON2_DA_LAYER_URL = process.env.COSTON2_DA_LAYER_URL;
const WEB2JSON_VERIFIER_URL_TESTNET = process.env.WEB2JSON_VERIFIER_URL_TESTNET;
const VERIFIER_API_KEY_TESTNET = process.env.VERIFIER_API_KEY_TESTNET;
  
  export const postprocessJq = `{
      aircraft_name: (.data[0].airline.name // "N/A"),
      aircraft_reg: (.data[0].aircraft.registration // "N/A"),
      flight_no: .data[0].flight.number,
  flight_date: .data[0].flight_date,
  departure_airport: .data[0].departure.airport,
  arrival_airport: .data[0].arrival.airport,
  flight_delayed_time: (if .data[0].departure.delay == null or .data[0].departure.delay == "" then 0 else (.data[0].departure.delay | tonumber) end),
  flight_status: (.data[0].flight_status // "N/A")
  }`;
  const httpMethod = "GET";
// Defaults to "Content-Type": "application/json"
const headers = "{}";

const body = "{}";

  export const abiSignature = `{
      \"components\": [
          {
              \"internalType\": \"string\",
              \"name\": \"aircraft_name\",
              \"type\": \"string\"
              },
              {
              \"internalType\": \"string\",
              \"name\": \"aircraft_reg\",
              \"type\": \"string\"
            },
            {
              \"internalType\": \"string\",
              \"name\": \"flight_no\",
              \"type\": \"string\"
            },
            {
              \"internalType\": \"string\",
              \"name\": \"flight_date\",
              \"type\": \"string\"
            },
            {
              \"internalType\": \"string\",
              \"name\": \"departure_airport\",
              \"type\": \"string\"
            },
            {
              \"internalType\": \"string\",
              \"name\": \"arrival_airport\",
              \"type\": \"string\"
            },
            {
              \"internalType\": \"uint256\",
              \"name\": \"flight_delayed_time\",
              \"type\": \"uint256\"
            },
            {
              \"internalType\": \"string\",
              \"name\": \"flight_status\",
              \"type\": \"string\"
            }
          ],
          \"internalType\": \"struct DataTransportObject\",
          \"name\": \"task\",
          \"type\": \"tuple\"
        }`;

          // Configuration constants
export const attestationTypeBase = "Web2Json";
export const sourceIdBase = "PublicWeb2";
export const verifierUrlBase = WEB2JSON_VERIFIER_URL_TESTNET;

async function prepareUrl(accessKey: string, flightNo: string, airlineIcao: string) {
    return `https://api.aviationstack.com/v1/flights`;
  }

async function prepareAttestationRequest(
    apiUrl: string,
    postprocessJq: string,
    abiSignature: string,
    flightNo: string,
    airlineIcao: string
  ) {
    const queryParams = JSON.stringify({
      access_key: FLIGHT_API_KEY,
      flight_number: flightNo,
      airline_icao: airlineIcao,
      limit: 1,
      offset: 0
    });

    const requestBody = {   
        url: apiUrl,
        httpMethod: httpMethod,
        headers: headers,
        queryParams: queryParams,
        body: body,
        postProcessJq: postprocessJq,
        abiSignature: abiSignature,
    };

    const url = `${verifierUrlBase}Web2Json/prepareRequest`; 
    const apiKey:any = VERIFIER_API_KEY_TESTNET;

    const response = await prepareAttestationRequestBase(
        url,
        apiKey,
        attestationTypeBase,
        sourceIdBase,
        requestBody
    );
    return response;
}       

async function retrieveDataAndProof(
    abiEncodedRequest: string,
    roundId: number,
  ) {
    const url = `${COSTON2_DA_LAYER_URL}api/v1/fdc/proof-by-request-round-raw`;
    console.log("Url:", url, "\n");
    return await retrieveDataAndProofBaseWithRetry(url, abiEncodedRequest, roundId);
}

async function addFlight(
    agency: any,
    aircraft_icao: string,
    flight_no: string,
    proof: any,
    walletProvider: any
) {
    // const responseType: any = IJsonApiVerificationAbi.abi[0].inputs[0].components[1];

    // A piece of black magic that allows us to read the response type from an artifact
    const responseType = (abi as any)[0].inputs[0].components[1];
    console.log("Response type:", responseType, "\n");

    try {
    // Decode the response
    const decodedResponse:any = web3.eth.abi.decodeParameter(
        responseType,
        proof.response_hex
    );

    console.log("decodedResponse",decodedResponse)

    const proofObject = {
        merkleProof: proof.proof,
        data: decodedResponse
      };

    const passengers:any = [
      {
        wallet:"0x0daAd898fd44B4af14d0d169c1bbA4f13bcD7D26",
        ticketType: "Economy",
        ticketPrice: ethers.parseEther("0.1")
      },
      {
        wallet:"0x9C9Dda5D4905E4A5418B04f58F7697Eb27eFA6E1",
        ticketType: "Business",
        ticketPrice: ethers.parseEther("0.2")
      }
    ]
    

    const requiredAmount = await agency.getCostOfInsurance(passengers);

    console.log("requiredAmount", requiredAmount)

    // Try with a much lower gas limit first to test
    const gasEstimate = await agency.insureFlight.estimateGas(
        aircraft_icao,
        flight_no,
        passengers,
        proofObject,
        {
          value: requiredAmount,
          from: await walletProvider.getAddress()
        }
      ).catch((e: any) => {
        console.error("Gas estimation failed:", e);
        return 3000000; // Fallback gas limit
      });
      console.log("gas", gasEstimate)
      
      // Use 1.5x the estimated gas to be safe
      const gasLimit = Number(gasEstimate) * 1.5;
      console.log("Using gas limit:", gasLimit);

    const tx = await agency.insureFlight(
        aircraft_icao,
        flight_no,
        passengers,
        proofObject,
        {
          value: requiredAmount.toString(),
          gasLimit
        }
      );
    await tx.wait();
    console.log("tx", tx)
    console.log("Flight insured successfully");
    } catch (error: any) {
        console.log("error", error)
        return error.reason;
    }
}


async function main (aircraft_icao: string, flight_no: string, passengers: any[], walletProvider: any) {
    try {
        const ethersProvider = new ethers.JsonRpcProvider(process.env.COSTON2_RPC_URL);
        // const signer = await ethersProvider.getSigner();

        const pk = process.env.PRIVATE_KEY?.trim();
        if (!pk) throw new Error("Missing PRIVATE_KEY in .env");
        
        const signer = new ethers.Wallet(pk, ethersProvider);
        // The Contract object
        const insuredFlightsAgencyContract = new ethers.Contract(insuredFlightsAgencyAddress, insuredFlightsAgencyAbi.abi, signer);
  
        const apiUrl = await prepareUrl(FLIGHT_API_KEY!, flight_no, aircraft_icao);

        const data:any = await prepareAttestationRequest(apiUrl, postprocessJq, abiSignature, flight_no, aircraft_icao);
        
        const roundId = await submitAttestationRequest(data.abiEncodedRequest, signer);
        const proof = await retrieveDataAndProof(data.abiEncodedRequest, roundId);
        try {
            await addFlight(insuredFlightsAgencyContract, aircraft_icao, flight_no, proof, signer);
            return "Flight updated successfully";
        } catch (error) {
            console.log("error", error)
            return error;
        }
    } catch (error) {
      console.error("Error in main:", error);
      return error;
    }
}

main("RAM", "9423", [], "ieir").catch((err) => {
  console.error("Error running insureFlight:", err);
});