import prisma from "@/libs/db";
// import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";
// import { getServerSession } from 'next-auth';
// import { getToken } from "next-auth/jwt";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function GET(req) {
//   try {
//     const session = await getSession({ req });
//     console.log("Session log in route handler:", session);

//     if (session) {
//       const userId = session.user.id; // Access user ID from the token
//       console.log("USERID HERE", userId);
//       // Fetch posts based on userId
//       const posts = await prisma.post.findMany({
//         where: {
//           userId: userId, // Now using the obtained userId
//         },
//       });

//       return new NextResponse(JSON.stringify(posts), { status: 200 });
//     } else {
//       return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
//         status: 401,
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching posts:", error); // Log the error for debugging
//     return new NextResponse(
//       JSON.stringify({ error: "Internal Server Error" }),
//       { status: 500 }
//     );
//   }
// }

export async function POST(req, res) {
  try {
    const { title, link, description, image, userId } = await req.json(); // Destructure formData from the request body
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
        userId: userId,
      },
    });

    console.log('POST in post route handler', post);
    return NextResponse.json(post);
    // res.status(200).json(post); // Respond with the created post
  } catch (error) {
    console.error("POST", error);
    return new NextResponse(error);
    // return res.status(500).json({ error: "Internal Server Error" }); // Handle errors
  }
}
