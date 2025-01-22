import prisma from "@/libs/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

// get all lists for a specific user
export async function GET(req) {
  try {
    // Get the session from the request
    const session = await getServerSession(authOptions);

    console.log("Data in Route Handler:", session); // Log session data for debugging

    if (!session) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = session?.user?.id;
    const lists = await prisma.list.findMany({
      where: { userId },
    });

    return new NextResponse(JSON.stringify(lists), { status: 200 });
  } catch (error) {
    console.error("Error fetching lists:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}