import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Shield, TrendingUp, Zap } from 'lucide-react';

export default function Features() {
  return (
    <section id="features" className="px-4 py-20">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h3 className="mb-4 text-3xl font-bold">Why Choose Prezopt?</h3>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Advanced yield optimization with complete control of your funds
          </p>
        </div>

        <div>
          <div className="rounded-[16px] bg-[radial-gradient(44.037%_58%_at_24%_28.4%,rgba(255,255,255,0.29)_0%,rgba(255,255,255,0.11)_100%)] opacity-100"></div>
          <div className="rounded-[15px] bg-[radial-gradient(50%_50%,rgb(8,8,8)_0%,rgb(13,10,17)_100%)] opacity-100"></div>

          <div className="bg-[conic-gradient(from_291deg_at_-4.9%_-6%,_rgb(11,10,11)_77.84deg,_rgb(11,10,11)_169.37deg,_white_198deg,_rgb(11,10,11)_227.17deg)] opacity-5"></div>
          <div>
            <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md">
              <Shield className="text-primary h-6 w-6" />
            </div>
            <h4 className="mb-2 font-semibold">Non-Custodial</h4>
            <p className="text-muted-foreground text-sm">
              You maintain complete control of your funds. No centralized custody risks.
            </p>
          </div>
        </div>

        {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover-elevate bg-[linear-gradient(145deg,rgba(152,50,255,.37)_0%,rgb(14,15,17)_12%,rgb(14,15,17)_87%,rgba(152,150,255,.15)_97%)]">
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md">
                <Shield className="text-primary h-6 w-6" />
              </div>
              <h4 className="mb-2 font-semibold">Non-Custodial</h4>
              <p className="text-muted-foreground text-sm">
                You maintain complete control of your funds. No centralized custody risks.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate bg-[conic-gradient(from_291deg_at_-4.9%_-6%,_rgb(11,10,11)_77.84deg,_rgb(11,10,11)_169.37deg,_white_198deg,_rgb(11,10,11)_227.17deg)]">
            <CardContent className="p-6 text-center">
              <div className="bg-success/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md">
                <Bot className="text-success h-6 w-6" />
              </div>
              <h4 className="mb-2 font-semibold">AI-Powered</h4>
              <p className="text-muted-foreground text-sm">
                Machine learning models predict yield opportunities across protocols.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="p-6 text-center">
              <div className="bg-warning/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md">
                <Zap className="text-warning h-6 w-6" />
              </div>
              <h4 className="mb-2 font-semibold">Automated</h4>
              <p className="text-muted-foreground text-sm">
                Keeper bots execute optimal rebalances automatically when profitable.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="p-6 text-center">
              <div className="bg-chart-1/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md">
                <TrendingUp className="text-chart-1 h-6 w-6" />
              </div>
              <h4 className="mb-2 font-semibold">Optimized Returns</h4>
              <p className="text-muted-foreground text-sm">
                Consistently outperform static positions through dynamic allocation.
              </p>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </section>
  );
}

//  linear-gradient(145deg,rgba(152,50,255,.37)_0%,rgb(14,15,17)_12%, rgb(14,15,17)_87%,rgba(152,150,255,.15)_97%);
