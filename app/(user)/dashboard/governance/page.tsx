'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import GovernanceProposal from '@/components/dashboard-comps/GovernanceProposal';
import { Vote, Plus, Users, Clock } from 'lucide-react';
import { btnStyle, cn } from '@/lib/utils';

export default function Governance() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  // todo: remove mock functionality
  const votingPower = {
    totalPZT: '1,234.56',
    stakedPZT: '567.89',
    totalVotingPower: '1,801.45', // total + staked (2x multiplier)
  };

  const proposals = [
    {
      id: '1',
      title: 'Increase Treasury Allocation for Marketing',
      description:
        "Proposal to increase the treasury allocation from 30% to 35% of protocol fees to fund marketing initiatives and community growth programs. This will help expand the protocol's reach and attract more users.",
      votesFor: 45670,
      votesAgainst: 12340,
      totalVotes: 58010,
      quorum: 50000,
      timeRemaining: '2 days, 14 hours',
      status: 'active' as const,
      proposer: '0x1234...5678',
    },
    {
      id: '2',
      title: 'Add Support for DAI',
      description:
        'Expand protocol to support DAI deposits alongside USDC, enabling broader participation and increased TVL through multi-stablecoin support.',
      votesFor: 67890,
      votesAgainst: 8901,
      totalVotes: 76791,
      quorum: 50000,
      timeRemaining: 'Passed',
      status: 'passed' as const,
      proposer: '0x5678...9012',
    },
    {
      id: '3',
      title: 'Reduce Keeper Bot Fees',
      description:
        'Proposal to reduce keeper bot fees from 10% to 8% of total protocol fees to improve net yields for users while maintaining incentives for keepers.',
      votesFor: 23450,
      votesAgainst: 34567,
      totalVotes: 58017,
      quorum: 50000,
      timeRemaining: 'Failed',
      status: 'failed' as const,
      proposer: '0x9012...3456',
    },
  ];

  return (
    <div className="min-h-screen">
      <>
        <div className="mb-8">
          <div className="mb-6 flex flex-wrap items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-white">Governance</h2>
              <p className="text-body">
                Participate in protocol governance by voting on proposals and
                creating new ones.
              </p>
            </div>
            <Button
              className={cn(btnStyle, 'mt-4 sm:mt-0')}
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Proposal
            </Button>
          </div>

          {/* Voting Power Display */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="bg-neutral-950">
              <CardContent className="p-6 text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <Users className="text-body h-4 w-4" />
                  <span className="text-body text-sm">Total $PZT Held</span>
                </div>
                <p className="font-mono text-2xl font-bold text-white">
                  {votingPower.totalPZT}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-950">
              <CardContent className="p-6 text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <Vote className="text-body h-4 w-4" />
                  <span className="text-body text-sm">Staked $PZT (2x)</span>
                </div>
                <p className="font-mono text-2xl font-bold text-white">
                  {votingPower.stakedPZT}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-950">
              <CardContent className="p-6 text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <Vote className="text-body h-4 w-4" />
                  <span className="text-body text-sm">Total Voting Power</span>
                </div>
                <p className="font-mono text-2xl font-bold text-white">
                  {votingPower.totalVotingPower}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Proposals List */}
            <div className="space-y-6">
              <div className="mb-6 flex items-center gap-4">
                <h3 className="text-xl font-semibold text-white">
                  Active Proposals
                </h3>
                <Badge variant="secondary" className="bg-main text-white">
                  {proposals.filter(p => p.status === 'active').length} Active
                </Badge>
              </div>

              {proposals.map(proposal => (
                <GovernanceProposal
                  key={proposal.id}
                  proposal={proposal}
                  userVotingPower={votingPower.totalVotingPower}
                  hasVoted={proposal.id === '2'} // Mock: user voted on proposal 2
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Create Proposal Form */}
            {showCreateForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Create New Proposal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="proposal-title">Title</Label>
                    <Input
                      id="proposal-title"
                      placeholder="Enter proposal title"
                      data-testid="input-proposal-title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="proposal-description">Description</Label>
                    <Textarea
                      id="proposal-description"
                      placeholder="Describe your proposal in detail"
                      rows={4}
                      data-testid="textarea-proposal-description"
                    />
                  </div>

                  <div>
                    <Label htmlFor="proposal-deposit">Proposal Deposit</Label>
                    <Input
                      id="proposal-deposit"
                      placeholder="5,000 PZT (minimum)"
                      data-testid="input-proposal-deposit"
                    />
                    <p className="text-body mt-1 text-xs">
                      Refundable if proposal passes
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    data-testid="button-submit-proposal"
                  >
                    Submit Proposal
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Voting Timeline */}
            <Card className="bg-neutral-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="h-5 w-5" />
                  Voting Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-main flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Proposal Submission
                      </p>
                      <p className="text-body text-xs">
                        5,000 PZT minimum deposit required
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-main flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Voting Period
                      </p>
                      <p className="text-body text-xs">
                        3 days for community voting
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-main flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Quorum Check
                      </p>
                      <p className="text-body text-xs">
                        5% of staked PZT must participate
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-main flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
                      4
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Execution
                      </p>
                      <p className="text-body text-xs">
                        48 hour timelock before implementation
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    </div>
  );
}
