import Image from "next/image";

//param: imageSrc, width?, height? if ya want
type CustomShapedImageProps = {
  imageSrc: string;
  width?: number;
  height?: number;
};

const CustomShapedImage: React.FC<CustomShapedImageProps> = ({
  imageSrc,
  width = 300,
  height = 300,
}) => {
  return (
    <div
      className="custom-image-container"
      style={{ "--image-url": `url(${imageSrc})` } as React.CSSProperties}
    >
      <Image
        src={imageSrc}
        alt="Custom Shaped Image"
        width={width}
        height={height}
        priority
        className="custom-shaped-image"
      />
    </div>
  );
};

export default CustomShapedImage;
