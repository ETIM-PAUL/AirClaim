import React, { createContext, useContext, useState } from 'react';

interface WalletContextType {
  isWalletConnected: boolean;
  walletAddress: string;
  setIsWalletConnected: (connected: boolean) => void;
  setWalletAddress: (address: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  return (
    <WalletContext.Provider value={{ isWalletConnected, walletAddress, setIsWalletConnected, setWalletAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
