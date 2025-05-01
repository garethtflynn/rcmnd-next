// Modified version of your /api/upload/route.js
import { NextResponse } from "next/server";
import getS3PresignedUrl from "@/utils/getS3PresignedUrl";

export async function GET(req, res) {
  const key = req.nextUrl.searchParams.get("key");
  const contentType = req.nextUrl.searchParams.get("contentType") || "application/octet-stream";

  try {
    if (!key) {
      return NextResponse.json({
        error: "Key is required in the query parameters",
      }, { status: 400 });
    }
    
    console.log(`Generating presigned URL for key: ${key}, contentType: ${contentType}`);
    
    try {
      const presignedUrl = await getS3PresignedUrl(key, contentType);
      console.log(`Successfully generated presigned URL for ${key}`);
      return NextResponse.json({ presignedUrl });
    } catch (presignError) {
      console.error("Error in getS3PresignedUrl:", presignError);
      return NextResponse.json({ 
        error: `Error generating presigned URL: ${presignError.message}` 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("General error in upload route:", error);
    return NextResponse.json({ 
      error: `Failed to generate upload info: ${error.message}` 
    }, { status: 500 });
  }
}

// import getB2UploadInfo from "@/utils/getB2UploadInfo";
// import { NextResponse } from "next/server";
// import getS3PresignedUrl from "@/utils/getS3PresignedUrl";
// import backblazeS3Service from "@/utils/backblazeS3Service";

// export async function GET(req, res) {
//   // console.log("REQ LOG", req);
//   const key = req.nextUrl.searchParams.get("key");

//   // console.log("REQ KEY", key);
//   try {
//     if (!key) {
//       return NextResponse.json({
//         error: "Key is required in the query parameters",
//       });
//     }
//     const presignedUrl = await getS3PresignedUrl(key);
//     // console.log("PRESIGNED URL", presignedUrl);

//     return NextResponse.json({
//       presignedUrl,
//     });
//   } catch (error) {
//     console.error("Error generating upload info:", error);
//     return NextResponse.json({ error: "Failed to generate upload info" });
//   }
// }
