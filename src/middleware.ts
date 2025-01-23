import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // ดึงค่า Cookie จาก Header
  const cookies = request.cookies.get("auth"); 
  const isLoggedIn = cookies?.value === "true"; 

  if (!isLoggedIn && url.pathname.startsWith("/ui-components")) {
    url.pathname = "/login"; 
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && url.pathname === "/login") {
    url.pathname = "/ui-components/dashboard"; 
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); 
}
