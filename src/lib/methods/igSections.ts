const themes = {
  news: {
    label: "News & Investigations",
    color: "#2c59ac",
  },
  humour: {
    label: "Humour & Satire",
    color: "#007036",
  },
  voices: {
    label: "Voices & Reviews",
    color: "#c52973",
  },
} as const;

export function getIGSectionTheme(section: string) {
  const key = section.trim().toLowerCase();

  return (
    themes[key as keyof typeof themes] ?? {
      label: section || "Other",
      color: "#666666",
    }
  );
}
