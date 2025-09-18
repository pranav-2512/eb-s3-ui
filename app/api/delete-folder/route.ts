import { NextRequest, NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";

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
    // List all objects with the folder prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: (process.env.EB_S3_BUCKET || process.env.AWS_S3_BUCKET || process.env.S3_BUCKET_NAME) as string,
      Prefix: key,
    });

    const listResult = await client.send(listCommand);
    const objectsToDelete = listResult.Contents || [];

    if (objectsToDelete.length === 0) {
      return NextResponse.json({ message: "Folder is already empty", key });
    }

    // Delete all objects in the folder
    const deletePromises = objectsToDelete.map(obj => {
      if (obj.Key) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: (process.env.EB_S3_BUCKET || process.env.AWS_S3_BUCKET || process.env.S3_BUCKET_NAME) as string,
          Key: obj.Key,
        });
        return client.send(deleteCommand);
      }
    });

    await Promise.all(deletePromises);

    return NextResponse.json({ 
      message: "Folder and all contents deleted successfully", 
      key,
      deletedCount: objectsToDelete.length 
    });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 });
  }
}
