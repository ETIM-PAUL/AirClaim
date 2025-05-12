export const insuredFlightsAgencyAddress = "0x51bdDF6cF2a4D0273EA1caC7c70C8b5Ea7B064a6";
  
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