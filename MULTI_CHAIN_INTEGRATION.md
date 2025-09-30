# Multi-Chain Integration Guide

This guide explains how to integrate and use the multi-chain system for your simulator contracts across different networks.

## Overview

The multi-chain system allows you to:

- Deploy simulator contracts on multiple networks (Base Sepolia, Ethereum Sepolia, BlockDAG)
- Switch between networks seamlessly
- Manage contract addresses dynamically
- Maintain a single codebase for all supported chains

## Supported Networks

| Network          | Chain ID            | Type    | Status      |
| ---------------- | ------------------- | ------- | ----------- |
| BlockDAG         | 0x413 (1043)        | Testnet | ✅ Deployed |
| Base Sepolia     | 0x14a34 (84532)     | Testnet | ⏳ Pending  |
| Ethereum Sepolia | 0xaa36a7 (11155111) | Testnet | ⏳ Pending  |

## Quick Start

### 1. Update Contract Addresses

When you deploy your simulator contracts to new networks, update the addresses directly in `utils/CONSTANTS.ts`:

```typescript
export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  // BlockDAG Network (existing)
  blockdag: {
    // ... existing config
    simulatorAddress: '0x709900553fE09E934243282F764A806A50Acfc21',
    isTestnet: true,
  },

  // Base Sepolia Testnet
  'base-sepolia': {
    // ... existing config
    simulatorAddress: '0xYourBaseSepoliaAddress', // Update this
    isTestnet: true,
  },

  // Ethereum Sepolia Testnet
  'ethereum-sepolia': {
    // ... existing config
    simulatorAddress: '0xYourEthereumSepoliaAddress', // Update this
    isTestnet: true,
  },
};
```

### 2. Use Chain Selector Component

Add the chain selector to your UI:

```tsx
import ChainSelector from '../components/ChainSelector';

function YourComponent() {
  return (
    <div>
      <ChainSelector />
      {/* Your other components */}
    </div>
  );
}
```

### 3. Initialize Blockchain Service

```typescript
import { blockchainService } from '../services/blockchainServices';
import { useWallet } from '../context/WalletContext';

function YourComponent() {
  const { provider, signer, currentChainKey } = useWallet();

  useEffect(() => {
    if (provider && signer) {
      blockchainService.init(provider, signer, currentChainKey);
    }
  }, [provider, signer, currentChainKey]);
}
```

## Components

### ChainSelector

A dropdown component that allows users to switch between supported networks.

**Props:**

- `className?: string` - Optional CSS classes

**Usage:**

```tsx
<ChainSelector className="w-64" />
```

## API Reference

### WalletContext

The wallet context now includes chain management:

```typescript
interface WalletContextType {
  // ... existing properties
  currentChain: ChainConfig | null;
  currentChainKey: string;
  switchChain: (chainKey: string) => Promise<void>;
  isOnSupportedChain: () => boolean;
}
```

### BlockchainService

Enhanced with multi-chain support:

```typescript
// Initialize with specific chain
await blockchainService.init(provider, signer, 'base-sepolia');

// Switch chains
await blockchainService.switchToChain('ethereum-sepolia');

// Check if on specific chain
const isOnBase = await blockchainService.isOnChain('base-sepolia');

// Get current chain info
const currentChain = blockchainService.getCurrentChain();
const currentChainKey = blockchainService.getCurrentChainKey();
```

### Contract Address Management

Contract addresses are managed directly in the `SUPPORTED_CHAINS` configuration in `utils/CONSTANTS.ts`. Simply update the `simulatorAddress` field for each chain when you deploy contracts.

```typescript
// In utils/CONSTANTS.ts
export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  'base-sepolia': {
    // ... other config
    simulatorAddress: '0xYourDeployedAddress', // Update this
  },
};
```

## Configuration

### Adding New Networks

To add a new network, update `utils/CONSTANTS.ts`:

```typescript
export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  // ... existing chains
  'your-new-chain': {
    chainId: '0x...', // Chain ID in hex
    chainName: 'Your Network',
    nativeCurrency: {
      name: 'Your Token',
      symbol: 'YTK',
      decimals: 18,
    },
    rpcUrls: ['https://your-rpc-url.com'],
    blockExplorerUrls: ['https://your-explorer.com'],
    simulatorAddress: '', // Will be set when deployed
    isTestnet: true,
  },
};
```

### Environment Variables

You can use environment variables for RPC URLs:

```typescript
// In your .env.local
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org
NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_KEY
```

## Deployment Workflow

1. **Deploy Contract**: Deploy your simulator contract to the target network
2. **Update Address**: Use the ContractAddressManager or update programmatically
3. **Test**: Verify the contract works on the new network
4. **Update Frontend**: The frontend will automatically use the new address

## Error Handling

The system handles various error scenarios:

- **Unsupported Network**: Shows warning and falls back to default
- **Contract Not Deployed**: Shows appropriate error message
- **Network Switch Failed**: Handles MetaMask errors gracefully
- **Invalid Address**: Validates contract address format

## Best Practices

1. **Always check deployment status** before allowing users to interact with contracts
2. **Provide clear feedback** when switching networks
3. **Handle loading states** during network switches
4. **Validate contract addresses** before updating
5. **Test on all supported networks** before deploying to production

## Troubleshooting

### Common Issues

1. **"Contract not deployed" error**
   - Check if contract address is set for the current chain
   - Verify the contract is actually deployed
   - Ensure the address is correct

2. **Network switch fails**
   - Check if the network is added to MetaMask
   - Verify the chain configuration is correct
   - Try adding the network manually first

3. **Contract calls fail**
   - Ensure you're on the correct network
   - Check if the contract ABI is correct
   - Verify the contract address is valid

### Debug Tools

Use the browser console to debug:

```typescript
// Check current chain
console.log(blockchainService.getCurrentChain());

// Check if contract is deployed
console.log(await blockchainService.isContractDeployed());

// Check current chain's contract address
console.log(blockchainService.getCurrentChain()?.simulatorAddress);
```

## Migration from Single Chain

If you're migrating from a single-chain setup:

1. **Update imports**: Change from hardcoded addresses to dynamic resolution
2. **Add chain detection**: Use the wallet context to detect current chain
3. **Update UI**: Add chain selector component
4. **Test thoroughly**: Ensure all functionality works across chains

## Support

For issues or questions:

1. Check the console for error messages
2. Verify your network configuration
3. Ensure contract addresses are properly set in `utils/CONSTANTS.ts`
4. Test chain switching with the ChainSelector component
