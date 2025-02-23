import CustomShapedHoverImage from "./custom-shaped-hover-image";
import Header from "./header";

function Gallery() {
  // Define an array of image data. Add more image objects as needed.
  const images = [
    {
      src: "/suki.png",
      hoverSrc: "/suki-hover.png",
      alt: "suki's cunty car",
      width: 500,
      height: 300,
    },
    {
      src: "/pages.png",
      hoverSrc: "/pages-hover.png",
      alt: "pages book mark",
      width: 500,
      height: 300,
    },
    {
      src: "/warhammer.png",
      hoverSrc: "/warhammer-hover.png",
      alt: "warhammer receipt",
      width: 500,
      height: 300,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {images.map((img, index) => (
        <CustomShapedHoverImage
          key={index}
          src={img.src}
          hoverSrc={img.hoverSrc}
          alt={img.alt}
          width={img.width}
          height={img.height}
        />
      ))}
    </div>
  );
}

export default function Home() {
  return <Header />;
}
