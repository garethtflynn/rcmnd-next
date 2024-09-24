import prisma from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { postId } = params;
  console.log("REQ QUERY:", postId);
  // get a single post with its unique ID
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    // res.json(post);
    return new NextResponse(JSON.stringify(post), { status: 200 });
  } catch (error) {
    // console.log(error);
    return new NextResponse(error);
  }
}

export async function DELETE(req, { params }) {
  const { postId } = params;
  console.log("REQ QUERY:", postId);
  // delete a single post with its unique ID
  try {
    const post = await prisma.post.delete({
      where: { id: postId },
    });
    // res.json(post);
    return new NextResponse(JSON.stringify(post), { status: 200 });
  } catch (error) {
    // console.log(error);
    return new NextResponse(error);
  }
}
