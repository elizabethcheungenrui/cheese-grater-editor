import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import formidable from "formidable";
import fs from "fs";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  api: {
    bodyParser: false,
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const form = formidable({
    maxFileSize: 80 * 1024 * 1024,
  });

  let fields, files;
  try {
    [fields, files] = await form.parse(req);
  } catch {
    return res.status(400).json({ error: "Invalid upload" });
  }

  const slug = fields.slug?.[0];
  const pdf = files.pdf?.[0];
  const cover = files.cover?.[0];

  if (!slug || !pdf || !cover) {
    return res.status(400).json({ error: "Missing pdf or cover" });
  }

  if (pdf.mimetype !== "application/pdf") {
    return res.status(400).json({ error: "PDF must be application/pdf" });
  }

  if (!cover.mimetype?.startsWith("image/")) {
    return res.status(400).json({ error: "Cover must be an image" });
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return res.status(403).json({ error: "Invalid slug" });
  }

  const pdfBuffer = fs.readFileSync(pdf.filepath);
  const coverBuffer = fs.readFileSync(cover.filepath);

  const pdfKey = `${slug}.pdf`;
  const pngKey = `${slug}.png`;

  try {
    // 1. upload PDF
    await S3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_PRINT_BUCKET_NAME!,
        Key: pdfKey,
        Body: pdfBuffer,
        ContentType: "application/pdf",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    // 3. upload PNG
    await S3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_PRINT_BUCKET_NAME!,
        Key: pngKey,
        Body: coverBuffer,
        ContentType: cover.mimetype,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to process print PDF" });
  }

  const base = process.env.R2_PUBLIC_PRINT_BASE_URL!;

  res.status(200).json({
    pdf: `${base}/${pdfKey}`,
    cover: `${base}/${pngKey}`,
  });
}
