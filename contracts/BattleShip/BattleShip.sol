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
    uint256 public constant MAX_DROPS = 15; // domain 0..15 inclusive
    mapping(address => DroneBattle[]) public userDroneBattles;
    mapping(address => uint256) public unpaidWins;
    mapping(address => uint16) private lastTarget;
    mapping(address => bool) private hasLastTarget;

    // uint256 public max_stake_amount;
    // uint256 public max_drops;
    address public owner;

    modifier onlyOwner() {
      require(msg.sender == owner, "NOT_ADMIN");
      _;
    }

    // Removed BattleWinSaved
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
        return userDroneBattles[user];
    }

    function getUnpaidWins(address user) public view returns (uint256) {
        return unpaidWins[user];
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
        require(prediction <= MAX_DROPS, "PREDICTION_OUT_OF_RANGE"); // 0..15 inclusive
        (uint256 seed, bool isSecure,) = randomV2.getRandomNumber();
        require(isSecure, "RNG_NOT_SECURE");
        uint32 usedMask = 0;
        if (hasLastTarget[msg.sender]) {
          usedMask |= (uint32(1) << lastTarget[msg.sender]);
        }
        uint256 j = 0;
        uint16 target;
        while (true) {
          uint256 expanded = uint256(
            keccak256(abi.encode(seed, j, msg.sender, block.number))
          );
          uint16 candidate = uint16(expanded % (MAX_DROPS + 1)); // 0..15
          uint32 bit = uint32(1) << candidate;
          if ((usedMask & bit) == 0) {
            target = candidate;
            break;
          }
          j++;
        }
        lastTarget[msg.sender] = target;
        hasLastTarget[msg.sender] = true;

        DroneDropResult result;
        uint256 prize; // record winnings; 0 on miss

        if (prediction == target) {
            result = DroneDropResult.Hit;
            prize = msg.value << 1; // 2x
            if (address(this).balance < prize) {
                unpaidWins[msg.sender] += prize;
            } else {
                (bool success,) = payable(msg.sender).call{value: prize}("");
                require(success, "PAYOUT_FAILED");
            }
        } else {
            result = DroneDropResult.Miss;
            prize = 0;
        }

        DroneBattle memory battle = DroneBattle(prediction, target, result, prize, block.timestamp);
        userDroneBattles[msg.sender].push(battle);
        emit DroneDropped(msg.sender, prediction, target, uint8(result), prize, block.timestamp);
    }

    function claimWins(uint256 amount) public {
      require(amount > 0, "INVALID_AMOUNT");
      require(unpaidWins[msg.sender] > 0, "NO_PAYOUT_FUNDS_OWED");
      require(amount <= unpaidWins[msg.sender], "AMOUNT_EXCEEDS_UNPAID");
      if (address(this).balance < amount) {
        revert("PAYOUT_FUNDS_UNAVAILABLE");
      } else {
        unpaidWins[msg.sender] -= amount;
        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, "PAYOUT_FAILED");
      }
    }

    function withdrawAll() public onlyOwner() {
      (bool success,) = payable(owner).call{value: address(this).balance}("");
      require(success, "WITHDRAWAL_FAILED");
    }
}
