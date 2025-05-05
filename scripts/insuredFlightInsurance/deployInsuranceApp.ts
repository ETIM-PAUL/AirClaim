import hre, { run } from "hardhat";
import { InsuredFlightsAgencyInstance } from "../../typechain-types";

const InsuredFlightsAgency = artifacts.require("insuredFlightsAgency");

// yarn hardhat run scripts/insuredFlightInsurance/deployDebugContract.ts --network coston2

async function deployAndVerify() {
  console.log("Deploying debug version of InsuredFlightsAgency...");
  
  const args: any[] = ["10000000000000000"]; // 0.01 ETH insurance price
  const agency: InsuredFlightsAgencyInstance = await InsuredFlightsAgency.new(...args);
  
  console.log(`Contract deployed to: ${agency.address}`);
  console.log("Updating config.ts with new address...");
  
  // Create a new config file with the updated address
  const fs = require('fs');
  const configPath = './scripts/insuredFlightInsurance/config.ts';
  const configContent = `export const insuredFlightsAgencyAddress = "${agency.address}";\n`;
  
  fs.writeFileSync(configPath, configContent);
  console.log("Config updated successfully!");
  
  try {
    console.log("Verifying contract on explorer...");
    await run("verify:verify", {
      address: agency.address,
      constructorArguments: args,
    });
    console.log("Contract verified successfully!");
  } catch (e: any) {
    console.log("Verification error:", e.message);
  }
  
  console.log(`(${hre.network.name}) InsuredFlightsAgency deployed to ${agency.address}`);
  console.log("Run the following command to use the new contract:");
  console.log(`yarn hardhat run scripts/insuredFlightInsurance/insureFlight.ts --network ${hre.network.name}`);
}

deployAndVerify().then(() => {
  process.exit(0);
}).catch(error => {
  console.error("Deployment failed:", error);
  process.exit(1);
});