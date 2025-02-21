import Image, { ImageProps } from "next/image";

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
  return (
    <div className="image-hover-container">
      {/* Original Image */}
      <div
        className="custom-shaped-image image-original"
        style={{ "--image-url": `url(${src})` } as React.CSSProperties}
      >
        <Image
          src={src}
          alt="Custom Shaped Image"
          width={width}
          height={height}
          {...rest}
        />
      </div>

      {/* Hover Image */}
      <div
        className="custom-shaped-image image-hover"
        style={{ "--image-url": `url(${hoverSrc})` } as React.CSSProperties}
      >
        <Image
          src={hoverSrc}
          alt="Hover Image"
          width={width}
          height={height}
          {...rest}
        />
      </div>
    </div>
  );
};

export default CustomShapedImage;
