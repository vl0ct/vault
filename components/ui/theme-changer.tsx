"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export function ThemeChanger({ ...props }) {
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (
        e.key.toLowerCase() !== "d" ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        e.shiftKey ||
        (e.target as HTMLElement)?.closest("input, textarea, select")
      ) {
        return;
      }
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setTheme, resolvedTheme]);

  return (
    <Button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      size="icon-lg"
      variant="outline"
      className="border-dashed"
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <title>Toggle theme</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
        <path d="M12 3l0 18"></path>
        <path d="M12 9l4.65 -4.65"></path>
        <path d="M12 14.3l7.37 -7.37"></path>
        <path d="M12 19.6l8.85 -8.85"></path>
      </svg>
    </Button>
  );
}
