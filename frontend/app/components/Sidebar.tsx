import React from 'react'
import { FaPlane, FaDollarSign, FaUserFriends, FaMoneyCheckAlt, FaChartBar, FaChartPie, FaChartLine, FaSuitcase, FaHeartbeat, FaExclamationCircle, FaTachometerAlt, FaPlaneDeparture, FaFileAlt, FaChartArea, FaUserCircle, FaCog, FaFileExport, FaClipboardList } from "react-icons/fa";


const Sidebar = () => {
  return (
        <aside className="fixed top-0 left-0 h-full w-64 bg-[#101112] border-r border-gray-900 flex flex-col justify-between z-40">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-900">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-lg">✈</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Airclaim
              </span>
            </div>
            {/* Main Navigation */}
            <nav className="mt-6 px-2 flex-1">
              <div className="mb-4">
                <span className="text-xs text-gray-500 px-4">MAIN</span>
                <ul className="mt-2 space-y-1">
                  <li><a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#18191b] text-green-400 font-semibold"><FaTachometerAlt /> Dashboard</a></li>
                  <li><a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-[#18191b] transition"><FaPlaneDeparture /> Flights</a></li>
                  <li><a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-[#18191b] transition"><FaClipboardList /> Insurance</a></li>
                  <li><a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-[#18191b] transition"><FaFileAlt /> Claims</a></li>
                </ul>
              </div>

            </nav>
          </div>
          <div className="px-6 py-4 border-t border-gray-900 text-xs text-gray-600">© {new Date().getFullYear()} Airclaim</div>
        </aside>
      );
}

export default Sidebar