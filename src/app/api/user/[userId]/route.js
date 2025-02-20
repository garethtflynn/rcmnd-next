import prisma from "@/libs/db";
import { NextResponse } from "next/server";

// get a specific user
// export async function GET(req, { params }) {
//   const { userId } = params; // Destructure userId from params

//   console.log("REQ QUERY:", userId); // Debugging log

//   try {
//     // Fetch a single user by their unique userId
//     const user = await prisma.user.findUnique({
//       where: {
//         id: userId,
//       },
//       include: {
//         posts: true,
//         lists: true,
//       },
//     });

//     if (!user) {
//       // Return a 404 if the user is not found
//       return new Response(JSON.stringify({ error: "User not found" }), {
//         status: 404,
//       });
//     }

//     // Return the user data
//     return new Response(JSON.stringify(user), { status: 200 });
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     return new Response(JSON.stringify({ error: "Failed to get user" }), {
//       status: 500,
//     });
//   }
// }

//get a specific user
export async function GET(req, { params }) {
  const { userId } = params; // Destructure userId from params

  console.log("REQ QUERY:", userId); // Debugging log

  try {
    // Fetch the user first to ensure they exist, and include posts and lists
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        posts: true, // Fetch all posts, we'll filter them later
        lists: true, // Fetch all lists, we'll filter them later
      },
    });

    if (!user) {
      // Return a 404 if the user is not found
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Assuming `req.userId` is the logged-in user's ID. You'll need to make sure this comes from an auth system.
    const isOwner = req.userId === userId;

    // Filter posts: Show public posts to anyone, private ones only to the owner
    const filteredPosts = user.posts.filter((post) =>
      post.isPrivate ? isOwner : true
    );

    // Filter lists: Show public lists to anyone, private ones only to the owner
    const filteredLists = user.lists.filter((list) =>
      list.isPrivate ? isOwner : true
    );

    // Return the user data, with only the allowed posts and lists
    return new Response(
      JSON.stringify({ ...user, posts: filteredPosts, lists: filteredLists }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error); // Log the error for debugging
    return new Response(JSON.stringify({ error: "Failed to get user" }), {
      status: 500,
    });
  }
}
