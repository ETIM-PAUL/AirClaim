// ... existing code ...
import React, { useContext, useEffect, useState } from 'react'
import { Wallet } from "lucide-react";
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'; 
import Sidebar from '~/components/Sidebar';
import { useGeneral } from '~/context/GeneralContext';

const MyClaims = () => {
  const { address, isConnected } = useAppKitAccount(); // Use reown's wallet hooks
  const { open} = useAppKit();
  const { isSidebarCollapsed, loadingFlights, allClaims } = useGeneral();


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
                    {loadingFlights && <p>Loading claims...</p>}
                    {(!loadingFlights && allClaims?.filter((item:any) => item.insuree.toLowerCase() === address?.toLowerCase()).length > 0) && 
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
                            {allClaims?.filter((item:any) => item.insuree.toLowerCase() === address?.toLowerCase()).map((claim: any,index:number) => (
                            <tr key={index} className="border-b border-gray-800 hover:bg-gray-900 transition">
                                <td className="py-6 font-semibold">{claim.flightNumber}</td>
                                <td>{claim.routeA.length > 30 ? claim.routeA.slice(0,30)+"..." : claim.routeA} → {claim.routeB.length > 30 ? claim.routeB.slice(0,30)+"..."  : claim.routeB}</td>
                                <td>{claim.type}</td>
                                <td>{claim.time}</td>
                                <td>{claim.amount} FLR</td>
                                <td>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${claim.playedPrediction ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"}`}>{claim.playedPrediction ? "Yes" : "No"}</span>
                                </td>
                                <td>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${claim.wonPrediction ? "bg-green-900 text-green-400" : claim.playedPrediction ? "bg-red-900 text-red-400" : "bg-yellow-900 text-yellow-400"}`}>{claim.wonPrediction ? "Yes" : claim.playedPrediction ? "No" : "n/a"}</span>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    }
                    {!loadingFlights && allClaims?.filter((item:any) => item.insuree.toLowerCase() === address?.toLowerCase()).length === 0 &&
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                      <h2 className="text-2xl font-bold text-white mb-6">No claims found</h2>
                    </div>
                    }
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