import { NextRequest, NextResponse } from "next/server";
import { createCipheriv } from "crypto";

const AES_KEY = Buffer.from([
  0x2B, 0x7E, 0x15, 0x16, 0x28, 0xAE, 0xD2, 0xA6,
  0xAB, 0xF7, 0x15, 0x88, 0x09, 0xCF, 0x4F, 0x3C,
  0x76, 0x2E, 0x71, 0x60, 0xF3, 0x8B, 0x4D, 0xA5,
  0x6A, 0x78, 0x4D, 0x90, 0x45, 0x19, 0x0C, 0xFE
]);

const AES_IV = Buffer.from([
  0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
  0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F
]);

function pkcs7Pad(data: Buffer, blockSize: number = 16): Buffer {
  const padding = blockSize - (data.length % blockSize);
  const paddingBuffer = Buffer.alloc(padding, padding);
  return Buffer.concat([data, paddingBuffer]);
}

function encryptBuffer(data: Buffer): Buffer {
  const paddedData = pkcs7Pad(data);
  const cipher = createCipheriv("aes-256-cbc", AES_KEY, AES_IV);
  cipher.setAutoPadding(false);

  const encrypted = Buffer.concat([
    cipher.update(paddedData),
    cipher.final()
  ]);

  return encrypted;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    const encryptedFiles = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const encrypted = encryptBuffer(buffer);

        const wggFileName = file.name.replace(/\.lua$/i, "") + ".wgg";

        return {
          name: wggFileName,
          data: encrypted.toString("base64"),
          size: encrypted.length,
        };
      })
    );

    return NextResponse.json({ files: encryptedFiles });
  } catch (error) {
    console.error("Encryption error:", error);
    return NextResponse.json(
      { error: "Encryption failed" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
