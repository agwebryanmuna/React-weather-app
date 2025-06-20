import type { PropsWithChildren } from "react";
import Header from "./ui/Header";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-gradient-to-br from-background to-muted">
      <Header />
      <main className="min-h-screen container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t backdrop-blur py-12 bg-background/60">
        <div className="container mx-auto px-4 text-center text-gray-200">
          Made with 🩷 by Agwe
        </div>
      </footer>
    </div>
  );
};

export default Layout;
