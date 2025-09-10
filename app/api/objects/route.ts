import { NextRequest, NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'; 
import { fileURLToPath } from "url";
import { Folder } from "lucide-react";

// const accessKeyId = process.env.AWS_ACCESS_KEY;
// const secretAccessKey = process.env.AWS_SECRET_KEY;

// if (!accessKeyId || !secretAccessKey) {
//     throw new Error("AWS credentials are missing in environment variables.");
// }


const client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string,
    },
    region: process.env.AWS_REGION as string,
})


export async function GET(request: NextRequest) {

    const prefix = request.nextUrl.searchParams.get('prefix') ?? undefined;

    const command = new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET_NAME as string,
        Delimiter: '/',
        Prefix: prefix,
    });

    const result = await client.send(command);
    console.log(result);

    // const modifiedResponse = result.Contents?.map(e => ({
    //     Key: e.Key,
    //     Size: e.Size,
    //     LastModified: e.LastModified,
    // }));

    const rootFiles = (result.Contents?.map((e) => ({
        Key: prefix ? e.Key?.replace(prefix, "") : e.Key, // Remove prefix from Key
        FullKey: e.Key, // Keep the full key for download
        Size: e.Size,
        LastModified: e.LastModified,
    })) || []).filter(e => e.Key); // Filter out empty Key

    const rootFolders = result.CommonPrefixes?.map((e) => (e.Prefix)) || [];

    return NextResponse.json({
        files: rootFiles,
        folders: rootFolders,
    });
}