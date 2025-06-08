import prisma from "@/libs/db";
import { NextResponse } from "next/server";

// get posts from multiple userIds -> specifically the IDs from a following list
export async function GET(req, res) {
  // Parse the query parameters from the request URL
  const url = new URL(req.url); // Access the URL from NextRequest
  const userIds = url.searchParams.get("userIds"); // Get userIds from the query string

  console.log("USER IDS IN POSTS ROUTE HANDLER", userIds); // Log for debugging

  if (!userIds) {
    return res.status(400).json({ error: "No user IDs provided" });
  }

  const userIdsArray = userIds.split(","); // Convert the comma-separated string to an array of user IDs
  console.log("userIDS ARRAY:", userIdsArray);
  try {
    // Fetch posts from the users the logged-in user is following
    const posts = await prisma.post.findMany({
      where: {
        userId: {
          in: userIdsArray,
        },
        isPrivate: false,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("POSTS BEING RETURNED IN POSTS RH", posts);

    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json(err);
  }
}
