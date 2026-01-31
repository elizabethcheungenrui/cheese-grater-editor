import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import formidable from "formidable";
import fs from "fs";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  api: {
    bodyParser: false, // REQUIRED for multipart
  },
};

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const form = formidable({
    maxFileSize: 10 * 1024 * 1024, // 10MB hard limit
  });

  let fields, files;
  try {
    [fields, files] = await form.parse(req);
  } catch (err) {
    return res.status(400).json({ error: "Invalid upload" });
  }

  const file = files.file?.[0];
  const path = fields.path?.[0];

  if (!file || !path) {
    return res.status(400).json({ error: "Missing file or path" });
  }

  if (!path.startsWith("article_images/")) {
    return res.status(403).json({ error: "Invalid path" });
  }

  if (path.includes("..")) {
    return res.status(403).json({ error: "Invalid path" });
  }

  const inputBuffer = fs.readFileSync(file.filepath);

  // ---- HARD VALIDATION ----
  let image;
  try {
    image = sharp(inputBuffer);
    await image.metadata();
  } catch {
    return res.status(400).json({ error: "Invalid image file" });
  }

  // ---- OPTIMISE ----
  const optimised = image
    .rotate()
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 82 });

  const outputBuffer = await optimised.toBuffer();
  const metadata = await optimised.metadata();

  const key = path.replace(/\.\w+$/, ".webp");

  await S3.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: outputBuffer,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  const publicUrl = `${process.env.R2_PUBLIC_BASE_URL}/${key}`;

  res.status(200).json({
    url: publicUrl,
    width: metadata.width,
    height: metadata.height,
  });
}
