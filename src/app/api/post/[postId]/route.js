import prisma from "@/libs/db";
import { NextResponse } from "next/server";

// get a specific post
export async function GET(req, { params }) {
  const { postId } = params;
  console.log("REQ QUERY:", postId);
  // get a single post with its unique ID
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            username: true, // Include the username of the user who posted
          },
        },
      },
    });
    // res.json(post);
    return new NextResponse(JSON.stringify(post), { status: 200 });
  } catch (error) {
    // console.log(error);
    return new NextResponse(error);
  }
}

// delete a specefic post
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

export async function PATCH(req, { params }) {
  const { postId } = params;
  const { title, link, description, listId, isPrivate } = await req.json(); // Get updated data from the request body

  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: title,
        link: link,
        description: description,
        listId: listId,
        isPrivate: isPrivate,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error updating post" },
      { status: 500 }
    );
  }
}
