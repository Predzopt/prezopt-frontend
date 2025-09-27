'use client';

import * as React from 'react';
import { NavMain } from '@/components/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { BiSolidDashboard } from 'react-icons/bi';
import { FaBalanceScale, FaCoins } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';
import Image from 'next/image';
import Link from 'next/link';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      icon: BiSolidDashboard,
      title: 'Dashboard',
      url: '/dashboard',
    },
    {
      icon: FaCoins,
      title: 'Staking',
      url: '/dashboard/staking',
    },
    {
      icon: FaBalanceScale,
      title: 'Governance',
      url: '/dashboard/governance',
    },
    {
      icon: IoSettings,
      title: 'Settings',
      url: '/dashboard/settings',
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="bg-body-bg">
      <SidebarHeader className="bg-body-bg">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="hover:bg-transparent data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/" className="flex items-center gap-3">
                <Image
                  className="size-6"
                  src="/images/brand/PrezoptJujora.svg"
                  alt="Logo"
                  width={150}
                  height={40}
                />
                <span className="text-xl font-bold text-white uppercase">
                  Prezopt
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-body-bg">
        <NavMain items={data?.navMain as any} />
      </SidebarContent>
    </Sidebar>
  );
}
