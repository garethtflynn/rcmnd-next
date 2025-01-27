import Debug from "debug";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const debug = Debug("b2-browser-upload:getS3PresignedUrl");

const client = new S3Client({
  endpoint: process.env.NEXT_PUBLIC_AWS_ENDPOINT_URL,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_B2_APPLICATION_KEY,
  },
});

async function getS3PresignedUrl(key) {
  if (!key) {
    console.error("No key provided!");
    return;
  }

  // console.log("Key is:", key);
  const putObjectParams = {
    Bucket: process.env.NEXT_PUBLIC_B2_BUCKET_NAME,
    Key: key,
    ACL: "public-read",
  };
  // console.log("putObjectParams:", putObjectParams);
  const putObjectCommand = new PutObjectCommand(putObjectParams);
  const presignedUrl = await getSignedUrl(client, putObjectCommand, {
    expiresIn: 3600,
  });
  // console.log("Presigned URL:", presignedUrl);
  debug("presignedUrl: %j", presignedUrl);

  return presignedUrl;
}

export default getS3PresignedUrl;
