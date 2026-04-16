"use client";

import Image from "next/image";
import type { ReactNode } from "react";

type CharacterPortraitProps = {
  src?: string;
  alt: string;
  className?: string;
  fallback?: ReactNode;
};

export default function CharacterPortrait({
  src,
  alt,
  className = "",
  fallback,
}: CharacterPortraitProps) {
  if (!src) {
    return <>{fallback ?? <span className="text-5xl">✨</span>}</>;
  }

  return (
    <div className={`relative h-full w-full ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 180px, 260px"
      />
    </div>
  );
}