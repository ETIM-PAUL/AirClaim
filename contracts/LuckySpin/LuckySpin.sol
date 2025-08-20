// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {RandomNumberV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/RandomNumberV2Interface.sol";

contract LuckySpin {
    RandomNumberV2Interface internal randomV2;
    enum SpinResult {
      Win,
      Lose
    }
    struct Spins {
      uint16[] predictions;
      uint16[] targets;
      SpinResult result;
      uint256 prize;
      uint256 timestamp;
    }
    uint256 public constant MAX_STAKE_AMOUNT = 2 ether;
    uint256 public constant MAX_NUM_PER_SPIN = 15;
    uint256 public constant MAX_PREDICTIONS = 5;
    mapping(address => Spins[]) public userSpins;
    mapping(address => uint256) public unpaidWins;

    // uint256 public max_stake_amount;
    // uint256 public max_num_per_spin;
    address public owner;

    modifier onlyOwner() {
      require(msg.sender == owner, "NOT_ADMIN");
      _;
    }

    event RandomNumberNotSecure();
    event SpinWinSaved(address player, uint16[] predictions, uint16[] targets, uint256 prize);
    event Spin(
      address player,
      uint16[] predictions,
      uint16[] targets,
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
        // max_num_per_spin = _max_drops;
    }

    function getUserSpins(address user) public view returns (Spins[] memory) {
        return userSpins[user];
    }

    function getUnpaidWins(address user) public view returns (uint256) {
        return unpaidWins[user];
    }

    // function getMaxStateAmount() public view returns (uint256) {
    //     return MAX_STAKE_AMOUNT;
    // }

    // function getMaxNumPerSpin() public view returns (uint256) {
    //     return MAX_NUM_PER_SPIN;
    // }

    function luckySpin(uint16[] memory predictions) public payable {
        uint16 numPredictions = uint16(predictions.length);
        require(numPredictions == MAX_PREDICTIONS, "PREDICTIONS_MUST_BE_FIVE");
        require(msg.value > 0, "ZERO_VALUE");
        require(msg.value <= MAX_STAKE_AMOUNT, "MAX_STAKE_EXCEEDED");

        for (uint256 i = 0; i < numPredictions; i++) {
          require(predictions[i] > 0 && predictions[i] <= MAX_NUM_PER_SPIN, "PREDICTION_OUT_OF_RANGE");
        }

        uint16[] memory targets = new uint16[](numPredictions);
        (uint256 seed, bool isSecure,) = randomV2.getRandomNumber();
        require(isSecure, "RNG_NOT_SECURE");
        uint32 usedMask = 0;
        for (uint256 i = 0; i < numPredictions; i++) {
          uint256 j = 0;
          while (true) {
            uint256 expanded = uint256(
              keccak256(abi.encode(seed, i, j, msg.sender, block.number))
            );
            uint16 candidate = uint16((expanded % MAX_NUM_PER_SPIN) + 1); // 1..15
            uint32 bit = uint32(1) << candidate;
            if ((usedMask & bit) == 0) {
              usedMask |= bit;
              targets[i] = candidate;
              break;
            }
            j++;
          }
        }

        uint16 matchCount;
        {
          uint8[] memory counts = new uint8[](MAX_NUM_PER_SPIN + 1);
          for (uint256 i = 0; i < numPredictions; i++) {
            counts[uint256(predictions[i])] += 1;
          }
          for (uint256 i = 0; i < numPredictions; i++) {
            uint16 value = targets[i];
            if (counts[uint256(value)] > 0) {
              counts[uint256(value)] -= 1;
              matchCount++;
            }
          }
        }

        uint256 payout;
        if (matchCount >= 3) {
          if (matchCount == 3) {
            payout = (msg.value * 50) / 100; // 0.5x
          } else if (matchCount == 4) {
            payout = msg.value; // 1x
          } else {
            payout = msg.value * 2; // 2x for 5 matches
          }
        }

        SpinResult result = payout > 0 ? SpinResult.Win : SpinResult.Lose;

        if (payout > 0) {
          if (address(this).balance < payout) {
              unpaidWins[msg.sender] += payout;
              emit SpinWinSaved(msg.sender, predictions, targets, payout);
          } else {
              (bool success,) = payable(msg.sender).call{value: payout}("");
              require(success, "PAYOUT_FAILED");
          }
        }

        Spins memory spin = Spins({
          predictions: predictions,
          targets: targets,
          result: result,
          prize: payout,
          timestamp: block.timestamp
        });
        userSpins[msg.sender].push(spin);
        emit Spin(msg.sender, predictions, targets, uint8(result), payout, block.timestamp);
    }

    function claimWins(uint256 amount) public {
      require(amount > 0, "INVALID_AMOUNT");
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
