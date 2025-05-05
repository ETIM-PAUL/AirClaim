import { insuredFlightsAgencyAddress } from "./config";
import { InsuredFlightsAgencyInstance } from "../../typechain-types";

const InsuredFlightsAgency = artifacts.require("insuredFlightsAgency");


async function main(insuredFlightId: number) {
    const agency: InsuredFlightsAgencyInstance = await InsuredFlightsAgency.at(insuredFlightsAgencyAddress);
    console.log("InsuredFlightsAgency:", agency.address, "\n");

    try {
        try {
            const insuredFlight = await agency.getInsuredFlight(insuredFlightId);
            console.log("Insured flight:", insuredFlight, "\n");
        } catch (error:any) {
            console.error("Transaction failed with error:", error.message);
        
            // Try to extract more information
            if (error.receipt) {
              console.log("Transaction receipt:", error.receipt);
              console.log("Gas used:", error.receipt.gasUsed);
            }
            
            if (error.reason) {
              console.log("Error reason:", error.reason);
            }
            return error;
        }

        const transaction = await agency.claimInsurance(insuredFlightId);
        console.log("Transaction:", transaction.tx, "\n");
    } catch (error:any) {
        console.error("Transaction failed with error:", error.message);
        // Try to extract more information
        if (error.receipt) {
          console.log("Transaction receipt:", error.receipt);
        }
        
        if (error.reason) {
          console.log("Error reason:", error.reason);
        }
        return error;

    }

}

void main(0).then(() => {
    process.exit(0);
});
