import prisma from "@/libs/db";
import { NextResponse } from "next/server";
import backblazeS3Service from "@/utils/backblazeS3Service";

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
export async function DELETE(req, { params }) {
  const { postId } = params;
  console.log("DELETE request received for postId:", postId);
  
  try {
    console.log("Fetching post from database...");
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    console.log("Post found:", post);

    if (!post) {
      console.log("Post not found!");
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    console.log("Checking for image to delete...");
    if (post.image) {
      console.log("Image URL found:", post.image);
      const key = backblazeS3Service.extractKeyFromUrl(post.image);
      console.log("Extracted key:", key);
      
      if (key) {
        console.log("Attempting to delete image with key:", key);
        try {
          await backblazeS3Service.deleteFile(key);
          console.log("Image deletion completed");
        } catch (deleteError) {
          console.error("Error during image deletion:", deleteError);
        }
      } else {
        console.log("No valid key extracted from image URL");
      }
    } else {
      console.log("No image found for this post");
    }

    console.log("Deleting post from database...");
    const deletedPost = await prisma.post.delete({
      where: { id: postId },
    });
    
    console.log("Post deleted successfully:", deletedPost);
    return NextResponse.json(deletedPost, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE function:", error);
    return NextResponse.json(
      { message: "Error deleting post", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  const { postId } = params;
  const { title, link, image, description, listId, isPrivate } =
    await req.json();

  try {
    // First fetch the current post to compare image URLs
    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!currentPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Check if the image is being updated
    if (image && currentPost.image && image !== currentPost.image) {
      // Delete the old image from Backblaze
      const oldKey = backblazeS3Service.extractKeyFromUrl(currentPost.image);
      if (oldKey) {
        await backblazeS3Service.deleteFile(oldKey);
        console.log(`Deleted old image with key ${oldKey} from Backblaze`);
      }
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        image,
        link,
        description,
        listId,
        isPrivate,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { message: "Error updating post", error: error.message },
      { status: 500 }
    );
  }
}
