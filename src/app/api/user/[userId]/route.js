import prisma from "@/libs/db";
import { NextResponse } from "next/server";

// get a specific user
export async function GET(req, { params }) {
  const { userId } = params; // Destructure userId from params

  console.log("REQ QUERY:", userId); // Debugging log

  try {
    // Fetch a single user by their unique userId
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        posts: true,
        lists: true,
      },
    });

    if (!user) {
      // Return a 404 if the user is not found
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Return the user data
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return new Response(JSON.stringify({ error: "Failed to get user" }), {
      status: 500,
    });
  }
}
