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
import IWeb2JsonVerification from "IWeb2JsonVerification.json";


// use ABI
const abi = IWeb2JsonVerification.abi;

const web3 = new Web3();

const FLIGHT_API_KEY = import.meta.env.VITE_FLIGHT_API_KEY;
const COSTON2_DA_LAYER_URL = import.meta.env.VITE_COSTON2_DA_LAYER_URL;
const WEB2JSON_VERIFIER_URL_TESTNET = import.meta.env.VITE_WEB2JSON_VERIFIER_URL_TESTNET;
const VERIFIER_API_KEY_TESTNET = import.meta.env.VITE_VERIFIER_API_KEY_TESTNET;
  
console.log("WEB2JSON_VERIFIER_URL_TESTNET",WEB2JSON_VERIFIER_URL_TESTNET)
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
    passengers:any,
    proof: any,
    signer: any
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

    const proofObject = {
        merkleProof: proof.proof,
        data: decodedResponse
      };
    

    const requiredAmount = await agency.getCostOfInsurance(passengers);


    const tx = await agency.insureFlight(
        aircraft_icao,
        flight_no,
        passengers,
        proofObject,
        {
          value: requiredAmount,
        }
      );
    await tx.wait();
    return tx;
    } catch (error: any) {
        console.log("error", error)
        return error.reason;
    }
}


export async function insureFlightAction (aircraft_icao: string, flight_no: string, passengers: any[], walletProvider: any) {
    try {
        // const ethersProvider = new ethers.BrowserProvider(window?.ethereum as any);
        // // const signer = await ethersProvider.getSigner();

        // const pk = process.env.PRIVATE_KEY?.trim();
        // if (!pk) throw new Error("Missing PRIVATE_KEY in .env");
        
        // const signer = new ethers.Wallet(pk, ethersProvider);

        const ethersProvider = new ethers.BrowserProvider(walletProvider as any);
        const signer = await ethersProvider.getSigner();
        // The Contract object
        const insuredFlightsAgencyContract = new ethers.Contract(insuredFlightsAgencyAddress, insuredFlightsAgencyAbi.abi, signer);
  
        const apiUrl = await prepareUrl(FLIGHT_API_KEY!, flight_no, aircraft_icao);

        const data:any = await prepareAttestationRequest(apiUrl, postprocessJq, abiSignature, flight_no, aircraft_icao);
        
        const roundId = await submitAttestationRequest(data.abiEncodedRequest, signer);
        const proof = await retrieveDataAndProof(data.abiEncodedRequest, roundId);
        try {
            const result = await addFlight(insuredFlightsAgencyContract, aircraft_icao, flight_no, passengers, proof, signer);
            return result;
        } catch (error) {
            console.log("error", error)
            return error;
        }
    } catch (error) {
      console.error("Error in main:", error);
      return error;
    }
}