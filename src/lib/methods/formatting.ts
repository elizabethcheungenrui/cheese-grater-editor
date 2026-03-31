import type { RefObject } from "react";
import { useLayoutEffect } from "react";

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

export function fitTextToContainer(el: HTMLElement, minPx: number, maxPx: number) {
  const box = el.parentElement as HTMLElement | null;
  if (!box) return;
  
  let low = minPx;
  let high = maxPx;

  const precision = 0.1;

  while (high - low >= precision) {
    const mid = (low + high) / 2;
    el.style.fontSize = `${mid}px`;

    if (el.scrollHeight > box.clientHeight) {
      high = mid;
    } else {
      low = mid;
    }
  }

  el.style.fontSize = `${low.toFixed(1)}px`;
}

export function useFitText(
  ref: RefObject<HTMLElement | null>,
  minPx: number,
  maxPx: number,
  deps: unknown[],
) {
  useLayoutEffect(() => {
    if (!ref.current) return;
    fitTextToContainer(ref.current, minPx, maxPx);
  }, deps);
}

export function fitTextToWidth(
  el: HTMLElement,
  minPx: number,
  maxPx: number,
) {
  const box = el.parentElement as HTMLElement | null;
  if (!box) return;

  let low = minPx;
  let high = maxPx;

  const precision = 0.1;

  while (high - low >= precision) {
    const mid = (low + high) / 2;
    el.style.fontSize = `${mid}px`;

    if (el.scrollWidth > box.clientWidth) {
      high = mid;
    } else {
      low = mid;
    }
  }

  el.style.fontSize = `${low.toFixed(1)}px`;
}

export function useFitTextWidth(
  ref: RefObject<HTMLElement | null>,
  minPx: number,
  maxPx: number,
  deps: unknown[],
) {
  useLayoutEffect(() => {
    if (!ref.current) return;
    fitTextToWidth(ref.current, minPx, maxPx);
  }, deps);
}
