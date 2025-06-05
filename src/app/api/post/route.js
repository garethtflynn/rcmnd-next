import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from "@/libs/db";


export async function POST(request) {
  try {
    const body = await request.json();
    const { title, link, image, description, listId } = body;
    
    // Validate required fields
    if (!title || !link || !listId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // First try to get user from session (for web app)
    const session = await getServerSession(authOptions);
    let userId = session?.user?.id;
    
    // If no session, check for API token (for Chrome extension)
    if (!userId) {
      const authHeader = request.headers.get('Authorization');
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        // Find token in database
        const apiToken = await prisma.apiToken.findUnique({
          where: { token },
          include: { user: true }
        });
        
        // Check if token exists and is not expired
        if (apiToken && apiToken.expiresAt >= new Date()) {
          userId = apiToken.user.id;
        }
      }
    }
    
    // If no valid session or token found
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify that the list belongs to the user
    const list = await prisma.list.findUnique({
      where: {
        id: listId,
        userId: userId
      }
    });
    
    if (!list) {
      return NextResponse.json({ error: 'List not found or unauthorized' }, { status: 404 });
    }
    
    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        link,
        image,
        description,
        list: { connect: { id: listId } },
        user: { connect: { id: userId } }
      }
    });
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

// import prisma from "@/libs/db";
// // import { auth } from "@/auth";
// import { NextResponse } from "next/server";
// import { getSession } from "next-auth/react";
// // import { getServerSession } from 'next-auth';
// // import { getToken } from "next-auth/jwt";
// // import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// // create a post
// export async function POST(req, res) {
//   try {
//     const { title, link, description, image, userId, listId, isPrivate } = await req.json(); // Destructure formData from the request body
//     console.log("REQ.BODY", req.body);
//     // if (!title || !link || !image) {
//     //   return NextResponse.json({ error: "Please fill out form" });
//     // }
//     // Create a new post in the database
//     const post = await prisma.post.create({
//       data: {
//         title: title,
//         link: link,
//         description: description,
//         image: image,
//         user: { connect: { id: userId } },
//         list: { connect: { id: listId } },
//         isPrivate: isPrivate
//       },
//     });

//     console.log('POST in post route handler', post);
//     return NextResponse.json(post);
//   } catch (error) {
//     console.error("POST", error);
//     return new NextResponse(error);
//   }
// }
