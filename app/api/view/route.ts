import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.EB_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.EB_AWS_SECRET_ACCESS_KEY as string,
  },
  region: (process.env.EB_AWS_REGION || 'us-east-1') as string,
});

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: (process.env.EB_S3_BUCKET || process.env.AWS_S3_BUCKET || process.env.S3_BUCKET_NAME) as string,
      Key: key,
    });

    const response = await client.send(command);
    
    // Get the content type from S3 response or default to application/octet-stream
    const contentType = response.ContentType || 'application/octet-stream';
    
    // Convert the stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of response.Body as NodeJS.ReadableStream) {
      const buf = Buffer.isBuffer(chunk)
        ? chunk
        : Buffer.from((chunk as unknown) as Uint8Array | string);
      chunks.push(buf);
    }
    const buffer = Buffer.concat(chunks);

    // Return the file content with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${key.split('/').pop()}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 });
  }
}
