import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Clock,
  Loader,
  Target,
  TrendingUp,
  Play,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { btnStyle, cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/services/axiosInstance';
import { api } from '@/services/api';
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useWallet } from '@/context/WalletContext';
import { blockchainService } from '@/services/blockchainServices';
import { safeContractCall } from '@/utils/error';
import { usePortfolioMetrics, usePortfolio } from '@/hooks/usePortfolio';

interface PredictedMoveProps {
  prediction?: {
    source: string;
    destination: string;
    expectedGain: string;
    confidence: number;
    executionTime: string;
    keeperReward: string;
    amount: string;
  };
}

const strategy = [
  {
    type: 'Aave',
    percent: 0.07,
  },
  {
    type: 'Compound',
    percent: 0.06,
  },
  {
    type: 'Curve',
    percent: 0.08,
  },
  {
    type: 'Yearn',
    percent: 0.05,
  },
];

// Strategy names array for simulation
const strategyNames = ['Aave', 'Compound', 'Curve', 'Yearn'];

const PredictedMove = forwardRef<
  { refreshCurrentStrategy: () => void },
  PredictedMoveProps
>((props, ref) => {
  const { isConnected, provider, signer } = useWallet();
  const { totalDeposited, currentValue, netGain, estimatedAPY } =
    usePortfolioMetrics();
  const { refreshPortfolio } = usePortfolio();
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [canRebalance, setCanRebalance] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null
  );

  // Simulation state
  const [currentStrategy, setCurrentStrategy] = useState('Aave');
  const [predictedStrategy, setPredictedStrategy] = useState<string | null>(
    null
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLoadingStrategy, setIsLoadingStrategy] = useState(false);

  function simulateLoading(duration = 2000) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('✅ Loading complete!');
      }, duration);
    });
  }

  // Function to get current strategy from smart contract
  const getCurrentStrategyFromContract = async () => {
    if (!isConnected || !provider || !signer) {
      console.log('Wallet not connected, skipping strategy fetch');
      return;
    }

    setIsLoadingStrategy(true);
    try {
      const initialized = await blockchainService.init(provider, signer);
      if (!initialized) {
        throw new Error('Failed to initialize blockchain service');
      }

      // Get strategy allocations from contract
      const strategies = await blockchainService.getStrategies();
      console.log('Strategies from contract:', strategies);

      // Find the strategy with the highest allocation (current strategy)
      if (strategies && strategies.length > 0) {
        const currentStrategyFromContract = strategies.reduce(
          (max: any, strategy: any) =>
            strategy.allocation > max.allocation ? strategy : max
        );

        console.log(
          'Current strategy from contract:',
          currentStrategyFromContract
        );

        // Only update if we found a strategy with allocation > 0
        if (currentStrategyFromContract.allocation > 0) {
          setCurrentStrategy(currentStrategyFromContract.name);
          console.log(
            `Updated current strategy to: ${currentStrategyFromContract.name}`
          );
        } else {
          console.log('No active strategy found, keeping default Aave');
        }
      }
    } catch (error) {
      console.error('Error fetching current strategy from contract:', error);
      // Keep the default Aave strategy on error
    } finally {
      setIsLoadingStrategy(false);
    }
  };

  // Function to generate prediction
  const generatePrediction = () => {
    setIsSimulating(true);

    // Use API data if available, otherwise use intelligent selection
    let finalNextStrategy;

    if (data?.signal?.toStrategy) {
      // Use API prediction if available
      finalNextStrategy = data.signal.toStrategy;
    } else if (
      strategiesData?.strategies &&
      strategiesData.strategies.length > 0
    ) {
      // Use highest allocation strategy from API data
      finalNextStrategy = getHighestAllocationStrategy();
    } else {
      // Fallback to random selection (excluding current strategy)
      const availableStrategies = strategyNames.filter(
        s => s !== currentStrategy
      );
      const randomIndex = Math.floor(
        Math.random() * availableStrategies.length
      );
      finalNextStrategy = availableStrategies[randomIndex];
    }

    // Ensure next strategy is different from current
    if (finalNextStrategy === currentStrategy) {
      const availableStrategies = strategyNames.filter(
        s => s !== currentStrategy
      );
      const randomIndex = Math.floor(
        Math.random() * availableStrategies.length
      );
      finalNextStrategy = availableStrategies[randomIndex];
    }

    setPredictedStrategy(finalNextStrategy);
    setIsSimulating(false);

    console.log(
      `Prediction generated: ${currentStrategy} -> ${finalNextStrategy}`
    );
  };

  const { data, isLoading, isSuccess } = useQuery<any>({
    queryKey: ['rebalance'],
    queryFn: async () => {
      const response = await axiosInstance.get(api.REBALANCE);
      return response.data;
    },
  });

  // Fetch strategies data from API
  const {
    data: strategiesData,
    isLoading: strategiesLoading,
    error: strategiesError,
  } = useQuery<any>({
    queryKey: ['strategies'],
    queryFn: async () => {
      try {
        console.log('Fetching strategies data...');
        const response = await axiosInstance.get(
          'https://prexopt-ml-service-production.up.railway.app/strategies'
        );
        console.log('Strategies API response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching strategies:', error);
        throw error;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3,
  });

  useEffect(() => {
    if (isSuccess && !isLoading) console.log('Rebalance data:', data);
  }, []);

  // Load current strategy from contract on component mount and wallet connection
  useEffect(() => {
    if (isConnected && provider && signer) {
      getCurrentStrategyFromContract();
    }
  }, [isConnected, provider, signer]);

  // Refresh current strategy function (can be called manually)
  const refreshCurrentStrategy = async () => {
    try {
      console.log('🔄 Manually refreshing strategy data...');
      await getCurrentStrategyFromContract();
      await blockchainService.refreshStrategyData();
      console.log('✅ Strategy data refreshed successfully');
    } catch (error) {
      console.error('❌ Failed to refresh strategy data:', error);
    }
  };

  // Expose refreshCurrentStrategy to parent component
  useImperativeHandle(ref, () => ({
    refreshCurrentStrategy,
  }));

  useEffect(() => {
    if (strategiesData) {
      console.log('Strategies data updated:', strategiesData);
      console.log(
        'Highest allocation strategy should be:',
        getHighestAllocationStrategy()
      );
    }
  }, [strategiesData]);

  // Update current strategy to Aave when deposits are made
  useEffect(() => {
    // If user has funds and current strategy is not Aave, update to Aave
    // This ensures that after deposits (which always use Aave), the UI reflects the correct strategy
    if (parseFloat(totalDeposited) > 0 && currentStrategy !== 'Aave') {
      console.log('Updating current strategy to Aave due to deposit');
      // setCurrentStrategy('Aave');
      setPredictedStrategy(null); // Clear any existing prediction
    }
  }, [totalDeposited, currentStrategy]);

  // Check rebalance eligibility
  useEffect(() => {
    const checkRebalanceEligibility = async () => {
      if (!isConnected || !provider || !signer) {
        setCanRebalance(false);
        setValidationMessage('Connect your wallet to enable rebalancing');
        return;
      }

      try {
        const initialized = await blockchainService.init(provider, signer);
        if (!initialized) {
          setCanRebalance(false);
          setValidationMessage('Failed to initialize blockchain service');
          return;
        }

        const isDeployed = await blockchainService.isContractDeployed();
        if (!isDeployed) {
          setCanRebalance(false);
          setValidationMessage('Contract not accessible on current network');
          return;
        }

        const userData = await blockchainService.getUserData();
        const userShares = parseFloat(userData.shares);
        const userAssets = parseFloat(userData.assets);

        // Use API data for strategy allocations if available, otherwise fallback to blockchain
        let totalAllocation = 0;
        if (strategiesData?.strategies) {
          totalAllocation = strategiesData.strategies.reduce(
            (sum: number, strategy: any) => sum + strategy.allocation_usd,
            0
          );
        } else {
          const strategies = await blockchainService.getStrategies();
          totalAllocation = strategies.reduce(
            (sum: number, strategy: any) => sum + strategy.allocation,
            0
          );
        }

        if (userShares === 0 && userAssets === 0) {
          setCanRebalance(false);
          setValidationMessage(
            'No funds in vault. Deposit funds first to enable rebalancing.'
          );
          return;
        }

        if (totalAllocation === 0) {
          setCanRebalance(false);
          setValidationMessage(
            'Vault not properly initialized. Strategy allocations not found.'
          );
          return;
        }

        setCanRebalance(true);
        setValidationMessage(null);
      } catch (error) {
        console.error('Error checking rebalance eligibility:', error);
        setCanRebalance(false);
        setValidationMessage('Unable to verify rebalance eligibility');
      }
    };

    checkRebalanceEligibility();
  }, [
    isConnected,
    provider,
    signer,
    totalDeposited,
    currentValue,
    strategiesData,
  ]);

  // Calculate expected gain based on portfolio data and rebalance signal
  const calculateExpectedGain = () => {
    const totalDepositedAmount = parseFloat(totalDeposited);
    const currentValueAmount = parseFloat(currentValue);
    const currentAPY = parseFloat(estimatedAPY);

    // Use API data for rebalance signal or fallback to portfolio-based calculation
    const apiExpectedGain = data?.metrics?.estimated_profit || 0;
    const apiConfidence = data?.metrics?.confidence || 0;

    // Calculate expected gain based on current portfolio value and APY
    // Assuming a 2-5% improvement from rebalancing
    const rebalanceImprovement = 0.03; // 3% improvement
    const portfolioBasedGain = currentValueAmount * rebalanceImprovement;

    // Use API data if available and higher confidence, otherwise use portfolio-based calculation
    const expectedGain =
      apiConfidence > 0.7 ? apiExpectedGain : portfolioBasedGain;
    const confidence = apiConfidence > 0.7 ? apiConfidence * 100 : 75; // Default 75% confidence for portfolio-based

    return {
      expectedGain: expectedGain.toFixed(2),
      confidence: Math.round(confidence),
    };
  };

  const { expectedGain, confidence } = calculateExpectedGain();

  // Calculate rebalance amount based on total deposited
  const calculateRebalanceAmount = () => {
    const totalDepositedAmount = parseFloat(totalDeposited);

    // Use API signal amount if available, otherwise use a percentage of total deposited
    const apiAmount = data?.signal?.amount || 0;
    const portfolioAmount = totalDepositedAmount * 0.3; // 30% of total deposited

    return apiAmount > 0 ? apiAmount : portfolioAmount;
  };

  const rebalanceAmount = calculateRebalanceAmount();

  // Calculate keeper reward based on rebalance amount (0.1% of amount)
  const calculateKeeperReward = () => {
    const reward = rebalanceAmount * 0.001; // 0.1% of rebalance amount
    return reward.toFixed(2);
  };

  // Loop through strategiesData to find the strategy with highest allocation_usd
  const getHighestAllocationStrategy = () => {
    console.log('strategiesData:', strategiesData);

    if (strategiesData?.strategies && strategiesData.strategies.length > 0) {
      console.log('Available strategies:', strategiesData.strategies);

      let highestStrategy = strategiesData.strategies[0];
      console.log('Starting with:', highestStrategy);

      for (let i = 1; i < strategiesData.strategies.length; i++) {
        const currentStrategy = strategiesData.strategies[i];
        console.log(
          `Comparing ${currentStrategy.name} (${currentStrategy.allocation_usd}) vs ${highestStrategy.name} (${highestStrategy.allocation_usd})`
        );

        if (currentStrategy.allocation_usd > highestStrategy.allocation_usd) {
          highestStrategy = currentStrategy;
          console.log('New highest:', highestStrategy);
        }
      }

      console.log('Final highest strategy:', highestStrategy);
      return highestStrategy.name;
    }
    console.log('No strategies data available, using fallback');
    return 'Aave'; // fallback - deposits always use Aave strategy
  };

  const defaultPrediction = {
    source: data?.signal?.fromStrategy || currentStrategy,
    destination:
      data?.signal?.toStrategy ||
      predictedStrategy ||
      getHighestAllocationStrategy(),
    expectedGain: expectedGain,
    confidence: confidence,
    executionTime: '~3 hours',
    keeperReward: calculateKeeperReward(),
    amount: rebalanceAmount.toLocaleString(),
  };

  const pred = defaultPrediction;

  // Strategy mapping for blockchain calls
  const getStrategyIndex = (strategyName: string): number => {
    const strategyMap: { [key: string]: number } = {
      Aave: 0,
      Compound: 1,
      Curve: 2,
      Yearn: 3,
    };
    return strategyMap[strategyName] ?? 0;
  };

  const handleExecuteRebalance = async () => {
    if (!isConnected || !provider || !signer) {
      setError('Please connect your wallet first');
      return;
    }

    setIsExecuting(true);
    setError(null);
    setSuccess(null);

    try {
      const initialized = await blockchainService.init(provider, signer);
      if (!initialized) {
        throw new Error('Failed to initialize blockchain service');
      }

      // Check if contract is deployed and accessible
      const isDeployed = await blockchainService.isContractDeployed();
      if (!isDeployed) {
        throw new Error(
          'Contract not deployed or not accessible on current network'
        );
      }

      // Get current user data and vault stats for validation
      const [userData, vaultStats] = await Promise.all([
        blockchainService.getUserData(),
        blockchainService.getVaultStats(),
      ]);

      // Use API data for strategy allocations if available, otherwise fallback to blockchain
      let strategies,
        totalAllocation = 0;
      if (strategiesData?.strategies) {
        strategies = strategiesData.strategies;
        totalAllocation = strategies.reduce(
          (sum: number, strategy: any) => sum + strategy.allocation_usd,
          0
        );
      } else {
        strategies = await blockchainService.getStrategies();
        totalAllocation = strategies.reduce(
          (sum: number, strategy: any) => sum + strategy.allocation,
          0
        );
      }

      console.log('Pre-rebalance validation:', {
        userData,
        vaultStats,
        strategies,
        totalDeposited,
        currentValue,
        strategiesData,
      });

      // Check if user has any shares/assets
      const userShares = parseFloat(userData.shares);
      const userAssets = parseFloat(userData.assets);

      if (userShares === 0 && userAssets === 0) {
        throw new Error(
          'No funds in vault. Please deposit funds first before rebalancing.'
        );
      }

      // Check if strategies have allocations
      if (totalAllocation === 0) {
        throw new Error(
          'No strategy allocations found. Vault may not be properly initialized.'
        );
      }

      const fromStrategy = getStrategyIndex(currentStrategy);
      const toStrategy = getStrategyIndex(
        predictedStrategy || pred.destination
      );

      // Validate strategy indices
      if (fromStrategy === toStrategy) {
        throw new Error('Cannot rebalance to the same strategy');
      }

      console.log('Executing rebalance:', {
        from: currentStrategy,
        to: predictedStrategy || pred.destination,
        fromStrategy,
        toStrategy,
        amount: rebalanceAmount,
        expectedGain: pred.expectedGain,
        userShares,
        userAssets,
        totalAllocation,
        strategies: strategies.map((s: any) => ({
          name: s.name,
          allocation: s.allocation_usd || s.allocation,
        })),
      });

      await safeContractCall(async () => {
        await blockchainService.rebalance(fromStrategy, toStrategy);
      });

      const destinationStrategy = predictedStrategy || pred.destination;
      setSuccess(
        `Successfully rebalanced from ${currentStrategy} to ${destinationStrategy}!`
      );

      // Update current strategy to the destination strategy after successful execution
      setCurrentStrategy(destinationStrategy);
      setPredictedStrategy(null); // Clear the prediction

      // Refresh portfolio data to reflect the rebalance
      await refreshPortfolio();

      // Also refresh current strategy from contract to ensure accuracy
      await getCurrentStrategyFromContract();

      // Refetch strategies data from smart contract after successful rebalance
      try {
        console.log('🔄 Refreshing strategies data after rebalance...');
        await blockchainService.refreshStrategyData();
        console.log('✅ Strategy data refreshed successfully after rebalance');
      } catch (error) {
        console.error(
          '❌ Failed to refresh strategies data after rebalance:',
          error
        );
      }

      console.log(`Current strategy updated to: ${destinationStrategy}`);
    } catch (err: any) {
      console.error('Rebalance execution error:', err);

      // Provide more specific error messages
      let errorMessage = err.message || 'Failed to execute rebalance';

      if (err.message?.includes('No allocation to move')) {
        errorMessage =
          'No allocation to move. This could mean:\n• No funds are deposited in the vault\n• Strategy allocations are not set up\n• The vault needs to be initialized first';
      } else if (err.message?.includes('execution reverted')) {
        errorMessage = `Transaction failed: ${err.reason || err.message}`;
      }

      setError(errorMessage);
    } finally {
      setIsExecuting(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-600/10';
    if (confidence >= 60) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  const calculateExpectedGainVal =
    strategy && data?.signal?.toStrategy
      ? (strategy.find(
          s => s.type.toLowerCase() === data.signal.toStrategy.toLowerCase()
        )?.percent ?? 0) * Number(totalDeposited)
      : 0;

  return (
    <Card className="relative overflow-hidden bg-neutral-950">
      {(isLoading ||
        strategiesLoading ||
        isLoadingStrategy ||
        isSimulating) && (
        <div className="absolute top-0 left-0 z-20 flex h-full w-full flex-col items-center justify-center gap-4 bg-black/45 backdrop-blur-[1px]">
          <Loader size={24} className="animate-spin" />
          <span>
            {isSimulating
              ? 'Predicting...'
              : isLoadingStrategy
                ? 'Loading current strategy...'
                : isLoading
                  ? 'Loading rebalance data...'
                  : 'Loading strategies...'}
          </span>
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Target className="h-5 w-5" />
          Predicted Next Move
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-main/20 flex items-center justify-center gap-3 rounded-md p-4">
          <div className="text-center">
            <p className="text-body text-sm">From</p>
            <p className="font-medium text-white">{currentStrategy}</p>
          </div>
          <ArrowRight className="text-main h-5 w-5" />
          <div className="text-center">
            <p className="text-body text-sm">To</p>
            <p className="font-medium text-white">
              {predictedStrategy || 'Click Predict'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-md border p-3 text-center">
            <p className="text-body text-sm">Amount</p>
            <p className="font-semibold text-white">${totalDeposited}</p>
          </div>
          <div className="rounded-md border p-3 text-center">
            <p className="text-body text-sm">Expected Gain</p>
            <p className="font-semibold text-white">
              +${calculateExpectedGainVal.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-body text-sm">Confidence Score</span>
            <div className="flex items-center gap-2">
              <span
                className={`font-medium text-white ${getConfidenceColor(pred.confidence)}`}
              >
                {pred.confidence}%
              </span>
              <Badge
                className={cn(
                  `text-xs ${getConfidenceBg(pred.confidence)} ${getConfidenceColor(pred.confidence)}`
                )}
              >
                {pred.confidence >= 80
                  ? 'High'
                  : pred.confidence >= 60
                    ? 'Medium'
                    : 'Low'}
              </Badge>
            </div>
          </div>
          <Progress
            value={pred.confidence}
            className="bg-main/30 [&>div]:bg-main z-0 h-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="text-body h-4 w-4" />
            <div>
              <p className="text-body">Execution Time</p>
              <p className="font-medium text-white">{pred.executionTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="text-body h-4 w-4" />
            <div>
              <p className="text-body">Keeper Reward</p>
              <p className="font-medium text-white">+{pred.keeperReward} PZT</p>
            </div>
          </div>
        </div>

        <div className="text-body rounded-md bg-neutral-900/50 p-3 text-xs">
          <p>
            Our ML model analyzes yield differentials across DeFi protocols to
            predict optimal rebalancing opportunities. The destination strategy
            is automatically selected based on the highest current allocation.
            Keeper bots execute these moves automatically when conditions are
            met.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400">Portfolio Value:</span>
              <span className="ml-1 text-white">${currentValue}</span>
            </div>
            <div>
              <span className="text-gray-400">Total Deposited:</span>
              <span className="ml-1 text-white">${totalDeposited}</span>
            </div>
          </div>
          {/* {strategiesData?.strategies && (
            <div className="mt-2">
              <span className="text-gray-400">Current Allocations:</span>
              <div className="mt-1 grid grid-cols-2 gap-1 text-xs">
                {strategiesData.strategies.map((strategy: any) => (
                  <div key={strategy.name} className="flex justify-between">
                    <span className="text-gray-400">{strategy.name}:</span>
                    <span className="text-white">
                      ${strategy.allocation_usd}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {strategiesError && (
          <div className="flex items-center gap-2 rounded-lg bg-yellow-500/10 p-3 text-yellow-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">
              Failed to load strategy data: {strategiesError.message}
            </span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        {/* Predict and Execute Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={generatePrediction}
            disabled={isSimulating}
            className={cn(btnStyle, 'w-full')}
            variant="outline"
          >
            {isSimulating ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              <>
                <Target className="mr-2 h-4 w-4" />
                Predict
              </>
            )}
          </Button>

          <Button
            onClick={handleExecuteRebalance}
            disabled={
              isExecuting ||
              !canRebalance ||
              pred.confidence < 60 ||
              !predictedStrategy
            }
            className={cn(btnStyle, 'w-full')}
            variant="outline"
          >
            {isExecuting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Execute Rebalance
              </>
            )}
          </Button>
        </div>

        {/* Validation Messages */}
        {validationMessage && (
          <p className="text-muted-foreground text-center text-sm">
            {validationMessage}
          </p>
        )}

        {!isConnected && !validationMessage && (
          <p className="text-muted-foreground text-center text-sm">
            Connect your wallet to execute rebalancing
          </p>
        )}

        {pred.confidence < 60 && isConnected && canRebalance && (
          <p className="text-muted-foreground text-center text-sm">
            Confidence too low to execute (minimum 60% required)
          </p>
        )}

        {!predictedStrategy && isConnected && canRebalance && (
          <p className="text-muted-foreground text-center text-sm">
            Click &quot;Predict&quot; to generate next strategy prediction
          </p>
        )}
      </CardContent>
    </Card>
  );
});

PredictedMove.displayName = 'PredictedMove';

export default PredictedMove;
