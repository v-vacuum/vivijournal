import Image from "next/image";
import Link from "next/link";
import CustomShapedHoverImage from "./custom-shaped-hover-image";

function Header() {
  return (
    <nav>
      <div className="flex flex-col items-center min-h-screen py-4">
        <Link href={"/page.tsx"}>
          <CustomShapedHoverImage
            src="/memory-box.png"
            hoverSrc="/memory-box-hover.png"
            alt="Memory Box"
            width={500}
          />
        </Link>

        <ol className="text-sm flex items-center justify-center gap-4 font-[family-name:var(--font-geist-mono)">
          <li>
            <Link
              href={"/about-me.tsx"}
              className="transition-colors hover:underline hover:underline-offset-4"
            >
              me
            </Link>
          </li>
          <li>
            <Link
              href="/others.tsx"
              className="transition-colors hover:underline hover:underline-offset-4"
            >
              others
            </Link>
          </li>
          <li>
            <Link
              href="/how-to-make-yourself.tsx"
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

export default function Home() {
  return <Header />;
}
