export const insuredFlightsAgencyAddress = "0x3FF08b588187ed212E0dcBD3eF7DAc9786282a24";
  
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

    export const barData = [
        { name: "Jan", British: 200, Delta: 150, United: 120, Emirates: 90, Others: 50 },
        { name: "Feb", British: 250, Delta: 200, United: 160, Emirates: 120, Others: 80 },
        { name: "Mar", British: 300, Delta: 250, United: 200, Emirates: 180, Others: 100 },
        { name: "Apr", British: 320, Delta: 280, United: 230, Emirates: 200, Others: 130 },
        { name: "May", British: 360, Delta: 310, United: 260, Emirates: 230, Others: 150 },
        { name: "Jun", British: 400, Delta: 340, United: 300, Emirates: 260, Others: 180 },
      ];
    
      export const pieData = [
        { name: "Flight Cancellation", value: 400 },
        { name: "Baggage Loss", value: 300 },
        { name: "Flight Delay", value: 300 },
        { name: "Medical Emergency", value: 200 },
        { name: "Other", value: 100 },
      ];
    
      export const COLORS = ["#34D399", "#10B981", "#06B6D4", "#F59E0B", "#EF4444"];
    
      export const lineData = [
        { name: "Jan", insured: 200000, claimed: 40000 },
        { name: "Feb", insured: 300000, claimed: 50000 },
        { name: "Mar", insured: 400000, claimed: 60000 },
        { name: "Apr", insured: 500000, claimed: 70000 },
        { name: "May", insured: 600000, claimed: 80000 },
        { name: "Jun", insured: 700000, claimed: 85000 },
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