import { insuredFlightsAgencyAddress } from "./config";
import { InsuredFlightsAgencyInstance } from "../../typechain-types";
import {
    prepareAttestationRequestBase,
    submitAttestationRequest,
    retrieveDataAndProofBase,
    sleep,
  } from "../fdcExample/Base";
  
  const {
    JQ_VERIFIER_URL_TESTNET,
    JQ_VERIFIER_API_KEY_TESTNET,
    COSTON2_DA_LAYER_URL,
  } = process.env;

const InsuredFlightsAgency = artifacts.require("insuredFlightsAgency");

// yarn hardhat run scripts/insuredFlightInsurance/insureFlight.ts --network coston2


const postprocessJq = `{
    aircraft_name: (.data[0].airline.name // "N/A"),
    aircraft_reg: (.data[0].aircraft.registration // "N/A"),
    flight_no: .data[0].flight.number,
    flight_date: .data[0].flight_date,
    departure_airport: .data[0].departure.airport,
    arrival_airport: .data[0].arrival.airport,
    flight_delayed_time: (.data[0].departure.delay // 0),
    flight_status: (.data[0].flight_status // "N/A")
}`;
const abiSignature = `{
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
          \"name\": \"dto\",
          \"type\": \"tuple\"
        }`;

  // Configuration constants
const attestationTypeBase = "IJsonApi";
const sourceIdBase = "WEB2";
const verifierUrlBase = JQ_VERIFIER_URL_TESTNET;

async function prepareUrl() {
    return `https://api.aviationstack.com/v1/flights?access_key=2714c9fc905d1214adbfe10c1137f373&flight_number=9039&airline_icao=AAL&limit=1`;
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

    const url = `${verifierUrlBase}JsonApi/prepareRequest`;
    const apiKey = JQ_VERIFIER_API_KEY_TESTNET!;

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
    roundId: number
  ) {
    const url = `${COSTON2_DA_LAYER_URL}api/v1/fdc/proof-by-request-round-raw`;
    console.log("Url:", url, "\n");
    return await retrieveDataAndProofBase(url, abiEncodedRequest, roundId);
  }


  async function insureFlight(
    agency: InsuredFlightsAgencyInstance,
    proof: any
  ) {
    // A piece of black magic that allows us to read the response type from an artifact
    const IJsonApiVerification = await artifacts.require("IJsonApiVerification");
    const responseType =
      IJsonApiVerification._json.abi[0].inputs[0].components[1];
  
    const decodedResponse = web3.eth.abi.decodeParameter(
      responseType,
      proof.response_hex
    );

  
      try {
        const transaction = await agency.getFlightDetails({
          merkleProof: proof.proof,
          data: decodedResponse,
        }
    );
        console.log("Flight details:", transaction);
      } catch (error: any) {
        console.error("Transaction failed with error:", error);
      }
    }
  
  async function main() {
    try {
      const agency: InsuredFlightsAgencyInstance = await InsuredFlightsAgency.at(
        insuredFlightsAgencyAddress
      );
      console.log("InsuredFlightsAgency:", agency.address, "\n");

      const apiUrl = await prepareUrl();
      console.log("API URL:", apiUrl, "\n");

      const data = await prepareAttestationRequest(
        apiUrl,
        postprocessJq,
        abiSignature
      );
      console.log("Prepared attestation data:", data, "\n");

      if (!data.abiEncodedRequest) {
        throw new Error("No abiEncodedRequest received from verifier");
      }

      const roundId = await submitAttestationRequest(data.abiEncodedRequest);
      console.log("Round ID:", roundId, "\n");

      const proof = await retrieveDataAndProof(data.abiEncodedRequest, roundId);
      console.log("Proof:", proof, "\n");

      await insureFlight(agency, proof);
    } catch (error) {
      console.error("Error in main:", error);
      throw error;
    }
  }

main().then(() => {
  process.exit(0);
});
