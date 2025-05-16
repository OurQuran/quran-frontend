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

export function NavDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <Menu />
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
                      buttonVariants({
                        variant: isActive ? "default" : "secondary",
                        className: "w-full",
                      })
                    )
                  }
                >
                  <DrawerClose className="w-full">{link.label}</DrawerClose>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
