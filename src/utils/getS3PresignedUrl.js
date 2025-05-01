// Update your getS3PresignedUrl.js file to accept contentType
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Configure your S3 client (using Backblaze B2 with S3 compatible API)
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  endpoint: process.env.NEXT_PUBLIC_AWS_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_B2_APPLICATION_KEY,
  },
});

// Update function to accept contentType parameter
export default async function getS3PresignedUrl(
  key,
  contentType = "application/octet-stream"
) {
  const bucketName = process.env.NEXT_PUBLIC_B2_BUCKET_NAME;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
    // Add cache control for better browser behavior
    CacheControl: "max-age=31536000", // Cache for 1 year
  });

  try {
    // Generate a presigned URL that includes the content type and cache control
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // URL valid for 1 hour
    });
    console.log('presignedURL:',presignedUrl)
    return presignedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
}

// import Debug from "debug";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// const debug = Debug("b2-browser-upload:getS3PresignedUrl");

// const client = new S3Client({
//   endpoint: process.env.NEXT_PUBLIC_AWS_ENDPOINT_URL,
//   region: process.env.NEXT_PUBLIC_AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.NEXT_PUBLIC_B2_APPLICATION_KEY_ID,
//     secretAccessKey: process.env.NEXT_PUBLIC_B2_APPLICATION_KEY,
//   },
// });

// async function getS3PresignedUrl(key) {
//   if (!key) {
//     console.error("No key provided!");
//     return;
//   }

//   // console.log("Key is:", key);
//   const putObjectParams = {
//     Bucket: process.env.NEXT_PUBLIC_B2_BUCKET_NAME,
//     Key: key,
//     ACL: "public-read",
//   };
//   // console.log("putObjectParams:", putObjectParams);
//   const putObjectCommand = new PutObjectCommand(putObjectParams);
//   const presignedUrl = await getSignedUrl(client, putObjectCommand, {
//     expiresIn: 3600,
//   });
//   // console.log("Presigned URL:", presignedUrl);
//   debug("presignedUrl: %j", presignedUrl);

//   return presignedUrl;
// }

// export default getS3PresignedUrl;
