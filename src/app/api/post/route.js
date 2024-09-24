import prisma from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    const posts = await prisma.post.findMany();
    return new NextResponse(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

export async function POST(req, res) {
  try {
    const { title, link, description, image } = await req.json(); // Destructure formData from the request body
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
      },
    });

    console.log(post);
    return NextResponse.json(post);
    // res.status(200).json(post); // Respond with the created post
  } catch (error) {
    console.error("POST", error);
    return new NextResponse(error);
    // return res.status(500).json({ error: "Internal Server Error" }); // Handle errors
  }
}
