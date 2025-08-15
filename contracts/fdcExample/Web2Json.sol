// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IWeb2Json} from "@flarenetwork/flare-periphery-contracts/coston2/IWeb2Json.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {RandomNumberV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/RandomNumberV2Interface.sol";

struct Passenger {
    address wallet;
    string ticketType;
    uint256 ticketPrice;
}

struct InsuredFlight {
    string aircraftIcao;
    string aircraftName;
    string flightDate;
    string departureAirport;
    string arrivalAirport;
    uint256 flightDelayedTime;
    string flightNo;
    uint256 passengers;
    string status;
    uint lastChecked;
    address insurer;
    uint256 insuranceId;
}

struct AllClaims {
    uint256 amountClaimed;
    uint dateClaimed;
    address insuree;
    uint256 insuranceId;
}

struct DataTransportObject {
    string aircraft_name;
    string aircraft_reg;
    string flight_no;
    string flight_date;
    string departure_airport;
    string arrival_airport;
    uint256 flight_delayed_time;
    string flight_status;
}

contract insuredFlightsAgency {
    uint256 public insuredFlightIds;
    uint256 public insuranceClaimsIds;
    uint256 public INSURANCE_PRICE;
    uint256 public insurance_delay_time;
    mapping(uint256 => InsuredFlight) public _insuredFlight;
    mapping(uint256 => uint256) public _insuredFlightPrice;
    mapping(uint256 => AllClaims) public _insuranceClaims;
    mapping(uint256 => Passenger[]) public _insuranceFlightPassengers;
    mapping(uint256 => mapping(address => bool)) public insuredFlightPassengersStatus;

    uint16 private _secretNumber;
    uint256 public _totalAmountInsurance;
    uint256 public constant _maxNumber = 20;
    RandomNumberV2Interface public _generator;
    
    address public owner;

    event FlightInfoUpdated(uint256 insuredFlightId, uint256 flightDelayedTime, string flightStatus);
    event FlightInsured(uint256 insuredFlightId);
    event FlightClaimed(uint256 insuredFlightId, address passenger, uint256 secretNumber);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(uint256 _insurancePrice) {
        INSURANCE_PRICE = _insurancePrice;
        insurance_delay_time = 30;
        insuredFlightIds = 1;
        insuranceClaimsIds = 1;
        owner = msg.sender;
        _generator = ContractRegistry.getRandomNumberV2();
        _setNewSecretNumber();
    }

    function _applyUpdate(IWeb2Json.Proof calldata data, uint256 insuredFlightId) external {
        require(_insuredFlight[insuredFlightId].insuranceId != 0 && _insuredFlight[insuredFlightId].insuranceId < insuredFlightIds, "Invalid Insurance");
        require(
            msg.sender == _insuredFlight[insuredFlightId].insurer ||
            (_insuranceFlightPassengers[insuredFlightId].length > 0 && _insuranceFlightPassengers[insuredFlightId][0].wallet == msg.sender) ||
            msg.sender == owner,
            "Either Insurer or Passenger can check flight delay"
        );
        require(keccak256(bytes(_insuredFlight[insuredFlightId].status)) == keccak256("scheduled"), "Flight status already updated");
        require(block.timestamp - _insuredFlight[insuredFlightId].lastChecked > 600, "Flight check is at 10 minutes interval");
        require(isWeb2JsonProofValid(data), "Invalid proof");
        require(data.data.responseBody.abiEncodedData.length > 0, "Empty data");

        DataTransportObject memory dto = abi.decode(data.data.responseBody.abiEncodedData, (DataTransportObject));

        if (dto.flight_delayed_time >= insurance_delay_time && 
            keccak256(bytes(dto.flight_status)) != keccak256("active") &&
            keccak256(bytes(dto.flight_status)) != keccak256("landed")) {
            _insuredFlight[insuredFlightId].status = dto.flight_status;
            _insuredFlight[insuredFlightId].flightDelayedTime = dto.flight_delayed_time;
        }
        _insuredFlight[insuredFlightId].lastChecked = block.timestamp;

        emit FlightInfoUpdated(insuredFlightId, _insuredFlight[insuredFlightId].flightDelayedTime, _insuredFlight[insuredFlightId].status);
    }

    function insureFlight(
        string memory aircraft_icao,
        string memory flight_no,
        Passenger[] memory passengers,
        IWeb2Json.Proof calldata data
    ) external payable {
        require(msg.value == getCostOfInsurance(passengers), "Invalid amount");
        require(isWeb2JsonProofValid(data), "Invalid proof");
        require(data.data.responseBody.abiEncodedData.length > 0, "Empty data");

        DataTransportObject memory dto = abi.decode(data.data.responseBody.abiEncodedData, (DataTransportObject));
        require(
            keccak256(abi.encodePacked(dto.flight_status)) == keccak256(abi.encodePacked("scheduled")), 
            "Flight No doesn't match a scheduled flight"
        );
        
        _storeFlightData(aircraft_icao, flight_no, dto, passengers);
    }

    function _storeFlightData(
        string memory aircraft_icao,
        string memory flight_no,
        DataTransportObject memory dto,
        Passenger[] memory passengers
    ) private {
        uint256 currentId = insuredFlightIds;
        uint256 total = 0;
        
        _insuredFlight[currentId].aircraftIcao = aircraft_icao;
        _insuredFlight[currentId].aircraftName = dto.aircraft_name;
        _insuredFlight[currentId].flightDate = dto.flight_date;
        _insuredFlight[currentId].departureAirport = dto.departure_airport;
        _insuredFlight[currentId].arrivalAirport = dto.arrival_airport;
        _insuredFlight[currentId].flightDelayedTime = dto.flight_delayed_time;
        _insuredFlight[currentId].flightNo = flight_no;
        _insuredFlight[currentId].passengers = passengers.length;
        _insuredFlight[currentId].status = dto.flight_status;
        _insuredFlight[currentId].lastChecked = block.timestamp;
        _insuredFlight[currentId].insurer = msg.sender;
        _insuredFlight[currentId].insuranceId = currentId;

        // Calculate and store flight price
        for (uint256 i = 0; i < passengers.length; i++) {
            _insuranceFlightPassengers[currentId].push(passengers[i]);
            insuredFlightPassengersStatus[currentId][passengers[i].wallet] = true;
            _totalAmountInsurance += (passengers[i].ticketPrice * 10) / 100;
            total+= (passengers[i].ticketPrice * 10) / 100;
        }
        
        _insuredFlightPrice[currentId] = total;
        insuredFlightIds++;
        
        emit FlightInsured(currentId);
    }

    function getCostOfInsurance(Passenger[] memory passengers) public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < passengers.length; i++) {
            total += (passengers[i].ticketPrice * 10) / 100;
        }
        return total + INSURANCE_PRICE;
    }

    function getFlightPassengers(uint256 _flightId) public view returns (Passenger[] memory) {
        return _insuranceFlightPassengers[_flightId];
    }

    // Split claim function into multiple parts
    function claimInsurance(
        uint insuredFlightId, 
        string memory flight_no, 
        uint256 predictedNumber
    ) external returns (uint256, bool) {
        _validateClaimRequirements(insuredFlightId, flight_no);
        return _processClaim(insuredFlightId, predictedNumber);
    }

    function _validateClaimRequirements(uint insuredFlightId, string memory flight_no) private view {
        require(keccak256(abi.encodePacked(_insuredFlight[insuredFlightId].flightNo)) == keccak256(abi.encodePacked(flight_no)), "Flight No doesn't match");
        require(_insuredFlight[insuredFlightId].flightDelayedTime >= insurance_delay_time, "Flight Not Delayed");
        require(insuredFlightPassengersStatus[insuredFlightId][msg.sender], "Passenger not insured OR Insurance already redeemed");
    }

    function _processClaim(uint insuredFlightId, uint256 predictedNumber) private returns (uint256, bool) {
        insuredFlightPassengersStatus[insuredFlightId][msg.sender] = false;
        
        uint256 currentSecret = _secretNumber;
        uint256 baseAmount = (_insuredFlightPrice[insuredFlightId] * 10) / 100;
        bool predictionSuccess = false;

        if (predictedNumber == 0) {
            payable(msg.sender).transfer(baseAmount / 2);
        } else if (predictedNumber == currentSecret) {
            payable(msg.sender).transfer(baseAmount);
            predictionSuccess = true;
        } else {
            payable(msg.sender).transfer(5e17);
        }

        _insuranceClaims[insuranceClaimsIds].amountClaimed = baseAmount;
        _insuranceClaims[insuranceClaimsIds].dateClaimed = block.timestamp;
        _insuranceClaims[insuranceClaimsIds].insuree = msg.sender;
        _insuranceClaims[insuranceClaimsIds].insuranceId = insuredFlightId;
        insuranceClaimsIds++;

        _setNewSecretNumber();
        emit FlightClaimed(insuredFlightId, msg.sender, currentSecret);
        
        return (currentSecret, predictionSuccess);
    }

    function getAllInsureFlights() public view returns (InsuredFlight[] memory) {
        InsuredFlight[] memory result = new InsuredFlight[](insuredFlightIds - 1);
        for (uint256 i = 1; i < insuredFlightIds; i++) {
            result[i - 1] = _insuredFlight[i];
        }
        return result;
    }

    function getAllClaims() public view returns (AllClaims[] memory) {
        AllClaims[] memory result = new AllClaims[](insuranceClaimsIds - 1);
        for (uint256 i = 1; i < insuranceClaimsIds; i++) {
            result[i - 1] = _insuranceClaims[i];
        }
        return result;
    }

    function setInsurancePrice(uint256 _insurancePrice) external onlyOwner {
        require(_insurancePrice > 0, "Insurance price must be greater than 0");
        INSURANCE_PRICE = _insurancePrice;
    }

    function getInsurancePrice() external view returns (uint256) {
        return INSURANCE_PRICE;
    }

    function transferAccumulatedFees(address to) external onlyOwner {
        require(to != address(0), "Invalid address");
        payable(to).transfer(address(this).balance);
    }

    function _setNewSecretNumber() private {
        (uint256 randomNumber, , ) = _generator.getRandomNumber();
        _secretNumber = uint16(randomNumber % _maxNumber);
    }

    function abiSignatureHack(DataTransportObject calldata dto) public pure {}

    function isWeb2JsonProofValid(
        IWeb2Json.Proof calldata _proof
    ) private view returns (bool) {
        // Inline the check for now until we have an official contract deployed
        return ContractRegistry.getFdcVerification().verifyWeb2Json(_proof);
    }

    receive() external payable {}
}