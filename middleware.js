import { NextResponse } from "next/server";
import siteSettings from "./src/data/site-settings.json";

function normalizeExternalUrl(value) {
  if (!value) {
    return "";
  }

  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function middleware(request) {
  if (request.nextUrl.pathname === "/facebook") {
    const facebookUrl = normalizeExternalUrl(siteSettings.socialLinks?.facebook);

    try {
      if (facebookUrl) {
        return NextResponse.redirect(new URL(facebookUrl), 307);
      }
    } catch {
      // Fall through to the site if the configured URL is not valid.
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|site.webmanifest).*)"],
};
