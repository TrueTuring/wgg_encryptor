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

export async function encryptFiles(files: File[]): Promise<Array<{ name: string; blob: Blob; size: number }>> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch("/api/encrypt", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Encryption failed");
  }

  const data = await response.json();

  return data.files.map((file: { name: string; data: string; size: number }) => {
    const binaryString = atob(file.data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "application/octet-stream" });

    return {
      name: file.name,
      blob,
      size: file.size,
    };
  });
}
