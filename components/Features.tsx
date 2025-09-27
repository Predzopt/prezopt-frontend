"use client"
import React from 'react';
import { Card } from '@/components/ui/card';
import ElectricBorder from './ElectricBorder';
import { GiReceiveMoney } from 'react-icons/gi';
import { RiTimerFlashLine } from 'react-icons/ri';
import { MdPsychology } from 'react-icons/md';
import { FaShield } from 'react-icons/fa6';
import Image from 'next/image';

export default function Features() {
  return (
    <section id="features" className="px-4 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <h3 className="mb-4 text-3xl text-white font-bold">Why Choose <span className="text-main">Prezopt?</span></h3>
          <p className="text-body mx-auto max-w-2xl text-lg">
            Advanced yield optimization with complete control of your funds
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {featureList.map((item, i) => {
            return (
           <ElectricBorder key={i} color="#9c6bff" speed={1} chaos={0.5} thickness={1} style={{ borderRadius: 16 }}>
               <Card  className="border group bg-transparent p-6 py-10 pt-14">
                <div
                  className={` relative h-[4.5em] mx-auto w-[4.5em] bg-transparent outline-none [-webkit-tap-highlight-color:transparent] [perspective:24em] [transform-style:preserve-3d]`}
                >
                  <span
                    className="bg-main/30 absolute top-0 left-0 block h-full w-full origin-[100%_100%] rotate-[15deg] rounded-[1.25em] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] group-hover:[transform:rotate(25deg)_translate3d(-0.5em,-0.5em,0.5em)]"
                    style={{
                      // ...getBackgroundStyle(item.color),
                      boxShadow:
                        '0.5em -0.5em 0.75em hsla(223, 10%, 10%, 0.15)',
                    }}
                  ></span>

                  <span    
                    className="absolute top-0 left-0 flex h-full w-full origin-[80%_50%] transform rounded-[1.25em] bg-[hsla(0,0%,100%,0.15)] backdrop-blur-[0.75em] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] [-webkit-backdrop-filter:blur(0.75em)] group-hover:[transform:translateZ(2em)]"
                    style={{
                      boxShadow: '0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset',
                    }}
                  >
                    <span
                      className="m-auto flex h-[1.5em] w-[1.5em] items-center justify-center"
                      aria-hidden="true"
                    >
                      <item.icon size={52} className="text-white" />
                    </span>
                  </span>
                </div>
                <h3 className="text-lg  text-center font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-body text-center ">{item.content}</p>
              </Card>
           </ElectricBorder>
            );
          })}
        </div>
      </div>
    </section>
  );
}

//  linear-gradient(145deg,rgba(152,50,255,.37)_0%,rgb(14,15,17)_12%, rgb(14,15,17)_87%,rgba(152,150,255,.15)_97%);

const featureList = [
  {
    icon: FaShield,
    title: 'Non-Custodial',
    content:
      'You maintain complete control of your funds. No centralized custody risks.',
  },
  {
    icon: MdPsychology,
    title: 'AI-Powered',
    content:
      'Machine learning models predict yield opportunities across protocols.',
  },
  {
    icon: RiTimerFlashLine,
    title: 'Automated',
    content:
      'Keeper bots execute optimal rebalances automatically when profitable.',
  },
  {
    icon: GiReceiveMoney,
    title: 'Optimized Returns',
    content:
      'Consistently outperform static positions through dynamic allocation.',
  },
];

/* 

 <ElectricBorder
              className=""
              color="#9c6bff"
              speed={1}
              chaos={0.5}
              thickness={2}
              style={{ borderRadius: 16 }}
           
            >
                </ElectricBorder>
*/
