"use client";

import Image from "next/image";

interface PreviewImageProps {
  src: string | null;
  alt?: string;
  className?: string;
}

export default function PreviewImage({ src, alt = "Preview", className = "" }: PreviewImageProps) {
  if (!src) return null;

  return (
    <div className={`relative ${className}`} style={{ width: 128, height: 128 }}>
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: "cover" }}
        className="rounded-lg border"
      />
    </div>
  );
}
