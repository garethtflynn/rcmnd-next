// src/app/api/lists/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import prisma from "@/libs/db";

export async function GET(request) {
  try {
    // First try to get user from session (for web app)
    const session = await getServerSession(authOptions);
    let userId = session?.user?.id;

    // If no session, check for API token (for Chrome extension)
    if (!userId) {
      const authHeader = request.headers.get("Authorization");

      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);

        // Find token in database
        const apiToken = await prisma.apiToken.findUnique({
          where: { token },
          include: { user: true },
        });

        // Check if token exists and is not expired
        if (apiToken && apiToken.expiresAt >= new Date()) {
          userId = apiToken.user.id;
        }
      }
    }

    // If no valid session or token found
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch lists for the user
    const lists = await prisma.list.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json(lists);
  } catch (error) {
    console.error("Error fetching lists:", error);
    return NextResponse.json(
      { error: "Failed to fetch lists" },
      { status: 500 }
    );
  }
}

// import prisma from "@/libs/db";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { getServerSession } from "next-auth/next";
// import { NextResponse } from "next/server";

// // get all lists for a specific user
// export async function GET(req) {
//   try {
//     // Get the session from the request
//     const session = await getServerSession(authOptions);

//     console.log("Data in Route Handler:", session); // Log session data for debugging

//     if (!session) {
//       return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
//         status: 401,
//       });
//     }

//     const userId = session?.user?.id;
//     const lists = await prisma.list.findMany({
//       where: { userId },
//     });

//     return new NextResponse(JSON.stringify(lists), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching lists:", error);
//     return new NextResponse(
//       JSON.stringify({ error: "Internal Server Error" }),
//       { status: 500 }
//     );
//   }
// }
