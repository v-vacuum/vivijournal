"use client";

import Image from "next/image";
import { useState } from "react";

type HoverImageProps = {
  src: string;
  hoverSrc: string;
  alt: string;
  aspectRatio?: string; // e.g. "16/9" or "4/3", default is "16/9"
};

const HoverImage: React.FC<HoverImageProps> = ({
  src,
  hoverSrc,
  alt,
  aspectRatio = "16/9",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate padding-bottom percentage from the aspect ratio
  const [w, h] = aspectRatio.split("/").map(Number);
  const paddingBottom = `${(h / w) * 100}%`;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom, // This sets the height based on the aspect ratio
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        style={{
          objectFit: "cover",
          transition: "opacity 0.3s ease-out",
          opacity: isHovered ? 0 : 1,
        }}
      />
      <Image
        src={hoverSrc}
        alt={alt}
        fill
        style={{
          objectFit: "cover",
          transition: "opacity 0.3s ease-out",
          opacity: isHovered ? 1 : 0,
        }}
      />
    </div>
  );
};

export default HoverImage;
