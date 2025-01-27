// import getB2UploadInfo from "@/utils/getB2UploadInfo";
import { NextResponse } from "next/server";
import getS3PresignedUrl from "@/utils/getS3PresignedUrl";

export async function GET(req, res) {
  // console.log("REQ LOG", req);
  const key = req.nextUrl.searchParams.get("key");

  // console.log("REQ KEY", key);
  try {
    if (!key) {
      return NextResponse.json({
        error: "Key is required in the query parameters",
      });
    }
    const presignedUrl = await getS3PresignedUrl(key);
    // console.log("PRESIGNED URL", presignedUrl);

    return NextResponse.json({
      presignedUrl,
    });
  } catch (error) {
    console.error("Error generating upload info:", error);
    return NextResponse.json({ error: "Failed to generate upload info" });
  }
}
