// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {RandomNumberV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/RandomNumberV2Interface.sol";

contract BattleShip {
    RandomNumberV2Interface internal randomV2;
    enum DroneDropResult {
      Hit,
      Miss
    }
    struct DroneBattle {
      uint16 prediction;
      uint16 target;
      DroneDropResult result;
      uint256 prize;
      uint256 timestamp;
    }
    uint256 public constant MAX_DROP_AMOUNT = 2 ether;
    uint256 public constant MAX_DROPS = 15;
    mapping(address => DroneBattle[]) public user_drone_battles;
    mapping(address => uint256) public unpaid_wins;

    // uint256 public max_stake_amount;
    // uint256 public max_drops;
    address public owner;

    modifier onlyOwner() {
      require(msg.sender == owner, "NOT_ADMIN");
      _;
    }

    event RandomNumberNotSecure();
    event BattleWinSaved(address player, uint16 prediction, uint16 target, uint256 prize);
    event DroneDropped(
      address player,
      uint16 prediction,
      uint16 target,
      uint8 result,
      uint256 prize,
      uint256 timestamp
    );

    /**
     * Initializing an instance with RandomNumberV2Interface.
     * The contract registry is used to fetch the contract address.
     */
    // constructor(uint256 _max_stake_amount, uint256 _max_drops) {
    constructor() {
        randomV2 = ContractRegistry.getRandomNumberV2();
        owner = msg.sender;
        // max_stake_amount = _max_stake_amount;
        // max_drops = _max_drops;
    }

    function getUserDroneBattles(address user) public view returns (DroneBattle[] memory) {
        return user_drone_battles[user];
    }

    function getUnpaidWins(address user) public view returns (uint256) {
        return unpaid_wins[user];
    }

    // function getMaxDropAmount() public view returns (uint256) {
    //     return MAX_DROP_AMOUNT;
    // }

    // function getMaxDrops() public view returns (uint256) {
    //     return MAX_DROPS;
    // }

    function dropDrone(uint16 prediction) public payable {
        require(msg.value > 0, "ZERO_VALUE");
        require(msg.value <= MAX_DROP_AMOUNT, "MAX_DROP_EXCEEDED");
        (uint256 randomNumber, bool isSecure,) = randomV2.getRandomNumber();
        if (!isSecure) emit RandomNumberNotSecure();

        randomNumber %= MAX_DROPS;
        uint16 target = uint16(randomNumber);
        DroneDropResult result;
        uint256 payout = msg.value<<1;
        if (prediction == target) {
            result = DroneDropResult.Hit;
            if (address(this).balance < payout) {
                unpaid_wins[msg.sender] += payout;
            } else {
                (bool success,) = payable(msg.sender).call{value: payout}("");
                require(success, "PAYOUT_FAILED");
            }
        } else {
            result = DroneDropResult.Miss;
        }
        DroneBattle memory battle = DroneBattle(prediction, target, result, payout, block.timestamp);
        user_drone_battles[msg.sender].push(battle);
        emit DroneDropped(msg.sender, prediction, target, uint8(result), payout, block.timestamp);
    }

    function claimWins(uint256 amount) public {
      require(unpaid_wins[msg.sender] > 0, "NO_PAYOUT_FUNDS_OWED");
      if (address(this).balance < amount) {
        revert("PAYOUT_FUNDS_UNAVAILABLE");
      } else {
        unpaid_wins[msg.sender] -= amount;
        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, "PAYOUT_FAILED");
      }
    }

    function withdrawAll() public onlyOwner() {
      (bool success,) = payable(owner).call{value: address(this).balance}("");
      require(success, "WITHDRAWAL_FAILED");
    }
}
