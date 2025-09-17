import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'; 
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string,
    },
    
    region: process.env.MY_AWS_REGION as string,
})


export async function GET(request: NextRequest) {

    const key = request.nextUrl.searchParams.get('key');

    if(!key) throw new Error('Key is Required buddy');

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME as string,
        Key: key,
    });

    const url = await getSignedUrl(client, command,  { expiresIn: 3600 });

    return NextResponse.json({ url });

}
