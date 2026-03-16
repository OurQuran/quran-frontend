"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { useLenis } from "@/hooks/useLenis";
import { useEffect, ReactNode } from "react";
import { useEditionStore } from "@/store/editionStore";
import { useAuthStore } from "@/store/authStore";
import { isLoggedIn } from "@/helpers/authGuards";

export default function MainLayout({ children }: { children: ReactNode }) {
  const lenisRef = useLenis();
  const pathname = usePathname();
  const { fetchEditions } = useEditionStore();
  const { fetchMe } = useAuthStore();

  useEffect(() => {
    fetchEditions();
    if (typeof window !== "undefined" && isLoggedIn()) {
      fetchMe();
    }
  }, [fetchEditions, fetchMe]);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname, lenisRef]);

  return (
    <div className="flex flex-col min-h-screen scroll-smooth">
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card border-border w-full">
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-4">
          <Footer />
        </div>
      </footer>
    </div>
  );
}
