import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, RefreshCw, TrendingUp } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "deposit" | "withdraw" | "rebalance" | "reward";
  amount: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  txHash?: string;
  details?: string;
  profit?: string;
  pztReward?: string;
}

interface ActivityHistoryProps {
  activities?: ActivityItem[];
  showPZTRewards?: boolean;
}

export default function ActivityHistory({ activities, showPZTRewards = true }: ActivityHistoryProps) {
  // todo: remove mock functionality
  const defaultActivities: ActivityItem[] = [
    {
      id: "1",
      type: "rebalance",
      amount: "15,000 USDC",
      timestamp: "2 hours ago",
      status: "completed",
      details: "Aave → Compound",
      profit: "+156.78",
      pztReward: "0.45"
    },
    {
      id: "2",
      type: "deposit",
      amount: "5,000 USDC",
      timestamp: "1 day ago",
      status: "completed",
      pztReward: "3.00"
    },
    {
      id: "3",
      type: "rebalance",
      amount: "22,500 USDC",
      timestamp: "3 days ago",
      status: "completed",
      details: "Curve → Aave",
      profit: "+284.32",
      pztReward: "0.68"
    },
    {
      id: "4",
      type: "withdraw",
      amount: "2,000 USDC",
      timestamp: "1 week ago",
      status: "completed",
      pztReward: "1.20"
    },
    {
      id: "5",
      type: "deposit",
      amount: "10,000 USDC",
      timestamp: "2 weeks ago",
      status: "completed",
      pztReward: "6.00"
    }
  ];

  const activitiesToShow = activities || defaultActivities;

  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="w-4 h-4 text-success" />;
      case "withdraw":
        return <ArrowUpRight className="w-4 h-4 text-warning" />;
      case "rebalance":
        return <RefreshCw className="w-4 h-4 text-primary" />;
      case "reward":
        return <TrendingUp className="w-4 h-4 text-success" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: ActivityItem["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary" className="text-xs bg-success/10 text-success">Completed</Badge>;
      case "pending":
        return <Badge variant="secondary" className="text-xs bg-warning/10 text-warning">Pending</Badge>;
      case "failed":
        return <Badge variant="secondary" className="text-xs bg-destructive/10 text-destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card >
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activitiesToShow.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 rounded-md hover-elevate border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-md">
                  {getIcon(activity.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize" >
                      {activity.type}
                    </span>
                    {getStatusBadge(activity.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span  >{activity.amount}</span>
                    {activity.details && (
                      <span className="ml-2">• {activity.details}</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground"  >
                    {activity.timestamp}
                  </div>
                </div>
              </div>
              
              <div className="text-right text-sm">
                {activity.profit && (
                  <div className="text-success font-mono">
                    +${activity.profit}
                  </div>
                )}
                {showPZTRewards && activity.pztReward && (
                  <div className="text-muted-foreground">
                    +{activity.pztReward} PZT
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}