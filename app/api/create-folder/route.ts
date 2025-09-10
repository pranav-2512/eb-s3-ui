import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
    region: process.env.MY_AWS_REGION as string,
});

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key || !key.endsWith("/")) {
      return NextResponse.json(
        { error: "Key is required and must end with '/'" },
        { status: 400 }
      );
    }

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME as string,
      Key: key,
      Body: "",
    });

    await client.send(command);

    return NextResponse.json({ message: "Folder created", key });
  } catch (err) {
    console.error("Error creating folder:", err);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}
