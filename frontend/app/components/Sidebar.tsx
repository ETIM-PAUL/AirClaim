import React, { useState } from 'react';
import { FaPlane, FaDollarSign, FaUserFriends, FaMoneyCheckAlt, FaChartBar, FaChartPie, FaChartLine, FaSuitcase, FaHeartbeat, FaExclamationCircle, FaTachometerAlt, FaPlaneDeparture, FaFileAlt, FaChartArea, FaUserCircle, FaCog, FaFileExport, FaClipboardList, FaWallet } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Import icons for toggle
import { useGeneral } from '../context/GeneralContext';
import { GiShipWheel } from 'react-icons/gi';

const Sidebar = () => {
  const navigate = useNavigate();
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useGeneral();
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full ${
        isSidebarCollapsed ? 'w-16' : 'w-56'
      } bg-[#101112] border-r border-gray-900 flex flex-col justify-between z-40 transition-all duration-300`}
    >
      <div>
        {/* Logo and Toggle Button */}
        <div className="flex items-center justify-between gap-3 px-6 py-6 border-b border-gray-900">
          {!isSidebarCollapsed && (
            <div onClick={() => navigate('/')} className="flex cursor-pointer items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-lg">✈</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Airclaim
              </span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 bg-[#18191b] cursor-pointer rounded-lg hover:bg-[#202122] transition-all"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5 text-gray-300" /> : <ChevronLeft className="w-5 h-5 text-gray-300" />}
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="mt-6 px-2 flex-1">
          <div className="mb-4">
            {!isSidebarCollapsed && <span className="text-xs text-gray-500 px-4">MAIN</span>}
            <ul className="mt-2 space-y-1">
              <li className='cursor-pointer'>
                <span
                  onClick={() => navigate('/dashboard')}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-[#18191b] transition ${
                    window.location.pathname === '/dashboard' ? 'bg-[#18191b] text-green-400' : ''
                  }`}
                >
                  <FaTachometerAlt />
                  {!isSidebarCollapsed && 'Dashboard'}
                </span>
              </li>
              <li className='cursor-pointer'>
                <span
                  onClick={() => navigate('/insured-flights')}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-[#18191b] transition ${
                    (window.location.pathname === '/insured-flights' || window.location.pathname.includes('/flight-details')) ? 'bg-[#18191b] text-green-400' : ''
                  }`}
                >
                  <FaPlaneDeparture />
                  {!isSidebarCollapsed && 'Insured Flights'}
                </span>
              </li>
              <li className='cursor-pointer'>
                <span
                  onClick={() => navigate('/claims')}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-[#18191b] transition ${
                    window.location.pathname === '/claims' ? 'bg-[#18191b] text-green-400' : ''
                  }`}
                >
                  <FaFileAlt />
                  {!isSidebarCollapsed && 'Claims'}
                </span>
              </li>
            </ul>
          </div>

          <div className='mb-4'>
            {!isSidebarCollapsed && <span className="text-xs text-gray-500 px-4">Games (Lounge)</span>}
            <ul className="mt-2 space-y-1">
              <li className='cursor-pointer'>
                <span
                  onClick={() => navigate('/lucky-spin')}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-[#18191b] transition"
                >
                  <GiShipWheel />
                  {!isSidebarCollapsed && 'Lucky Spin'}
                </span>
              </li>
            </ul>
          </div>

          <div>
            {!isSidebarCollapsed && <span className="text-xs text-gray-500 px-4">SETTINGS</span>}
            <ul className="mt-2 space-y-1">
              <li className='cursor-pointer'>
                <span
                  onClick={() => navigate('/wallet')}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-[#18191b] transition ${
                    window.location.pathname === '/wallet' ? 'bg-[#18191b] text-green-400' : ''
                  }`}
                >
                  <FaWallet />
                  {!isSidebarCollapsed && 'Wallet'}
                </span>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Footer */}
      {!isSidebarCollapsed && (
        <div className="px-6 py-4 border-t border-gray-900 text-xs text-gray-600">
          © {new Date().getFullYear()} Airclaim
        </div>
      )}
    </aside>
  );
};

export default Sidebar;