import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
    region: process.env.MY_AWS_REGION as string,
});

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  const disposition = request.nextUrl.searchParams.get("disposition") || undefined; // inline | attachment
  const filenameParam = request.nextUrl.searchParams.get("filename") || undefined;

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  const filenameFromKey = key.split('/').pop() || 'download';
  const filename = filenameParam || filenameFromKey;

  const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME as string,
    Key: key,
    // When provided, these override the response headers on the presigned URL
    ResponseContentDisposition: disposition ? `${disposition}; filename="${filename}"` : undefined,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 3600 });

  return NextResponse.json({ url });
}
