"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

type CustomShapedImageProps = ImageProps & {
  hoverSrc: string; // Image to show on hover
  alt: string; // Alternative text for the image
};

const CustomShapedImage: React.FC<CustomShapedImageProps> = ({
  src,
  hoverSrc,
  width = 300,
  height = 300,
  ...rest
}) => {
  // Refs for the visible image and offscreen canvas for hit testing
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // When the image loads, draw it on the hidden canvas
  useEffect(() => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleLoad = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
    };

    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener("load", handleLoad);
      return () => img.removeEventListener("load", handleLoad);
    }
  }, [src]);

  // On mouse move, check the pixel data for transparency
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    const rect = img.getBoundingClientRect();
    // Calculate the mouse coordinates relative to the image
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      const alpha = pixelData[3];
      // Define a threshold for 95% opacity (95% of 255 ≈ 242)
      const threshold = 242;
      setIsHovered(alpha >= threshold);
    } catch (error) {
      // If getImageData fails (e.g. due to CORS issues) fallback to no hover
      setIsHovered(false);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="image-hover-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ width, height, position: "relative", display: "inline-block" }}
    >
      {/* Original image for hit testing */}
      <div
        className="custom-shaped-image image-original"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: isHovered ? 0 : 1,
        }}
      >
        <Image
          // Casting ref because Next.js Image might not forward it automatically.
          ref={imageRef as any}
          src={src}
          alt="Custom Shaped Image"
          width={width}
          height={height}
          {...rest}
        />
      </div>

      {/* Hover image appears on top when isHovered is true */}
      {isHovered && (
        <div
          className="custom-shaped-image image-hover"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <Image
            src={hoverSrc}
            alt="Hover Image"
            width={width}
            height={height}
            {...rest}
          />
        </div>
      )}
      {/* Hidden canvas for per-pixel hit detection */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CustomShapedImage;
