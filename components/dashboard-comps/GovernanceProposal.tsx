import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, CheckCircle, X } from "lucide-react";

interface Proposal {
  id: string;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  quorum: number;
  timeRemaining: string;
  status: "active" | "passed" | "failed" | "executed";
  proposer: string;
}

interface GovernanceProposalProps {
  proposal: Proposal;
  userVotingPower?: string;
  hasVoted?: boolean;
}

export default function GovernanceProposal({ 
  proposal, 
  userVotingPower = "1,234", 
  hasVoted = false 
}: GovernanceProposalProps) {
  const [selectedVote, setSelectedVote] = useState<"for" | "against" | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (vote: "for" | "against") => {
    setIsVoting(true);
    setSelectedVote(vote);
    
    // Simulate voting
    setTimeout(() => {
      setIsVoting(false);
      console.log("Voted", vote, "on proposal", proposal.id);
    }, 2000);
  };

  const getStatusBadge = (status: Proposal["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-primary/10 text-primary">Active</Badge>;
      case "passed":
        return <Badge className="bg-success/10 text-success">Passed</Badge>;
      case "failed":
        return <Badge className="bg-destructive/10 text-destructive">Failed</Badge>;
      case "executed":
        return <Badge className="bg-muted text-muted-foreground">Executed</Badge>;
      default:
        return null;
    }
  };

  const forPercentage = (proposal.votesFor / proposal.totalVotes) * 100;
  const againstPercentage = (proposal.votesAgainst / proposal.totalVotes) * 100;
  const quorumPercentage = (proposal.totalVotes / proposal.quorum) * 100;

  return (
    <Card className="hover-elevate" data-testid={`proposal-${proposal.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg mb-2">{proposal.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Proposed by {proposal.proposer}
            </p>
          </div>
          {getStatusBadge(proposal.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{proposal.description}</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">For</span>
            <span className="font-mono">{proposal.votesFor.toLocaleString()} votes ({forPercentage.toFixed(1)}%)</span>
          </div>
          <Progress value={forPercentage} className="h-2" />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Against</span>
            <span className="font-mono">{proposal.votesAgainst.toLocaleString()} votes ({againstPercentage.toFixed(1)}%)</span>
          </div>
          <Progress value={againstPercentage} className="h-2" />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Quorum ({proposal.quorum.toLocaleString()} needed)</span>
            <span className="font-mono">{quorumPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={Math.min(quorumPercentage, 100)} className="h-2" />
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{proposal.timeRemaining}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{proposal.totalVotes.toLocaleString()} voters</span>
          </div>
        </div>
        
        {proposal.status === "active" && !hasVoted && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote("for")}
              disabled={isVoting}
              className="flex-1 text-success border-success/20 hover:bg-success/10"
              data-testid={`button-vote-for-${proposal.id}`}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isVoting && selectedVote === "for" ? "Voting..." : "Vote For"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote("against")}
              disabled={isVoting}
              className="flex-1 text-destructive border-destructive/20 hover:bg-destructive/10"
              data-testid={`button-vote-against-${proposal.id}`}
            >
              <X className="w-4 h-4 mr-2" />
              {isVoting && selectedVote === "against" ? "Voting..." : "Vote Against"}
            </Button>
          </div>
        )}
        
        {hasVoted && (
          <div className="flex items-center gap-2 text-sm text-success bg-success/10 p-2 rounded-md">
            <CheckCircle className="w-4 h-4" />
            <span>You have voted on this proposal</span>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground pt-2 border-t">
          Your voting power: {userVotingPower} PZT
        </div>
      </CardContent>
    </Card>
  );
}