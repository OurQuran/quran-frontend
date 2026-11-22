"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
import SectionsSidebar, { SECTIONS_PER_PAGE } from "@/components/Books/SectionsSidebar";
import SectionContent from "@/components/Books/SectionContent";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Last reading position per book (open section + sidebar page), kept in localStorage so coming back to a
// book without ?section= / ?page= in the URL resumes where the reader left off. The URL still wins.
const positionKey = (bookId: number) => `book-position-${bookId}`;

interface SavedPosition {
  section: number | null;
  page: number | null;
}

function readSavedPosition(bookId: number): string | null {
  try {
    return localStorage.getItem(positionKey(bookId));
  } catch {
    return null;
  }
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function parseSavedPosition(raw: string | null): SavedPosition {
  const empty: SavedPosition = { section: null, page: null };
  if (!raw) return empty;
  try {
    const value = JSON.parse(raw) as Partial<SavedPosition>;
    const toPositive = (n: unknown) =>
      typeof n === "number" && Number.isInteger(n) && n > 0 ? n : null;
    return { section: toPositive(value.section), page: toPositive(value.page) };
  } catch {
    return empty;
  }
}

export default function BookDetailClient({ bookId }: { bookId: number }) {
  const params = useParams();
  const isRTL = params.locale === "ar" || params.locale === "ku";

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // null on the server and during hydration, then the stored value (no hydration mismatch)
  const savedRaw = useSyncExternalStore(
    subscribeToStorage,
    () => readSavedPosition(bookId),
    () => null,
  );
  const saved = parseSavedPosition(savedRaw);

  const sectionParam = parseInt(searchParams.get("section") ?? "");
  const activeOrderNo = sectionParam > 0 ? sectionParam : saved.section;

  // The sidebar page lives in the URL (?page=) next to ?section=, so a reload or a shared link comes back
  // to the same place. Without ?page= it is derived from the open section (order numbers are 1..N, so the
  // section's page is ceil(order_no / page size)).
  const pageParam = parseInt(searchParams.get("page") ?? "");
  const hasUrlPosition = sectionParam > 0 || pageParam > 0;
  const sidebarPage =
    pageParam > 0
      ? pageParam
      : !hasUrlPosition && saved.page
        ? saved.page
        : activeOrderNo
          ? Math.max(1, Math.ceil(activeOrderNo / SECTIONS_PER_PAGE))
          : 1;

  useEffect(() => {
    if (activeOrderNo === null) return;
    try {
      localStorage.setItem(
        positionKey(bookId),
        JSON.stringify({ section: activeOrderNo, page: sidebarPage }),
      );
    } catch {
      // storage unavailable (private mode / blocked): the URL still carries the position
    }
  }, [bookId, activeOrderNo, sidebarPage]);

  const setSidebarPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const setActiveOrderNo = (orderNo: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("section", orderNo.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-background rounded-lg border overflow-hidden relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden absolute inset-0 bg-black/50 z-20 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "absolute md:relative z-30 h-full w-[280px] lg:w-[320px] transition-transform duration-300 ease-in-out shrink-0 bg-card",
          isRTL ? "right-0" : "left-0",
          isSidebarOpen
            ? "translate-x-0"
            : isRTL
              ? "translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-none"
              : "-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-none",
        )}
      >
        <button
          className={cn(
            "md:hidden absolute top-3 p-1 rounded-full bg-secondary text-secondary-foreground z-40",
            isRTL ? "left-3" : "right-3",
          )}
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-4 h-4" />
        </button>

        <div
          className={cn(
            "h-full w-[280px] lg:w-[320px]",
            !isSidebarOpen && "md:hidden",
          )}
        >
          <SectionsSidebar
            bookId={bookId}
            activeOrderNo={activeOrderNo}
            page={sidebarPage}
            onPageChange={setSidebarPage}
            onSelectSection={(orderNo) => {
              setActiveOrderNo(orderNo);
              if (window.innerWidth < 768) {
                setSidebarOpen(false);
              }
            }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full bg-background relative">
        <button
          className={cn(
            "absolute top-4 z-20 p-2 bg-secondary/80 backdrop-blur text-secondary-foreground rounded-md hover:bg-secondary transition-colors md:flex shadow-sm",
            isRTL ? "left-4" : "right-4",
            isSidebarOpen && "md:hidden", // Hide button on desktop if sidebar is open
          )}
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        <SectionContent bookId={bookId} orderNo={activeOrderNo} />
      </div>
    </div>
  );
}
