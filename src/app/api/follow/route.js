import prisma from "@/libs/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { followingId, followerId } = await request.json();
    if (!followerId || !followingId) {
      return NextResponse.json(
        { error: "Missing followerId or followingId" },
        { status: 400 }
      );
    }
    await prisma.user.update({
      where: { id: followerId },
      data: {
        following: {
          connect: { id: followingId }, // Add the user being followed to the `following` list
        },
      },
    });
    return NextResponse.json({ message: "Follow action successful" });
  } catch (error) {
    console.error("Error following user:", error);
    return new NextResponse("Failed to follow user", { status: 500 });
  }
}