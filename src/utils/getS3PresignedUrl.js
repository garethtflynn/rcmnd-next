import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// S3 client 
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  endpoint: process.env.NEXT_PUBLIC_AWS_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_B2_APPLICATION_KEY,
  },
});

// function to accept contentType parameter
export default async function getS3PresignedUrl(
  key,
  contentType = "application/octet-stream"
) {
  const bucketName = process.env.NEXT_PUBLIC_B2_BUCKET_NAME;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
    CacheControl: "max-age=31536000", 
  });

  try {
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    console.log('presignedURL:',presignedUrl)
    return presignedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
}


