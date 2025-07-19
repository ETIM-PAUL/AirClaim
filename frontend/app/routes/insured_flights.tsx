import { useState } from "react";
import { FaCalendarAlt, FaMoneyBill, FaPlane, FaPlus, FaSatellite } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "~/components/Sidebar";
import { useGeneral } from "../context/GeneralContext";

const FlightsOverviewPage = () => {
  const [flights, setFlights] = useState<any[]>([
    {
      id: "1",
      flightNumber: "UA-482",
      airline: "United Airlines",
      airlineImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/United_Airlines_logo_2010.svg/1200px-United_Airlines_logo_2010.svg.png",
      departureAirport: "JFK",
      arrivalAirport: "LAX",
      flightDate: "2023-10-15",
      flightStatus: "Active",
      insuredAmount: "560 FLR",
    },
    {
      id: "2",
      flightNumber: "DL-123",
      airline: "Delta Airlines",
      airlineImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Delta_Airlines_logo_2014.svg/1200px-Delta_Airlines_logo_2014.svg.png",
      departureAirport: "ATL",
      arrivalAirport: "SFO",
      flightDate: "2023-10-20",
      flightStatus: "Delayed",
      insuredAmount: "720 FLR",
    },
    {
      id: "3",
      flightNumber: "AA-456",
      airline: "American Airlines",
      airlineImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/American_Airlines_logo_2013.svg/1200px-American_Airlines_logo_2013.svg.png",
      departureAirport: "DFW",
      arrivalAirport: "ORD",
      flightDate: "2023-10-25",
      flightStatus: "Cancelled",
      insuredAmount: "480 FLR",
    },
  ]);

  const navigate = useNavigate();
  const { isSidebarCollapsed } = useGeneral();

  const handleInsureNewFlight = () => {
    // Navigate to the page for insuring a new flight
    navigate("/insure-flight");
  };

  const handleViewDetails = (flightId: string) => {
    // Navigate to the flight details page
    navigate(`/flight-details/${flightId}`);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
        <Sidebar />
      <main className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} p-6 text-white`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Insured Flights</h1>
            <p className="text-gray-400 mt-1">Overview of all your insured flights</p>
          </div>
          <button
            onClick={handleInsureNewFlight}
            className="flex cursor-pointer items-center bg-gradient-to-r from-green-500 to-green-700 py-2 px-4 rounded-lg text-white text-sm font-semibold shadow hover:from-green-600 hover:to-green-800 transition"
          >
            <FaPlus className="mr-2" />
            Insure New Flight
          </button>
        </div>
        <hr className="border-gray-800 mb-8" />

        {/* Flights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flights.map((flight) => (
            <div key={flight.id} className="bg-[#101112] rounded-2xl p-6 shadow-xl transition-transform hover:scale-[1.01]">
              <div className="flex items-center gap-4 mb-4">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt={flight.airline} className="w-12 h-12 rounded-full shadow-lg" />
                <div>
                  <h2 className="text-lg font-bold">{flight.airline}</h2>
                  <p className="text-gray-400">{flight.flightNumber}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaPlane className="text-green-400" />
                  <p className="text-gray-400">Route</p>
                  <p className="font-semibold font-xs">{flight.departureAirport} → {flight.arrivalAirport}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-green-400" />
                  <p className="text-gray-400">Date</p>
                  <p className="font-semibold font-xs">{flight.flightDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FaSatellite className="text-green-400" />
                  <p className="text-gray-400">Status</p>
                  <p className={`font-semibold font-xs ${flight.flightStatus === "Delayed" ? "text-yellow-400" : flight.flightStatus === "Cancelled" ? "text-red-400" : "text-green-400"}`}>
                    {flight.flightStatus}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <FaMoneyBill className="text-green-400" />
                  <p className="text-gray-400">Insured Amount</p>
                  <p className="font-semibold font-xs">{flight.insuredAmount}</p>
                </div>
              </div>
              <button
                onClick={() => handleViewDetails(flight.id)}
                className="mt-4 w-full bg-gradient-to-r from-green-400 to-emerald-500 py-2 rounded-lg text-white text-sm font-semibold shadow hover:from-green-600 hover:to-emerald-700 transition cursor-pointer"
              >
                See More Details
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FlightsOverviewPage;
