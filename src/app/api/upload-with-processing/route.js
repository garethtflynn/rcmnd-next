import { NextResponse } from "next/server";
import sharp from "sharp";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import getS3PresignedUrl from "@/utils/getS3PresignedUrl";

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the form data with the image
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert the file to a buffer
    const buffer = await file.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);

    // Get image info from Sharp
    const metadata = await sharp(imageBuffer).metadata();
    console.log(
      "Processing image:",
      metadata.format,
      metadata.width,
      "x",
      metadata.height
    );

    // Process with Sharp
    const processedBuffer = await sharp(imageBuffer)
      .resize({
        width: 1200, 
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 80,
        progressive: true,
      })
      .toBuffer();

    // Generate a unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const baseName =
      originalName.substring(0, originalName.lastIndexOf(".")) || originalName;
    const newFileName = `${baseName}-${timestamp}.jpg`;

    // UPDATED: Call getS3PresignedUrl directly instead of making an HTTP request
    try {
      console.log(`Getting presigned URL for ${newFileName}...`);
      const contentType = "image/jpeg";
      const presignedUrl = await getS3PresignedUrl(newFileName, contentType);
      console.log("Successfully generated presigned URL");

      // Upload the processed image to B2
      console.log("Uploading to B2...");
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: processedBuffer,
        headers: {
          "Content-Type": contentType,
          Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/jpeg,image/*,*/*;q=0.8",
        },
      });

      if (!uploadResponse.ok) {
        console.error(`Failed to upload to B2: ${uploadResponse.status}`);
        throw new Error(`Failed to upload to B2: ${uploadResponse.status}`);
      }

      console.log("Successfully uploaded to B2");

      // Return the uploaded file information
      const imageReferenceUrl = process.env.NEXT_PUBLIC_DATABASE_IMAGE_URL;
      return NextResponse.json({
        success: true,
        fileName: newFileName,
        url: `${imageReferenceUrl}/${newFileName}`,
        size: processedBuffer.length,
        type: contentType,
      });
    } catch (presignError) {
      console.error("Error getting presigned URL or uploading:", presignError);
      return NextResponse.json(
        { error: `Upload failed: ${presignError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Upload processing error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
