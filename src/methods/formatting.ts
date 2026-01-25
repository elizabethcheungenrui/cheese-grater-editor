export function formatDate(isoString: string): string {
  const date = new Date(isoString);

  const day = date.getDate();
  const year = date.getFullYear();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = monthNames[date.getMonth()];

  return `${day} ${month} ${year}`;
}

export function truncateWords(text: string, max: number): string {
  if (!text) return "";

  if (text.length <= max) return text;

  const slice = text.slice(0, max);

  // Cut before last space if possible
  const lastSpace = slice.lastIndexOf(" ");
  const clean = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;

  return clean + "...";
}
