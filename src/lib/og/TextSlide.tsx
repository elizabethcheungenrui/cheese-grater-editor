export function TextSlide({ text }: { text: string }) {
  return (
    <div
      style={{
        background: "#f7d046",
        padding: "72px",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "56px",
          fontSize: 44,
          lineHeight: 1.35,
          fontFamily: "Georgia, serif",
        }}
      >
        {text}
      </div>
    </div>
  );
}
