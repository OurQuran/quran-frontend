import { useScrollDirection } from "@/hooks/useScrollDirection";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import QuranLogoIcon from "./QuranLogoIcon";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { useTranslation } from "react-i18next";

import HeaderProfile from "./HeaderProfile";
import { cn } from "@/lib/utils";
import { NavDrawer } from "./NavDrawer";
import { navLinks } from "@/helpers/utils";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { useAuthStore } from "@/store/authStore";
import { isLoggedIn } from "@/helpers/authGuards";
import { Button } from "./ui/button";
import { UserPlus, LogIn } from "lucide-react";

function Header() {
  const scrollDirection = useScrollDirection();
  const [hasScrolled, setHasScrolled] = useState(false);
  const { locale } = useParams();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { t, i18n } = useTranslation("global");
  const fontClass = i18n.language === "en" ? "font-poppins" : "font-kurdish";

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{
        y: scrollDirection === "down" && hasScrolled ? -100 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1], // Custom ease-in-out for premium feel
      }}
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        hasScrolled
          ? "bg-card/80 backdrop-blur-md  border-b border-border/50"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-5 items-center">
          <Link
            href={`/${locale}`}
            className="flex w-fit flex-col items-center "
          >
            <QuranLogoIcon className="w-10 h-10 text-primary" />
          </Link>
          <nav className="gap-5 items-center hidden sm:flex">
            {navLinks.map((link, i) => {
              const href = `/${locale}${link.href === "/" ? "" : link.href}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={i}
                  href={href}
                  className={cn(
                    fontClass,
                    "relative px-3 py-1.5 transition-colors duration-200 font-medium text-sm",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t(link.label)}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/80 rounded-full mx-3"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
          {isClient &&
            (isLoggedIn() && user ? (
              <HeaderProfile />
            ) : (
              <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                <Link href={`/${locale}/login`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(fontClass, "flex items-center gap-2")}
                  >
                    <LogIn className="w-4 h-4" />
                    {t("Login")}
                  </Button>
                </Link>
                <Link href={`/${locale}/signup`}>
                  <Button
                    size="sm"
                    className={cn(fontClass, "flex items-center gap-2")}
                  >
                    <UserPlus className="w-4 h-4" />
                    {t("Sign Up")}
                  </Button>
                </Link>
              </div>
            ))}
          <div className="sm:hidden">
            <NavDrawer />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Header;
