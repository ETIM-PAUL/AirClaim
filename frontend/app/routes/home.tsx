import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import planeImage from '../assets/image1.png';
import prof from '../assets/prof.png';
import Swal from 'sweetalert2';
import CustomModal from '../components/claimInsurance';
import { useAppKit, useAppKitAccount, useAppKitProvider, useDisconnect } from "@reown/appkit/react";
import { BrowserProvider, ethers } from "ethers";
import { customNetwork, insuredFlightsAgencyAddress } from '~/utils';
import insuredFlightsAgencyAbi from 'insuredFlightsAgency.json';
import { toast } from "react-toastify";

export default function Home() {
  const { walletProvider } = useAppKitProvider("eip155");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const [loading, setLoading] = useState(false);
  
  const handleInsuranceSubmit = async (formData: any) => {
    try {
      setLoading(true);
    const ethersProvider = new BrowserProvider(walletProvider as any);
    const signer = await ethersProvider.getSigner();
    // The Contract object
    const insuredFlightsAgencyContract = new ethers.Contract(insuredFlightsAgencyAddress, insuredFlightsAgencyAbi.abi, signer);
    
    // Call the claimInsurance function
    const tx = await insuredFlightsAgencyContract.claimInsurance(formData.flightID);
    await tx.wait();
    toast.success('Insurance Claimed Successfully');
    setLoading(false);
    } catch (error: any) {
      toast.error(error.reason);
      console.log("error",error)
      setLoading(false);
    }
  };


  // Function to handle the "Dashboard" button click
  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const switchToCustomNetwork = async (): Promise<void> => {
    if (!window.ethereum) {
      console.error("MetaMask is not installed");
      return;
    }
  
    try {
      // Try to switch to the custom network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: customNetwork.chainId }],
      });
    } catch (error: any) {
      // If the network is not added, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [customNetwork],
          });
        } catch (addError: any) {
          console.error("Failed to add the network:", addError);
        }
      } else {
        console.error("Failed to switch the network:", error);
      }
    }
  };

  const handleConnectWallet = async () => {
    await open(); // Open the Reown AppKit modal
    await switchToCustomNetwork(); // Force switch to the custom network
  };

  return (
    <div className="min-h-screen hero-gradient plane-background">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-12 italic">
            <a href="/" className="text-blue-500 transition-transform duration-200 text-2xl font-bold">AirClaim</a>
            <a href="#features" className="text-white/90 hover:text-blue-500 hover:scale-105 transition-transform duration-200 text-sm">Features</a>
            <a href="#how-it-works" className="text-white/90 hover:text-blue-500 hover:scale-105 transition-transform duration-200 text-sm">How It Works</a>
            <a href="#about" className="text-white/90 hover:text-blue-500 hover:scale-105 transition-transform duration-200 text-sm">About</a>
          </div>
          <div className="flex space-x-3">
            {isConnected ? (
              <div className="flex gap-4">
                <div>
                  <button 
                    onClick={() => disconnect()} 
                    className="nav-button primary-button hover:scale-105 transition-transform duration-200"
                  >
                    Disconnect Wallet
                  </button>
                </div>
                <div>
                  <button 
                    className="nav-button primary-button hover:scale-105 transition-transform duration-200" 
                    onClick={handleDashboardClick}
                  >
                    Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <button className="nav-button primary-button hover:scale-105 transition-transform duration-200" onClick={handleConnectWallet}>
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 flex">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-16">
          {/* Left Column */}
          <div className="space-y-6 pt-8">
            <h1 className="text-[56px] leading-[1.1] font-bold text-[#F8F7FF]">
              Real-Time<br />
              Flight Delay<br />
              Insurance
            </h1>
            <p className="text-[#F8F7FF]/90 text-xl max-w-md">
              Get automated, real-time payouts for flight delays with blockchain-based insurance.
            </p>
            <div className="pt-4">
              <button 
                className="get-started-button cursor-pointer"
                onClick={() => {
                  if (!isConnected) {
                    Swal.fire({
                      title: 'Error!',
                      text: 'Please connect your wallet to proceed',
                      icon: 'error',
                      confirmButtonText: 'OK',
                      timer: 2000,
                      timerProgressBar: true
                    });
                  } else {
                    {/* Add your logic for handling the insurance claim here and navigate to the  */}
                 handleOpenModal();
                  }
                }}
              >
                {isConnected ? 'Claim Insurance' : 'Get Started'}
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column mx-10 hidden md:block ">
            <img 
              src={planeImage} 
              alt="Plane illustration" 
              className="plane-image"
              style={{ 
                width: '100%', 
                maxWidth: '500px',
                opacity: 0.8
              }}
            />
          </div>
          <div className="right-column hidden md:block">
            <img 
              src={prof} 
              alt="professionals" 
              className="plane-image"
              style={{ 
                width: '100%', 
                maxWidth: '500px',
              }}
            />
          </div>

          {/* Right Column */}
          <div className="flex items-center">
            <div className="card w-full max-w-lg mx-auto p-8">
              <div className="text-center mb-8">
                <h2 className="text-[32px] font-bold text-gray-900 mb-4">
                  Flight Delay Insurance
                </h2>
                <p className="text-gray-600">
                  Protect your journey with instant, automated insurance coverage for flight delays.
                </p>
              </div>
              <div className="inner-card p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Smart Contract Protection
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our blockchain-based smart contracts ensure immediate, transparent payouts when delays occur. No paperwork, no waiting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Modal */}
      {isModalOpen && (
        <CustomModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleInsuranceSubmit} loading={loading} />
      )}
    </div>
  );
}
