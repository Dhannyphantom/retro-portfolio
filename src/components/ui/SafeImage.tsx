"use client";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SafeImage({
  src,
  alt = "",
  className = "",
  iconSize = 26,
}: {
  src?: string;
  alt?: string;
  className?: string;
  iconSize?: number;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={cn("flex items-center justify-center bg-gradient-to-br from-ink2 to-purple-2/10", className)}>
        <ImageIcon size={iconSize} className="text-violet" strokeWidth={1.4} />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} loading="lazy" />;
}
