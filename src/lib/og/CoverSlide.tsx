export function CoverSlide({
  title,
  category,
  image,
}: {
  title: string;
  category: string;
  image: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        color: "white",
      }}
    >
      <div style={{ fontSize: 28 }}>{category}</div>
      <div style={{ fontSize: 56, fontWeight: 700 }}>{title}</div>
    </div>
  );
}
