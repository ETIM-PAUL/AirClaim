import { ethers } from "ethers";
import IFlareContractRegistry from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFlareContractRegistry.sol/IFlareContractRegistry.json";
import IPriceSubmitter from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IPriceSubmitter.sol/IPriceSubmitter.json";
import IGovernanceSettings from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IGovernanceSettings.sol/IGovernanceSettings.json";
import IFtsoRewardManager from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFtsoRewardManager.sol/IFtsoRewardManager.json";
import IFtsoRegistry from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFtsoRegistry.sol/IFtsoRegistry.json";
import IVoterWhitelister from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IVoterWhitelister.sol/IVoterWhitelister.json";
import IFtsoManager from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFtsoManager.sol/IFtsoManager.json";
import IWNat from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IWNat.sol/IWNat.json";
import IGovernanceVotePower from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IGovernanceVotePower.sol/IGovernanceVotePower.json";
import IClaimSetupManager from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IClaimSetupManager.sol/IClaimSetupManager.json";
import IFlareAssetRegistry from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFlareAssetRegistry.sol/IFlareAssetRegistry.json";
import ISubmission from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/ISubmission.sol/ISubmission.json";
import IEntityManager from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IEntityManager.sol/IEntityManager.json";
import IVoterRegistry from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IVoterRegistry.sol/IVoterRegistry.json";
import IFlareSystemsCalculator from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFlareSystemsCalculator.sol/IFlareSystemsCalculator.json";
import IFlareSystemsManager from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFlareSystemsManager.sol/IFlareSystemsManager.json";
import IRewardManager from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IRewardManager.sol/IRewardManager.json";
import IRelay from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IRelay.sol/IRelay.json";
import IWNatDelegationFee from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IWNatDelegationFee.sol/IWNatDelegationFee.json";
import IFtsoInflationConfigurations from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFtsoInflationConfigurations.sol/IFtsoInflationConfigurations.json";
import IFtsoRewardOffersManager from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFtsoRewardOffersManager.sol/IFtsoRewardOffersManager.json";
import IFtsoFeedDecimals from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFtsoFeedDecimals.sol/IFtsoFeedDecimals.json";
import IFtsoFeedPublisher from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFtsoFeedPublisher.sol/IFtsoFeedPublisher.json";
import IFtsoFeedIdConverter from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFtsoFeedIdConverter.sol/IFtsoFeedIdConverter.json";
import IFastUpdateIncentiveManager from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFastUpdateIncentiveManager.sol/IFastUpdateIncentiveManager.json";
import IFastUpdatesConfiguration from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFastUpdatesConfiguration.sol/IFastUpdatesConfiguration.json";
import IFastUpdater from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFastUpdater.sol/IFastUpdater.json";
import IFeeCalculator from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFeeCalculator.sol/IFeeCalculator.json";
import FtsoV2Interface from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/FtsoV2Interface.sol/FtsoV2Interface.json";
import TestFtsoV2Interface from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/TestFtsoV2Interface.sol/TestFtsoV2Interface.json";
import ProtocolsV2Interface from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/ProtocolsV2Interface.sol/ProtocolsV2Interface.json";
import RandomNumberV2Interface from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/RandomNumberV2Interface.sol/RandomNumberV2Interface.json";
import RewardsV2Interface from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/RewardsV2Interface.sol/RewardsV2Interface.json";
import IFdcVerification from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFdcVerification.sol/IFdcVerification.json";
import IFdcHub from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFdcHub.sol/IFdcHub.json";
import IFdcRequestFeeConfigurations from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IFdcRequestFeeConfigurations.sol/IFdcRequestFeeConfigurations.json";
import IJsonApiVerification from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IJsonApiVerification.sol/IJsonApiVerification.json";
import IWeb2JsonVerification from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IWeb2JsonVerification.sol/IWeb2JsonVerification.json";
import IAssetManagerController from "../../artifacts/@flarenetwork/flare-periphery-contracts/coston2/IAssetManagerController.sol/IAssetManagerController.json";

const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_COSTON2_RPC_URL);
const FLARE_CONTRACT_REGISTRY_ADDRESS = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";

export async function getFlareContractRegistry() {
  return new ethers.Contract(FLARE_CONTRACT_REGISTRY_ADDRESS, IFlareContractRegistry.abi, provider);
}

export async function getContractAddressByName(name: string) {
    const registry = await getFlareContractRegistry();
    return await registry.getContractAddressByName(name);
}

export async function getPriceSubmitter() {
    const address: string = await getContractAddressByName("PriceSubmitter");
    return new ethers.Contract(address, IPriceSubmitter.abi, provider);
  }

export async function getGovernanceSettings() {
    const address: string = await getContractAddressByName("GovernanceSettings");
    return new ethers.Contract(address, IGovernanceSettings.abi, provider);
}

export async function getFtsoRewardManager() {
    const address: string = await getContractAddressByName("FtsoRewardManager");
    return new ethers.Contract(address, IFtsoRewardManager.abi, provider);
}

export async function getFtsoRegistry() {
    const address: string = await getContractAddressByName("FtsoRegistry");
    return new ethers.Contract(address, IFtsoRegistry.abi, provider);
}

export async function getVoterWhitelister() {
    const address: string = await getContractAddressByName("VoterWhitelister");
    return new ethers.Contract(address, IVoterWhitelister.abi, provider);
}

export async function getFtsoManager() {
    const address: string = await getContractAddressByName("FtsoManager");
    return new ethers.Contract(address, IFtsoManager.abi, provider);
}

export async function getWNat() {
    const address: string = await getContractAddressByName("WNat");
    return new ethers.Contract(address, IWNat.abi, provider);
}

