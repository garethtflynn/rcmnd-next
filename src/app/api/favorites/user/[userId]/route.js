// get all favorites for a user
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/db";

// export async function GET(request, { params }) {
//   console.log("=== ROUTE DEBUG INFO ===");
//   console.log("Request URL:", request.url);
//   console.log("Params:", params);
//   console.log("UserId from params:", params?.userId);
//   console.log("Request method:", request.method);
  
//   return NextResponse.json({
//     message: "Route is working!",
//     userId: params?.userId,
//     url: request.url,
//     timestamp: new Date().toISOString()
//   });
// }

// // You can also test other HTTP methods
// export async function POST(request, { params }) {
//   return NextResponse.json({
//     message: "POST method works too!",
//     userId: params?.userId
//   });
// }

export async function GET(request, { params }) {
  try {
    // Get session (this should work fine in App Router)
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId: paramUserId } = params;
    
    // Optional: Check if authenticated user can access this user's favorites
    // Remove this check if any authenticated user should access any user's favorites
    if (session.user.id !== paramUserId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get user with favorites in a single query
    const user = await prisma.user.findUnique({
      where: { id: paramUserId },
      select: { 
        id: true, 
        favoritePostIDs: true 
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return early if no favorites
    if (!user.favoritePostIDs?.length) {
      return NextResponse.json({
        message: "No favorite posts found",
        favoritePosts: [],
      });
    }

    // Get favorite posts
    const favoritePosts = await prisma.post.findMany({
      where: {
        id: { in: user.favoritePostIDs },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      message: "Favorite posts retrieved successfully",
      favoritePosts,
    });

  } catch (error) {
    console.error("Error fetching favorite posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}