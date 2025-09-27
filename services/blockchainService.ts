// services/blockchainService.ts
import { ethers } from 'ethers';

// ABI remains unchanged
const SIMULATOR_ABI = [
  "function deposit(uint256 amount)",
  "function withdraw(uint256 shares)",
  "function rebalance(uint256 fromStrategy, uint256 toStrategy)",
  "function mint(address to, uint256 amount)",
  "function balanceOf(address account) view returns (uint256)",
  "function getUserBalance(address user) view returns (uint256 usdcBalance, uint256 shares, uint256 assets)",
  "function getVaultStats() view returns (uint256 totalAssets, uint256 totalSupply, uint256 sharePrice)",
  "function getStrategyAllocations() view returns (uint256[4] allocations, uint256[4] apys, string[4] names)",
  "function triggerYieldAccrual()",
  "event Deposit(address indexed user, uint256 amount, uint256 shares)",
  "event Withdraw(address indexed user, uint256 amount, uint256 shares)",
  "event Rebalanced(uint256 fromStrategy, uint256 toStrategy, uint256 amount)",
  "event YieldAccrued(uint256 strategy, uint256 amount)"
];

export const CONTRACTS = {
  SIMULATOR: "0x709900553fE09E934243282F764A806A50Acfc21",
} as const;

export const STRATEGIES = {
  AAVE: 0,
  COMPOUND: 1, 
  CURVE: 2,
  YEARN: 3
} as const;

// Extend Window interface to recognize ethereum as Eip1193Provider
declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider;
  }
}

class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  public simulator: ethers.Contract | null = null;

  async init() {
    if (typeof window === 'undefined' || !window.ethereum) {
      return false;
    }

    try {
      // Optional: Validate that it's a real EIP-1193 provider
      await window.ethereum.request({ method: 'eth_chainId' });
    } catch (error) {
      console.warn('Ethereum provider validation failed:', error);
      return false;
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    this.simulator = new ethers.Contract(CONTRACTS.SIMULATOR, SIMULATOR_ABI, this.signer);
    return true;
  }

  // Core Functions
  async deposit(amount: string) {
    if (!this.simulator) throw new Error('Simulator not initialized');
    const amountWei = ethers.parseUnits(amount, 6);
    const tx = await this.simulator.deposit(amountWei);
    return await tx.wait();
  }

  async withdraw(shares: string) {
    if (!this.simulator) throw new Error('Simulator not initialized');
    const sharesWei = ethers.parseUnits(shares, 6);
    const tx = await this.simulator.withdraw(sharesWei);
    return await tx.wait();
  }

  async rebalance(fromStrategy: number, toStrategy: number) {
    if (!this.simulator) throw new Error('Simulator not initialized');
    const tx = await this.simulator.rebalance(fromStrategy, toStrategy);
    return await tx.wait();
  }

  async mintUSDC(amount: string) {
    if (!this.simulator) throw new Error('Simulator not initialized');
    const address = await this.signer!.getAddress();
    const amountWei = ethers.parseUnits(amount, 6);
    const tx = await this.simulator.mint(address, amountWei);
    return await tx.wait();
  }

  async triggerYield() {
    if (!this.simulator) throw new Error('Simulator not initialized');
    const tx = await this.simulator.triggerYieldAccrual();
    return await tx.wait();
  }

  // Data Fetching
  async getUserData() {
    if (!this.simulator) throw new Error('Simulator not initialized');
    const address = await this.signer!.getAddress();
    const [usdcBalance, shares, assets] = await this.simulator.getUserBalance(address);
    
    return {
      usdcBalance: ethers.formatUnits(usdcBalance, 6),
      shares: ethers.formatUnits(shares, 6),
      assets: ethers.formatUnits(assets, 6)
    };
  }

  async getVaultStats() {
    if (!this.simulator) throw new Error('Simulator not initialized');
    const [totalAssets, totalSupply, sharePrice] = await this.simulator.getVaultStats();
    
    return {
      totalAssets: ethers.formatUnits(totalAssets, 6),
      totalSupply: ethers.formatUnits(totalSupply, 6),
      sharePrice: ethers.formatUnits(sharePrice, 18)
    };
  }

  async getStrategies() {
    if (!this.simulator) throw new Error('Simulator not initialized');
    const [allocations, apys, names] = await this.simulator.getStrategyAllocations();
    
    return allocations.map((allocation: bigint, i: number) => ({
      id: i,
      name: names[i],
      allocation: Number(allocation),
      apy: (Number(apys[i]) / 100).toFixed(2) + '%',
      apyValue: Number(apys[i])
    }));
  }

  // Utility Functions
  formatUSDC(amount: string): string {
    return parseFloat(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  }

  calculateAPY(principal: number, final: number, days: number): string {
    const apy = (Math.pow(final / principal, 365 / days) - 1) * 100;
    return apy.toFixed(2) + '%';
  }
}

export const blockchainService = new BlockchainService();