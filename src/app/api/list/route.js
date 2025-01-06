import prisma from "@/libs/db";
import { NextResponse } from "next/server";


//get all lists
export async function GET (req, res) {
    try {
      const lists = await prisma.list.findMany();
      return new NextResponse(JSON.stringify(lists), { status: 200 });
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500 }
      );
    }
  }

  // create a new list
  export async function POST(req, res) {
    try {
      const { title, userId } = await req.json(); // Destructure formData from the request body
      console.log("REQ.BODY", req.body);
      // if (!title) {
      //   return NextResponse.json({ error: "Please fill out form" });
      // }

      // Create a new post in the database
      const list = await prisma.list.create({
        data: {
          title: title,
          userId: userId,
        },
      });

      return NextResponse.json(list);
      // res.status(200).json(post); // Respond with the created post
    } catch (error) {
      console.error("POST", error);
      return new NextResponse(error);
      // return res.status(500).json({ error: "Internal Server Error" }); // Handle errors
    }
  }
