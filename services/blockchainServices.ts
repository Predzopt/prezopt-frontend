// services/blockchainService.ts
import { ethers } from 'ethers';

// BlockDAG Network Configuration
const BLOCKDAG_NETWORK = {
  chainId: '0x413', // 1043 in hex
  chainName: 'BlockDAG',
  nativeCurrency: {
    name: 'BlockDAG',
    symbol: 'BDAG',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.primordial.bdagscan.com'],
  blockExplorerUrls: ['https://primordial.bdagscan.com'],
};

// ABI remains unchanged
const SIMULATOR_ABI = [
  'function deposit(uint256 amount)',
  'function withdraw(uint256 shares)',
  'function rebalance(uint256 fromStrategy, uint256 toStrategy)',
  'function mint(address to, uint256 amount)',
  'function balanceOf(address account) view returns (uint256)',
  'function getUserBalance(address user) view returns (uint256 usdcBalance, uint256 shares, uint256 assets)',
  'function getVaultStats() view returns (uint256 totalAssets, uint256 totalSupply, uint256 sharePrice)',
  'function getStrategyAllocations() view returns (uint256[4] allocations, uint256[4] apys, string[4] names)',
  'function triggerYieldAccrual()',
  'event Deposit(address indexed user, uint256 amount, uint256 shares)',
  'event Withdraw(address indexed user, uint256 amount, uint256 shares)',
  'event Rebalanced(uint256 fromStrategy, uint256 toStrategy, uint256 amount)',
  'event YieldAccrued(uint256 strategy, uint256 amount)',
];

export const CONTRACTS = {
  SIMULATOR: '0x709900553fE09E934243282F764A806A50Acfc21',
} as const;

export const STRATEGIES = {
  AAVE: 0,
  COMPOUND: 1,
  CURVE: 2,
  YEARN: 3,
} as const;

// Type assertion for window.ethereum to avoid type conflicts
const getEthereumProvider = (): ethers.Eip1193Provider | undefined => {
  return (window as any).ethereum as ethers.Eip1193Provider | undefined;
};

class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  public simulator: ethers.Contract | null = null;

  // Initialize with provider and signer from wallet context
  async init(provider?: ethers.BrowserProvider, signer?: ethers.Signer) {
    if (provider && signer) {
      this.provider = provider;
      this.signer = signer;
      this.simulator = new ethers.Contract(
        CONTRACTS.SIMULATOR,
        SIMULATOR_ABI,
        signer
      );
      return true;
    }

    // Fallback to direct MetaMask connection
    const ethereum = getEthereumProvider();
    if (typeof window === 'undefined' || !ethereum) {
      return false;
    }

    try {
      // Check if on BlockDAG network
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      if (chainId !== BLOCKDAG_NETWORK.chainId) {
        console.warn('Not on BlockDAG network. Current chainId:', chainId);
        // Don't throw error, just warn - let user handle network switching
      }

      this.provider = new ethers.BrowserProvider(ethereum);
      this.signer = await this.provider.getSigner();
      this.simulator = new ethers.Contract(
        CONTRACTS.SIMULATOR,
        SIMULATOR_ABI,
        this.signer
      );
      return true;
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      return false;
    }
  }

  // Switch to BlockDAG network
  async switchToBlockDAG() {
    const ethereum = getEthereumProvider();
    if (!ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      // Try to switch to BlockDAG network
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BLOCKDAG_NETWORK.chainId }],
      });
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BLOCKDAG_NETWORK],
          });
        } catch (addError) {
          throw new Error('Failed to add BlockDAG network to wallet');
        }
      } else {
        throw new Error('Failed to switch to BlockDAG network');
      }
    }
  }

  // Check if on BlockDAG network
  async isOnBlockDAG(): Promise<boolean> {
    const ethereum = getEthereumProvider();
    if (!ethereum) return false;

    try {
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log(
        'Current chainId:',
        chainId,
        'Expected:',
        BLOCKDAG_NETWORK.chainId
      );
      return chainId === BLOCKDAG_NETWORK.chainId;
    } catch (error) {
      console.error('Error checking chainId:', error);
      return false;
    }
  }

  // Check if contract is deployed on current network
  async isContractDeployed(): Promise<boolean> {
    if (!this.simulator) return false;

    try {
      // Try to call a view function to check if contract exists
      await this.simulator.getVaultStats();
      return true;
    } catch (error) {
      console.error('Contract not deployed or not accessible:', error);
      return false;
    }
  }

  // Core Functions
  async deposit(amount: string) {
    if (!this.simulator) throw new Error('Simulator not initialized');
    const address = await this.signer!.getAddress();
    const amountWei = ethers.parseUnits(amount, 6);
    const tx = await this.simulator.deposit(amountWei);
    const receipt = await tx.wait();

    // Track the deposit
    this.trackDeposit(address, parseFloat(amount));

    return receipt;
  }

  async withdraw(shares: string) {
    if (!this.simulator) throw new Error('Simulator not initialized');
    const address = await this.signer!.getAddress();
    const sharesWei = ethers.parseUnits(shares, 6);
    const tx = await this.simulator.withdraw(sharesWei);
    const receipt = await tx.wait();

    // Calculate the USD value of withdrawn shares
    const vaultStats = await this.getVaultStats();
    const sharePrice = parseFloat(vaultStats.sharePrice);
    const withdrawnAmount = parseFloat(shares) * sharePrice;

    // Track the withdrawal
    this.trackWithdrawal(address, withdrawnAmount);

    return receipt;
  }

  async rebalance(fromStrategy: number, toStrategy: number) {
    if (!this.simulator) throw new Error('Simulator not initialized');
    const tx = await this.simulator.rebalance(fromStrategy, toStrategy);
    return await tx.wait();
  }

  async mintUSDC(amount: string) {
    if (!this.simulator) throw new Error('Simulator not initialized');
    if (!this.signer) throw new Error('Signer not available');

    const address = await this.signer.getAddress();
    const amountWei = ethers.parseUnits(amount, 6);

    console.log('Minting USDC:', {
      address,
      amount,
      amountWei: amountWei.toString(),
      contractAddress: CONTRACTS.SIMULATOR,
    });

    try {
      const tx = await this.simulator.mint(address, amountWei);
      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      return receipt;
    } catch (error) {
      console.error('Mint USDC error:', error);
      throw error;
    }
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
    const [usdcBalance, shares, assets] =
      await this.simulator.getUserBalance(address);

    return {
      usdcBalance: ethers.formatUnits(usdcBalance, 6),
      shares: ethers.formatUnits(shares, 6),
      assets: ethers.formatUnits(assets, 6),
    };
  }

  // Portfolio Data Functions
  async getPortfolioData() {
    if (!this.simulator) throw new Error('Simulator not initialized');
    const address = await this.signer!.getAddress();

    try {
      // Get user data and vault stats
      const [userData, vaultStats, strategies] = await Promise.all([
        this.getUserData(),
        this.getVaultStats(),
        this.getStrategies(),
      ]);

      // Calculate current value (assets in USDC)
      const currentValue = parseFloat(userData.assets);

      // Get tracked deposit/withdrawal history from localStorage
      const totalDeposited = this.getTotalDeposited(address);
      const totalWithdrawn = this.getTotalWithdrawn(address);

      // Calculate net deposited (deposits - withdrawals)
      const netDeposited = totalDeposited - totalWithdrawn;

      // Calculate net gain (current value - net deposited)
      const netGain = currentValue - netDeposited;
      const netGainPercent =
        netDeposited > 0 ? (netGain / netDeposited) * 100 : 0;

      // Calculate weighted average APY from strategies
      const totalAllocation = strategies.reduce(
        (sum: number, strategy: any) => sum + strategy.allocation,
        0
      );
      const weightedAPY =
        totalAllocation > 0
          ? strategies.reduce(
              (sum: number, strategy: any) =>
                sum + strategy.apyValue * strategy.allocation,
              0
            ) / totalAllocation
          : 0;

      return {
        totalDeposited: netDeposited.toFixed(2),
        currentValue: currentValue.toFixed(2),
        netGain: netGain.toFixed(2),
        netGainPercent: netGainPercent.toFixed(2),
        estimatedAPY: weightedAPY.toFixed(2),
        shares: userData.shares,
        sharePrice: vaultStats.sharePrice,
        totalAssets: vaultStats.totalAssets,
        totalSupply: vaultStats.totalSupply,
        strategies: strategies,
        // Additional tracking data
        grossDeposited: totalDeposited.toFixed(2),
        grossWithdrawn: totalWithdrawn.toFixed(2),
      };
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      throw error;
    }
  }

  // Track deposit amount in localStorage
  trackDeposit(address: string, amount: number) {
    const key = `deposits_${address}`;
    const deposits = this.getDepositHistory(address);
    deposits.push({
      amount,
      timestamp: Date.now(),
      type: 'deposit',
    });
    localStorage.setItem(key, JSON.stringify(deposits));
  }

  // Track withdrawal amount in localStorage
  trackWithdrawal(address: string, amount: number) {
    const key = `deposits_${address}`;
    const deposits = this.getDepositHistory(address);
    deposits.push({
      amount,
      timestamp: Date.now(),
      type: 'withdrawal',
    });
    localStorage.setItem(key, JSON.stringify(deposits));
  }

  // Get deposit/withdrawal history from localStorage
  private getDepositHistory(address: string) {
    const key = `deposits_${address}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  // Calculate total deposited amount
  private getTotalDeposited(address: string): number {
    const history = this.getDepositHistory(address);
    return history
      .filter((entry: any) => entry.type === 'deposit')
      .reduce((sum: number, entry: any) => sum + entry.amount, 0);
  }

  // Calculate total withdrawn amount
  private getTotalWithdrawn(address: string): number {
    const history = this.getDepositHistory(address);
    return history
      .filter((entry: any) => entry.type === 'withdrawal')
      .reduce((sum: number, entry: any) => sum + entry.amount, 0);
  }

  // Get user's deposit history (if available)
  async getUserDepositHistory() {
    if (!this.simulator) throw new Error('Simulator not initialized');
    const address = await this.signer!.getAddress();

    try {
      // This would require events to be indexed
      // For now, return empty array as we don't have event filtering set up
      return [];
    } catch (error) {
      console.error('Error fetching deposit history:', error);
      return [];
    }
  }

  // Initialize tracking for existing users (one-time setup)
  async initializeTracking() {
    if (!this.simulator) throw new Error('Simulator not initialized');
    const address = await this.signer!.getAddress();

    // Check if user already has tracking data
    const existingHistory = this.getDepositHistory(address);
    if (existingHistory.length > 0) {
      return; // Already initialized
    }

    try {
      // Get current user data
      const userData = await this.getUserData();
      const vaultStats = await this.getVaultStats();

      const currentShares = parseFloat(userData.shares);
      const sharePrice = parseFloat(vaultStats.sharePrice);

      // If user has shares but no tracking data, estimate initial deposit
      if (currentShares > 0) {
        const estimatedInitialDeposit = currentShares * sharePrice;
        this.trackDeposit(address, estimatedInitialDeposit);
        console.log(
          'Initialized tracking with estimated deposit:',
          estimatedInitialDeposit
        );
      }
    } catch (error) {
      console.error('Error initializing tracking:', error);
    }
  }

  // Reset tracking data (for debugging/testing)
  resetTracking(address: string) {
    const key = `deposits_${address}`;
    localStorage.removeItem(key);
    console.log('Tracking data reset for address:', address);
  }

  // Get tracking summary for debugging
  getTrackingSummary(address: string) {
    const history = this.getDepositHistory(address);
    const totalDeposited = this.getTotalDeposited(address);
    const totalWithdrawn = this.getTotalWithdrawn(address);

    return {
      totalEntries: history.length,
      totalDeposited,
      totalWithdrawn,
      netDeposited: totalDeposited - totalWithdrawn,
      history: history.slice(-10), // Last 10 entries
    };
  }

  async getVaultStats() {
    if (!this.simulator) throw new Error('Simulator not initialized');
    const [totalAssets, totalSupply, sharePrice] =
      await this.simulator.getVaultStats();

    return {
      totalAssets: ethers.formatUnits(totalAssets, 6),
      totalSupply: ethers.formatUnits(totalSupply, 6),
      sharePrice: ethers.formatUnits(sharePrice, 18),
    };
  }

  async getStrategies() {
    if (!this.simulator) throw new Error('Simulator not initialized');
    const [allocations, apys, names] =
      await this.simulator.getStrategyAllocations();

    return allocations.map((allocation: bigint, i: number) => ({
      id: i,
      name: names[i],
      allocation: Number(allocation),
      apy: (Number(apys[i]) / 100).toFixed(2) + '%',
      apyValue: Number(apys[i]),
    }));
  }

  // Utility Functions
  formatUSDC(amount: string): string {
    return parseFloat(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  }

  calculateAPY(principal: number, final: number, days: number): string {
    const apy = (Math.pow(final / principal, 365 / days) - 1) * 100;
    return apy.toFixed(2) + '%';
  }
}

export const blockchainService = new BlockchainService();
