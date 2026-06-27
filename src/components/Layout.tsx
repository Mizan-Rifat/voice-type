import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <main className="w-full max-w-3xl px-4 py-12 mx-auto flex flex-col items-center justify-center min-h-[80vh]">
      {children}
    </main>
  );
};

export default Layout;
