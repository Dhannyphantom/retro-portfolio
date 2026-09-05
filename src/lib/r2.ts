import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

// Cloudflare R2 is S3-API-compatible, so the regular AWS SDK works against it
// — just point `endpoint` at your account's R2 endpoint instead of AWS.
function getClient() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) return null;

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export function isR2Configured() {
  return !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET_NAME && process.env.R2_PUBLIC_URL);
}

const MAX_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "video/mp4", "video/webm", "video/quicktime",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

export async function uploadToR2(file: File, folder = "uploads"): Promise<{ url: string } | { error: string }> {
  if (!isR2Configured()) {
    return { error: "File uploads aren't configured yet. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME and R2_PUBLIC_URL (see README)." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "That file is too large — the limit is 15MB." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Unsupported file type. Allowed: images, video, PDF, Word, PowerPoint." };
  }

  const client = getClient()!;
  const ext = file.name.split(".").pop() || "bin";
  const key = `${folder}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );

  const base = process.env.R2_PUBLIC_URL!.replace(/\/$/, "");
  return { url: `${base}/${key}` };
}
