import React, { useContext, useEffect, useState } from 'react'
import { Copy, Wallet, Network, Coins } from "lucide-react";
import { useAppKit, useAppKitAccount, useAppKitBalance, useAppKitState, useDisconnect } from '@reown/appkit/react'; // Replace wagmi with reown
import Sidebar from '~/components/Sidebar';
import { useGeneral } from "../context/GeneralContext";
import { ethers } from 'ethers';
import GetWFLRModal from '~/components/WFlr';
import FLRToUSDTModal from '~/components/FlrToUsdt';

const MyWallet = () => {
  const { address, isConnected } = useAppKitAccount(); // Use reown's wallet hooks
  const { fetchBalance } = useAppKitBalance(); // Use reown's wallet hooks
  const { disconnect } = useDisconnect();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [balance, setBalance] = useState<any>(0);
  const [wFlrBalance, setWFlrBalance] = useState<any>(0);
  const [showGetWFLRModal, setShowGetWFLRModal] = useState<boolean>(false);
  const [showGetUsdtModal, setShowGetUsdtModal] = useState<boolean>(false);
  const { isSidebarCollapsed } = useGeneral();
 

  const { open} = useAppKit();


  const handleCopy = () => {
    navigator.clipboard.writeText(address?.toString() ?? "");
  }

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  const disconnectWallet = async () => {
    await disconnect();
  }

  const getBalance = async () => {
    const balance = await fetchBalance();
    setBalance(balance);
  }

  const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
  ];

  async function fetchWFLRBalance() {
    const tokenAddress = "0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273";
    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any)
      // Create contract instance
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      
      // Fetch token info and balance in parallel
      const [balance, decimals] = await Promise.all([
        tokenContract.balanceOf(address),
        tokenContract.decimals()
      ]);
      
      // Format balance from wei to human readable
      const formattedBalance = ethers.formatUnits(balance, decimals);
      setWFlrBalance(formattedBalance)
      
    } catch (error:any) {
      console.error('Error fetching ERC20 balance:', error);
      return {
        success: false,
        error: error.message,
        balance: '0',
        tokenAddress: tokenAddress,
        accountAddress: address
      };
    }
  }


  useEffect(() => {
    if (isConnected) {
      getBalance();
      fetchWFLRBalance();
      }
  }, [address, isConnected]);


  return (
    <div>
      <div className="w-full bg-gradient-to-br from-gray-900 via-black to-gray-950">
        <div className="flex">
          <Sidebar />
          <div className={`block ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} p-6 text-white w-full`}>
            <div className="p-4">
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-950 rounded-xl p-4">
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 p-8">
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
                    <div id="wallet-card" className="max-w-4xl mx-auto space-y-6">
                      {/* Wallet Card */}
                      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-950 shadow-xl rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center">
                        <div>
                          <h2 className="text-lg font-semibold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-1 flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-white" /> Connected Wallet
                          </h2>
                          <div className="text-xl font-mono font-bold text-white">{formatAddress(address?.toString() ?? "")}</div>
                          <button onClick={handleCopy} className="text-sm mt-1 cursor-pointer bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent hover:underline">Copy</button>
                        </div>

                        <div className="mt-4 md:mt-0 flex flex-col items-end">
                          <h2 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                            <Network className="w-4 h-4 text-indigo-500" /> Network
                          </h2>
                          <div className="text-md font-medium">Coston2</div> {/* Replace with dynamic network if needed */}
                          <button 
                            onClick={disconnectWallet}
                            className="text-sm text-red-500 hover:underline mt-2"
                          >
                            Disconnect
                          </button>
                        </div>
                      </div>

                      {/* Native Token Balance */}
                      <div className="bg-gradient-to-r from-green-800 to-emerald-500 p-6 rounded-3xl shadow flex justify-between items-center">
                        <div>
                          <h3 className="text-md font-medium text-black">Your FLR Balance</h3>
                          <div className='flex items-center gap-3'>
                            <div className="text-3xl font-bold text-white mt-1">
                            {balance.data?.balance} FLR
                            </div>
                            <div className='bg-green-400 p-2 text-xs cursor-pointer w-fit rounded-md'>
                              <button onClick={()=>setShowGetWFLRModal(true)} className='cursor-pointer'>Get WFLR</button>
                            </div>
                            <div className='bg-white hidden p-2 text-xs cursor-pointer w-fit rounded-md'>
                              <button onClick={()=>setShowGetUsdtModal(true)} className='cursor-pointer text-black'>Convert USDT</button>
                            </div>
                          </div>
                        </div>
                        <Coins className="w-12 h-12 text-white" />
                      </div>

                      {/* Token Balances */}
                      <div className="bg-white rounded-3xl p-6 shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Other Token Balances</h3>
                        
                        <div className='flex gap-2'>
                          <div className="">
                              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-2">
                                <div className="w-14 h-14 p-2 rounded-full bg-green-300 flex justify-center items-center">
                                  <span className="font-bold">WFLR</span>
                                </div>
                                <div>
                                  <div className="flex items-center gap-1">
                                    <div className="text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">{wFlrBalance}</div>
                                    <div className="text-sm hidden text-gray-600">WFLR</div>
                                  </div>
                                  <div className="text-sm text-gray-600">Wrapped FLR</div>
                                </div>
                                </div>

                              </div>
                          </div>
                          <div className="">
                              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-2">
                                <div className="w-14 h-14 p-2 rounded-full bg-green-300 flex justify-center items-center">
                                  <span className="font-bold">USDT</span>
                                </div>
                                <div>
                                  <div className="flex items-center gap-1">
                                    <div className="text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">{wFlrBalance}</div>
                                    <div className="text-sm hidden text-gray-600">USDT</div>
                                  </div>
                                  <div className="text-sm text-gray-600">USDT</div>
                                </div>
                                </div>

                              </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GetWFLRModal
        isOpen={showGetWFLRModal}
        onClose={() => setShowGetWFLRModal(false)}
        getBalance={getBalance}
        fetchWFLRBalance={fetchWFLRBalance}
        balance={balance.data?.balance}
      />
      <FLRToUSDTModal
        isOpen={showGetUsdtModal}
        onClose={() => setShowGetUsdtModal(false)}
        getBalance={getBalance}
        fetchWFLRBalance={fetchWFLRBalance}
        balance={balance.data?.balance}
      />
     
    </div>
  )
}

export default MyWallet