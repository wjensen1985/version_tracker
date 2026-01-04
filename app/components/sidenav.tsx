"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Navigation item type for extensibility
type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

// Navigation section type
type NavSection = {
  title?: string;
  items: NavItem[];
};

// Icon components - easily add more as needed
const Icons = {
  dashboard: (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  ),
  projects: (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
      />
    </svg>
  ),
  settings: (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  help: (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
      />
    </svg>
  ),
  signOut: (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
      />
    </svg>
  ),
};

// =============================================================================
// NAVIGATION CONFIGURATION
// Add new navigation items here - they will automatically appear in the sidebar
// =============================================================================

const mainNavigation: NavSection = {
  items: [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Icons.dashboard,
    },
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: Icons.projects,
    },
  ],
};

const secondaryNavigation: NavSection = {
  title: "Support",
  items: [
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Icons.settings,
    },
    {
      name: "Help",
      href: "/dashboard/help",
      icon: Icons.help,
    },
  ],
};

// =============================================================================

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      {/* Active indicator - left border */}
      <span
        className={`absolute left-0 h-6 w-1 rounded-r-full bg-blue-600 dark:bg-blue-400 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />
      <span className="text-gray-500 dark:text-gray-400">
        {item.icon}
      </span>
      <span className={isActive ? "font-semibold" : ""}>{item.name}</span>
    </Link>
  );
}

function NavSectionComponent({
  section,
  pathname,
}: {
  section: NavSection;
  pathname: string;
}) {
  return (
    <div>
      {section.title && (
        <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {section.title}
        </h3>
      )}
      <nav className="space-y-1">
        {section.items.map((item) => {
          // Check if current path matches or starts with the nav item href
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return <NavLink key={item.href} item={item} isActive={isActive} />;
        })}
      </nav>
    </div>
  );
}

export default function SideNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-950">
      {/* Logo / Brand */}
      <div className="p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
            />
          </svg>
          <div className="hidden md:block">
            <span className="text-lg font-bold text-white">Version</span>
            <span className="text-lg font-light text-blue-100">Tracker</span>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <NavSectionComponent section={mainNavigation} pathname={pathname} />

        {/* Divider */}
        <div className="my-6 border-t border-gray-200 dark:border-gray-800" />

        {/* Secondary Navigation */}
        <NavSectionComponent section={secondaryNavigation} pathname={pathname} />
      </div>

      {/* Footer / User Section */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <span className="text-gray-500 dark:text-gray-400">{Icons.signOut}</span>
          <span className="hidden md:block">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
