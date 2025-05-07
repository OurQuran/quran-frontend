import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HelmetProvider } from "react-helmet-async";
import { Outlet, useLocation } from "react-router";
import { useLenis } from "@/hooks/useLenis";
import { useEffect } from "react";
import { useEditionStore } from "@/store/editionStore";
import { useAuthStore } from "@/store/authStore";
import { isLoggedIn } from "@/helpers/authGuards";

export default function ClientLayout() {
  const lenisRef = useLenis();
  const { pathname } = useLocation();
  const { fetchEditions } = useEditionStore();
  const { fetchMe } = useAuthStore();

  useEffect(() => {
    fetchEditions();
    if (isLoggedIn()) {
      fetchMe();
    }
  }, []);
  useEffect(() => {
    lenisRef.current?.scrollTo(0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen scroll-smooth">
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6">
          <HelmetProvider>
            <Outlet />
          </HelmetProvider>
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
