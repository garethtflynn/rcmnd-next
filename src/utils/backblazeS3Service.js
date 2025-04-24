// utils/backblazeS3Service.js
import Debug from "debug";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { 
  S3Client, 
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand 
} from "@aws-sdk/client-s3";

const debug = Debug("backblaze-s3-service");

class BackblazeS3Service {
  constructor() {
    this.client = new S3Client({
      endpoint: process.env.NEXT_PUBLIC_AWS_ENDPOINT_URL,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_B2_APPLICATION_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_B2_APPLICATION_KEY,
      },
    });
    this.bucketName = process.env.NEXT_PUBLIC_B2_BUCKET_NAME;
  }

  async getPresignedUrl(key) {
    if (!key) {
      console.error("No key provided!");
      return null;
    }

    debug("Creating presigned URL for key:", key);
    
    const putObjectParams = {
      Bucket: this.bucketName,
      Key: key,
      ACL: "public-read",
    };
    
    const putObjectCommand = new PutObjectCommand(putObjectParams);
    
    try {
      const presignedUrl = await getSignedUrl(this.client, putObjectCommand, {
        expiresIn: 3600,
      });
      
      debug("Generated presigned URL:", presignedUrl);
      return presignedUrl;
    } catch (error) {
      console.error("Error creating presigned URL:", error);
      return null;
    }
  }

  async deleteFile(key) {
    console.log(`Attempting to delete image with key: ${key} from backBlazeService deleteFile`);
    if (!key) {
      console.error("No key provided for deletion!");
      return false;
    }

    debug("Attempting to delete file with key:", key);

    try {
      // First check if the file exists
      try {
        const headParams = {
          Bucket: this.bucketName,
          Key: key
        };
        
        await this.client.send(new HeadObjectCommand(headParams));
      } catch (error) {
        // If the file doesn't exist, consider it already deleted
        if (error.name === 'NotFound') {
          console.warn(`File with key ${key} not found, considering it already deleted`);
          return true;
        }
        throw error;
      }
      
      // If we got here, the file exists, so delete it
      const deleteParams = {
        Bucket: this.bucketName,
        Key: key
      };
      
      await this.client.send(new DeleteObjectCommand(deleteParams));
      debug(`Successfully deleted file with key: ${key}`);
      return true;
    } catch (error) {
      console.error(`Error deleting file with key ${key}:`, error);
      return false;
    }
  }

  // Extract key from full Backblaze URL
  extractKeyFromUrl(backblazeUrl) {
    if (!backblazeUrl) return null;
    
    console.log("Trying to extract key from URL:", backblazeUrl);
    
    try {
      const url = new URL(backblazeUrl);
      
      // For URLs like: https://rcmndBucket.s3.us-east-005.backblazeb2.com/path/to/file.jpg
      if (url.hostname.includes('.backblazeb2.com')) {
        // Just take everything after the hostname as the key
        const key = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
        console.log("Extracted key:", key);
        return key;
      }
      
      // Additional parsing for other URL formats if needed
      return null;
    } catch (error) {
      console.error('Error extracting key from URL:', error);
      return null;
    }
  }
}

const backblazeS3Service = new BackblazeS3Service();
export default backblazeS3Service;