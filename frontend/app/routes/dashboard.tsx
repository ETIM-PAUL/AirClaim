import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { COLORS, lineData, shortenAddress, transformFlightData, transformToAirlineTotals, transformToMonthlyTotalsETH } from '~/utils';
import { FaPlane, FaDollarSign, FaUserFriends, FaMoneyCheckAlt, FaChartBar, FaChartPie, FaChartLine, FaSuitcase, FaHeartbeat, FaExclamationCircle, FaTachometerAlt, FaPlaneDeparture, FaFileAlt, FaChartArea, FaUserCircle, FaCog, FaFileExport, FaClipboardList } from "react-icons/fa";
import StatCard from "../components/statCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import Sidebar from '~/components/Sidebar';
import { useGeneral } from '../context/GeneralContext';

// Skeleton components
const StatCardSkeleton = () => (
  <div className="bg-[#101112] rounded-2xl p-6 shadow-xl">
    <div className="flex items-center justify-between mb-4">
      <Skeleton width={120} height={20} />
      <Skeleton width={40} height={40} circle />
    </div>
    <Skeleton width={80} height={32} className="mb-2" />
    <Skeleton width={100} height={16} />
  </div>
);

const ChartSkeleton = () => (
  <div className="bg-[#101112] rounded-2xl p-6 shadow-xl h-80">
    <div className="flex items-center mb-4 gap-2">
      <Skeleton width={20} height={20} />
      <Skeleton width={150} height={20} />
    </div>
    <Skeleton height="85%" />
  </div>
);

