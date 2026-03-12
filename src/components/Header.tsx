import { useScrollDirection } from "@/hooks/useScrollDirection";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import QuranLogoIcon from "./QuranLogoIcon";
import { User } from "lucide-react";
import { Link, NavLink } from "react-router";
import { isLoggedIn } from "@/helpers/authGuards";

import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

import HeaderProfile from "./HeaderProfile";
import { cn } from "@/lib/utils";
import { NavDrawer } from "./NavDrawer";
import { navLinks } from "@/helpers/utils";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";

function Header() {
  const scrollDirection = useScrollDirection();
  const [hasScrolled, setHasScrolled] = useState(false);

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
        ease: [0.4, 0, 0.2, 1] // Custom ease-in-out for premium feel
      }}
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        hasScrolled 
          ? "bg-card/80 backdrop-blur-md shadow-sm border-b border-border/50" 
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="mx-auto max-w-screen-xl flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-5 items-center">
          <Link to="/" className="flex w-fit flex-col items-center ">
            <QuranLogoIcon className="w-10 h-10 text-primary" />
          </Link>
          <nav className="gap-5 items-center hidden sm:flex">
            {navLinks.map((link, i) => {
              return (
                <NavLink
                  key={i}
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      fontClass,
                      "relative px-3 py-1.5 transition-colors duration-200 font-medium text-sm",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {t(link.label)}
                      {isActive && (
                        <motion.div
                          layoutId="nav-underline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/80 rounded-full mx-3"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <LanguageToggle />
          {isLoggedIn() ? (
            <HeaderProfile />
          ) : (
            <Link to="/login">
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-primary bg-accent/20 hover:bg-accent/40 backdrop-blur-sm border border-border/50 shadow-xs", 
                  fontClass
                )}
              >
                <User className="h-[1.1rem] w-[1.1rem] text-primary" />
                <span className="hidden sm:inline">{t("Login or Sign Up")}</span>
              </Button>
            </Link>
          )}
          <div className="sm:hidden">
            <NavDrawer />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Header;
