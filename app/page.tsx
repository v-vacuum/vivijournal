import Image from "next/image";
import Link from "next/link";
import CustomShapedHoverImage from "./custom-shaped-hover-image";
import HoverImage from "./hover-image";

function Header() {
  return (
    <nav>
      <div className="flex flex-col items-center min-h-screen py-4">
        {/* Link to the home page */}
        <Link href="/">
          <CustomShapedHoverImage
            src="/memory-box.png"
            hoverSrc="/memory-box-hover.png"
            alt="Memory Box"
            width={500}
            height={100}
          />
        </Link>

        <ol className="text-sm flex items-center justify-center gap-4 font-[family-name:var(--font-geist-mono)]">
          <li>
            <Link
              href="/about"
              className="transition-colors hover:underline hover:underline-offset-4"
            >
              me
            </Link>
          </li>
          <li>|</li>
          <li>
            <Link
              href="/others"
              className="transition-colors hover:underline hover:underline-offset-4"
            >
              others
            </Link>
          </li>
          <li>|</li>
          <li>
            <Link
              href="/how-to-make-yourself"
              className="transition-colors hover:underline hover:underline-offset-4"
            >
              how to make yourself
            </Link>
          </li>
        </ol>
      </div>
    </nav>
  );
}

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
  return (
    <div>
      <Header />
      <Gallery />
    </div>
  );
}
