# TanStack Query Setup for Prezopt Dashboard

## ÌæØ Overview
Complete TanStack Query (React Query) integration with custom hooks for all API endpoints in the Prezopt dashboard.

## Ì≥Å Files Created

### 1. QueryProvider (`context/QueryProvider.tsx`)
- Wraps the app with TanStack Query client
- Includes React Query DevTools for development
- Configured with sensible defaults for caching and retries

### 2. API Hooks (`hooks/useApi.ts`)
Individual hooks for each API endpoint:
- `usePools()` - Get all pools
- `usePoolsSummary()` - Get pools summary statistics
- `usePredictions()` - Get market predictions
- `useActivity()` - Get user activity history
- `useSystemHealth()` - Get system health status (auto-refreshes every 30s)
- `useDashboardData()` - Combined hook for dashboard overview

### 3. Updated Layout (`app/layout.tsx`)
- Added QueryProvider wrapper around the entire app

### 4. Example Components (`components/examples/ApiUsageExample.tsx`)
- `PoolsList` - Shows individual hook usage with loading/error states
- `DashboardOverview` - Shows combined hook usage
- `SystemStatus` - Shows auto-refreshing data

## Ì∫Ä Usage Examples

### Basic Individual Hook Usage
```tsx
import { usePools } from '@/hooks/useApi';

function PoolsList() {
  const { data: pools, isLoading, error, refetch } = usePools();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {pools?.map(pool => (
        <div key={pool.id}>
          <h3>{pool.name}</h3>
          <p>APY: {pool.apy}%</p>
        </div>
      ))}
    </div>
  );
}
```

### Dashboard Data Usage
```tsx
import { useDashboardData } from '@/hooks/useApi';

function Dashboard() {
  const { 
    pools, 
    poolsSummary, 
    predictions, 
    activity, 
    systemHealth, 
    isLoading, 
    isError 
  } = useDashboardData();

  if (isLoading) return <div>Loading dashboard...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div>
      <h2>Total Pools: {poolsSummary.data?.totalPools}</h2>
      <p>System Status: {systemHealth.data?.status}</p>
    </div>
  );
}
```

## ‚öôÔ∏è Configuration

### QueryClient Defaults
- **staleTime**: 5 minutes - Data stays fresh for 5 minutes
- **gcTime**: 10 minutes - Data is garbage collected after 10 minutes
- **retry**: 3 attempts - Retry failed requests 3 times
- **refetchOnWindowFocus**: false - Don't refetch when window regains focus

### Special Configurations
- **System Health**: Auto-refreshes every 30 seconds
- **All other queries**: Use default configuration

## Ì¥ß API Endpoints Covered

1. **GET /pools** - List all pools
2. **GET /pools/summary** - Pools summary statistics  
3. **GET /predictions** - Market predictions
4. **GET /activity** - User activity history
5. **GET /system/health** - System health status

## Ìª†Ô∏è Development Tools

### React Query DevTools
- Available in development mode
- Shows query status, cache, and network requests
- Located in bottom-left corner of the screen
- Click the React Query icon to open

### TypeScript Support
- Fully typed API responses
- Type-safe hooks and data access
- IntelliSense support for all data properties

## Ì≥¶ Dependencies

Already installed:
- `@tanstack/react-query` - Core React Query library
- `@tanstack/react-query-devtools` - Development tools

## Ìæ® Features

### Caching
- Intelligent caching with 5-minute stale time
- Background refetching for fresh data
- Automatic garbage collection

### Error Handling
- Built-in retry logic (3 attempts)
- Error states in all hooks
- Easy error recovery with refetch functions

### Loading States
- Loading indicators for all queries
- Combined loading states for dashboard data
- Skeleton loading patterns

### Auto-refresh
- System health updates every 30 seconds
- Configurable refresh intervals per hook
- Background updates without user interaction

## Ì∫Ä Next Steps

1. **Replace Mock Data**: Update your components to use the new hooks instead of mock data
2. **Add Mutations**: Create mutation hooks for POST/PUT/DELETE operations
3. **Customize Queries**: Adjust query options per component as needed
4. **Add Optimistic Updates**: Implement optimistic updates for better UX
5. **Add Infinite Queries**: For paginated data like activity history

## Ì≥ù Example Integration

To integrate into your existing dashboard:

```tsx
// In your dashboard component
import { useDashboardData } from '@/hooks/useApi';

export default function Dashboard() {
  const { poolsSummary, systemHealth, isLoading } = useDashboardData();
  
  // Use real data instead of mock data
  const portfolioData = {
    totalDeposited: poolsSummary.data?.totalValue?.toString() || '0',
    estimatedAPY: poolsSummary.data?.averageApy?.toString() || '0',
    // ... other fields
  };

  return (
    <div>
      {/* Your existing JSX with real data */}
    </div>
  );
}
```

## Ì¥ç Debugging

1. Open React Query DevTools
2. Check query status and cache
3. Monitor network requests
4. Inspect error states
5. Test refetch functionality

The setup is complete and ready to use! Ìæâ
