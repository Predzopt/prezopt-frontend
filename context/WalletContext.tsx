'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { ethers } from 'ethers';
import {
  SUPPORTED_CHAINS,
  DEFAULT_CHAIN,
  getChainConfig,
  getChainConfigByKey,
  type ChainConfig,
} from '../utils/CONSTANTS';

interface WalletContextType {
  isConnected: boolean;
  address: string | undefined;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  currentChain: ChainConfig | null;
  currentChainKey: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainKey: string) => Promise<void>;
  isOnSupportedChain: () => boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [currentChain, setCurrentChain] = useState<ChainConfig | null>(null);
  const [currentChainKey, setCurrentChainKey] = useState<string>(DEFAULT_CHAIN);
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

  // Detect current chain from provider
  const detectCurrentChain = async (provider: ethers.BrowserProvider) => {
    try {
      const network = await provider.getNetwork();
      const chainId = '0x' + network.chainId.toString(16);
      const chainConfig = getChainConfig(chainId);

      if (chainConfig) {
        // Find the chain key
        const chainKey =
          Object.keys(SUPPORTED_CHAINS).find(
            key => SUPPORTED_CHAINS[key].chainId === chainId
          ) || DEFAULT_CHAIN;

        setCurrentChain(chainConfig);
        setCurrentChainKey(chainKey);
        return chainKey;
      } else {
        console.warn('Unsupported chain detected:', chainId);
        const defaultChain = getChainConfigByKey(DEFAULT_CHAIN);
        setCurrentChain(defaultChain);
        setCurrentChainKey(DEFAULT_CHAIN);
        return DEFAULT_CHAIN;
      }
    } catch (error) {
      console.error('Error detecting current chain:', error);
      const defaultChain = getChainConfigByKey(DEFAULT_CHAIN);
      setCurrentChain(defaultChain);
      setCurrentChainKey(DEFAULT_CHAIN);
      return DEFAULT_CHAIN;
    }
  };

  // Switch to a specific chain
  const switchChain = async (chainKey: string) => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    const chainConfig = getChainConfigByKey(chainKey);
    if (!chainConfig) {
      throw new Error(`Unsupported chain: ${chainKey}`);
    }

    try {
      // Try to switch to the target network
      await window.ethereum!.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainConfig.chainId }],
      });

      // Update current chain
      setCurrentChain(chainConfig);
      setCurrentChainKey(chainKey);
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum!.request({
            method: 'wallet_addEthereumChain',
            params: [chainConfig],
          });

          // Update current chain
          setCurrentChain(chainConfig);
          setCurrentChainKey(chainKey);
        } catch (addError) {
          throw new Error(
            `Failed to add ${chainConfig.chainName} network to wallet`
          );
        }
      } else {
        throw new Error(`Failed to switch to ${chainConfig.chainName} network`);
      }
    }
  };

  // Check if on a supported chain
  const isOnSupportedChain = (): boolean => {
    return currentChain !== null;
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

      // Detect current chain
      await detectCurrentChain(newProvider);

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

            // Detect current chain
            await detectCurrentChain(newProvider);

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

    // Listen for chain changes
    const handleChainChanged = async (chainId: string) => {
      console.log('Chain changed to:', chainId);
      if (provider && isConnected) {
        await detectCurrentChain(provider);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum!.removeListener(
          'accountsChanged',
          handleAccountsChanged
        );
        window.ethereum!.removeListener('chainChanged', handleChainChanged);
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
        currentChain,
        currentChainKey,
        connect,
        disconnect,
        switchChain,
        isOnSupportedChain,
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
