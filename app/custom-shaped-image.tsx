"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

type VisibleRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CustomShapedImageProps = ImageProps & {
  hoverSrc: string; // Image to show on hover
  alt: string; // Alternative text for the image
};

const CustomShapedImage: React.FC<CustomShapedImageProps> = ({
  src,
  hoverSrc,
  width, // desired width (optional)
  height, // desired height (optional)
  ...rest
}) => {
  // Refs for the underlying image and a hidden canvas (used both for cropping and hit testing)
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State for hover effect, visible crop rectangle and natural image dimensions
  const [isHovered, setIsHovered] = useState(false);
  const [visibleRect, setVisibleRect] = useState<VisibleRect | null>(null);
  const [imgDimensions, setImgDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // When the image loads, draw it on the hidden canvas and compute the crop region (visibleRect)
  useEffect(() => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleLoad = () => {
      // Set canvas size to the image’s natural dimensions
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      ctx.drawImage(img, 0, 0);

      try {
        // Get full image pixel data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let minX = canvas.width;
        let minY = canvas.height;
        let maxX = 0;
        let maxY = 0;
        // Iterate through each pixel; consider any pixel with alpha > 0 as “visible”
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            const alpha = imageData.data[index + 3];
            if (alpha > 0) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
        // If no visible pixels found, fallback to the full image.
        if (maxX < minX || maxY < minY) {
          setVisibleRect({
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
          });
        } else {
          // Add 1 so the rectangle fully covers the visible pixels.
          setVisibleRect({
            x: minX,
            y: minY,
            width: maxX - minX + 1,
            height: maxY - minY + 1,
          });
        }
      } catch (error) {
        // On error (for example due to CORS), use the full image.
        setVisibleRect({
          x: 0,
          y: 0,
          width: canvas.width,
          height: canvas.height,
        });
      }
    };

    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener("load", handleLoad);
      return () => img.removeEventListener("load", handleLoad);
    }
  }, [src]);

  // Determine final container dimensions based on the visibleRect and the provided width/height.
  // The container’s aspect ratio will match that of the visible part.
  let finalWidth = width || 300;
  let finalHeight = height || 300;
  let scale = 1;
  if (visibleRect && imgDimensions) {
    const visibleAspect = visibleRect.width / visibleRect.height;
    if (width && !height) {
      finalWidth = width;
      finalHeight = Math.round(width / visibleAspect);
    } else if (!width && height) {
      finalHeight = height;
      finalWidth = Math.round(height * visibleAspect);
    } else if (width && height) {
      // If both dimensions are provided, fit the visibleRect within those dimensions while preserving aspect ratio.
      const desiredAspect = width / height;
      if (visibleAspect > desiredAspect) {
        finalWidth = width;
        finalHeight = Math.round(width / visibleAspect);
      } else {
        finalHeight = height;
        finalWidth = Math.round(height * visibleAspect);
      }
    } else {
      // No dimensions provided: use the visible rectangle’s size.
      finalWidth = visibleRect.width;
      finalHeight = visibleRect.height;
    }
    // Determine how many display pixels per original image pixel.
    scale = finalWidth / visibleRect.width;
  }

  // The style for the inner image (both original and hover) is set so that we only display the visibleRect portion.
  const imageStyle =
    visibleRect && imgDimensions
      ? {
          position: "absolute" as const,
          // Offset the image so that the visibleRect aligns with the container's (0,0)
          left: `-${visibleRect.x * scale}px`,
          top: `-${visibleRect.y * scale}px`,
          // Scale the entire image so that the visibleRect is scaled to finalWidth/finalHeight.
          width: `${imgDimensions.width * scale}px`,
          height: `${imgDimensions.height * scale}px`,
        }
      : {};

  // Updated hit testing: when the mouse moves over the container,
  // translate the container coordinates back to the original image coordinates (taking cropping into account)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !visibleRect || !imgDimensions) return;
    const containerRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;
    // Translate to original image coordinate space
    const originalX = x / scale + visibleRect.x;
    const originalY = y / scale + visibleRect.y;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const pixelData = ctx.getImageData(
        Math.floor(originalX),
        Math.floor(originalY),
        1,
        1,
      ).data;
      // Use the same hover threshold (95% opaque) as before.
      const threshold = 242;
      setIsHovered(pixelData[3] >= threshold);
    } catch (error) {
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
      style={{
        width: finalWidth,
        height: finalHeight,
        position: "relative",
        display: "inline-block",
        overflow: "hidden",
      }}
    >
      {/* This first div holds the original image for display and hit testing */}
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
          ref={imageRef as any}
          src={src}
          alt="Custom Shaped Image"
          // The natural dimensions are used (if available); our CSS scales it.
          width={imgDimensions ? imgDimensions.width : finalWidth}
          height={imgDimensions ? imgDimensions.height : finalHeight}
          style={imageStyle}
          {...rest}
        />
      </div>

      {/* The hover image (displayed on top when hover is detected) */}
      {isHovered && (
        <div
          className="custom-shaped-image image-hover"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <Image
            src={hoverSrc}
            alt="Hover Image"
            width={imgDimensions ? imgDimensions.width : finalWidth}
            height={imgDimensions ? imgDimensions.height : finalHeight}
            style={imageStyle}
            {...rest}
          />
        </div>
      )}
      {/* Hidden canvas used for per-pixel hit testing and crop computation */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CustomShapedImage;
