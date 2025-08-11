import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InsureFlightModal from '../components/InsureFlightModal';
import FlightDetailsModal from '../components/FlightDetailsModal';
import '../styles/dashboard.css';
import { useDisconnect } from '@reown/appkit/react';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider, ethers } from "ethers";
import { barData, claimAvatars, COLORS, flights, insuredFlightsAgencyAddress, lineData, pieData } from '~/utils';
import insuredFlightsAgencyAbi from 'insuredFlightsAgency.json';
import { toast } from 'react-toastify';
// import { insureFlight } from 'scripts/insureFlight';
import { FaPlane, FaDollarSign, FaUserFriends, FaMoneyCheckAlt, FaChartBar, FaChartPie, FaChartLine, FaSuitcase, FaHeartbeat, FaExclamationCircle, FaTachometerAlt, FaPlaneDeparture, FaFileAlt, FaChartArea, FaUserCircle, FaCog, FaFileExport, FaClipboardList } from "react-icons/fa";
import StatCard from "../components/statCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import Sidebar from '~/components/Sidebar';
import { useGeneral } from '../context/GeneralContext';

interface FlightFormData {
  aircraftCode: string;
  flightNumber: string;
  insurancePrice: number;
  passengerWalletAddresses: string[];
}

interface Flight {
  id: number;
  aircraftCode: string;
  flightNumber: string;
  insurancePrice: number;
  passengerWalletAddresses: string[];
}


