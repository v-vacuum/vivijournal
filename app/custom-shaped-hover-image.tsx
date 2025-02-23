"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface CustomShapedHoverImageProps {
  src: string;
  hoverSrc: string;
  alt: string;
  width: number;
  height: number;
}

function CustomShapedHoverImage({
  src,
  hoverSrc,
  alt,
  width,
  height,
}: CustomShapedHoverImageProps) {
  const [isHovering, setIsHovering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Load the base image into a canvas to check pixel transparency
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvasRef.current = canvas;
      }
    };
    img.src = src;
  }, [src]);

  // Handle mouse movement to detect hover over non-transparent areas
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !containerRef.current) return;

    // Use offsetX and offsetY for accurate coordinates relative to the container
    const { offsetX, offsetY } = e.nativeEvent;
    const x = offsetX;
    const y = offsetY;

    // Get the natural dimensions of the canvas (image)
    const naturalWidth = canvasRef.current.width;
    const naturalHeight = canvasRef.current.height;

    // Scale the mouse coordinates to match the natural image size
    const pixelX = Math.floor((x / width) * naturalWidth);
    const pixelY = Math.floor((y / height) * naturalHeight);

    // Check if the pixel is within bounds and non-transparent
    if (
      pixelX >= 0 &&
      pixelX < naturalWidth &&
      pixelY >= 0 &&
      pixelY < naturalHeight
    ) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const pixelData = ctx.getImageData(pixelX, pixelY, 1, 1).data;
        const alpha = pixelData[3]; // Alpha value (0 = transparent, 255 = opaque)
        setIsHovering(alpha > 0);
      }
    } else {
      setIsHovering(false);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: `${width}px`,
        height: `${height}px`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base Image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "fill", // Ensure the image fills the container exactly
          opacity: isHovering ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
      {/* Hover Image */}
      <Image
        src={hoverSrc}
        alt={alt}
        width={width}
        height={height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "fill", // Ensure the hover image fills the container exactly
          opacity: isHovering ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
    </div>
  );
}

export default CustomShapedHoverImage;
