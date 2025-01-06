import prisma from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { listId } = params;
  console.log("REQ QUERY:", listId);
  // get a single list with its unique ID
  try {
    // Fetch posts belonging to the specific list
    const posts = await prisma.post.findMany({
      where: {
        listId: listId, // Filter posts by the given listId
      },
      include: {
        list: true, // Optionally include the list information in the response
      },
    });

    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch posts" }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  const { listId } = params;
  console.log("REQ QUERY:", listId);
  // delete a single post with its unique ID
  try {
    const post = await prisma.post.delete({
      where: { id: listId },
    });
    // res.json(post);
    return new NextResponse(JSON.stringify(post), { status: 200 });
  } catch (error) {
    // console.log(error);
    return new NextResponse(error);
  }
}
