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
import heroBg from '../assets/plane.png';
import newsletterBg from '../assets/newsletter.png';
import footerImg from '../assets/footer.jpeg';
import footer3 from '../assets/footer3.jpg';
import footer4 from '../assets/casino.jpg';
import plane from '../assets/plane.png';
import predictionClaim from '../assets/prediction_claim.png';
import dashboard from '../assets/dashboard.png';
import image1 from '../assets/image1.png';
import barcode from '../assets/barcode.png';
import airplaneSky from '../assets/airplane-sky_1308-31202.png';
import adsilable from '../assets/places/adailabe.jpeg';
import ghana from '../assets/places/ghana.jpeg';
import addis from '../assets/places/addis-abbab.jpeg';
import malaga from '../assets/places/malaga.jpeg';
import algeiers from '../assets/places/algiers.jpeg';
import almabad from '../assets/places/almabad.jpeg';
import unknown from '../assets/places/unknown.jpeg';
import almaty from '../assets/places/almaty.jpeg';
import { IoIosAirplane } from "react-icons/io";
import { BsPersonSquare } from "react-icons/bs";
import { FaArrowDown, FaArrowRight } from "react-icons/fa";


const faqs = [
  {
    question: "How do I claim insurance?",
    answer:
      "Connect your wallet, enter your flight details, and submit a claim. If your flight is delayed, you'll receive an automatic payout.",
  },
  {
    question: "What blockchain do you use?",
    answer:
      "We use a secure, custom blockchain network to ensure fast and transparent transactions.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes, your data is encrypted and only used for processing your insurance claim.",
  },
];



