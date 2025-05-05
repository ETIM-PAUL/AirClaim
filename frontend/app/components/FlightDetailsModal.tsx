import React, { useState } from 'react';
import image1 from '../assets/airplane-sky_1308-31202.png';
import barcode from '../assets/barcode.png';
import a_svg from '../assets/148768013_a4a0801a-2ba9-4571-a244-823120e79c2b.svg'
import airplaneSkySvg from '../assets/airplane-sky_1308-31202.png';
import { shortenAddress } from '~/utils';
import { toast } from 'react-toastify';
import { useAppKitProvider } from '@reown/appkit/react';
import { checkFlightDetails } from 'scripts/updateFlight';
import { ethers } from 'ethers';

interface FlightDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchMockFlights: () => void;
  flight: {
    aircraftCode: string;
    flightNumber: string;
    insurancePrice: number;
    passengerWalletAddresses: string[];
  };
}

const FlightDetailsModal: React.FC<FlightDetailsModalProps> = ({ isOpen, onClose, flight, fetchMockFlights }:any) => {
  if (!isOpen) return null;
  const [isLoading, setIsLoading] = useState(false);
  const { walletProvider } = useAppKitProvider("eip155");

  const flightDate = new Date(flight.flightDate).toLocaleDateString();

  const handleCheckFlightDelay = async () => {
    try {
      setIsLoading(true);
      const result = await checkFlightDetails(flight.flightNumber, flight.aircraftIcao, flight.flightId, walletProvider);
      toast.success(result as any);
      fetchMockFlights();
      onClose();
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error);
      console.log("error",error)
      setIsLoading(false);
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      />
      {/* Modal content */}
      <div 
        className="relative max-w-xl w-full mx-auto mb-4 min-h-39 p-4 rounded-xl shadow-2xl z-60 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${airplaneSkySvg})` }}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
      >

        {/* Boarding pass card */}
        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
          {/* Header */}
          <div className="bg-[#1a2d5a] text-white p-4 flex items-center justify-center">
            <h1 className="text-lg font-medium">Boarding Pass {flight.aircraftName && `- ${flight.aircraftName}`}</h1>
          </div>

          {/* Main content */}
          <div className="p-6 bg-white">
            {/* Flight info */}
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Flight date</span>
              <span>Airline ICAO</span>
            </div>
            <div className="flex justify-between text-sm font-medium mb-6">
              <span className='text-black'>{flightDate}</span>
              <span className='text-black'>{flight.aircraftIcao}</span>
            </div>

              <div className="flex flex-col items-center mx-2">
                <div className="text-sm font-bold text-black">{flight.status.toUpperCase()}</div>
                <div className="flex items-center">
                  <div className="h-[1px] w-12 bg-gray-300"></div>
                  <img
                    src={a_svg}  alt="Custom SVG"className="h-4 mt-2 text-blue-500 mx-1 transform rotate-90"/>
                  <div className="h-[1px] w-12 bg-gray-300"></div>
                </div>
              </div>

            {/* Airports */}
            <div className="w-full flex justify-between items-center mb-4">
              {/* Departure Airport */}
              <div className="flex-1 text-center">
                <div className="text-sm font-bold text-gray-500">{flight.departureAirport}</div>
              </div>
              
              {/* Airplane Image */}
              <div className="flex-1 flex justify-center">
                <img src={image1} alt="Freedom airline" className="w-24 h-auto" />
              </div>
              
              {/* Arrival Airport */}
              <div className="flex-1 text-center">
                <div className="text-sm font-bold text-gray-500">{flight.arrivalAirport}</div>
              </div>
            </div>


            {/* Flight details */}
            <div className='bg-[#1a2d5a]'>
              <div className='p-3 overflow-hidden'>
                <div className="overflow-auto scrollbar-hide">
                  <table className="w-full text-white text-xs">
                    <thead>
                      <tr className="bg-[#6B46C1]">
                        <th className="p-2">ICAO</th>
                        <th className="p-2">Flight Number</th>
                        <th className="p-2">Passengers</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Delayed</th>
                        <th className="p-2">Insurer</th>
                        <th className="p-2">Insurance Flight ID</th>
                        <th className="p-2">Ticket Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td className="p-2">{flight.aircraftIcao}</td>
                        <td className="p-2">{flight.flightNumber}</td>
                        <td className="p-2">{flight.passengers.length}</td>
                        <td className="p-2 capitalize">{flight.status}</td>
                        <td className="p-2">{Number(flight.flightDelayedTime)}</td>
                        <td className="p-2">{shortenAddress(flight.insurer)}</td>
                        <td className="p-2">{flight.insuranceFlightId}</td>
                        <td className="p-2">{ethers.formatEther(flight.flight_price)} ETH</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Barcode */}
            <div className="w-full  z-10">
              <img src={barcode} alt="Barcode" className="w-full h-16 bg-gray-200" />
            </div>

            {/* Todo: Add a button to check flight delay */}
            <div className="w-full flex justify-end gap-2 mt-4">
              <button disabled={isLoading} onClick={onClose} className="bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#6B46C1] text-[#6B46C1] px-4 py-2 rounded-md">Close</button>
              <button onClick={handleCheckFlightDelay} disabled={flight.status !== "scheduled" || isLoading} className="bg-[#6B46C1] hover:bg-[#4C2AA0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md">Check Flight Delay</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailsModal;