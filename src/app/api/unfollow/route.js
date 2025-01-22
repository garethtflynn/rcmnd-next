import prisma from "@/libs/db";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    const { followerId, followingId } = await request.json();

    if (!followerId || !followingId) {
      return NextResponse.json(
        { error: "Missing followerId or followingId" },
        { status: 400 }
      );
    }

    // Disconnect the follow relationship
    await prisma.user.update({
      where: { id: followerId },
      data: {
        following: {
          disconnect: { id: followingId }, // Remove the connection from the following list
        },
      },
    });

    return NextResponse.json({ message: "Unfollow action successful" });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return new NextResponse("Failed to unfollow user", { status: 500 });
  }
}