import { Menu, LogIn, UserPlus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { navLinks } from "@/helpers/utils";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useAuthStore } from "@/store/authStore";
import { isLoggedIn } from "@/helpers/authGuards";

export function NavDrawer() {
  const { t } = useTranslation("global");
  const pathname = usePathname();
  const { locale } = useParams();
  const { user } = useAuthStore();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="shrink-0 text-primary bg-accent/20 hover:bg-accent/40 backdrop-blur-sm border border-border/50 shadow-xs"
        >
          <Menu className="h-[1.1rem] w-[1.1rem]" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-card/95 backdrop-blur-xl border-border/40">
        <div className="mx-auto w-full max-w-sm p-6">
          <div className="flex flex-col gap-6">
            {/* Quick Actions */}
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-medium text-muted-foreground">{t("Quick Settings")}</span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <LanguageToggle />
              </div>
            </div>

            <div className="h-px bg-border/40" />

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2">
              {navLinks.map((link, i) => {
                const localizedHref = `/${locale}${link.href === "/" ? "" : link.href}`;
                const activePath = link.activePath || link.href;
                const localizedActivePath = `/${locale}${activePath === "/" ? "" : activePath}`;
                const isActive = link.exact ? pathname === localizedHref : pathname.startsWith(localizedActivePath);
                
                return (
                  <DrawerClose asChild key={i}>
                    <Link
                      href={localizedHref}
                      className={cn(
                        buttonVariants({
                          variant: isActive ? "default" : "ghost",
                          className: "w-full justify-start text-base font-medium",
                        }),
                        isActive ? "shadow-md" : "hover:bg-accent/50"
                      )}
                    >
                      <span className="w-full text-start">{t(link.label)}</span>
                    </Link>
                  </DrawerClose>
                );
              })}
            </nav>

            {/* Auth Section for Logged Out Users */}
            {!(isLoggedIn() && user) && (
              <>
                <div className="h-px bg-border/40" />
                <div className="flex flex-col gap-3">
                  <DrawerClose asChild>
                    <Link 
                      href={`/${locale}/login`} 
                      className={cn(buttonVariants({ variant: "outline" }), "w-full h-11 gap-2 border-primary/20 hover:bg-primary/5")}
                    >
                      <LogIn className="w-4 h-4" />
                      {t("Login")}
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link 
                      href={`/${locale}/signup`} 
                      className={cn(buttonVariants({ variant: "default" }), "w-full h-11 gap-2 shadow-md")}
                    >
                      <UserPlus className="w-4 h-4" />
                      {t("Sign Up")}
                    </Link>
                  </DrawerClose>
                </div>
              </>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
