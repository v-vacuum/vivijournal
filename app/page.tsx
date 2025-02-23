import CustomShapedHoverImage from "./custom-shaped-hover-image";

export default function Home() {
  return (
    <CustomShapedHoverImage src="/pages.png" hoverSrc="/pages-hover.png" alt="Memory Box" width={1000} height={1000} />
  );
}
