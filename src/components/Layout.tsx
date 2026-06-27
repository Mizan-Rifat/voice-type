import type { ReactNode } from 'react';

interface LayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  sidebarExpanded?: boolean;
}

const Layout = ({ sidebar, children, sidebarExpanded = true }: LayoutProps) => {
  return (
    <main
      className={`min-h-screen w-full transition-[padding] duration-300 ${
        sidebarExpanded ? 'md:pl-72' : 'md:pl-0'
      }`}
    >
      {sidebar}
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-4 py-12 pt-20 md:pt-12">
        {children}
      </div>
    </main>
  );
};

export default Layout;