const ClaimsSkeleton = () => (
  <div className="bg-[#101112] rounded-2xl p-6 shadow-xl flex flex-col gap-4">
    <div className="flex items-center mb-2 gap-2">
      <Skeleton width={20} height={20} />
      <Skeleton width={100} height={20} />
    </div>
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3">
            <Skeleton width={32} height={32} circle />
            <div>
              <Skeleton width={80} height={16} className="mb-1" />
              <Skeleton width={120} height={12} />
            </div>
          </div>
          <Skeleton width={60} height={20} />
        </div>
      ))}
      <Skeleton height={40} />
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="bg-[#101112] rounded-2xl p-6 shadow-xl">
    <div className="flex items-center justify-between mb-4">
      <Skeleton width={150} height={20} />
      <Skeleton width={80} height={32} />
    </div>
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex justify-between items-center py-2">
          <Skeleton width={60} height={16} />
          <Skeleton width={100} height={16} />
          <Skeleton width={80} height={16} />
          <Skeleton width={80} height={16} />
          <Skeleton width={60} height={16} />
          <Skeleton width={80} height={16} />
          <Skeleton width={60} height={16} />
        </div>
      ))}
    </div>
    <div className="flex justify-between items-center mt-4">
      <Skeleton width={120} height={16} />
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} width={32} height={32} />
        ))}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  
  const navigate = useNavigate();
  const { isSidebarCollapsed, loadingFlights, allFlights, allClaims  } = useGeneral();
  

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 3000); // Show skeleton for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Show skeleton loading
  if (loadingFlights) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-300 via-black to-gray-950">
        <Sidebar />
        <main className={`flex-1 ${isSidebarCollapsed ? 'pl-20' : 'pl-64'} p-6 text-white`}>
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton width={400} height={32} className="mb-2" />
            <Skeleton width={300} height={16} />
          </div>
          <hr className="border-gray-800 mb-8" />
          
          {/* Stat Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
          
          {/* Main Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ChartSkeleton />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ChartSkeleton />
                <ChartSkeleton />
              </div>
            </div>
            <ClaimsSkeleton />
          </div>
          
          {/* Table Skeleton */}
          <div className="mt-10">
            <TableSkeleton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
      <Sidebar />
      <main className={`flex-1 ${isSidebarCollapsed ? 'pl-20' : 'pl-64'} p-6 text-white`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back to <span className="text-green-400"> Airclaim</span></h1>
            <p className="text-gray-400 mt-1">Here's a summary of all insured flights and claims</p>
          </div>
        </div>
        <hr className="border-gray-800 mb-8" />
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Insured Flights" value={allFlights?.length} change="12.5%" positive icon={<FaPlane className="text-green-400 text-2xl" />} />
          <StatCard title="Total Amount Insured" value={allFlights?.reduce((total:number, item:any) => {
                    const ticketPrice = item.insuredAmount;
                    return total + Number(ticketPrice);
                  }, 0).toString() + " FLR"} change="8.3%" positive icon={<FaDollarSign className="text-green-400 text-2xl" />} />
          <StatCard title="Passengers Insured" value={allFlights?.reduce((total:number, item:any) => {
                    const flightPassengers = item.passengers;
                    return total + Number(flightPassengers);
                  }, 0)} change="5.7%" positive icon={<FaUserFriends className="text-green-400 text-2xl" />} />
          <StatCard title="Claimed Amount" value={allClaims?.reduce((total:number, item:any) => {
                    const amountClaimed = item.amount;
                    return total + Number(amountClaimed);
                  }, 0).toString() + " FLR"} change="2.8%" positive={false} icon={<FaMoneyCheckAlt className="text-red-400 text-2xl" />} />
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
                <BarChart data={transformFlightData(allFlights)}>
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  {allFlights?.map((item:any, index:number) =>
                  <Bar key={index} dataKey={item?.airline} stackId="a" fill={COLORS[index]} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pie Chart Card */}
              <div className="bg-[#101112] rounded-2xl p-6 shadow-xl h-80 transition-transform hover:scale-[1.01]">
                <div className="flex items-center mb-4 gap-2">
                  <FaChartPie className="text-green-400 text-xl" />
                  <h4 className="text-lg font-bold">Insurance Distribution by Airlines and Insured Amount</h4>
                </div>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={transformToAirlineTotals(allFlights)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {transformToAirlineTotals(allFlights).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex hidden flex-wrap gap-2 mt-4">
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
                  <LineChart data={transformToMonthlyTotalsETH(allFlights)}>
                    <XAxis dataKey="name" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Line type="monotone" dataKey="insured" stroke="#34D399" strokeWidth={2} />
                    <Line type="monotone" dataKey="passengers" stroke="#EF4444" strokeWidth={2} />
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
            {allClaims?.length > 0 &&
              <div className="space-y-4 text-sm">
                {allClaims.slice(0,5).map((claim:any, idx:number) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-900 transition">
                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex justify-center items-center">
                      <span className="font-bold text-white">{claim.avatar}</span>
                    </div>
                      <div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold mr-2 ${claim.color}`}>{claim.type}</span>
                        <div className="text-gray-400 text-xs">{shortenAddress(claim.insuree)} • {claim.time}</div>
                      </div>
                    </div>
                    <span className="font-bold text-lg text-red-400">{claim.amount} FLR</span>
                  </div>
                ))}
                <button onClick={() => navigate('/claims')} className="mt-4 cursor-pointer w-full bg-gradient-to-r from-green-500 to-green-700 py-2 rounded-lg text-white text-sm font-semibold shadow hover:from-green-600 hover:to-green-800 transition">View My Claims</button>
              </div>
            }
            {allClaims?.length === 0 &&
              <p>No flights found</p>
            }
          </div>
        </div>
        
        {/* Recent Insured Flights Table */}
        <div className="bg-[#101112] rounded-2xl p-6 mt-10 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold">Recent Insured Flights</h4>
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 rounded-lg text-white text-xs font-semibold shadow hover:from-cyan-600 hover:to-blue-700 transition">Export CSV</button>
          </div>

          {allFlights?.length > 0 &&
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
                {allFlights.map((flight:any) => (
                  <tr key={flight.id} className="border-b border-gray-800 hover:bg-gray-900 transition">
                    <td className="py-2 font-semibold">{flight.id}</td>
                    <td>{flight.departureAirport.length > 30 ? flight.departureAirport.slice(0,30)+"..." : flight.departureAirport} → {flight.arrivalAirport.length > 30 ? flight.arrivalAirport.slice(0,30)+"..."  : flight.arrivalAirport}</td>
                    <td>{flight.airline}</td>
                    <td>{flight.flightDate}</td>
                    <td>{flight.passengers}</td>
                    <td>{flight.insuredAmount}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${Number(flight.flightDelayedTime) >= 30 ? "bg-red-900 text-red-400" : "bg-green-900 text-green-400"}`}>{Number(flight.flightDelayedTime) >= 30 ? "delayed" : flight?.flightStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          }

          {allFlights?.length === 0 &&
              <p>No flights insured yet</p>
            }
        </div>
      </main>
      
    </div>
  );
};

export default Dashboard;