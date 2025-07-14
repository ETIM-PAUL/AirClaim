import { useState } from "react";
import { FaPlane, FaUserFriends, FaDollarSign, FaChartLine, FaExclamationCircle, FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaInfoCircle } from "react-icons/fa";
import Sidebar from "~/components/Sidebar";

const FlightDetailsPage = () => {
  const [flight, setFlight] = useState<any>({
    id: "UA-482",
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
    ticketPrice: "1200 FLR",
    passengerTicketPrice: "600 FLR",
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
    insuredAmount: "560 FLR",
    claimedAmount: "280 FLR",
    claimedFLR: "280 FLR",
    status: "Claimed",
  });

  const handleCheckFlightStatus = () => {
    // Implement flight status check logic here
    alert("Checking flight status...");
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
              {/* <div className="flex items-center gap-3">
                <FaTicketAlt className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Ticket Price</p>
                  <p className="font-semibold">{flight.ticketPrice}</p>
                </div>
              </div> */}
              <div className="flex items-center gap-3">
                <FaUserFriends className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Passengers</p>
                  <p className="font-semibold">{flight.passengers ?? 0}</p>
                </div>
              </div>
              <button
                onClick={handleCheckFlightStatus}
                className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-2 rounded-lg text-white text-sm font-semibold shadow hover:from-cyan-600 hover:to-blue-700 transition"
              >
                Check Flight Status
              </button>
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
                  <p className={`font-semibold ${flight.status === "Claimed" ? "text-red-400" : "text-green-400"}`}>{flight.status}</p>
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
                <FaChartLine className="text-green-400 text-xl" />
                <div>
                  <p className="text-gray-400">Claimed Amount</p>
                  <p className="font-semibold">{flight.claimedAmount} FLR</p>
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
    </div>
  );
};

export default FlightDetailsPage;
