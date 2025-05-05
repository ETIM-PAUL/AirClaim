import { insuredFlightsAgencyAddress } from "./config";
import { InsuredFlightsAgencyInstance } from "../../typechain-types";

const InsuredFlightsAgency = artifacts.require("insuredFlightsAgency");


async function getAllFlights() {
    const agency: InsuredFlightsAgencyInstance = await InsuredFlightsAgency.at(insuredFlightsAgencyAddress);
    console.log("InsuredFlightsAgency:", agency.address, "\n");

    try {
        const insuredFlights = await agency.getAllInsureFlights();
        console.log("Insured flights:", insuredFlights, "\n");
        return insuredFlights;
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

}

export { getAllFlights };