export default function Home() {
  const { walletProvider } = useAppKitProvider("eip155");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
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
    const tx = await insuredFlightsAgencyContract.claimInsurance(formData.flightID, formData.flightNumber, formData.predictedNumber);
    await tx.wait();
    setIsModalOpen(false);
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

  
  const switchToCustomNetwork = async () => {
    let windowEthereum = window.ethereum as any;
    if (!windowEthereum) {
      console.error("MetaMask is not installed");
      return;
    }
    if(windowEthereum.chainId === "0x72"){
      console.log("window.ethereum",windowEthereum.chainId)
      return;
    }
  
    try {
      // Try to switch to the custom network
      await windowEthereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x72" }],
      });
    } catch (error: any) {
      // If the network is not added, add it
      if (error.code === 4902) {
        try {
          await windowEthereum.request({
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
  };

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };


  return (
    <div className="min-h-300px plane-background">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 border-b-red-500">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-12 font-lato ">
            <a href="/" className="text-blue-white/50 text-4xl transition-transform duration-200 font-bold">AirClaim</a>
            <a href="#features" className="text-white/90 hover:text-blue-500 hover:scale-105 transition-transform duration-200 text-x">Features</a>
            <a href="#how-it-works" className="text-white/90 hover:text-blue-500 hover:scale-105 transition-transform duration-200 text-x">How It Works</a>
            <a href="#about" className="text-white/90 hover:text-blue-500 hover:scale-105 transition-transform duration-200 text-x">About</a>
          </div>
          <div className="flex space-x-3">
            {isConnected ? (
              <div className="flex gap-4">
                <div>
                {window?.ethereum && window.ethereum?.chainId === "0x72" ? (
                    <button 
                    onClick={() => disconnect()} 
                    className="nav-button font-lato font-x primary-button hover:scale-105 transition-transform duration-200"
                  >
                    Disconnect Wallet
                  </button>
                  ) : (
                    <button 
                    onClick={() => switchToCustomNetwork()} 
                    className="nav-button bg-red-500 hover:scale-105 transition-transform duration-200"
                  >
                    Switch Network
                  </button>
                  )}
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
      {/* Hero Section with background image */}
      <div
  style={{
    backgroundImage: `url(${heroBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
  className="min-h-169" // ✅ Extend height here
>
  <main className="max-w-7xl mx-auto px-6 flex items-center font-lato">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-16">
      {/* Left Column */}
      <div className="space-y-6 pt-8 mt-30">
        <h1 className=" leading-[1.1] text-6xl font-bold text-[#F8F7FF]">
          Real-Time<br />
          Flight Delay<br />
          Insurance
        </h1>
        <p className="text-[#F8F7FF]/90 text-xl max-w-md">
          Get automated, real-time payouts for flight delays with blockchain-based insurance,
          and claim insurance in winning prizes.
        </p>
        <div className="pt-4">
          <button
            className="get-started-button cursor-pointer font-Roboto"
            onClick={() => {
              if (!isConnected) {
                Swal.fire({
                  title: 'Error!',
                  text: 'Please connect your wallet to proceed',
                  icon: 'error',
                  confirmButtonText: 'OK',
                  timer: 2000,
                  timerProgressBar: true,
                });
              } else {
                handleOpenModal();
              }
            }}
          >
            {isConnected ? 'Claim Insurance' : 'Get Started'}
          </button>
        </div>
      </div>

      {/* Right Column (Optional) */}
      {/* Uncomment and adjust image as needed */}
      {/* <div className="right-column mx-10 hidden md:block">
        <img
          src={planeImage}
          alt="Plane illustration"
          className="plane-image"
          style={{
            width: '100%',
            maxWidth: '500px',
            opacity: 0.6,
            height: 'auto', // or set specific height like '600px'
          }}
        />
      </div> */}
    </div>
  </main>
</div>


                        {/* Destination Grid Section Replica */}
<section className="w-full font-lato bg-[#f6f7fa] py-50 md:px-0 flex flex-col items-center">
  <div className="max-w-5xl w-full mx-auto">
    <h2 className="text-3xl font-semibold mb-2 text-6xl text-gray-800">Where to next?</h2>

    <div className="flex items-center gap-2 mb-8 text-gray-600">
      <span className="font-semibold underline decoration-dotted cursor-pointer"></span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* Card 1: Lagos – Accra */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg group flex flex-col justify-end min-h-[220px] bg-center bg-cover"
        style={{ backgroundImage: `url(${ghana})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0"></div>
        <div className="relative z-10 p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2 text-lg font-semibold">
              <IoIosAirplane className="text-xl" />
              Lagos – Accra
            </span>
            <div className="flex items-center gap-1 text-sm">
              <BsPersonSquare className="text-base" />
              <span>5</span>
            </div>
          </div>
          <div className="text-xs text-white/90">
            <span>08 Oct 2025 – 21 Oct 2025</span>
          </div>
        </div>
      </div>

      {/* Card 2: Addis Ababa */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg group flex flex-col justify-end min-h-[220px] bg-center bg-cover"
        style={{ backgroundImage: `url(${addis})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0"></div>
        <div className="relative z-10 p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2 text-lg font-semibold">
              <IoIosAirplane className="text-xl" />
              Addis Ababa
            </span>
            <div className="flex items-center gap-1 text-sm">
              <BsPersonSquare className="text-base" />
              <span>5</span>
            </div>
          </div>
          <div className="text-xs text-white/90">
            <span>08 Oct 2025 – 14 Oct 2025</span>
          </div>
        </div>
      </div>

      {/* Card 3: Adelaide */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg group flex flex-col justify-end min-h-[220px] bg-center bg-cover"
        style={{ backgroundImage: `url(${adsilable})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0"></div>
        <div className="relative z-10 p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2 text-lg font-semibold">
              <IoIosAirplane className="text-xl" />
              Adelaide
            </span>
            <div className="flex items-center gap-1 text-sm">
              <BsPersonSquare className="text-base" />
              <span>5</span>
            </div>
          </div>
          <div className="text-xs text-white/90">
            <span>12 Nov 2025 – 17 Nov 2025</span>
          </div>
        </div>
      </div>

      {/* Card 4: Malaga */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg group flex flex-col justify-end min-h-[220px] bg-center bg-cover"
        style={{ backgroundImage: `url(${malaga})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0"></div>
        <div className="relative z-10 p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2 text-lg font-semibold">
              <IoIosAirplane className="text-xl" />
              Malaga
            </span>
            <div className="flex items-center gap-1 text-sm">
              <BsPersonSquare className="text-base" />
              <span>5</span>
            </div>
          </div>
          <div className="text-xs text-white/90">
            <span>06 Nov 2025 – 28 Nov 2025</span>
          </div>
        </div>
      </div>

      {/* Card 5: Auckland */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg group flex flex-col justify-end min-h-[220px] bg-center bg-cover"
        style={{ backgroundImage: `url(${unknown})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0"></div>
        <div className="relative z-10 p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2 text-lg font-semibold">
              <IoIosAirplane className="text-xl" />
              Auckland
            </span>
            <div className="flex items-center gap-1 text-sm">
              <BsPersonSquare className="text-base" />
              <span>5</span>
            </div>
          </div>
          <div className="text-xs text-white/90">
            <span>31 Oct 2025 – 05 Nov 2025</span>
          </div>
        </div>
      </div>

      {/* Card 6: Almaty */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg group flex flex-col justify-end min-h-[220px] bg-center bg-cover"
        style={{ backgroundImage: `url(${almaty})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0"></div>
        <div className="relative z-10 p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2 text-lg font-semibold">
              <IoIosAirplane className="text-xl" />
              Almaty
            </span>
            <div className="flex items-center gap-1 text-sm">
              <BsPersonSquare className="text-base" />
              <span>5</span>
            </div>
          </div>
          <div className="text-xs text-white/90">
            <span>08 Nov 2025 – 24 Oct 2025</span>
          </div>
        </div>
      </div>

      {/* Card 7: Algiers */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg group flex flex-col justify-end min-h-[220px] bg-center bg-cover"
        style={{ backgroundImage: `url(${algeiers})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0"></div>
        <div className="relative z-10 p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2 text-lg font-semibold">
              <IoIosAirplane className="text-xl" />
              Algiers
            </span>
            <div className="flex items-center gap-1 text-sm">
              <BsPersonSquare className="text-base" />
              <span>5</span>
            </div>
          </div>
          <div className="text-xs text-white/90">
            <span>15 Oct 2025 – 05 Nov 2025</span>
          </div>
        </div>
      </div>

      {/* Card 8: Ahmedabad */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg group flex flex-col justify-end min-h-[220px] bg-center bg-cover"
        style={{ backgroundImage: `url(${almabad})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0"></div>
        <div className="relative z-10 p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2 text-lg font-semibold">
              <IoIosAirplane className="text-xl" />
              Ahmedabad
            </span>
            <div className="flex items-center gap-1 text-sm">
              <BsPersonSquare className="text-base" />
              <span>5</span>
            </div>
          </div>
          <div className="text-xs text-white/90">
            <span>10 Sep 2025 – 10 Oct 2025</span>
          </div>
        </div>
      </div>
    </div>

    <div className="flex justify-center mt-10">
      <button className="rounded-full border border-[#8a1852] text-gray-800 px-8 py-3 font-semibold hover:bg-[#8a1852] hover:text-white transition">
        View
      </button>
    </div>
  </div>
</section>

      
      {/* Features/Services Section */}
      <section id="features" font-lato className="py-16 px-6 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800  text-6xl ">Features </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-20 rounded-lg shadow p-6 text-center">
              <h3 className="font-semibold text-xl mb-2 text-gray-800 ">Instant Payouts</h3>
              <p className="text-gray-600">Receive automatic compensation directly to your wallet when your flight is delayed—no paperwork required.</p>
            </div>
            <div className="bg-white p-20 rounded-lg shadow p-6 text-center">
              <h3 className="font-semibold text-xl mb-2 text-gray-800 ">Blockchain Security</h3>
              <p className="text-gray-600">Smart contracts ensure transparent, tamper-proof insurance processing and payouts.</p>
            </div>
            <div className="bg-white p-20 rounded-lg shadow p-6 text-center">
              <h3 className="font-semibold text-xl mb-2 text-gray-800 ">Easy Claims</h3>
              <p className="text-gray-600">Claim your insurance in just a few clicks—no lengthy forms or waiting periods.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Flexbox of footer images */}
      <section>
        <div className="flex bg-gray-50 p-30 flex-row  items-center gap-3 justify-center">
          <img src={footer4} alt="Footer Decorative 2" className="h-90 w-90 object-cover rounded-lg shadow-md" />
          <img src={footer3} alt="Footer Decorative 2" className="h-90 object-cover rounded-lg shadow-md" />
          <img src={footerImg} alt="Footer Decorative 1" className="h-90 w-90 object-contain rounded-lg shadow-md" />
        </div>
      </section>
      

      <section id="faq" className="text-gray-800 py-20 px-4 sm:px-6 bg-blue-50">
      <div className="max-w-7.8xl mx-auto">
        <h2 className="text-6xl  font-bold-lato text-center mb-10 text-gray-800">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow transition duration-200"
            >
              {/* FAQ Header */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left p-5 focus:outline-none"
              >
                <span className="font-semibold font-Roboto-500 text-lg text-black-600">
                  {faq.question}
                </span>
                <span
                  className={`text-blue-600 text-xl transform transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <FaArrowRight />
                </span>
              </button>

              {/* Animated Answer */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out px-5 ${
                  openIndex === index ? "max-h-[500px] pb-5" : "max-h-0"
                }`}
              >
                <p className="text-gray-700 font-lato-200">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  
      

     {/* <section className="w-full flex justify-center items-center py-12 bg-[#f6f7fa]">
        <div className="relative flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full">
          <div className="hidden md:block md:w-1/2 relative">
            <img src={newsletterBg} alt="Newsletter" className="object-cover h-full w-full" />
            <div className="absolute inset-0 bg-black/30"></div>
          </div> */}
          {/* Right form
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-black/80 text-white">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Never miss an offer</h2>
            <p className="mb-6 text-base md:text-lg">Subscribe and be the first to receive our exclusive offers.</p>
            <form className="flex flex-col md:flex-row gap-3 mb-3">
              <input type="email" placeholder="Email address" className="rounded px-4 py-3 text-white-900 w-full md:w-1/2 focus:outline-none" required />
            </form>
            <div className="flex items-start mb-4">
              <input type="checkbox" id="offers" className="mt-1" />
              <label htmlFor="offers" className="ml-2 text-xs md:text-sm">I would like to get offers and news from AirClaim. I have read and understood the <a href="#" className="underline">privacy notice</a>.</label>
            </div>
            <button className="rounded border border-white px-8 py-2 text-white hover:bg-white hover:text-black transition font-semibold w-fit">Subscribe</button>
          </div>
        </div> */}
      {/* </section> */}
      
   
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8 px-4 md:px-8 mt-10 rounded-t-3xl shadow-lg">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-gray-800">
       
        
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-10 pt-8 border-t border-gray-200 gap-6">
          <div className="flex items-center space-x-4 mb-2 md:mb-0">
            {/* Placeholder for certification or logo */}
            <span className="font-bold text-lg text-blue-900 tracking-wide">THEQA</span>
            <span className="text-xs text-gray-500">CERTIFIED</span>
          </div>
          <div className="flex space-x-4 text-gray-600 text-xl">
            {/* SVG Social icons */}
            <a href="#" aria-label="Facebook" className="hover:text-blue-600 transition-colors">
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.406.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
            </a>
            <a href="#" aria-label="X" className="hover:text-blue-600 transition-colors">
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M17.53 2.47a6.5 6.5 0 0 1 4.6 4.6C23 8.7 23 12 23 12s0 3.3-.87 4.93a6.5 6.5 0 0 1-4.6 4.6C15.3 23 12 23 12 23s-3.3 0-4.93-.87a6.5 6.5 0 0 1-4.6-4.6C1 15.3 1 12 1 12s0-3.3.87-4.93a6.5 6.5 0 0 1 4.6-4.6C8.7 1 12 1 12 1s3.3 0 4.93.87zm-2.1 3.1l-2.1 3.6-2.1-3.6H7.1l3.1 5.2-3.1 5.2h2.1l2.1-3.6 2.1 3.6h2.1l-3.1-5.2 3.1-5.2h-2.1z"/></svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-blue-600 transition-colors">
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-blue-600 transition-colors">
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.602.388 3.635 1.355 2.668 2.322 2.41 3.495 2.352 4.772.013 8.332 0 8.741 0 12c0 3.259.013 3.668.072 4.948.058 1.277.316 2.45 1.283 3.417.967.967 2.14 1.225 3.417 1.283C8.332 23.987 8.741 24 12 24c3.259 0 3.668-.013 4.948-.072 1.277-.058 2.45-.316 3.417-1.283.967-.967 1.225-2.14 1.283-3.417.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.058-1.277-.316-2.45-1.283-3.417-.967-.967-2.14-1.225-3.417-1.283C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-blue-600 transition-colors">
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.545 3.5 12 3.5 12 3.5s-7.545 0-9.386.574a2.994 2.994 0 0 0-2.112 2.112C0 8.027 0 12 0 12s0 3.973.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.455 20.5 12 20.5 12 20.5s7.545 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 15.973 24 12 24 12s0-3.973-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center text-xs text-gray-500 mt-6">
          &copy; {new Date().getFullYear()} AirClaim. All rights reserved.
        </div>
      </footer>
      {/* Modal */}
      {isModalOpen && (
        <CustomModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleInsuranceSubmit} loading={loading} />
      )}
      
    </div>
  );
}

