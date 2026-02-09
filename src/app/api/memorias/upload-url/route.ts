import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET_NAME } from "@/lib/r2";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { filename, fileType } = await req.json();

    if (!filename || !fileType) {
      return NextResponse.json({ error: "Filename and fileType are required" }, { status: 400 });
    }

    if (!process.env.R2_ACCOUNT_ID) {
        // Mock mode se não tiver credenciais
        return NextResponse.json({ 
            uploadUrl: "https://mock-upload-url.com",
            key: `mock-${uuidv4()}-${filename}`,
            mock: true
        });
    }

    const uniqueKey = `${uuidv4()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });

    return NextResponse.json({ uploadUrl, key: uniqueKey });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Error generating signed URL:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
