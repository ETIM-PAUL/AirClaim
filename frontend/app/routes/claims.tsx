// ... existing code ...
import React, { useContext, useEffect, useState } from 'react'
import { Copy, Wallet, Network, Coins } from "lucide-react";
import { useAppKit, useAppKitAccount, useAppKitBalance, useDisconnect } from '@reown/appkit/react'; 
import Sidebar from '~/components/Sidebar';
import { useGeneral } from '~/context/GeneralContext';

const MyClaims = () => {
  const { address, isConnected } = useAppKitAccount(); // Use reown's wallet hooks
  const { fetchBalance } = useAppKitBalance(); // Use reown's wallet hooks
  const { disconnect } = useDisconnect();
  const [claims, setClaims] = useState<any>([]); // State to store claims data
  const { open} = useAppKit();
  const { isSidebarCollapsed } = useGeneral();
  // Fetch claims data for the connected wallet
  const fetchClaims = async () => {
    // Replace with actual API call or contract interaction to fetch claims
    const mockClaims = [
      {
        id: 1,
        flightNumber: "DL-2937",
        airline: "Delta",
        route: "New York - Los Angeles",
        date: "2024-01-01",
        insuredAmount: "100 FLR",
        participatedInPrediction: true,
        wonPrediction: true,
      },
      {
        id: 2,
        flightNumber: "BA-1234",
        airline: "British Airways",
        route: "London - New York",
        date: "2024-01-01",
        insuredAmount: "200 FLR",
        participatedInPrediction: false,
        wonPrediction: false,
      },
      {
        id: 3,
        flightNumber: "SQ-1234",
        airline: "Singapore Airlines",
        route: "Singapore - Los Angeles",
        date: "2024-01-01",
        insuredAmount: "150 FLR",
        participatedInPrediction: true,
        wonPrediction: false,
      },
    ];
    setClaims(mockClaims);
  };

  useEffect(() => {
    if (isConnected) {
      fetchClaims();
    }
  }, [isConnected]);

  // ... existing code ...

  return (
      <div className="w-full bg-gradient-to-br from-gray-900 via-black to-gray-950">
        <div className="flex">
          <Sidebar />
          <div className={`block w-full ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} p-6`}>
            <div>
             <h1 className="text-3xl font-extrabold tracking-tight">Claimed Insurances</h1>
             <p className="text-gray-400 mt-1">Overview of all your claimed insurances</p>
            </div>

            <div className="p-">
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-950 rounded-xl p-4 mt-10">
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
                  {!isConnected ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                      <h2 className="text-2xl font-bold text-white mb-6">Connect Your Wallet</h2>
                      <button
                        onClick={() => open({ view: "Connect", namespace: "eip155" })}
                        className="bg-[#9e74eb] text-white px-8 py-4 rounded-xl hover:opacity-90 transition-all duration-200 flex items-center gap-2"
                      >
                        <Wallet className="w-5 h-5" />
                        Connect Wallet
                      </button>
                    </div>
                  ) : (
                 <div className="">
                    {claims.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                        <thead className="text-gray-400 border-b border-gray-700">
                            <tr>
                            <th className="py-2">Flight No.</th>
                            <th>Route</th>
                            <th>Airline</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Played Prediction</th>
                            <th>Won Prediction</th>
                            </tr>
                        </thead>
                        <tbody>
                            {claims.map((claim: any) => (
                            <tr key={claim.id} className="border-b border-gray-800 hover:bg-gray-900 transition">
                                <td className="py-6 font-semibold">{claim.flightNumber}</td>
                                <td>{claim.route}</td>
                                <td>{claim.airline}</td>
                                <td>{claim.date}</td>
                                <td>{claim.insuredAmount}</td>
                                <td>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${claim.participatedInPrediction ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"}`}>{claim.participatedInPrediction ? "Yes" : "No"}</span>
                                </td>
                                <td>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${claim.wonPrediction ? "bg-green-900 text-green-400" : claim.participatedInPrediction ? "bg-red-900 text-red-400" : "bg-yellow-900 text-yellow-400"}`}>{claim.wonPrediction ? "Yes" : claim.participatedInPrediction ? "No" : "n/a"}</span>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    ) : (
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                      <h2 className="text-2xl font-bold text-white mb-6">No claims found</h2>
                    </div>
                    )}
                 </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  )
}

export default MyClaims