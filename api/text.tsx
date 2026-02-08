import { ImageResponse } from "@vercel/og";
import { TextSlide } from "../src/lib/og/TextSlide";

export const runtime = "edge";

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text");

  if (!text) {
    return new Response("Missing text", { status: 400 });
  }

  return new ImageResponse(
    <TextSlide text={text} />,
    {
      width: 1080,
      height: 1080,
    }
  );
}
