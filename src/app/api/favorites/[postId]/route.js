// src/app/api/favorites/[postId]/route.js POST/DELETE/GET specific post
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/db";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = params;
    const userId = session.user.id;


    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        favoritePostIDs: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.favoritePostIDs && user.favoritePostIDs.includes(postId)) {
      return NextResponse.json(
        { error: "Post already favorited" },
        { status: 400 }
      );
    }

    const currentFavorites = user.favoritePostIDs || [];
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        favoritePostIDs: [...currentFavorites, postId]
      }
    });

    return NextResponse.json(
      {
        message: "Post favorited successfully",
        favorited: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error favoriting post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = params;
    const userId = session.user.id;

    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        favoritePostIDs: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    if (!user.favoritePostIDs || !user.favoritePostIDs.includes(postId)) {
      return NextResponse.json(
        { error: "Post not in favorites" },
        { status: 400 }
      );
    }

    const updatedFavorites = user.favoritePostIDs.filter(id => id !== postId);
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        favoritePostIDs: updatedFavorites
      }
    });

    return NextResponse.json(
      {
        message: "Post unfavorited successfully",
        favorited: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unfavoriting post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = params;
    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { favoritePostIDs: true },
    });

    const isFavorited = user?.favoritePostIDs.includes(postId) || false;

    return NextResponse.json({ isFavorited });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
