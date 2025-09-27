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
import { Wallet } from 'lucide-react';

export function NavUser() {
  const { isMobile } = useSidebar();
  const user = {
    name: '0x23b....a6820',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="bg-main/10 hover:bg-main/15 h-auto p-2 px-2 text-white hover:text-white focus-visible:border-0 focus-visible:ring-0"
            >
              <Wallet size={20} className="text-main" />

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium uppercase">
                  {user.name}
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
                <Wallet size={20} className="text-main" />

                <div className="grid flex-1 text-left text-sm leading-tight text-white">
                  <span className="truncate font-medium uppercase">
                    {user.name}
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
              <DropdownMenuItem className="text-body hover:bg-main hover:text-white">
                <IconLogout />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
