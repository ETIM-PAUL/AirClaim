import { insuredFlightsAgencyAddress } from "./config";
import { InsuredFlightsAgencyInstance } from "../../typechain-types";
import {
    prepareAttestationRequestBase,
    submitAttestationRequest,
    retrieveDataAndProofBase,
    sleep,
  } from "../fdcExample/Base";
import { web3 } from "hardhat";
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
  flight_delayed_time: (if .data[0].departure.delay == null or .data[0].departure.delay == "" then 0 else (.data[0].departure.delay | tonumber) end),
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
          \"internalType\": \"struct DataTransportObject\",
          \"name\": \"task\",
          \"type\": \"tuple\"
        }`;

  // Configuration constants
const attestationTypeBase = "IJsonApi";
const sourceIdBase = "WEB2";
const verifierUrlBase = JQ_VERIFIER_URL_TESTNET;

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
    proof: any,
    flightPrice: string,
    passengers: string[],
    flightNo: string,
    airlineIcao: string
  ) {
    const IJsonApiVerification = await artifacts.require("IJsonApiVerification");
    const responseType = IJsonApiVerification._json.abi[0].inputs[0].components[1];
    const accounts = await web3.eth.getAccounts();

    try {
      // Decode the response
      const decodedResponse = web3.eth.abi.decodeParameter(
        responseType,
        proof.response_hex
      );
      console.log("Decoded Response:", JSON.stringify(decodedResponse, null, 2));

      
      // Get cost of insurance
      const requiredAmount = await agency.getCostOfInsurance(flightPrice, passengers);
      console.log("\n--- Insurance Details ---");
      console.log("Required amount:", requiredAmount.toString());
      console.log("Account:", accounts[0]);
      
      // Check balance
      const balance = await web3.eth.getBalance(accounts[0]);
      console.log("Account balance:", balance);
      console.log("Has sufficient funds:", BigInt(balance) >= BigInt(requiredAmount));
      
      // Try the transaction with a lower gas limit and step-by-step debugging
      console.log("\n--- Executing Transaction ---");
      try {
        // Create the proof object exactly as expected by the contract
        const proofObject = {
          merkleProof: proof.proof,
          data: decodedResponse
        };
        
        console.log("Proof object created", proofObject);
        console.log("Flight status:", decodedResponse.flight_status);
        console.log("Flight delayed time:", decodedResponse.flight_delayed_time);
        
        // Try with a much lower gas limit first to test
        const gasEstimate = await agency.insureFlight.estimateGas(
          airlineIcao,
          flightNo,
          passengers,
          flightPrice,
          proofObject,
          {
            value: requiredAmount.toString(),
            from: accounts[0]
          }
        ).catch((e: any) => {
          console.error("Gas estimation failed:", e.message);
          return e.reason;
        });
        
        console.log("Estimated gas:", gasEstimate);
        
        // Use 1.5x the estimated gas to be safe
        const gasLimit = Math.ceil(gasEstimate * 1.5);
        console.log("Using gas limit:", gasLimit);
        
        const transaction = await agency.insureFlight(
          airlineIcao,
          flightNo,
          passengers,
          flightPrice,
          proofObject,
          {
            value: requiredAmount.toString(),
            from: accounts[0],
            gas: gasLimit
          }
        );
        
        console.log("Transaction successful:", transaction.tx);
        console.log("Transaction receipt:", transaction.receipt);
        
        // Check if the insurance was created
        const insuranceCount = await agency.insuredFlightIds();
        console.log("Insurance count after transaction:", insuranceCount.toString());
        
        if (insuranceCount > 0) {
          const latestInsurance = await agency.getInsuredFlight(insuranceCount - 1);
          console.log("Latest insurance:", latestInsurance);
        }
        
      } catch (error: any) {
        console.error("Transaction failed with error:", error.message);
        
        // Try to extract more information
        if (error.receipt) {
          console.log("Transaction receipt:", error.receipt);
        }
        
        if (error.reason) {
          console.log("Error reason:", error.reason);
        }
        
        throw new Error(`Insurance transaction failed: ${error.message}`);
      }
    } catch (error: any) {
      console.error("Function execution failed:", error);
      throw error;
    }
  }
  
  async function main(accessKey: string, flightNo: string, airlineIcao: string, flightPrice: string, passengers: string[]) {
    try {
      const agency: InsuredFlightsAgencyInstance = await InsuredFlightsAgency.at(
        insuredFlightsAgencyAddress
      );
      console.log("InsuredFlightsAgency:", agency.address, "\n");

      const apiUrl = await prepareUrl(accessKey, flightNo, airlineIcao);
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

      await insureFlight(agency, proof, flightPrice, passengers, flightNo, airlineIcao);
    } catch (error) {
      console.error("Error in main:", error);
      throw error;
    }
  }

  const flightPrice = "10000000000000000";  // 0.01 ETH
  const passengers = [
    "0x9d4eF81F5225107049ba08F69F598D97B31ea644",
    "0x1b6e16403b06a51C42Ba339E356a64fE67348e92"
  ];
  const accessKey = "7ebf708bbced8cbfedc67a44e19721b7";
  const flightNo = "1233";
  const airlineIcao = "AXB";


main(accessKey, flightNo, airlineIcao, flightPrice, passengers).then(() => {
  process.exit(0);
});
