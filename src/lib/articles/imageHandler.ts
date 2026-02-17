export async function uploadImage(
  file: File,
  path: string,
): Promise<{ url: string; width: number; height: number }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("path", path);

  const res = await fetch("/api/uploadImage", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  return res.json();
}

export async function processContentImages(
  html: string,
  slug: string,
): Promise<string> {
  const doc = new DOMParser().parseFromString(html, "text/html");

  const images = Array.from(doc.querySelectorAll("img"));

  let index = 1;

  for (const img of images) {
    const src = img.getAttribute("src");
    if (!src || !(src.startsWith("blob:") || src.startsWith("data:"))) continue;

    const response = await fetch(src);
    const blob = await response.blob();
    const ext = blob.type.split("/")[1] ?? "bin";
    const file = new File([blob], `image_${index}.${ext}`, {
      type: blob.type,
    });

    const path = `article_images/${slug}/image_${index}.webp`;
    const { url } = await uploadImage(file, path);
    img.setAttribute("src", url);
    index++;
  }

  return doc.body.innerHTML;
}

export async function blobUrlToFile(blobUrl: string, name: string) {
  const blob = await fetch(blobUrl).then((r) => r.blob());
  return new File([blob], name, { type: blob.type });
}
