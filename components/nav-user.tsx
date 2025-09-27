'use client';

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from '@tabler/icons-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Wallet, Check, X } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import WalletConnectionModal from './WalletConnectionModal';

export function NavUser() {
  const { isMobile } = useSidebar();
  const { isConnected, address, disconnect } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {isConnected && address ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="bg-main/10 hover:bg-main/15 h-auto p-2 px-2 text-white hover:text-white focus-visible:border-0 focus-visible:ring-0"
              >
                <Check size={20} className="text-green-500" />

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium uppercase">
                    {formatAddress(address)}
                  </span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-body-bg w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? 'bottom' : 'bottom'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Check size={20} className="text-green-500" />

                  <div className="grid flex-1 text-left text-sm leading-tight text-white">
                    <span className="truncate font-medium uppercase">
                      {formatAddress(address)}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/10" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-body hover:bg-main hover:text-white">
                  <IconUserCircle />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-body hover:bg-main hover:text-white">
                  <IconNotification />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  onClick={handleDisconnect}
                >
                  <X className="mr-2 h-4 w-4" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <WalletConnectionModal
            trigger={
              <SidebarMenuButton
                size="lg"
                className="bg-main/10 hover:bg-main/15 h-auto p-2 px-2 text-white hover:text-white focus-visible:border-0 focus-visible:ring-0"
              >
                <Wallet size={20} className="text-main" />

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium uppercase">
                    Connect Wallet
                  </span>
                </div>
              </SidebarMenuButton>
            }
          />
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
