import type { Article } from "../../lib/types/Article";
import type { IGCard } from "../../lib/types/IGCard";
import IGText from "./IGText";
import IGQuote from "./IGQuote";

export default function IGCardRenderer({
  article,
  card,
}: {
  article: Article;
  card: IGCard;
}) {
  switch (card.type) {
    case "text":
      return <IGText section={article.section} content={card.content} />;

    case "quote":
      return (
        <IGQuote
          section={article.section}
          content={card.content}
          quoteAuthor={card.quoteAuthor}
        />
      );

    default:
      return null;
  }
}
