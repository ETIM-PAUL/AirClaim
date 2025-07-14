import React from "react";
import StatCard from "../components/statCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { FaPlane, FaDollarSign, FaUserFriends, FaMoneyCheckAlt, FaChartBar, FaChartPie, FaChartLine, FaSuitcase, FaHeartbeat, FaExclamationCircle, FaTachometerAlt, FaPlaneDeparture, FaFileAlt, FaChartArea, FaUserCircle, FaCog, FaFileExport, FaClipboardList } from "react-icons/fa";
import Sidebar from "~/components/Sidebar";


const Dashboard = () => {
  const barData = [
    { name: "Jan", British: 200, Delta: 150, United: 120, Emirates: 90, Others: 50 },
    { name: "Feb", British: 250, Delta: 200, United: 160, Emirates: 120, Others: 80 },
    { name: "Mar", British: 300, Delta: 250, United: 200, Emirates: 180, Others: 100 },
    { name: "Apr", British: 320, Delta: 280, United: 230, Emirates: 200, Others: 130 },
    { name: "May", British: 360, Delta: 310, United: 260, Emirates: 230, Others: 150 },
    { name: "Jun", British: 400, Delta: 340, United: 300, Emirates: 260, Others: 180 },
  ];

  const pieData = [
    { name: "Flight Cancellation", value: 400 },
    { name: "Baggage Loss", value: 300 },
    { name: "Flight Delay", value: 300 },
    { name: "Medical Emergency", value: 200 },
    { name: "Other", value: 100 },
  ];

  const COLORS = ["#34D399", "#10B981", "#06B6D4", "#F59E0B", "#EF4444"];

  const lineData = [
    { name: "Jan", insured: 200000, claimed: 40000 },
    { name: "Feb", insured: 300000, claimed: 50000 },
    { name: "Mar", insured: 400000, claimed: 60000 },
    { name: "Apr", insured: 500000, claimed: 70000 },
    { name: "May", insured: 600000, claimed: 80000 },
    { name: "Jun", insured: 700000, claimed: 85000 },
  ];

  const flights = [
    { id: "BA-2937", route: "London → Paris", airline: "British Airways", date: "Jun 15, 2023", passengers: 2, amount: "$420", status: "Claimed" },
    { id: "DL-1854", route: "New York → Miami", airline: "Delta Airlines", date: "Jun 14, 2023", passengers: 1, amount: "$750", status: "Claimed" },
    { id: "UA-482", route: "Chicago → Dallas", airline: "United Airlines", date: "Jun 14, 2023", passengers: 3, amount: "$280", status: "Claimed" },
    { id: "SQ-321", route: "Singapore → Tokyo", airline: "Singapore Airlines", date: "Jun 13, 2023", passengers: 2, amount: "$1,200", status: "Claimed" },
    { id: "EK-203", route: "Dubai → New York", airline: "Emirates", date: "Jun 12, 2023", passengers: 4, amount: "$1,800", status: "Active" },
  ];

  const claimAvatars = [
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/45.jpg",
    "https://randomuser.me/api/portraits/women/46.jpg",
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, <span className="text-green-400">Alex</span></h1>
            <p className="text-gray-400 mt-1">Here’s a summary of your insurance dashboard</p>
          </div>
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar" className="w-12 h-12 rounded-full border-2 border-green-400 shadow-lg" />
        </div>
        <hr className="border-gray-800 mb-8" />
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Insured Flights" value="1,284" change="12.5%" positive icon={<FaPlane className="text-green-400 text-2xl" />} />
          <StatCard title="Total Amount Insured" value="$2.4M" change="8.3%" positive icon={<FaDollarSign className="text-green-400 text-2xl" />} />
          <StatCard title="Passengers Insured" value="3,569" change="5.7%" positive icon={<FaUserFriends className="text-green-400 text-2xl" />} />
          <StatCard title="Claimed Amount" value="$342K" change="2.8%" positive={false} icon={<FaMoneyCheckAlt className="text-red-400 text-2xl" />} />
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
                <div className="flex flex-wrap gap-2 mt-4">
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
                { type: "Flight Cancellation", amount: "$420", avatar: claimAvatars[0], user: "Emma W.", time: "2h ago", color: "bg-green-900 text-green-300" },
                { type: "Lost Luggage", amount: "$750", avatar: claimAvatars[1], user: "James F.", time: "5h ago", color: "bg-cyan-900 text-cyan-300" },
                { type: "Flight Delay", amount: "$280", avatar: claimAvatars[2], user: "Michael R.", time: "8h ago", color: "bg-blue-900 text-blue-300" },
                { type: "Medical Emergency", amount: "$1,200", avatar: claimAvatars[3], user: "Sarah L.", time: "12h ago", color: "bg-yellow-900 text-yellow-300" },
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
              <button className="mt-4 w-full bg-gradient-to-r from-green-500 to-green-700 py-2 rounded-lg text-white text-sm font-semibold shadow hover:from-green-600 hover:to-green-800 transition">View All Claims</button>
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
    </div>
  );
};

export default Dashboard;
