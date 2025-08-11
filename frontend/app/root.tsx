import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { WalletProvider } from "./context/WalletContext";

import type { Route } from "./+types/root";
import "./app.css";
import { createAppKit, useAppKitAccount } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { AppKitNetwork, mainnet } from "@reown/appkit/networks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GeneralProvider } from "./context/GeneralContext";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100..900;1,100..900&display=swap",
  },
];

// 1. Get projectId from https://cloud.reown.com
const projectId = "4940035ce4b4813061af223f7b3c77f4";

// 2. Create a metadata object - optional
const metadata = {
  name: "AirClaim",
  description: "AirClaim is a blockchain-based insurance platform that allows users to insure their flight delays.",
  url: "https://airclaim.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// 3. Set the networks
const customNetwork = {
  id: "0x72", // Replace with your chain ID
  name: "Coston2 Network", // Replace with your network name
  network: "coston2", // Replace with your network identifier
  nativeCurrency: {
    decimals: 18,
    name: "Coston2 Token", // Replace with your native token name
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

const networks: any = [customNetwork];

// 4. Create Ethers Adapter
const ethersAdapter = new EthersAdapter(

);

// 5. Create AppKit
createAppKit({
  adapters: [ethersAdapter],
  networks,
  projectId,
  metadata,
  allWallets: "HIDE",
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});



export function Layout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <GeneralProvider>
          <WalletProvider>
            {children}
            <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />
          </WalletProvider>
        </GeneralProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
