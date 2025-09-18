import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'; 
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const client = new S3Client({
    credentials: {
        accessKeyId: process.env.EB_AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.EB_AWS_SECRET_ACCESS_KEY as string,
    },
    
    region: (process.env.EB_AWS_REGION || 'us-east-1') as string,
})


export async function GET(request: NextRequest) {

    const key = request.nextUrl.searchParams.get('key');

    if(!key) throw new Error('Key is Required buddy');

    const command = new PutObjectCommand({
        Bucket: (process.env.EB_S3_BUCKET || process.env.AWS_S3_BUCKET || process.env.S3_BUCKET_NAME) as string,
        Key: key,
    });

    const url = await getSignedUrl(client, command,  { expiresIn: 3600 });

    return NextResponse.json({ url });

}
