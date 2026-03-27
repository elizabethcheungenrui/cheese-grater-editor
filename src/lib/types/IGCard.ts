export type IGCoverDraft = {
  title: string;
  summary: string;
};

export type IGTextCard = {
  id: string;
  type: "text";
  content: string;
};

export type IGQuoteCard = {
  id: string;
  type: "quote";
  content: string;
  quoteAuthor: string;
};

export type IGCard = IGTextCard | IGQuoteCard;
