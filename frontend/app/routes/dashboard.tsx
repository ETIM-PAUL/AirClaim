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
import { insuredFlightsAgencyAddress } from '~/utils';
import insuredFlightsAgencyAbi from 'insuredFlightsAgency.json';
import { toast } from 'react-toastify';
import { insureFlight } from 'scripts/insureFlight';

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
  const [flights, setFlights] = useState<Flight[]>([]);
  
  const navigate = useNavigate();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleDisconnect = () => {
    disconnect();
    navigate('/');
  };
  
  const handleInsureFlight = () => {
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
      const result = await insureFlight(newFlight.aircraftCode, newFlight.flightNumber, newFlight.flightPrice, newFlight.passengerWalletAddresses, walletProvider);
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
      setFlights(data);
    } catch (error) {
      console.error("Failed to fetch flights:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlights();
  }, []);

  return (
    <div className="min-h-screen bg-[#4C2AA0] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 bg-[#6B46C1] text-white rounded-lg hover:bg-[#553C9A] transition-colors"
          >
            Disconnect Wallet
          </button>
        </div>

        {/* Insure Flight Button */}
        <div className="flex justify-between w-full itemse-center my-8">
          <h2 className="text-2xl font-bold text-white">Insured Flights</h2>

          <button
            onClick={handleInsureFlight}
            className="px-6 py-3 cursor-pointer text-center bg-[#FFD700] text-[#4C2AA0] font-semibold rounded-lg hover:bg-[#FFC700] transition-colors"
          >
            Insure Flight
          </button>
        </div>

        {/* Insured Flights Section */}
        <div className="w-full mt-10">
          {loading ? (
            <ul>
              {[1, 2, 3].map((index) => (
                <li key={index} style={{ marginBottom: "1rem" }}>
                  <Skeleton height={20} width={200} />
                  <Skeleton height={15} width={100} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-wrap gap-6">
              {flights.length > 0 ? (
                flights.map((flight:any) => (
                  <div key={Number(flight.insuranceFlightId)} className="max-w-sm gap-6">
                  <div
                  key={Number(flight.insuranceFlightId)}
                  className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4"
                >
                  <div className="w-full text-center">
                    <div className="text-xl font-semibold text-[#4C2AA0]">
                      {flight.aircraftIcao}
                    </div>
                    <h3 className="text-lg text-gray-500 bg-white rounded-lg p-2">
                      Flight {flight.flightNumber} - <span className='text-white text-xs bg-gray-500 rounded-lg p-2'>{flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}</span>
                    </h3>
                  </div>
                  <button
                    onClick={() => handleViewMore(flight)}
                    className="px-4 cursor-pointer py-2 border-2 border-[#4C2AA0] text-[#4C2AA0] rounded-lg hover:bg-[#4C2AA0] hover:text-white transition-colors"
                  >
                    View More
                  </button>
                </div>
                </div>
              ))
              ) : (
                <div className="text-white w-full text-2xl font-bold text-center">
                  No flights found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
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
}

export default Dashboard;