'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';
import { BiSolidDashboard } from 'react-icons/bi';
import { FaBalanceScale, FaCoins } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';
import { cn } from '@/lib/utils';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <BiSolidDashboard />,
    name: 'Dashboard',
    path: '/dashboard',
  },
  {
    icon: <FaCoins />,
    name: 'Staking',
    path: '/dashboard/staking',
  },
  {
    icon: <FaBalanceScale />,
    name: 'Governance',
    path: '/dashboard/governance',
  },
  {
    icon: <IoSettings />,
    name: 'Settings',
    path: '/dashboard/settings',
  },
];

const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const { isExpanded, isMobileOpen } = useSidebar();

  return (
    <aside
      className={`fixed top-0 left-0 z-50 mt-16 flex h-screen flex-col border-r bg-neutral-950 px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 ${'w-[290px]'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      <div className={`flex py-8`}>
        <Link href="/" className="text-white">
          {isExpanded || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/brand/Prezopt_2Jujora.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/brand/PrezoptJujora.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6 space-y-4">
          {navItems.map(nav => (
            <Link
              key={nav.name}
              href={nav.path as string}
              className={cn('flex items-center gap-3 text-white')}
            >
              <span
                className={cn(
                  '',
                  isExpanded || isMobileOpen
                    ? 'justify-center'
                    : 'justify-start'
                )}
              >
                {nav.icon}
              </span>
              {(isExpanded || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
