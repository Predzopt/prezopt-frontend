// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import React from 'react';
// import Settings from './dashboard/settings/page';
// import { Settings2 } from 'lucide-react';

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';

//   return (
//     <>
//       <header className=" sticky top-0 z-50 border-b backdrop-blur">
//         <div className="container mx-auto flex h-16 items-center justify-between px-4">
//           <div className="flex items-center gap-8">
//             <h1 className="text-2xl font-bold">Prezopt</h1>
//             <nav className="hidden gap-6 md:flex">
//               <Link href="/dashboard" className="text-sm font-medium">
//                 Dashboard
//               </Link>
//               <Link
//                 href="/dashboard/staking"
//                 className="text-muted-foreground hover:text-foreground text-sm transition-colors"
//               >
//                 Staking
//               </Link>
//               <Link
//                 href="/dashboard/governance"
//                 className="text-muted-foreground hover:text-foreground text-sm transition-colors"
//               >
//                 Governance
//               </Link>
//               <Link
//                 href="/dashboard/settings"
//                 className="text-muted-foreground hover:text-foreground text-sm transition-colors"
//               >
//                 Settings
//               </Link>
//             </nav>
//           </div>
//           <div className="flex items-center gap-4">
//             <Badge variant="secondary" className="font-mono">
//               {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
//             </Badge>
//             <Button variant="ghost" size="icon">
//               <Settings2 className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </header>

//       <main className="bg-body-bg">{children}</main>
//     </>
//   );
// }

'use client';

import { useSidebar } from '@/context/SidebarContext';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import Backdrop from '@/components/layout/Backdrop';
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? 'ml-0'
    : isExpanded || isHovered
      ? 'lg:ml-[290px]'
      : 'lg:ml-[90px]';

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
