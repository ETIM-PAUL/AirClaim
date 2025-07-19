import React, { useState } from 'react';
import { FaPlane, FaUserFriends, FaDollarSign, FaChartLine, FaExclamationCircle, FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaInfoCircle, FaGamepad, FaClock, FaFantasyFlightGames, FaHandSparkles } from "react-icons/fa";
import {Check, X, Clock, ArrowRight } from "lucide-react";
import Sidebar from "~/components/Sidebar";
import { TbNumber10, TbNumbers } from 'react-icons/tb';
import { GiPodiumWinner } from "react-icons/gi";
import { RiCreativeCommonsZeroFill } from "react-icons/ri";

const FlightDetailsPage = () => {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [participateInPrediction, setParticipateInPrediction] = useState(false);
  const [prediction, setPrediction] = useState("");

  const [flight, setFlight] = useState<any>({
    id: "1",
    flightNumber: "UA-482",
    airline: "United Airlines",
    airlineICAO: "UAL",
    airlineImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/United_Airlines_logo_2010.svg/1200px-United_Airlines_logo_2010.svg.png",
    aircraftName: "Boeing 737-800",
    flightDate: "2023-10-15",
    departureAirport: "JFK",
    arrivalAirport: "LAX",
    flightStatus: "Delayed",
    insurer: "AirClaim Insurance",
    passengers: 2,
    passengersList: [
      {
        name: "John Doe",
        walletAddress: "0x1234567890123456789012345678901234567890",
        ticketType: "Economy",
        ticketPrice: "600",
        insuredAmount: "280",
        claimed: "Yes",
        predictionInclusive: "Yes",
        won: "No",
      },
      {
        name: "Jane Doe",
        walletAddress: "0x1234567890123456789012345678901234567890",
        ticketType: "Economy",
        ticketPrice: "600",
        insuredAmount: "280",
        claimed: "Yes",
        predictionInclusive: "No",
        won: "n/a",
      },
    ],
    insuredAmount: "560",
    claimedFLR: "280",
    predictionFLRWon: "100"
  });

  const handleCheckFlightStatus = () => {
    setIsClaimModalOpen(true);
  };

  const handleProceed = () => {
    // Logic to proceed with the claim
    console.log("Proceeding with claim...");
    setIsClaimModalOpen(false);
  };

  const handleCancel = () => {
    setIsClaimModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Flight Details</h1>
            <p className="text-gray-400 mt-1">Detailed information about the insured flight</p>
          </div>
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar" className="w-12 h-12 rounded-full border-2 border-green-400 shadow-lg" />
        </div>
        <hr className="border-gray-800 mb-8" />

        {/* Flight Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#101112] rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Flight Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-12 h-12 rounded-full border-2 border-green-400 shadow-lg" alt={flight.airline} />
                <div>
                  <p className="text-gray-400">Airline</p>
                  <p className="font-semibold">{flight.airline} ({flight.airlineICAO})</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaPlane className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Aircraft</p>
                  <p className="font-semibold">{flight.aircraftName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Flight Date</p>
                  <p className="font-semibold">{flight.flightDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Departure / Arrival</p>
                  <p className="font-semibold">{flight.departureAirport} → {flight.arrivalAirport}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaInfoCircle className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Flight Status</p>
                  <p className={`font-semibold ${flight.flightStatus === "Delayed" ? "text-yellow-400" : flight.flightStatus === "Cancelled" ? "text-red-400" : "text-green-400"}`}>{flight.flightStatus}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaUserFriends className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Passengers</p>
                  <p className="font-semibold">{flight.passengers ?? 0}</p>
                </div>
              </div>
              
              {flight.flightStatus === "Delayed" && (
              <button
                onClick={handleCheckFlightStatus}
                className="mt-4 w-full bg-gradient-to-r from-green-400 to-emerald-500 py-2 rounded-lg text-white text-sm font-semibold shadow hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 cursor-pointer"
              >
                Claim Insurance
              </button>
              )}
            </div>
          </div>

          {/* Claim Information */}
          <div className="bg-[#101112] rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Claim Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaExclamationCircle className="text-red-400 text-xl" />
                <div>
                  <p className="text-gray-400">Claim Status</p>
                  <p className={`font-semibold ${flight.flightStatus === "Delayed" ? "text-red-400" : "text-green-400"}`}>{flight.flightStatus === "Delayed" ? "Activated" : "Not Claimed"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Claimed FLR Tokens</p>
                  <p className="font-semibold">{flight.claimedFLR} FLR</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaDollarSign className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Insured Amount</p>
                  <p className="font-semibold">{flight.insuredAmount} FLR</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaGamepad className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Prediction FLR Won</p>
                  <p className="font-semibold">{flight.predictionFLRWon} FLR</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaUserFriends className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Insurer</p>
                  <p className="font-semibold">{flight.insurer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Passengers List */}
        <div className="bg-[#101112] rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4">Passengers</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400 border-b border-gray-700">
                <tr>
                  <th className="py-2">Name</th>
                  <th>Wallet Address</th>
                  <th>Ticket Type</th>
                  <th>Ticket Price</th>
                  <th>Insured Amount</th>
                  <th>Claimed</th>
                  <th>Prediction Inclusive</th>
                  <th>Won</th>
                </tr>
              </thead>
              <tbody>
                {flight.passengersList.map((passenger: any, idx: any) => (
                  <tr key={idx} className="border-b border-gray-800 hover:bg-gray-900 transition">
                    <td className="py-2 font-semibold">{passenger.name}</td>
                    <td>{passenger.walletAddress.slice(0, 6)}...{passenger.walletAddress.slice(-4)}</td>
                    <td>{passenger.ticketType}</td>
                    <td>{passenger.ticketPrice} FLR</td>
                    <td>{passenger.insuredAmount} FLR</td>
                    <td className={`${passenger.claimed === "Yes" ? "text-green-400" : "text-red-400"}`}>{passenger.claimed}</td>
                    <td className={`${passenger.predictionInclusive === "Yes" ? "text-green-400" : "text-red-400"}`}>{passenger.predictionInclusive}</td>
                    <td className={`${passenger.won === "Yes" ? "text-green-400" : passenger.predictionInclusive === "Yes" ? "text-red-400" : "text-yellow-400"}`}>{passenger.won}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Claim Insurance Modal */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 flex mx-auto items-center justify-center bg-blac bg-opacity-50 backdrop-blur-sm">
          <div className="flex w-full justify-center">
            <div className="flex gap-6 bg-white rounded-2xl p-3">
              <div className="w-1/2 flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Claim Insurance</h2>

                {/* Prediction Game Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 mb-4">
                    Do you want to participate in the prediction game?
                  </label>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setParticipateInPrediction(true)}
                      className={`flex items-center justify-center gap-2 px-2 cursor-pointer py-2 rounded-xl transition-all transform hover:scale-105 ${
                        participateInPrediction
                          ? "bg-green-500 text-white shadow-lg"
                          : "bg-white text-gray-700 shadow-sm hover:shadow-md"
                      }`}
                    >
                      <Check className="w-5 h-5" />
                      Yes
                    </button>
                    <button
                      onClick={() => setParticipateInPrediction(false)}
                      className={`flex items-center justify-center gap-2 px-2 cursor-pointer py-2 rounded-xl transition-all transform hover:scale-105 ${
                        !participateInPrediction
                          ? "bg-red-500 text-white shadow-lg"
                          : "bg-white text-gray-700 shadow-sm hover:shadow-md"
                      }`}
                    >
                      <X className="w-5 h-5" />
                      No
                    </button>
                  </div>
                </div>

                {/* Prediction Game UI */}
                {participateInPrediction && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Predict the current secret number:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={prediction}
                        onChange={(e) => setPrediction(e.target.value)}
                        className="w-full text-black p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
                        placeholder="Enter your prediction"
                      />
                      <TbNumbers className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                )}

                {/* Cancel and Proceed Buttons */}
                <div className="flex justify-start gap-4">
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 px-2 cursor-pointer py-2 bg-white text-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:scale-105"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                  <button
                    onClick={handleProceed}
                    className="flex items-center justify-center gap-2 px-2 cursor-pointer py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    Proceed
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="w-1/2 flex justify-center">
                <div className="md:w-lg px-8 py-6 bg-gradient-to-br from-gray-900 via-black to-gray-950 shadow-xl text-center rounded-2xl">
                    <h2 className="text-xl font-bold mb-4">Claiming Of Insurance</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                                <FaMapMarkerAlt className="text-white text-xl" />
                            </div>
                            <p className="text-gray-400 text-left">Insurance claims is active for delayed or cancelled flights.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                                <FaFantasyFlightGames className="text-white text-xl" />
                            </div>
                            <p className="text-gray-400 text-left">You have an option of playing a prediction game.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                                <GiPodiumWinner className="text-white text-xl" />
                            </div>
                            <p className="text-gray-400 text-left">If your prediction is correct, you get your full insurance and win 5FLR.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                                <RiCreativeCommonsZeroFill className="text-white text-xl" />
                            </div>
                            <p className="text-gray-400 text-left">If your prediction is wrong, you lose 50% of your insurance.</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightDetailsPage;
