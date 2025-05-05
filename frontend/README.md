# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.


  // <div class="text-left">
        //   <label class="block text-sm font-medium text-gray-700 mb-1">Wallet Addresses</label>
        //   <input 
        //     id="walletAddresses" 
        //     class="swal2-input w-full mb-2" 
        //     placeholder="Wallet addresses (e.g 0x123..., 0x334...)"
        //     required
        //   >
        // </div>


// <div class="text-left">
        //   <label class="block text-sm font-medium text-gray-700 mb-1">Wallet Addresses</label>
        //   <div id="walletAddressesContainer">
        //     <input class="swal2-input w-full mb-2 wallet-address" placeholder="Wallet address" required>
        //   </div>
        </div>







        import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import planeImage from '../assets/image1.png';
import prof from '../assets/prof.png';
import Swal from 'sweetalert2';
import { showFlightModal, type FlightFormData } from '../components/FlightModal';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Flight Delay Insurance" },
    { name: "description", content: "Real-time flight delay insurance with blockchain-based payouts" },
  ];
}

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const navigate = useNavigate();

  const handleInsuranceSubmit = (formData: FlightFormData) => {
    console.log('Insurance Form Data:', formData);
    // Add your blockchain transaction logic here
  };

  const handleWalletConnection = () => {
    // Add your wallet connection logic here
    setIsWalletConnected(true);
  };

  return (
    <div className="min-h-screen hero-gradient plane-background">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-12">
            <a href="#features" className="text-white/90 hover:text-blue-500 hover:scale-105 transition-transform duration-200 text-sm">Features</a>
            <a href="#how-it-works" className="text-white/90 hover:text-blue-500 hover:scale-105 transition-transform duration-200 text-sm">How It Works</a>
            <a href="#about" className="text-white/90 hover:text-blue-500 hover:scale-105 transition-transform duration-200 text-sm">About</a>
          </div>
          <div className="flex space-x-3">
            {isWalletConnected ? (
               <div className="flex gap-4"> {/* Add gap between buttons */}
               <>
                 <button 
                   onClick={() => navigate('/')} 
                   className="nav-button primary-button hover:scale-105 transition-transform duration-200"
                 >
                   Disconnect Wallet
                 </button>
               </>
               <>
                 <button 
                   className="nav-button primary-button hover:scale-105 transition-transform duration-200" 
                   onClick={handleWalletConnection}
                 >
                   Dashboard
                 </button>
               </>
             </div>
            ) : (

              <button className="nav-button primary-button hover:scale-105 transition-transform duration-200" onClick={handleWalletConnection}>
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
                className="get-started-button"
                onClick={() => {
                  if (!isWalletConnected) {
                    Swal.fire({
                      title: 'Error!',
                      text: 'Please connect your wallet to proceed',
                      icon: 'error',
                      confirmButtonText: 'OK',
                      timer: 2000,
                      timerProgressBar: true
                    });
                  } else {
                    showFlightModal({
                      isWalletConnected,
                      walletAddress,
                      onSubmit: handleInsuranceSubmit,
                      onSuccess: () => navigate('/check')
                    });
                  }
                }}
              >
                {isWalletConnected ? 'Claim Insurance' : 'Get Started'}
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
    </div>
  );
}



airplaneName, aircraftCode, flightNumber, flightDate, insurancePrice, passengerWalletAddresses    
