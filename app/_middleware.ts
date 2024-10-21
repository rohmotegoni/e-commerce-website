// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(req: NextRequest , res: NextResponse) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   if (!token) {
//     // Redirect to the sign-in page if no token is found
//     return NextResponse.redirect(new URL('/auth/signin', req.url));
//   }
//   return NextResponse.next(); // Proceed if token exists
// }
