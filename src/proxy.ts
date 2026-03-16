import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18nConfig } from "./i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18nConfig.locales;

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  const locale = matchLocale(languages, locales, i18nConfig.defaultLocale);

  return locale;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  // // `/_next/` and `/api/` are ignored by the middleware, but we should be aware of this
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") // skip files with extensions (like favicon.ico)
  ) {
    return;
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18nConfig.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  }

  // Auth Guards
  const segments = pathname.split("/");
  const locale = segments[1];
  const pathAfterLocale = segments.slice(2).join("/");

  const protectedRoutes = ["dashboard", "bookmarks"];
  const authRoutes = ["login", "signup"];

  const isProtectedRoute = protectedRoutes.some(route => pathAfterLocale.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathAfterLocale.startsWith(route));

  if (isProtectedRoute && !token) {
    const response = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    return response;
  }

  if (isAuthRoute && token) {
    const response = NextResponse.redirect(new URL(`/${locale}`, request.url));
    return response;
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
