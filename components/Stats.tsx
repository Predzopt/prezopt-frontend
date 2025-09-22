import React from 'react';
import ProtocolStats from './ProtocolStats';

export default function Stats() {
  return (
    <section className="py-10 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto ">
        <ProtocolStats />
      </div>
    </section>
  );
}
