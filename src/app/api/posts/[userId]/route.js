import prisma from "@/libs/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Get the session from the request
    const session = await getServerSession(authOptions);

    console.log("Session Data in Route Handler:", session); // Log session data for debugging

    if (!session) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = session?.user?.id;
    const posts = await prisma.post.findMany({
      where: { userId },
    });

    return new NextResponse(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
