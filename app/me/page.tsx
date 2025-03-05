import CustomShapedHoverImage from "../custom-shaped-hover-image";
import Header from "../header";
const images = [
  {
    id: 1,
    src: "/durama.png",
    hoverSrc: "/durama-hover.png",
    alt: "durama",
    width: 350,
    height: 400,
  },
  {
    id: 2,
    src: "/instax.png",
    hoverSrc: "/instax-hover.png",
    alt: "instax",
    width: 550,
    height: 350,
  },
  {
    id: 3,
    src: "/lighter.png",
    hoverSrc: "/lighter-hover.png",
    alt: "lighter",
    width: 175,
    height: 450,
  },
  {
    id: 4,
    src: "/miffy-figure.png",
    hoverSrc: "/miffy-figure-hover.png",
    alt: "miffy figure",
    width: 300,
    height: 350,
  },
  {
    id: 5,
    src: "/miffy.png",
    hoverSrc: "/miffy-hover.png",
    alt: "miffy sticky!",
    width: 400,
    height: 500,
  },
  // Add more images as needed
];

const Gallery = () => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "24px",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {images.map((img) => (
        <CustomShapedHoverImage
          key={img.id}
          src={img.src}
          hoverSrc={img.hoverSrc}
          alt={img.alt}
          width={img.width}
          height={img.height}
        />
      ))}
    </div>
  );
};

export default function AboutMe() {
  return (
    <div>
      <Header />
      <Gallery />
    </div>
  );
}
