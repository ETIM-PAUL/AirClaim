import { ethers } from 'ethers';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { insuredFlightsAgencyAddress, timeAgo } from '~/utils';
import insuredFlightsAgencyAbi from 'insuredFlightsAgency.json';

interface GeneralContextType {
  isSidebarCollapsed: boolean;
  loadingFlights: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  allFlights: any;
  allClaims: any;
  allPassengers: any;
  fetchInsuredFlights: any;
  setAllFlights: (flights: []) => void;
}

const GeneralContext = createContext<GeneralContextType | undefined>(undefined);

export const GeneralProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [allFlights, setAllFlights] = useState([]) as any;
  const [allClaims, setAllClaims] = useState([]);
  const [allPassengers, setAllPassengers] = useState([]);
  const [loadingFlights, setLoadingFlights] = useState(false);


    // Setup provider and contract
    async function setupContract() {
        const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_COSTON2_RPC_URL);
        return new ethers.Contract(insuredFlightsAgencyAddress, insuredFlightsAgencyAbi.abi, provider);
      }
    
      // Fetch paginated flights
      async function fetchInsuredFlights() {
      try {
        setLoadingFlights(true);
        const contract:any = await setupContract();
        
        const count = await contract.getInsuredFlightsCount();
        const flightsArray:any = [];
        const flightPassengers = await contract.getFlightPassengers();
        setAllPassengers(flightPassengers)
        // 2. loop through all
        for (let i = 1; i <= Number(count); i++) {
          const flight = await contract.getInsureFlight(i);
          const flightPrice = await contract._insuredFlightPrice(i);
          flightsArray.push({
            id: i,
            aircraftIcao: flight[0],
            airline: flight[1],
            flightDate: flight[2],
            departureAirport: flight[3],
            arrivalAirport: flight[4],
            flightDelayedTime: flight[5].toString(),
            flightNumber: flight[6],
            passengers: flight[7].toString(),
            allPassengers: flightPassengers.filter((item:any) => Number(item[3]) === Number(i)),
            flightStatus: flight[8],
            lastChecked: timeAgo(flight[9].toString()),
            insurer: flight[10],
            insuredAmount: ethers.formatEther(flightPrice.toString()),
          });
        }
        setAllFlights(flightsArray)
        setLoadingFlights(false);
        return flightsArray
      } catch (error:any) {
        console.error("Error fetching paginated flights:", error);
        toast.error(error.reason || error.message)
        throw error;
      }
      }

      async function fetchInsuranceClaims(res:any) {
      const colors = ["bg-green-900 text-green-300","bg-cyan-900 text-cyan-300","bg-blue-900 text-blue-300","bg-yellow-900 text-yellow-300"]
      try {
        const contract:any = await setupContract();
        
        const count = await contract.getInsuranceClaimsCount();
        const flightClaims:any = [];
        if (count === 0) {
        setAllClaims([]);
        return;
        }
        // 2. loop through all
        for (let i = 0; i <= Number(count); i++) {
          const claim = await contract._insuranceClaims(i);
        console.log(claim)

          flightClaims.push({
            id: i,
            type: res?.find((item:any) => Number(item?.id) === Number(claim[3]))?.airline,
            routeA: res?.find((item:any) => Number(item?.id) === Number(claim[3]))?.departureAirport,
            routeB: res?.find((item:any) => Number(item?.id) === Number(claim[3]))?.arrivalAirport,
            flightNumber: res?.find((item:any) => Number(item?.id) === Number(claim[3]))?.flightNumber,
            avatar: res?.find((item:any) => Number(item?.id) === Number(claim[3]))?.aircraftIcao,
            amount: ethers.formatEther(claim[0]),
            time: timeAgo(claim[1]),
            color: colors[i],
            insuree: claim[2],
            insuranceId: claim[3],
            playedPrediction: claim[4],
            wonPrediction: claim[5],
          })
        }
        console.log("flightClaims",flightClaims)
        setAllClaims(flightClaims.slice(0, -1))
      } catch (error:any) {
        console.error("Error fetching paginated flights:", error);
        toast.error(error.reason || error.message)
        throw error;
      }
      }

      useEffect(() => {
        fetchInsuredFlights().then((res) => fetchInsuranceClaims(res));
      }, []);
    
  return (
    <GeneralContext.Provider value={{ isSidebarCollapsed, setIsSidebarCollapsed, allFlights, allPassengers, allClaims, setAllFlights, fetchInsuredFlights, loadingFlights }}>
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneral = () => {
  const context = useContext(GeneralContext);
  if (!context) {
    throw new Error('useGeneral must be used within a GeneralProvider');
  }
  return context;
};
