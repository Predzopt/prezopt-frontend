import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, CheckCircle, X } from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  quorum: number;
  timeRemaining: string;
  status: 'active' | 'passed' | 'failed' | 'executed';
  proposer: string;
}

interface GovernanceProposalProps {
  proposal: Proposal;
  userVotingPower?: string;
  hasVoted?: boolean;
}

export default function GovernanceProposal({
  proposal,
  userVotingPower = '1,234',
  hasVoted = false,
}: GovernanceProposalProps) {
  const [selectedVote, setSelectedVote] = useState<'for' | 'against' | null>(
    null
  );
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (vote: 'for' | 'against') => {
    setIsVoting(true);
    setSelectedVote(vote);

    // Simulate voting
    setTimeout(() => {
      setIsVoting(false);
      console.log('Voted', vote, 'on proposal', proposal.id);
    }, 2000);
  };

  const getStatusBadge = (status: Proposal['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-main/20 text-white">Active</Badge>;
      case 'passed':
        return <Badge className="bg-green-600/10 text-green-600">Passed</Badge>;
      case 'failed':
        return (
          <Badge className="bg-destructive/10 text-destructive">Failed</Badge>
        );
      case 'executed':
        return <Badge className="bg-muted text-body">Executed</Badge>;
      default:
        return null;
    }
  };

  const forPercentage = (proposal.votesFor / proposal.totalVotes) * 100;
  const againstPercentage = (proposal.votesAgainst / proposal.totalVotes) * 100;
  const quorumPercentage = (proposal.totalVotes / proposal.quorum) * 100;

  return (
    <Card className="bg-body-bg" data-testid={`proposal-${proposal.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="mb-2 text-lg text-white">
              {proposal.title}
            </CardTitle>
            <p className="text-body text-sm">Proposed by {proposal.proposer}</p>
          </div>
          {getStatusBadge(proposal.status)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-white/70">
          {proposal.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-body">For</span>
            <span className="text-white/80">
              {proposal.votesFor.toLocaleString()} votes (
              {forPercentage.toFixed(1)}%)
            </span>
          </div>
          <Progress
            value={forPercentage}
            className="[&>div]:bg-main bg-main/20 h-2"
          />

          <div className="flex items-center justify-between text-sm">
            <span className="text-body">Against</span>
            <span className="text-white/80">
              {proposal.votesAgainst.toLocaleString()} votes (
              {againstPercentage.toFixed(1)}%)
            </span>
          </div>
          <Progress
            value={againstPercentage}
            className="[&>div]:bg-main bg-main/20 h-2"
          />

          <div className="flex items-center justify-between text-sm">
            <span className="text-body">
              Quorum ({proposal.quorum.toLocaleString()} needed)
            </span>
            <span className="text-white/80">
              {quorumPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={Math.min(quorumPercentage, 100)}
            className="[&>div]:bg-main bg-main/20 h-2"
          />
        </div>

        <div className="text-body flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{proposal.timeRemaining}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{proposal.totalVotes.toLocaleString()} voters</span>
          </div>
        </div>

        {proposal.status === 'active' && !hasVoted && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote('for')}
              disabled={isVoting}
              className="h-11 flex-1 border-green-600/20 bg-green-700 text-white hover:bg-green-600/10 hover:text-green-700"
              data-testid={`button-vote-for-${proposal.id}`}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isVoting && selectedVote === 'for' ? 'Voting...' : 'Vote For'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote('against')}
              disabled={isVoting}
              className="hover:text-destructive bg-destructive border-destructive/20 hover:bg-destructive/10 h-11 flex-1 text-white"
              data-testid={`button-vote-against-${proposal.id}`}
            >
              <X className="mr-2 h-4 w-4" />
              {isVoting && selectedVote === 'against'
                ? 'Voting...'
                : 'Vote Against'}
            </Button>
          </div>
        )}

        {hasVoted && (
          <div className="flex items-center gap-2 rounded-md bg-green-600/10 p-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>You have voted on this proposal</span>
          </div>
        )}

        <div className="text-body border-t pt-2 text-xs">
          Your voting power:{' '}
          <span className="text-main font-medium">{userVotingPower} PZT</span>
        </div>
      </CardContent>
    </Card>
  );
}
