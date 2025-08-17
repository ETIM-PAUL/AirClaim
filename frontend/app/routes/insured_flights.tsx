import { useEffect, useState } from "react";
import { FaCalendarAlt, FaMoneyBill, FaPlane, FaPlus, FaSatellite } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "~/components/Sidebar";
import { useGeneral } from "../context/GeneralContext";

const FlightsOverviewPage = () => {
  const navigate = useNavigate();
  const { isSidebarCollapsed, loadingFlights, allFlights  } = useGeneral();

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
        {loadingFlights && <p>Loading flights...</p>}
        {!loadingFlights && allFlights.length === 0 && <p>No flights found</p>}

        <div className="flex md:flex-wrap gap-6">
          {allFlights.map((flight:any) => (
            <div key={flight.id} className="bg-[#101112] grow w-full md:max-w-md rounded-2xl p-6 shadow-xl transition-transform hover:scale-[1.01]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex justify-center items-center">
                  <span className="font-bold">{flight.aircraftIcao}</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold">{flight.airline}</h2>
                  <p className="text-gray-400">{flight.flightNumber}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaPlane className="text-green-400" />
                  <p className="text-gray-400">Route</p>
                  <p className="font-semibold font-xs">{flight.departureAirport.length > 30 ? flight.departureAirport.slice(0,30) : flight.departureAirport} → {flight.arrivalAirport.length > 30 ? flight.arrivalAirport.slice(0,30) : flight.arrivalAirport}</p>
                </div>

                <div className="inline">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-green-400" />
                    <p className="text-gray-400">Date</p>
                    <p className="font-semibold font-xs">{flight.flightDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaSatellite className="text-green-400" />
                    <p className="text-gray-400">Status</p>
                    <p className={`font-semibold ${Number(flight.flightDelayedTime) >= 30 ? "text-yellow-400" : flight.flightStatus === "cancelled" ? "text-red-400" : "text-green-400"}`}>{Number(flight.flightDelayedTime) >= 30 ? "delayed" : flight?.flightStatus}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FaMoneyBill className="text-green-400" />
                  <p className="text-gray-400">Insured Amount</p>
                  <p className="font-semibold font-xs">{flight.insuredAmount} FLR</p>
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
