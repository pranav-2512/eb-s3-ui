import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.EB_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.EB_AWS_SECRET_ACCESS_KEY as string,
  },
  region: (process.env.EB_AWS_REGION || 'us-east-1') as string,
});

export async function DELETE(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: (process.env.EB_S3_BUCKET || process.env.AWS_S3_BUCKET || process.env.S3_BUCKET_NAME) as string,
      Key: key,
    });

    await client.send(command);

    return NextResponse.json({ message: "File deleted successfully", key });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
