import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface AllocationData {
  name: string;
  value: number;
  apy: number;
  color: string;
  [key: string]: any;
}

interface AllocationChartProps {
  data?: AllocationData[];
  totalValue?: string;
}

export default function AllocationChart({ data, totalValue = "$45,678" }: AllocationChartProps) {
  // todo: remove mock functionality
  const defaultData: AllocationData[] = [
    { name: "Aave USDC", value: 45, apy: 8.2, color: "#2563eb" },
    { name: "Compound USDC", value: 30, apy: 7.8, color: "#16a34a" },
    { name: "Curve 3Pool", value: 20, apy: 9.1, color: "#ca8a04" },
    { name: "Yearn USDC", value: 5, apy: 6.5, color: "#9333ea" }
  ];

  const chartData = data || defaultData;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-md p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value}% allocation • {data.apy}% APY
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card data-testid="allocation-chart">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Portfolio Allocation</span>
          <span className="text-lg font-mono" data-testid="text-total-value">{totalValue}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: item.color }}
              />
              <div className="text-sm">
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground">{item.value}% • {item.apy}% APY</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}