import CustomShapedImage from "./custom-shaped-image";

export default function Home() {
  return (
    <CustomShapedImage
      src="/memory-box.png"
      hoverSrc="/memory-box-hover.png"
      alt="Memory Box"
      width={1000}
      height={200}
    />
  );
}