const Dashboard = () => {
  const { disconnect } = useDisconnect();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const[isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const[selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isSidebarCollapsed } = useGeneral();
  
  const handleDisconnect = () => {
    disconnect();
    navigate('/');
  };
  
  const insureFlight = () => {
    setIsModalOpen(true);
  };
  
  const handleModalSubmit = async (formData: FlightFormData) => {
    try {
      setIsLoading(true);
      const newFlight = {
        aircraftCode: formData.aircraftCode,
        flightNumber: formData.flightNumber,
        flightPrice: (formData.insurancePrice * 1e18).toFixed(0),
        passengerWalletAddresses: formData.passengerWalletAddresses,
      }
      console.log("newFlight", newFlight)
      const result = await insureFlight();
      loadFlights();
      toast.success(result as any);

    } catch (error:any) {
      toast.error(error);
      console.log("error",error)
      setIsLoading(false);
    }
  };
  
  const fetchMockFlights = async (): Promise<Flight[]> => {
    // Simulate an API call with mock data
    if (!isConnected) navigate('/');

    const ethersProvider = new BrowserProvider(walletProvider as any);

    // The Contract object
    const insuredFlightsAgencyContract = new ethers.Contract(insuredFlightsAgencyAddress, insuredFlightsAgencyAbi.abi, ethersProvider);
    const allInsuredFlights = await insuredFlightsAgencyContract.getAllInsureFlights();

    const flightsAsObjects = allInsuredFlights.filter((flight:any) => flight[11].toLowerCase() === address?.toLowerCase()).map((flight:any) => ({
      aircraftIcao: flight[0],
      aircraftName: flight[1],
      flightDate: flight[2],
      departureAirport: flight[3],
      arrivalAirport: flight[4],
      flightDelayedTime: flight[5],
      flightNumber: flight[6],
      passengers: flight[7],
      flight_price: flight[8],
      status: flight[9],
      lastChecked: flight[10],
      insurer: flight[11],
      insuranceFlightId: flight[12],
    }));
    
    // Simulate a delay (e.g., 2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));
  
    return flightsAsObjects;
  };

  const handleViewMore = (flight: Flight) => {
    setSelectedFlight(flight);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedFlight(null);
  };

  const loadFlights = async () => {
    setLoading(true);
    try {
      const data = await fetchMockFlights();
      // setFlights(data);
    } catch (error) {
      console.error("Failed to fetch flights:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // loadFlights();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
      <Sidebar />
      <main className={`flex-1 ${isSidebarCollapsed ? 'pl-20' : 'pl-64'} p-6 text-white`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back to <span className="text-green-400"> Airclaim</span></h1>
            <p className="text-gray-400 mt-1">Here’s a summary of all insured flights and claims</p>
          </div>

        </div>
        <hr className="border-gray-800 mb-8" />
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Insured Flights" value="1,284" change="12.5%" positive icon={<FaPlane className="text-green-400 text-2xl" />} />
          <StatCard title="Total Amount Insured" value="2.4M FLR" change="8.3%" positive icon={<FaDollarSign className="text-green-400 text-2xl" />} />
          <StatCard title="Passengers Insured" value="3,569" change="5.7%" positive icon={<FaUserFriends className="text-green-400 text-2xl" />} />
          <StatCard title="Claimed Amount" value="342K FLR" change="2.8%" positive={false} icon={<FaMoneyCheckAlt className="text-red-400 text-2xl" />} />
        </div>
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Bar Chart Card */}
            <div className="bg-[#101112] rounded-2xl p-6 shadow-xl h-80 transition-transform hover:scale-[1.01]">
              <div className="flex items-center mb-4 gap-2">
                <FaChartBar className="text-green-400 text-xl" />
                <h4 className="text-lg font-bold">Insured Flights by Airline</h4>
              </div>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Bar dataKey="British" stackId="a" fill="#34D399" />
                  <Bar dataKey="Delta" stackId="a" fill="#10B981" />
                  <Bar dataKey="United" stackId="a" fill="#06B6D4" />
                  <Bar dataKey="Emirates" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="Others" stackId="a" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pie Chart Card */}
              <div className="bg-[#101112] rounded-2xl p-6 shadow-xl h-80 transition-transform hover:scale-[1.01]">
                <div className="flex items-center mb-4 gap-2">
                  <FaChartPie className="text-green-400 text-xl" />
                  <h4 className="text-lg font-bold">Insurance Distribution by Type</h4>
                </div>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wra gap-2 mt-4">
                  <span className="flex items-center gap-1 text-xs text-green-300"><FaExclamationCircle className="text-green-400" /> Flight Cancellation</span>
                  <span className="flex items-center gap-1 text-xs text-cyan-300"><FaSuitcase className="text-cyan-400" /> Baggage Loss</span>
                  <span className="flex items-center gap-1 text-xs text-blue-300"><FaPlane className="text-blue-400" /> Flight Delay</span>
                  <span className="flex items-center gap-1 text-xs text-yellow-300"><FaHeartbeat className="text-yellow-400" /> Medical Emergency</span>
                  <span className="flex items-center gap-1 text-xs text-red-300"><FaExclamationCircle className="text-red-400" /> Other</span>
                </div>
              </div>
              {/* Line Chart Card */}
              <div className="bg-[#101112] rounded-2xl p-6 shadow-xl h-80 transition-transform hover:scale-[1.01]">
                <div className="flex items-center mb-4 gap-2">
                  <FaChartLine className="text-green-400 text-xl" />
                  <h4 className="text-lg font-bold">Monthly Insurance Trend</h4>
                </div>
                <ResponsiveContainer width="100%" height="85%">
                  <LineChart data={lineData}>
                    <XAxis dataKey="name" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Line type="monotone" dataKey="insured" stroke="#34D399" strokeWidth={2} />
                    <Line type="monotone" dataKey="claimed" stroke="#EF4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {/* Latest Claims Card */}
          <div className="bg-[#101112] rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center mb-2 gap-2">
              <FaExclamationCircle className="text-red-400 text-xl" />
              <h4 className="text-lg font-bold">Latest Claims</h4>
            </div>
            <div className="space-y-4 text-sm">
              {[
                { type: "Emirates", amount: "420FLR", avatar: claimAvatars[0], user: "Emma W.", time: "2h ago", color: "bg-green-900 text-green-300" },
                { type: "Delta", amount: "750FLR", avatar: claimAvatars[1], user: "James F.", time: "5h ago", color: "bg-cyan-900 text-cyan-300" },
                { type: "United", amount: "280FLR", avatar: claimAvatars[2], user: "Michael R.", time: "8h ago", color: "bg-blue-900 text-blue-300" },
                { type: "British Airway", amount: "1200FLR", avatar: claimAvatars[3], user: "Sarah L.", time: "12h ago", color: "bg-yellow-900 text-yellow-300" },
              ].map((claim, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-900 transition">
                  <div className="flex items-center gap-3">
                    <img src={claim.avatar} alt={claim.user} className="w-8 h-8 rounded-full border-2 border-gray-700" />
                    <div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold mr-2 ${claim.color}`}>{claim.type}</span>
                      <div className="text-gray-400 text-xs">{claim.user} • {claim.time}</div>
                    </div>
                  </div>
                  <span className="font-bold text-lg text-red-400">{claim.amount}</span>
                </div>
              ))}
              <button onClick={() => navigate('/claims')} className="mt-4 cursor-pointer w-full bg-gradient-to-r from-green-500 to-green-700 py-2 rounded-lg text-white text-sm font-semibold shadow hover:from-green-600 hover:to-green-800 transition">View My Claims</button>
            </div>
          </div>
        </div>
        {/* Recent Insured Flights Table */}
        <div className="bg-[#101112] rounded-2xl p-6 mt-10 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold">Recent Insured Flights</h4>
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 rounded-lg text-white text-xs font-semibold shadow hover:from-cyan-600 hover:to-blue-700 transition">Export CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400 border-b border-gray-700">
                <tr>
                  <th className="py-2">Flight No.</th>
                  <th>Route</th>
                  <th>Airline</th>
                  <th>Date</th>
                  <th>Passengers</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight) => (
                  <tr key={flight.id} className="border-b border-gray-800 hover:bg-gray-900 transition">
                    <td className="py-2 font-semibold">{flight.id}</td>
                    <td>{flight.route}</td>
                    <td>{flight.airline}</td>
                    <td>{flight.date}</td>
                    <td>{flight.passengers}</td>
                    <td>{flight.amount}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${flight.status === "Claimed" ? "bg-red-900 text-red-400" : "bg-green-900 text-green-400"}`}>{flight.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
            <span>Showing 5 of 1,284 entries</span>
            <div className="flex gap-1">
              <button className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 transition">Previous</button>
              <button className="px-2 py-1 rounded bg-green-700 text-white font-bold">1</button>
              <button className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 transition">2</button>
              <button className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 transition">3</button>
              <button className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 transition">Next</button>
            </div>
          </div>
        </div>
      </main>
      
      <InsureFlightModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
      {(isDetailsModalOpen && selectedFlight) && (
        <FlightDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          fetchMockFlights={loadFlights}
          flight={selectedFlight}
        />
      )}
    </div>
  );

};

export default Dashboard;