import {
    prepareAttestationRequestBase,
    submitAttestationRequest,
    retrieveDataAndProofBase,
  } from "./fdc";
import { BrowserProvider } from "ethers";
import { ethers } from "ethers";
import { insuredFlightsAgencyAddress } from "~/utils";
import insuredFlightsAgencyAbi from 'insuredFlightsAgency.json';
// import IJsonApiVerificationAbi from 'IJsonApiVerification.json';
import Web3 from 'web3';
import IWeb2JsonVerification from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IWeb2JsonVerification.sol/IWeb2JsonVerification.json";
// use ABI
const abi = IWeb2JsonVerification.abi;

const web3 = new Web3();

const FLIGHT_API_KEY = import.meta.env.VITE_FLIGHT_API_KEY;
const COSTON2_DA_LAYER_URL = import.meta.env.VITE_COSTON2_DA_LAYER_URL;
const WEB2JSON_VERIFIER_URL_TESTNET = import.meta.env.WEB2JSON_VERIFIER_URL_TESTNET;
const VERIFIER_API_KEY_TESTNET = import.meta.env.VERIFIER_API_KEY_TESTNET;

  
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
    return `https://api.aviationstack.com/v1/flights?access_key=${accessKey}&flight_number=${flightNo}&airline_icao=${airlineIcao}&limit=1`;
  }

async function prepareAttestationRequest(
    apiUrl: string,
    postprocessJq: string,
    abiSignature: string
  ) {
    const requestBody = {   
        url: apiUrl,
        postprocessJq: postprocessJq,
        abi_signature: abiSignature,
    };

    const url = `${verifierUrlBase}Web2Json/prepareRequest`; 
    const apiKey = VERIFIER_API_KEY_TESTNET!;

    const response = await prepareAttestationRequestBase(
        url,
        apiKey,
        attestationTypeBase,
        sourceIdBase,
        requestBody
    );

    // Add validation and logging
    if (!response || !response.abiEncodedRequest) { 
        console.error("Invalid response from verifier:", response);
        throw new Error("Missing abiEncodedRequest in verifier response");
    }

    console.log("Verifier response:", response);
    return response;
}       

async function retrieveDataAndProof(
    abiEncodedRequest: string,
    roundId: number,
  ) {
    const url = `${COSTON2_DA_LAYER_URL}api/v1/fdc/proof-by-request-round-raw`;
    console.log("Url:", url, "\n");
    return await retrieveDataAndProofBase(url, abiEncodedRequest, roundId);
}

async function addFlight(
    agency: any,
    aircraft_icao: string,
    flight_no: string,
    passengers: string[],
    proof: any,
    walletProvider: any
) {
    // const responseType: any = IJsonApiVerificationAbi.abi[0].inputs[0].components[1];

    // A piece of black magic that allows us to read the response type from an artifact
    const responseType = (abi as any)[0].inputs[0].components[1];
    console.log("Response type:", responseType, "\n");

    try {
    // Decode the response
    const decodedResponse = web3.eth.abi.decodeParameter(
        responseType,
        proof.response_hex
    );

    const proofObject = {
        merkleProof: proof.proof,
        data: decodedResponse
      };
    

    const requiredAmount = await agency.getCostOfInsurance(passengers);

    // Try with a much lower gas limit first to test
    const gasEstimate = await agency.insureFlight.estimateGas(
        aircraft_icao,
        flight_no,
        passengers,
        proofObject,
        {
          value: requiredAmount.toString(),
          from: await walletProvider.getAddress()
        }
      ).catch((e: any) => {
        console.error("Gas estimation failed:", e.message);
        return 3000000; // Fallback gas limit
      });

      // Use 1.5x the estimated gas to be safe
      const gasLimit = Number(gasEstimate) * 1.5;
      console.log("Using gas limit:", gasLimit);

    const tx = await agency.insureFlight(aircraft_icao, flight_no, passengers, proofObject, {
        value: requiredAmount.toString(),
        from: await walletProvider.getAddress(),
        gas: gasLimit
      });
    await tx.wait();
    console.log("tx", tx)
    return "Flight insured successfully";
    } catch (error: any) {
        console.log("error", error)
        return error.reason;
    }
}


export async function insureFlight(aircraft_icao: string, flight_no: string, passengers: any[], walletProvider: any) {
    try {
        const ethersProvider = new BrowserProvider(walletProvider as any);
        const signer = await ethersProvider.getSigner();
        // The Contract object
        const insuredFlightsAgencyContract = new ethers.Contract(insuredFlightsAgencyAddress, insuredFlightsAgencyAbi.abi, signer);
  
        const apiUrl = await prepareUrl(FLIGHT_API_KEY!, flight_no, aircraft_icao);

        const data = await prepareAttestationRequest(apiUrl, postprocessJq, abiSignature);
        const roundId = await submitAttestationRequest(data.abiEncodedRequest);
        const proof = await retrieveDataAndProof(data.abiEncodedRequest, roundId);
        try {
            await addFlight(insuredFlightsAgencyContract, aircraft_icao, flight_no, passengers, proof, signer);
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