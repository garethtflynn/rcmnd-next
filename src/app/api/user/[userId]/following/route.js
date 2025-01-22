import prisma from "@/libs/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Get session data
    const session = await getServerSession(authOptions);
    console.log("Session Data in Route Handler:", session); // Log session data for debugging

    // If no session exists, return unauthorized response
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id; // Extract user ID from session
    console.log("Fetching following for user ID:", userId);

    // Fetch the user and the users they are following
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        following: true, // Include the list of users the current user is following
      },
    });

    // Check if user is found, if not, return a 404 error
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the list of users the logged-in user is following
    return NextResponse.json(user.following);
  } catch (err) {
    // Log error for debugging and return generic 500 error
    console.error("Error fetching following users:", err);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
