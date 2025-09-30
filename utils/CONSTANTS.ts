// For development, use Next.js proxy to avoid CORS issues
// For production, use the direct API URL
export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? '/api'
    : process.env.NEXT_PUBLIC_BASE_URL || 'https://defibot-2.onrender.com';

// Multi-chain configuration
export interface ChainConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  simulatorAddress: string;
  isTestnet: boolean;
}

export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  // BlockDAG Network (existing)
  blockdag: {
    chainId: '0x413', // 1043 in hex
    chainName: 'BlockDAG',
    nativeCurrency: {
      name: 'BlockDAG',
      symbol: 'BDAG',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.primordial.bdagscan.com'],
    blockExplorerUrls: ['https://primordial.bdagscan.com'],
    simulatorAddress: '0x709900553fE09E934243282F764A806A50Acfc21',
    isTestnet: true,
  },

  // Base Sepolia Testnet
  'base-sepolia': {
    chainId: '0x14a34', // 84532 in hex
    chainName: 'Base Sepolia',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://sepolia.base.org'],
    blockExplorerUrls: ['https://sepolia.basescan.org'],
    simulatorAddress: '0xA16ea5653d1d68221e626d994372b1AD33E8135A', // Will be updated when deployed
    isTestnet: true,
  },

  // Ethereum Sepolia Testnet
  'ethereum-sepolia': {
    chainId: '0xaa36a7', // 11155111 in hex
    chainName: 'Sepolia',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    simulatorAddress: '0xA16ea5653d1d68221e626d994372b1AD33E8135A', // Will be updated when deployed
    isTestnet: true,
  },
};

// Default chain
export const DEFAULT_CHAIN = 'blockdag';

// Get chain config by chain ID
export const getChainConfig = (chainId: string): ChainConfig | null => {
  return (
    Object.values(SUPPORTED_CHAINS).find(chain => chain.chainId === chainId) ||
    null
  );
};

// Get chain config by key
export const getChainConfigByKey = (key: string): ChainConfig | null => {
  return SUPPORTED_CHAINS[key] || null;
};

// Get all supported chain IDs
export const getSupportedChainIds = (): string[] => {
  return Object.values(SUPPORTED_CHAINS).map(chain => chain.chainId);
};

// Get all supported chain keys
export const getSupportedChainKeys = (): string[] => {
  return Object.keys(SUPPORTED_CHAINS);
};
