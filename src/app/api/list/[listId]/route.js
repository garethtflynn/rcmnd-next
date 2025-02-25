import prisma from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { listId } = params;
  console.log("REQ QUERY:", listId);
  // get a single list with its unique ID
  try {
    // Fetch specific list and return post(s)
    const list = await prisma.list.findUnique({
      where: {
        id: listId, // Filter posts by the given listId
      },
      include: {
        posts: true, // include the posts information in the response
      },
    });
    console.log("LIST IN RH", list);
    return new NextResponse(JSON.stringify(list), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch posts" }),
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req, { params }) {
  const { listId } = params;
  console.log("REQ QUERY:", listId);
  // delete a single post with its unique ID
  try {
    const list = await prisma.list.delete({
      where: { id: listId },
    });
    // res.json(post);
    return new NextResponse(JSON.stringify(list), { status: 200 });
  } catch (error) {
    // console.log(error);
    return new NextResponse(error);
  }
}

export async function PATCH(req, { params }) {
  const { listId } = params;
  const { title, isPrivate } = await req.json(); // Get updated data from the request body

  try {
    const updatedList = await prisma.list.update({
      where: { id: listId },
      data: {
        title: title,
        isPrivate: isPrivate,
      },
    });

    return NextResponse.json(updatedList);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error updating post" },
      { status: 500 }
    );
  }
}
