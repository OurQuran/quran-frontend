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

function Header() {
  const scrollDirection = useScrollDirection();
  const [hasScrolled, setHasScrolled] = useState(false);

  const [t] = useTranslation("globL");

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 10) {
        setHasScrolled(true);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Tags",
      href: "/tags",
    },
    {
      label: "Advaced Search",
      href: "/advanced-search",
    },
  ];

  return (
    <motion.div
      initial={false}
      animate={{
        y: scrollDirection === "down" && hasScrolled ? "-100%" : "0%",
      }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
      className="sticky top-0 z-40 bg-card border-b border-border transition-all"
    >
      <div className="mx-auto max-w-screen-xl flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-5 items-center">
          <Link to="/" className="flex w-fit flex-col items-center ">
            <QuranLogoIcon className="w-10 h-10 text-primary" />
          </Link>
          <nav className="flex gap-5 items-center">
            {navLinks.map((link, i) => {
              return (
                <NavLink
                  key={i}
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      "font-poppins hover:underline",
                      isActive ? "text-primary underline" : "text-text"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
        {isLoggedIn() ? (
          <HeaderProfile />
        ) : (
          <Link to="/login">
            <Button
              variant={"outline"}
              className="rounded-4xl text-primary hover:bg-transparent"
            >
              <User className="w-6 h-6 text-primary" />
              {t("Login or Sign Up")}
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default Header;
