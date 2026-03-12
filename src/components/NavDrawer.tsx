import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { navLinks } from "@/helpers/utils";
import { NavLink } from "react-router";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function NavDrawer() {
  const { t, i18n } = useTranslation("global");
  const fontClass = i18n.language === "en" ? "font-poppins" : "font-kurdish";

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
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <nav className="gap-2 m-5 items-center flex flex-col">
            {navLinks.map((link, i) => {
              return (
                <NavLink
                  key={i}
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      fontClass,
                      buttonVariants({
                        variant: isActive ? "default" : "secondary",
                        className: "w-full",
                      }),
                    )
                  }
                >
                  <DrawerClose className="w-full">{t(link.label)}</DrawerClose>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
