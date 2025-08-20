import { RefObject, useEffect } from "react";

interface AutosizeOptions {
  minHeight?: number; // px
  maxHeight?: number; // px cap for growth
  shrinkOnEmpty?: boolean; // force reset when value cleared
}

export function useAutosizeTextArea(
  ref: RefObject<HTMLTextAreaElement>,
  value: string,
  defaultHeight: string = "auto",
  options: AutosizeOptions = {}
) {
  const { minHeight, maxHeight, shrinkOnEmpty = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reset to auto first to measure natural scrollHeight
    el.style.height = "auto";

    if (!value && shrinkOnEmpty) {
      el.style.height = defaultHeight;
      return;
    }

    let newHeight = el.scrollHeight;
    if (typeof minHeight === "number")
      newHeight = Math.max(newHeight, minHeight);
    if (typeof maxHeight === "number")
      newHeight = Math.min(newHeight, maxHeight);

    el.style.height = newHeight + "px";
  }, [ref, value, defaultHeight, minHeight, maxHeight, shrinkOnEmpty]);
}