export async function getGovernanceVotePower() {
    const address: string = await getContractAddressByName("GovernanceVotePower");
    return new ethers.Contract(address, IGovernanceVotePower.abi, provider);
}

export async function getClaimSetupManager() {
    const address: string = await getContractAddressByName("ClaimSetupManager");
    return new ethers.Contract(address, IClaimSetupManager.abi, provider);
}

export async function getFlareAssetRegistry() {
    const address: string = await getContractAddressByName("FlareAssetRegistry");
    return new ethers.Contract(address, IFlareAssetRegistry.abi, provider);
}

export async function getSubmission() {
    const address: string = await getContractAddressByName("Submission");
    return new ethers.Contract(address, ISubmission.abi, provider);
}

export async function getEntityManager() {
    const address: string = await getContractAddressByName("EntityManager");
    return new ethers.Contract(address, IEntityManager.abi, provider);
}

export async function getVoterRegistry() {
    const address: string = await getContractAddressByName("VoterRegistry");
    return new ethers.Contract(address, IVoterRegistry.abi, provider);
}

export async function getFlareSystemsCalculator() {
    const address: string = await getContractAddressByName("FlareSystemsCalculator");
    return new ethers.Contract(address, IFlareSystemsCalculator.abi, provider);
}

export async function getFlareSystemsManager() {
    const address: string = await getContractAddressByName("FlareSystemsManager");
    return new ethers.Contract(address, IFlareSystemsManager.abi, provider);
}

export async function getRewardManager() {
    const address: string = await getContractAddressByName("RewardManager");
    return new ethers.Contract(address, IRewardManager.abi, provider);
}

export async function getRelay() {
    const address: string = await getContractAddressByName("Relay");
    return new ethers.Contract(address, IRelay.abi, provider);
}

export async function getWNatDelegationFee() {
    const address: string = await getContractAddressByName("WNatDelegationFee");
    return new ethers.Contract(address, IWNatDelegationFee.abi, provider);
}

export async function getFtsoInflationConfigurations() {
    const address: string = await getContractAddressByName("FtsoInflationConfigurations");
    return new ethers.Contract(address, IFtsoInflationConfigurations.abi, provider);
}

export async function getFtsoRewardOffersManager() {
    const address: string = await getContractAddressByName("FtsoRewardOffersManager");
    return new ethers.Contract(address, IFtsoRewardOffersManager.abi, provider);
}

export async function getFtsoFeedDecimals() {
    const address: string = await getContractAddressByName("FtsoFeedDecimals");
    return new ethers.Contract(address, IFtsoFeedDecimals.abi, provider);
}

export async function getFtsoFeedPublisher() {
    const address: string = await getContractAddressByName("FtsoFeedPublisher");
    return new ethers.Contract(address, IFtsoFeedPublisher.abi, provider);
}

export async function getFtsoFeedIdConverter() {
    const address: string = await getContractAddressByName("FtsoFeedIdConverter");
    return new ethers.Contract(address, IFtsoFeedIdConverter.abi, provider);
}

export async function getFastUpdateIncentiveManager() {
    const address: string = await getContractAddressByName("FastUpdateIncentiveManager");
    return new ethers.Contract(address, IFastUpdateIncentiveManager.abi, provider);
}

export async function getFastUpdater() {
    const address: string = await getContractAddressByName("FastUpdater");
    return new ethers.Contract(address, IFastUpdater.abi, provider);
}

export async function getFastUpdatesConfiguration() {
    const address: string = await getContractAddressByName("FastUpdatesConfiguration");
    return new ethers.Contract(address, IFastUpdatesConfiguration.abi, provider);
}

export async function getFeeCalculator() {
    const address: string = await getContractAddressByName("FeeCalculator");
    return new ethers.Contract(address, IFeeCalculator.abi, provider);
}

export async function getFtsoV2() {
    const address: string = await getContractAddressByName("FtsoV2");
    return new ethers.Contract(address, FtsoV2Interface.abi, provider);
}

export async function getTestFtsoV2() {
    const address: string = await getContractAddressByName("TestFtsoV2");
    return new ethers.Contract(address, TestFtsoV2Interface.abi, provider);
}

export async function getProtocolsV2() {
    const address: string = await getContractAddressByName("ProtocolsV2");
    return new ethers.Contract(address, ProtocolsV2Interface.abi, provider);
}

export async function getRandomNumberV2() {
    const address: string = await getContractAddressByName("RandomNumberV2");
    return new ethers.Contract(address, RandomNumberV2Interface.abi, provider);
}

export async function getRewardsV2() {
    const address: string = await getContractAddressByName("RewardsV2");
    return new ethers.Contract(address, RewardsV2Interface.abi, provider);
}

export async function getFdcVerification() {
    const address: string = await getContractAddressByName("FdcVerification");
    return new ethers.Contract(address, IFdcVerification.abi, provider);
}

export async function getFdcHub() {
    const address: string = await getContractAddressByName("FdcHub");
    return new ethers.Contract(address, IFdcHub.abi, provider);
}

export async function getFdcRequestFeeConfigurations() {
    const address: string = await getContractAddressByName("FdcRequestFeeConfigurations");
    return new ethers.Contract(address, IFdcRequestFeeConfigurations.abi, provider);
}

export async function getWeb2JsonVerification() {
     const address: string = await getContractAddressByName("Web2JsonVerification");
    return new ethers.Contract(address, IWeb2JsonVerification.abi, provider);
}

export async function getAssetManagerController() {
    const address: string = await getContractAddressByName("AssetManagerController");
    return new ethers.Contract(address, IAssetManagerController.abi, provider);
}