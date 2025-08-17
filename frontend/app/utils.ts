import { format, formatRelative, isToday } from 'date-fns';
import { enUS } from 'date-fns/locale';
export const insuredFlightsAgencyAddress = "0x4De616A56362f3C5a043345fa3dEe0384D8b35B8";
  
  export const shortenAddress = (address: string): string => {
      if (!address || address.length < 10) return address; // Handle invalid or short addresses
      return `${address.slice(0, 5)}.....${address.slice(-5)}`;
    };
    
    const chainIdNumber = 114;
    
    export const customNetwork = {
        id: `0x${chainIdNumber.toString(16)}`, // Replace with your chain ID
        name: "Flare Coston2 Network", // Replace with your network name
        network: "coston2", // Replace with your network identifier
        nativeCurrency: {
            decimals: 18,
            name: "Flare Coston2 Token", // Replace with your native token name
            symbol: "C2FLR", // Replace with your native token symbol
        },
        rpcUrls: {
            default: {
                http: ["https://coston2-api.flare.network/ext/C/rpc"], // Replace with your RPC URL
            },
        },
        blockExplorers: {
            default: {
                name: "Coston2 Explorer", // Replace with your block explorer name
                url: "https://coston2-explorer.flare.network", // Replace with your block explorer URL
            },
        },
    };

    export function transformFlightData(flights:any) {
      const groupedByMonth:any = {};
      
      flights.forEach((flight:any) => {
        const date = new Date(flight.flightDate);
        const monthYear = date.toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        });
        
        if (!groupedByMonth[monthYear]) {
          groupedByMonth[monthYear] = {};
        }
        
        const airline = flight.airline;
        if (!groupedByMonth[monthYear][airline]) {
          groupedByMonth[monthYear][airline] = 0;
        }
        
        // Count number of insured flights
        groupedByMonth[monthYear][airline] += 1;
      });
      
      return Object.keys(groupedByMonth).map(month => {
        const monthData:any = { name: month };
        
        Object.keys(groupedByMonth[month]).forEach(airline => {
          monthData[airline] = groupedByMonth[month][airline];
        });
        
        return monthData;
      });
    }

    export const transformToAirlineTotals = (flights:any) => {
      const airlineTotals:any = {};
      
      flights.forEach((flight:any) => {
        const airline = flight.airline;
        if (!airlineTotals[airline]) {
          airlineTotals[airline] = 0;
        }
        
        // Sum insured amounts for each airline
        airlineTotals[airline] += parseFloat(flight.insuredAmount);
      });
      
      // Convert to desired format: [{ name: "Airline", value: total }]
      return Object.keys(airlineTotals).map(airline => ({
        name: airline,
        value: Math.round(airlineTotals[airline] * 100) / 100 // Round to 2 decimal places
      }));
    };

    export const transformToMonthlyTotalsETH = (flights:any) => {
      const monthlyTotals:any = {};
      
      flights.forEach((flight:any) => {
        const date = new Date(flight.flightDate);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        if (!monthlyTotals[monthName]) {
          monthlyTotals[monthName] = {
            insured: 0,
            passengers: 0
          };
        }
        
        // Keep actual ETH values
        const insuredAmount = parseFloat(flight.insuredAmount);
        const passengerCount = parseInt(flight.passengers);
        
        monthlyTotals[monthName].insured += insuredAmount;
        monthlyTotals[monthName].passengers += passengerCount;
      });
      
      return Object.keys(monthlyTotals).map(month => ({
        name: month,
        insured: Math.round(monthlyTotals[month].insured * 100) / 100, // Round to 2 decimal places
        passengers: monthlyTotals[month].passengers
      }));
    };
    
    
    export const COLORS = ["#34D399", "#EF4444", "#10B981", "#06B6D4", "#F59E0B", "#EF4444"];
    
    export const lineData = [
        { name: "Jan", insured: 200000, passengers: 40000 },
      ];
    
      export const flights = [
        { id: "BA-2937", route: "London → Paris", airline: "British Airways", date: "Jun 15, 2023", passengers: 2, amount: "420FLR", status: "Claimed" },
        { id: "DL-1854", route: "New York → Miami", airline: "Delta Airlines", date: "Jun 14, 2023", passengers: 1, amount: "750FLR", status: "Claimed" },
        { id: "UA-482", route: "Chicago → Dallas", airline: "United Airlines", date: "Jun 14, 2023", passengers: 3, amount: "280FLR", status: "Claimed" },
        { id: "SQ-321", route: "Singapore → Tokyo", airline: "Singapore Airlines", date: "Jun 13, 2023", passengers: 2, amount: "1200FLR", status: "Claimed" },
        { id: "EK-203", route: "Dubai → New York", airline: "Emirates", date: "Jun 12, 2023", passengers: 4, amount: "1800FLR", status: "Active" },
      ] ;
    
      export const claimAvatars = [
        "https://randomuser.me/api/portraits/men/32.jpg",
        "https://randomuser.me/api/portraits/women/44.jpg",
        "https://randomuser.me/api/portraits/men/45.jpg",
        "https://randomuser.me/api/portraits/women/46.jpg",
      ];

export const formatLocalized = (date: Date, locale = enUS) => {
  if (isToday(date)) {
    // Get the localized "Today"
    const relative = formatRelative(date, new Date(), { locale });
    const todayWord = relative.split(' ')[0]; // usually "today"
    return `${todayWord.charAt(0).toUpperCase() + todayWord.slice(1)}, ${format(date, 'HH:mm', { locale })}`;
  }
  // fallback for non-today dates
  return format(date, 'PP, HH:mm', { locale });
}

export function timeAgo(timestamp:string) {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - Number(timestamp) * 1000) / 1000);
  
  if (diffInSeconds < 0) {
    // Future timestamp
    const future = Math.abs(diffInSeconds);
    if (future < 60) return `in ${future} seconds`;
    if (future < 3600) return `in ${Math.floor(future / 60)} minutes`;
    if (future < 86400) return `in ${Math.floor(future / 3600)} hours`;
    return `in ${Math.floor(future / 86400)} days`;
  }
  
  // Past timestamp
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
}