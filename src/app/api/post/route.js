import prisma from "@/libs/db";
// import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";
// import { getServerSession } from 'next-auth';
// import { getToken } from "next-auth/jwt";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// create a post
export async function POST(req, res) {
  try {
    const { title, link, description, image, userId, listId, isPrivate } = await req.json(); // Destructure formData from the request body
    console.log("REQ.BODY", req.body);
    // if (!title || !link || !image) {
    //   return NextResponse.json({ error: "Please fill out form" });
    // }
    // Create a new post in the database
    const post = await prisma.post.create({
      data: {
        title: title,
        link: link,
        description: description,
        image: image,
        user: { connect: { id: userId } },
        list: { connect: { id: listId } },
        isPrivate: isPrivate
      },
    });

    console.log('POST in post route handler', post);
    return NextResponse.json(post);
  } catch (error) {
    console.error("POST", error);
    return new NextResponse(error);
  }
}