import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Shield, TrendingUp, Zap } from 'lucide-react';

export default function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4">Why Choose Prezopt?</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced yield optimization with complete control of your funds
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover-elevate">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Non-Custodial</h4>
              <p className="text-sm text-muted-foreground">
                You maintain complete control of your funds. No centralized custody risks.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-success/10 rounded-md flex items-center justify-center mx-auto mb-4">
                <Bot className="w-6 h-6 text-success" />
              </div>
              <h4 className="font-semibold mb-2">AI-Powered</h4>
              <p className="text-sm text-muted-foreground">
                Machine learning models predict yield opportunities across protocols.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-md flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-warning" />
              </div>
              <h4 className="font-semibold mb-2">Automated</h4>
              <p className="text-sm text-muted-foreground">
                Keeper bots execute optimal rebalances automatically when profitable.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-chart-1/10 rounded-md flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-chart-1" />
              </div>
              <h4 className="font-semibold mb-2">Optimized Returns</h4>
              <p className="text-sm text-muted-foreground">
                Consistently outperform static positions through dynamic allocation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
