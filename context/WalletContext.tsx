'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  isConnected: boolean;
  address: string | undefined;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [userDisconnected, setUserDisconnected] = useState(false);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return (
      typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
    );
  };

  // Get MetaMask provider
  const getProvider = () => {
    if (!isMetaMaskInstalled()) return null;
    return new ethers.BrowserProvider(window.ethereum!);
  };

  // Connect wallet
  const connect = async () => {
    if (!isMetaMaskInstalled()) {
      throw new Error(
        'MetaMask is not installed. Please install MetaMask to continue.'
      );
    }

    try {
      // Request account access
      const accounts = await window.ethereum!.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const newProvider = getProvider();
      if (!newProvider) {
        throw new Error('Failed to get provider');
      }

      const newSigner = await newProvider.getSigner();
      const newAddress = await newSigner.getAddress();

      setProvider(newProvider);
      setSigner(newSigner);
      setAddress(newAddress);
      setIsConnected(true);
      setUserDisconnected(false);

      // Clear the disconnect flag from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('wallet-disconnected');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  // Disconnect wallet
  const disconnect = async () => {
    // Clear local state first
    setProvider(null);
    setSigner(null);
    setAddress(undefined);
    setIsConnected(false);
    setUserDisconnected(true);

    // Set a flag in localStorage to remember user disconnected
    if (typeof window !== 'undefined') {
      localStorage.setItem('wallet-disconnected', 'true');
    }

    // Disconnect from MetaMask
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Try to revoke permissions (newer MetaMask versions)
        if (window.ethereum.request) {
          await window.ethereum.request({
            method: 'wallet_revokePermissions',
            params: [{ eth_accounts: {} }],
          });
        }
      } catch (error) {
        // If revokePermissions fails, try alternative method
        try {
          // Request empty permissions to effectively disconnect
          await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }],
          });
        } catch (revokeError) {
          console.warn('Could not revoke MetaMask permissions:', revokeError);
          // Even if we can't revoke permissions, we've cleared our local state
        }
      }
    }
  };

  // Check connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return;

      // Check if user previously disconnected
      const wasDisconnected =
        typeof window !== 'undefined' &&
        localStorage.getItem('wallet-disconnected') === 'true';

      if (wasDisconnected) {
        setUserDisconnected(true);
        return; // Don't auto-connect if user previously disconnected
      }

      try {
        const accounts = await window.ethereum!.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          const newProvider = getProvider();
          if (newProvider) {
            const newSigner = await newProvider.getSigner();
            const newAddress = await newSigner.getAddress();

            setProvider(newProvider);
            setSigner(newSigner);
            setAddress(newAddress);
            setIsConnected(true);
            setUserDisconnected(false);
          }
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();

    // Listen for account changes
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        await disconnect();
      } else if (!userDisconnected) {
        // Only auto-connect if user hasn't explicitly disconnected
        checkConnection();
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum!.removeListener(
          'accountsChanged',
          handleAccountsChanged
        );
      };
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        provider,
        signer,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (
        event: string,
        callback: (...args: any[]) => void
      ) => void;
    };
  }
}
