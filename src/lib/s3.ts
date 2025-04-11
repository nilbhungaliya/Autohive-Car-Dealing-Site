import { env } from "@/env";
// import { Credentials } from "aws-sdk/lib/core";
import {
  PutObjectCommand,
  S3Client,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";

// const credentials = new Credentials({
//   accessKeyId: env.S3_BUCKET_ACCESS_KEY,
//   secretAccessKey: env.S3_BUCKET_SECRET_KEY,
// });

export const s3 = new S3Client({
  region: env.NEXT_PUBLIC_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: env.S3_BUCKET_ACCESS_KEY,
    secretAccessKey: env.S3_BUCKET_SECRET_KEY,
  },
});

interface UploadToS3Args {
  bucketName: string;
  path: string;
  file: Buffer;
  mimetype: string;
}

export async function uploadToS3({
  bucketName,
  file,
  path,
  mimetype,
}: UploadToS3Args) {
  const params = {
    Bucket: bucketName,
    Key: path,
    Body: file,
    ContentType: mimetype,
    CacheControl: "no-store",
  } satisfies PutObjectCommandInput;
  try {
    const command = new PutObjectCommand(params);
    return s3.send(command);
  } catch (error: unknown) {
    console.log(error);
    throw new Error(`Failed to upload file: ${path}. Error: ${error}`);
  }
}
