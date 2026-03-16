"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

const RouterTabs = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};

const RouterTabsList = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
RouterTabsList.displayName = "RouterTabsList";

interface RouterTabNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  exact?: boolean;
}

const RouterTabNavLink = forwardRef<HTMLAnchorElement, RouterTabNavLinkProps>(
  ({ className, href, children, exact = false, ...props }, ref) => {
    const pathname = usePathname();
    const { locale } = useParams();
    
    // Normalize href for locale
    const localizedHref = href.startsWith("/") ? href : `/${locale}/dashboard/${href}`;
    const isActive = exact ? pathname === localizedHref : pathname.startsWith(localizedHref);

    return (
      <Link
        href={localizedHref}
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isActive
            ? "bg-background text-foreground shadow-sm"
            : "hover:bg-background/50 hover:text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </Link>
    );
  }
);
RouterTabNavLink.displayName = "RouterTabNavLink";

export { RouterTabs, RouterTabsList, RouterTabNavLink };
