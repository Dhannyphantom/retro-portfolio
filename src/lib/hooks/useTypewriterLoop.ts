"use client";
import { useEffect, useState } from "react";

type Options = {
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
};

// Classic retro-terminal typewriter: types out each string in `texts`,
// holds it a moment, deletes it character by character, then moves on to
// the next entry — looping forever. Used for the hero headline, which can
// now be a list of titles cycled on repeat instead of a single static line.
export function useTypewriterLoop(texts: string[], options: Options = {}) {
  const { typeSpeed = 55, deleteSpeed = 28, pauseTime = 1600 } = options;
  const list = texts.length ? texts : [""];
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = list[index % list.length] ?? "";
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting) {
      if (display.length < current.length) {
        timeout = setTimeout(() => setDisplay(current.slice(0, display.length + 1)), typeSpeed);
      } else {
        timeout = setTimeout(() => setDeleting(true), pauseTime);
      }
    } else {
      if (display.length > 0) {
        timeout = setTimeout(() => setDisplay(current.slice(0, display.length - 1)), deleteSpeed);
      } else {
        setDeleting(false);
        setIndex((i) => (i + 1) % list.length);
      }
    }
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display, deleting, index, list.join("|")]);

  return display;
}
