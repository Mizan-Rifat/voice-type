import type { ReactNode } from 'react';

interface LayoutProps {
  sidebar: ReactNode;
  rightSidebar?: ReactNode;
  children: ReactNode;
  sidebarExpanded?: boolean;
  historySidebarExpanded?: boolean;
}

const Layout = ({
  sidebar,
  rightSidebar,
  children,
  sidebarExpanded = true,
  historySidebarExpanded = true,
}: LayoutProps) => {
  return (
    <main
      className={`min-h-screen w-full transition-[padding] duration-300 ${
        sidebarExpanded ? 'md:pl-72' : 'md:pl-0'
      } ${historySidebarExpanded ? 'md:pr-72' : 'md:pr-0'}`}
    >
      {sidebar}
      {rightSidebar}
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-4 py-12 pt-20 md:pt-12">
        {children}
      </div>
    </main>
  );
};

export default Layout;
