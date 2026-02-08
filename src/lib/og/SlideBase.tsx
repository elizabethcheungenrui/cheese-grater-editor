export function SlideBase({
  children,
  background = "#0b6b3a",
}: {
  children: React.ReactNode;
  background?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 64,
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}
