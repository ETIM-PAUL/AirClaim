// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IWeb2Json} from "@flarenetwork/flare-periphery-contracts/coston2/IWeb2Json.sol";
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
        Passenger[] passengers;
        uint256 flight_price;
        string status;
        uint lastChecked;
        address insurer;
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
    uint256 public INSURANCE_PRICE;
    uint256 public insurance_delay_time;
    mapping(uint256 => InsuredFlight) public _insuredFlight;
    mapping(uint256 => mapping(address => bool)) public insuredFlightPassengersStatus;

    uint16 private _secretNumber;
    uint256 public constant _maxNumber = 20;
    RandomNumberV2Interface public _generator;
    
    address public owner;

    event FlightInfoUpdated(uint256 insuredFlightId, uint256 flightDelayedTime, string flightStatus);
    event FlightInsured(uint256 insuredFlightId);
    event FlightClaimed(uint256 insuredFlightId, address passenger);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(uint256 _insurancePrice) {
        INSURANCE_PRICE = _insurancePrice;
        insurance_delay_time = 30;
        insuredFlightIds = 1;
        owner = msg.sender;

        _generator = ContractRegistry.getRandomNumberV2();
        _setNewSecretNumber();
    }

    function checkFlightDelay(IWeb2Json.Proof calldata data, uint256 insuredFlightId) external {
        InsuredFlight memory insuredFlight = _insuredFlight[insuredFlightId];
        require(
           insuredFlight.insuranceId < insuredFlightIds,
           "Invalid Insurance"
        );
        require((msg.sender == insuredFlight.insurer || insuredFlight.passengers[0].wallet == msg.sender || msg.sender == owner), "Either Insurer or Passenger can check flight delay");
        require(
            keccak256(abi.encodePacked(insuredFlight.status)) == keccak256(abi.encodePacked("scheduled")), 
            "Flight status already updated"
        );
        require(block.timestamp - insuredFlight.lastChecked > 600, "Flight check is at 10 minutes interval");

        require(isJsonApiProofValid(data), "Invalid proof");

        DataTransportObject memory dto = abi.decode(
                    data.data.responseBody.abiEncodedData,
                    (DataTransportObject)
                );

        if (uint256(dto.flight_delayed_time) >= insurance_delay_time && 
        (keccak256(abi.encodePacked(dto.flight_status)) != keccak256(abi.encodePacked("active")) || 
        keccak256(abi.encodePacked(dto.flight_status)) != keccak256(abi.encodePacked("landed"))
        )) {
            _insuredFlight[insuredFlightId].status = dto.flight_status;
            _insuredFlight[insuredFlightId].flightDelayedTime = uint256(dto.flight_delayed_time);
        }
        _insuredFlight[insuredFlightId].lastChecked = block.timestamp;

        emit FlightInfoUpdated(insuredFlightId, insuredFlight.flightDelayedTime, insuredFlight.status);
    }

    function insureFlight(
        string memory aircraft_icao,
        string memory flight_no,
        Passenger[] memory passengers,
        IWeb2Json.Proof calldata data
    ) external payable {
        uint256 total = 0;
        for (uint256 i = 0; i < passengers.length; i++) {
            total += (passengers[i].ticketPrice * 10) / 100;
        }
        require(msg.value == total + INSURANCE_PRICE, "Invalid amount");

        require(isJsonApiProofValid(data), "Invalid proof");

        DataTransportObject memory dto = abi.decode(
            data.data.responseBody.abiEncodedData,
            (DataTransportObject)
        );

        require(
            keccak256(abi.encodePacked(dto.flight_status)) == keccak256(abi.encodePacked("scheduled")), 
            "Flight No doesn't match a scheduled flight"
        );

        _insuredFlight[insuredFlightIds].aircraftIcao = aircraft_icao;
        _insuredFlight[insuredFlightIds].aircraftName = dto.aircraft_name;
        _insuredFlight[insuredFlightIds].flightDate = dto.flight_date;
        _insuredFlight[insuredFlightIds].departureAirport = dto.departure_airport;
        _insuredFlight[insuredFlightIds].arrivalAirport = dto.arrival_airport;
        _insuredFlight[insuredFlightIds].flightDelayedTime = uint256(dto.flight_delayed_time);
        _insuredFlight[insuredFlightIds].flightNo = flight_no;
        _insuredFlight[insuredFlightIds].flight_price = total;
        _insuredFlight[insuredFlightIds].status = dto.flight_status;
        _insuredFlight[insuredFlightIds].lastChecked = block.timestamp;
        _insuredFlight[insuredFlightIds].insurer = msg.sender;
        _insuredFlight[insuredFlightIds].insuranceId = insuredFlightIds;

        for (uint256 i = 0; i < passengers.length; i++) {
            insuredFlightPassengersStatus[insuredFlightIds][passengers[i].wallet] = true;
             _insuredFlight[insuredFlightIds].passengers.push(passengers[i]);
        }

        insuredFlightIds++;

        emit FlightInsured(insuredFlightIds);
    }

    function getCostOfInsurance(Passenger[] memory passengers) public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < passengers.length; i++) {
            total += (passengers[i].ticketPrice * 10) / 100;
        }
        return total + INSURANCE_PRICE;
    }


    function claimInsurance(uint insuredFlightId, string memory flight_no, uint256 predictedNumber) external returns (uint256 secretNumber, bool _predictedSuccess) {
        InsuredFlight memory insuredFlight = _insuredFlight[insuredFlightId];
        
        require(keccak256(abi.encodePacked(insuredFlight.flightNo)) == keccak256(abi.encodePacked(flight_no)), "Flight No doesn't match");
        require(insuredFlight.flightDelayedTime >= insurance_delay_time, "Flight Not Delayed");
        require(insuredFlightPassengersStatus[insuredFlightId][msg.sender], 
            "Passenger not insured OR Insurance already redeemed"
        );

        insuredFlightPassengersStatus[insuredFlightId][msg.sender] = false;
        secretNumber = _secretNumber;

        if(predictedNumber > 0 && predictedNumber == _secretNumber){
            (bool success, ) = payable(msg.sender).call{value: (insuredFlight.flight_price * 10) / 100}("");
            require(success, "Transfer failed");
            (bool success2, ) = payable(msg.sender).call{value: 5e17}("");
            require(success2, "Insufficient balance");
            _predictedSuccess = true;
            _setNewSecretNumber();
        }

        else if(predictedNumber > 0 && predictedNumber != _secretNumber){
            (bool success, ) = payable(msg.sender).call{value: ((insuredFlight.flight_price * 10) / 100)/2}("");
            require(success, "Transfer failed");
            _predictedSuccess = false;
            _setNewSecretNumber();
        }

        else {
            (bool success, ) = payable(msg.sender).call{value: (insuredFlight.flight_price * 10) / 100}("");
            require(success, "Transfer failed");
        }

        emit FlightClaimed(insuredFlightId, msg.sender);
    }

    function getAllInsureFlights() public view returns (InsuredFlight[] memory) {
        InsuredFlight[] memory result = new InsuredFlight[](insuredFlightIds);
        for (uint256 i = 0; i < insuredFlightIds; i++) {
            result[i] = _insuredFlight[i];
        }
        return result;
    }

    function getInsuredFlight(uint256 insuredFlightId) public view returns (InsuredFlight memory) {
        require(insuredFlightId < insuredFlightIds, "Invalid insured flight");
        return _insuredFlight[insuredFlightId];
    }

    function checkFlightInsured(uint insuredFlightId, address passenger) public view returns (bool status) {
        return insuredFlightPassengersStatus[insuredFlightId][passenger];
    }

    function setInsurancePrice(uint256 _insurancePrice) external onlyOwner {
        require(_insurancePrice > 0, "Insurance price must be greater than 0");
        INSURANCE_PRICE = _insurancePrice;
    }


    function getInsurancePrice() external view returns (uint256) {
        return INSURANCE_PRICE;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function transferAccumulatedFees(address to) external onlyOwner {
        require(to != address(0), "Invalid address");
        payable(to).transfer(address(this).balance);
    }

    function _setNewSecretNumber() private {
        (uint256 randomNumber, , ) = _generator.getRandomNumber();
        randomNumber %= _maxNumber;
        _secretNumber = uint16(randomNumber);
    }

    function abiSignatureHack(DataTransportObject calldata dto) public pure {}

    function isJsonApiProofValid(
        IWeb2Json.Proof calldata _proof
    ) private view returns (bool) {
        // Inline the check for now until we have an official contract deployed
        return ContractRegistry.getFdcVerification().verifyJsonApi(_proof);
    }

    function recieve() external payable {}
}