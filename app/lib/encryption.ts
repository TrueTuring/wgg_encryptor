const AES_KEY = new Uint8Array([
  0x2B, 0x7E, 0x15, 0x16, 0x28, 0xAE, 0xD2, 0xA6,
  0xAB, 0xF7, 0x15, 0x88, 0x09, 0xCF, 0x4F, 0x3C,
  0x76, 0x2E, 0x71, 0x60, 0xF3, 0x8B, 0x4D, 0xA5,
  0x6A, 0x78, 0x4D, 0x90, 0x45, 0x19, 0x0C, 0xFE
]);

const AES_IV = new Uint8Array([
  0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
  0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F
]);

function pkcs7Pad(data: Uint8Array, blockSize: number = 16): Uint8Array {
  const padding = blockSize - (data.length % blockSize);
  const padded = new Uint8Array(data.length + padding);
  padded.set(data);
  for (let i = data.length; i < padded.length; i++) {
    padded[i] = padding;
  }
  return padded;
}

export async function encryptLuaFile(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);

  const paddedData = pkcs7Pad(data);

  const key = await crypto.subtle.importKey(
    "raw",
    AES_KEY,
    { name: "AES-CBC", length: 256 },
    false,
    ["encrypt"]
  );

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv: AES_IV,
    },
    key,
    paddedData as BufferSource
  );

  return new Blob([encrypted], { type: "application/octet-stream" });
}

export function getWggFileName(luaFileName: string): string {
  return luaFileName.replace(/\.lua$/i, "") + ".wgg";
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
