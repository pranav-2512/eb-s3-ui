const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export type FileType = {
  Key: string;
  FullKey: string;
  Size: number;
  LastModified: string;
};

export type ListResponse = {
  files: FileType[];
  folders: string[];
};

export async function listObjects(prefix: string = ""): Promise<ListResponse> {
  const url = prefix
    ? `${apiUrl}/api/objects?prefix=${encodeURIComponent(prefix)}`
    : `${apiUrl}/api/objects`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to list objects");
  return res.json();
}

export async function createFolder(key: string): Promise<void> {
  const res = await fetch(`${apiUrl}/api/create-folder?key=${encodeURIComponent(key)}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to create folder");
}

export async function deleteFolder(key: string): Promise<void> {
  const res = await fetch(`${apiUrl}/api/delete-folder?key=${encodeURIComponent(key)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete folder");
}

export async function getUploadUrl(key: string): Promise<string> {
  const res = await fetch(`${apiUrl}/api/upload?key=${encodeURIComponent(key)}`);
  if (!res.ok) throw new Error("Failed to get upload URL");
  const { url } = await res.json();
  return url as string;
}

export async function getDownloadUrl(fullKey: string, filename: string): Promise<string> {
  const res = await fetch(
    `${apiUrl}/api/download?key=${encodeURIComponent(fullKey)}&disposition=attachment&filename=${encodeURIComponent(filename)}`
  );
  if (!res.ok) throw new Error("Failed to get download URL");
  const { url } = await res.json();
  return url as string;
}

export async function deleteObject(fullKey: string): Promise<void> {
  const res = await fetch(`${apiUrl}/api/delete?key=${encodeURIComponent(fullKey)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete object");
}


