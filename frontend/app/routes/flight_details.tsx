import React, { useMemo, useState } from 'react';
import { FaPlane, FaUserFriends, FaDollarSign, FaChartLine, FaExclamationCircle, FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaInfoCircle, FaGamepad, FaClock, FaFantasyFlightGames, FaHandSparkles } from "react-icons/fa";
import {Check, X, Clock, ArrowRight } from "lucide-react";
import Sidebar from "~/components/Sidebar";
import { TbNumber10, TbNumbers } from 'react-icons/tb';
import { GiPodiumWinner } from "react-icons/gi";
import { RiCreativeCommonsZeroFill } from "react-icons/ri";
import { useGeneral } from '~/context/GeneralContext';
import { useParams } from 'react-router';
import { insuredFlightsAgencyAddress, shortenAddress } from '~/utils';
import { ethers } from 'ethers';
import insuredFlightsAgencyAbi from 'insuredFlightsAgency.json';
import { toast } from 'react-toastify';
import Outcome from '~/components/Outcome';
import { useAppKitProvider, Provider, useAppKitAccount } from '@reown/appkit/react';
import { checkFlightDelayAction } from 'scripts/updateFlight';

const FlightDetailsPage = () => {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const { address } = useAppKitAccount(); // Use reown's wallet hooks
  const [participateInPrediction, setParticipateInPrediction] = useState(true);
  const [claimInUsdt, setClaimInUsdt] = useState(false);
  const [prediction, setPrediction] = useState(0);
  const [processing, setProcessing] = useState(false);

  const { walletProvider } = useAppKitProvider<Provider>("eip155");

  // Modal state
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState("info"); // 'win' | 'lose' | 'half' | 'info'
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const { fetchInsuredFlights, allPassengers, loadingFlights, allFlights, allClaims  } = useGeneral();
  const params:any = useParams();

  const iface:any = useMemo(() => new ethers.Interface(insuredFlightsAgencyAbi.abi), [insuredFlightsAgencyAbi.abi]);
  // const [flight, setFlight] = useState<any>({
  //   id: "1",
  //   flightNumber: "UA-482",
  //   airline: "United Airlines",
  //   airlineICAO: "UAL",
  //   airlineImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/United_Airlines_logo_2010.svg/1200px-United_Airlines_logo_2010.svg.png",
  //   aircraftName: "Boeing 737-800",
  //   flightDate: "2023-10-15",
  //   departureAirport: "JFK",
  //   arrivalAirport: "LAX",
  //   flightStatus: "Delayed",
  //   insurer: "AirClaim Insurance",
  //   passengers: 2,
  //   passengersList: [
  //     {
  //       name: "John Doe",
  //       walletAddress: "0x1234567890123456789012345678901234567890",
  //       ticketType: "Economy",
  //       ticketPrice: "600",
  //       insuredAmount: "280",
  //       claimed: "Yes",
  //       predictionInclusive: "Yes",
  //       won: "No",
  //     },
  //     {
  //       name: "Jane Doe",
  //       walletAddress: "0x1234567890123456789012345678901234567890",
  //       ticketType: "Economy",
  //       ticketPrice: "600",
  //       insuredAmount: "280",
  //       claimed: "Yes",
  //       predictionInclusive: "No",
  //       won: "n/a",
  //     },
  //   ],
  //   insuredAmount: "560",
  //   claimedFLR: "280",
  //   predictionFLRWon: "100"
  // });

  const flight = allFlights.find((flight:any) => flight.id === Number(params?.id))
  const handleCheckFlightStatus = () => {
    setIsClaimModalOpen(true);
  };

  const handleCheckFlightUpdate = async () => {
    try {
      setProcessing(true);
      const result:any = await checkFlightDelayAction(flight?.airline_icao, flight?.flightNumber, Number(params?.id), walletProvider);
      if (result?.data) {
        toast.success("Flight Insured");
        setProcessing(false);
        fetchInsuredFlights();
      } else {
        toast.error("Flight status can't be updated. Try again later");
        setProcessing(false);
      }
    } catch (error:any) {
      const reason = extractRevertReason(error);
      toast.error(reason || "Transaction failed");
      console.log("error",error)
      setProcessing(false);
    }
  };


  const handleClaim = async () => {
    const i = allPassengers.findIndex((item:any) => (item[0].toLowerCase() === address?.toLowerCase() && Number(item[3]) === Number(params?.id)))
    if (i === -1) {
      toast.error("ooops, not a passenger on this flight");
      return;
    }

    try {
      setProcessing(true);
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const caller = await signer.getAddress();
      const contract = new ethers.Contract(insuredFlightsAgencyAddress, insuredFlightsAgencyAbi?.abi, signer);

      // Send tx and wait for receipt
      const tx = await contract.claimInsurance(Number(params?.id), flight?.flightNumber, Number(prediction),i, claimInUsdt);
      const toastL = toast.loading("Submitting claim…");
      const receipt = await tx.wait();
      toast.dismiss(toastL)
      toast.success("Transaction confirmed");

      // If user passed 0 → show the simple modal regardless of event
      if (Number(prediction) === 0) {
        setIsClaimModalOpen(false);
        setModalMode("half");
        setModalTitle("Claim submitted");
        setModalMessage("Your insurance claim has been made. You'll receive 100% of the insurance, per contract rules for not participating in prediction.");
        setOpen(true);
        return;
      }

      // Parse FlightClaimed event from the receipt
      let foundEvent = null;
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed?.name === "FlightClaimed") {
            const [evInsuredFlightId, passenger, secretNumber] = parsed.args;
            if (passenger.toLowerCase() === caller.toLowerCase() && evInsuredFlightId.toString() === String(params?.id)) {
              foundEvent = { passenger, secretNumber: Number(secretNumber) };
              break;
            }
          }
        } catch (_) {
          // Not our event
        }
      }

      // If not found in receipt (rare), try fetching logs for that block
      if (!foundEvent) {
        try {
          const filter = {
            address: insuredFlightsAgencyAddress,
            fromBlock: receipt.blockNumber,
            toBlock: receipt.blockNumber,
            topics: [iface.getEvent("FlightClaimed").topicHash, ethers.zeroPadValue(ethers.toBeHex(params?.id), 32), ethers.zeroPadValue(caller, 32)],
          };
          const logs = await provider.getLogs(filter);
          if (logs?.[0]) {
            const parsed = iface.parseLog(logs[0]);
            const [, passenger, secretNumber] = parsed.args;
            foundEvent = { passenger, secretNumber: Number(secretNumber) };
          }
        } catch (e) {
          // Ignore; we'll handle as unknown
        }
      }

      if (!foundEvent) {
        // Fallback: unknown outcome but tx succeeded
        setIsClaimModalOpen(false);
        setModalMode("info");
        setModalTitle("Claim submitted");
        setModalMessage("Your claim transaction succeeded. However, we couldn't read the event. Please check your balance or activity.");
        setOpen(true);
        return;
      }

      // Compare with user's prediction (non-zero path)
      if (Number(foundEvent.secretNumber) === Number(prediction)) {
        setIsClaimModalOpen(false);
        setModalMode("win");
        setModalTitle("🎉 You won the prediction game!");
        setModalMessage("You got the full insurance payout, plus 2 FLR tokens.");
      } else {
        setIsClaimModalOpen(false);
        setModalMode("lose");
        setModalTitle(`😔 Better luck next time. The Secret Number was ${foundEvent.secretNumber})`);
        setModalMessage("You lost the prediction game and received 50% of your insurance claim.");
      }
      setOpen(true);
    } catch (err) {
      // Try to toast any revert reason
      const reason = extractRevertReason(err);
      toast.error(reason || "Transaction failed");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  function extractRevertReason(err:any) {
    try {
      if (!err) return null;
      // Ethers v6 errors
      if (err.shortMessage) return err.shortMessage;
      if (err.info?.error?.message) return err.info.error.message;
      if (err.error?.message) return err.error.message;
      if (err.reason) return err.reason;
      if (err.message) return err.message;
      return null;
    } catch (_) {
      return null;
    }
  }

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

        {loadingFlights && <p>Loading flight insurance details...</p>}
        {!loadingFlights && !flight?.id && <p>No flight found</p>}

        {/* Flight Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#101112] rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Flight Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex justify-center items-center">
                  <span className="font-bold">{flight?.aircraftIcao}</span>
                </div>
                <div className="flex items-center gap-3">
                <FaPlane className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Aircraft</p>
                  <p className="font-semibold">{flight?.airline} ({flight?.aircraftIcao})</p>
                </div>
              </div>
              </div>

              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Flight Date</p>
                  <p className="font-semibold">{flight?.flightDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Departure / Arrival</p>
                  <p className="font-semibold">{flight?.departureAirport} → {flight?.arrivalAirport}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaInfoCircle className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Flight Status</p>
                  <p className={`font-semibold ${Number(flight?.flightDelayedTime) >= 30 ? "text-yellow-400" : flight?.flightStatus === "cancelled" ? "text-red-400" : "text-green-400"}`}>{Number(flight?.flightDelayedTime) >= 30 ? "delayed" : flight?.flightStatus}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaUserFriends className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Passengers</p>
                  <p className="font-semibold">{flight?.passengers ?? 0}</p>
                </div>
              </div>
              
              {Number(flight?.flightDelayedTime) >= 30 && (
              <button
                onClick={handleCheckFlightStatus}
                className="mt-4 w-full bg-gradient-to-r from-green-400 to-emerald-500 py-2 rounded-lg text-white text-sm font-semibold shadow hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 cursor-pointer"
              >
                Claim Insurance
              </button>
              )}
              {(Number(flight?.flightDelayedTime) < 30 && flight?.flightStatus === "scheduled") && (
              <button
                onClick={handleCheckFlightUpdate}
                className="mt-4 w-full bg-gradient-to-r from-green-400 to-emerald-500 py-2 rounded-lg text-white text-sm font-semibold shadow hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 cursor-pointer"
              >
                Check Flight Delay
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
                  <p className={`font-semibold ${Number(flight.flightDelayedTime) >= 30 ? "text-red-400" : "text-green-400"}`}>{Number(flight.flightDelayedTime) >= 30 ? "active" : "Not Claimed"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Claimed FLR Tokens</p>
                  <p className="font-semibold">{allClaims?.filter((item:any) => Number(item.insuranceId) === Number(params?.id))?.reduce((total:number, item:any) => {
                    const amountClaimed = item.amount;
                    return total + Number(amountClaimed);
                  }, 0).toString() + " FLR"}</p>
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
                  <p className="font-semibold">{flight?.predictionFLRWon ?? 0} FLR</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaUserFriends className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Insurer</p>
                  <p className="font-semibold">{shortenAddress(flight.insurer)}</p>
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
                  <th>Wallet Address</th>
                  <th>Ticket Type</th>
                  <th>Ticket Price</th>
                </tr>
              </thead>
              <tbody className='space-y-2'>
                {flight.allPassengers.map((passenger: any, idx: any) => (
                  <tr key={idx} className="border-b border-gray-800 hover:bg-gray-900 transition">
                    <td className='py-3'>{shortenAddress(passenger[0])}</td>
                    <td className='py-3'>{passenger[1]}</td>
                    <td className='py-3'>{ethers.formatEther(passenger.ticketPrice)} FLR</td>
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
              <div className="w-1/2 flex pl-4 flex-col justify-center items-cente">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Claim Insurance</h2>

                {/* Prediction Game Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 mb-4">
                    Do you want to claim your insurance in USDT Tokens?
                  </label>
                  <div className="flex items-center text-sm justify-cente gap-4">
                    <button
                      onClick={() => setClaimInUsdt(true)}
                      className={`flex items-center justify-center gap-2 px-2 cursor-pointer py-2 rounded-xl transition-all transform hover:scale-105 ${
                        claimInUsdt
                          ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
                          : "bg-white hover:bg-green-600 text-gray-700 shadow-sm hover:shadow-md"
                      }`}
                    >
                      <Check className="w-5 h-5" />
                      Yes
                    </button>
                    <button
                      onClick={() => setClaimInUsdt(false)}
                      className={`flex items-center justify-center gap-2 px-2 cursor-pointer py-2 rounded-xl transition-all transform hover:scale-105 ${
                        !claimInUsdt
                          ? "bg-gray-500 text-white shadow-lg"
                          : "bg-white hover:bg-gray-600 text-gray-700 shadow-sm hover:shadow-md"
                      }`}
                    >
                      <X className="w-5 h-5" />
                      No
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 mb-4">
                    Do you want to participate in the prediction game?
                  </label>
                  <div className="flex items-center text-sm justify-cente gap-4">
                    <button
                      onClick={() => setParticipateInPrediction(true)}
                      className={`flex items-center justify-center gap-2 px-2 cursor-pointer py-2 rounded-xl transition-all transform hover:scale-105 ${
                        participateInPrediction
                          ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
                          : "bg-white hover:bg-green-600 text-gray-700 shadow-sm hover:shadow-md"
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
                          : "bg-white hover:bg-red-600 text-gray-700 shadow-sm hover:shadow-md"
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
                        onChange={(e:any) => setPrediction(e.target.value)}
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
                    onClick={handleClaim}
                    className="flex items-center justify-center gap-2 px-2 cursor-pointer py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    {processing ? "Processing" : "Proceed"}
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
                            <p className="text-gray-400 text-left">If your prediction is correct, you get your full insurance and win 2FLR.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                                <RiCreativeCommonsZeroFill className="text-white text-xl" />
                            </div>
                            <p className="text-gray-400 text-left">If your prediction is wrong, you lose 50% of your insurance.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                                <FaFantasyFlightGames className="text-white text-xl" />
                            </div>
                            <p className="text-gray-400 text-left">You have an option of getting your insurance in either USDT or FLR Tokens.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg">
                                <FaFantasyFlightGames className="text-white text-xl" />
                            </div>
                            <p className="text-gray-400 text-left">If we have insufficent USDT Tokens. Your Insurance will be paid in FLR Tokens.</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    <Outcome open={open} setOpen={setOpen} mode={modalMode} title={modalTitle} message={modalMessage} />
    </div>
  );
};

export default FlightDetailsPage;
