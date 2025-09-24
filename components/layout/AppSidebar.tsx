'use client';
import Link from 'next/link';
// import Image from 'next/image';
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
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (navItems: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {navItems.map(nav => (
        <Link key={nav.name} href={nav.path as string}>
          <span>{nav.icon}</span>
          {(isExpanded || isHovered || isMobileOpen) && (
            <span className={`menu-item-text`}>{nav.name}</span>
          )}
        </Link>
      ))}
    </ul>
  );

  return (
    <aside
      className={`bg-body-bg-light fixed top-0 left-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900 ${
        isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'
      } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex py-8 ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'}`}
      >
        <Link href="/" className="text-white">
          PREZOPT
          {/* {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
          )} */}
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
              <span>{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && (
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
