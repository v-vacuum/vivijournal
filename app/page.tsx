import Image from "next/image";
import Link from "next/link";
import CustomShapedImage from "./custom-shaped-image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <CustomShapedImage
          src="/memory-box.png"
          hoverSrc="/memory-box-hover.png"
          alt="Memory Box"
          width={1000}
          height={200}
        />
        <nav className="mt-8">
          <ol className="text-sm flex items-center justify-center gap-4 font-[family-name:var(--font-geist-mono)">
            <li>
              <Link
                href="/about-me"
                className="transition-colors hover:underline hover:underline-offset-4"
              >
                me
              </Link>
            </li>
            <li>
              <Link
                href="/others"
                className="transition-colors hover:underline hover:underline-offset-4"
              >
                others
              </Link>
            </li>
            <li>
              <Link
                href="/how-to-make-it-yourself"
                className="transition-colors hover:underline hover:underline-offset-4"
              >
                how to make it yourself
              </Link>
            </li>
          </ol>
        </nav>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li>
            <Link
              href="/about-me"
              className="transition-colors hover:underline hover:underline-offset-4"
            >
              me
            </Link>
          </li>
          <li>
            <Link
              href="/others"
              className="transition-colors hover:underline hover:underline-offset-4"
            >
              others
            </Link>
          </li>
          <li>
            <Link
              href="/how-to-make-it-yourself"
              className="transition-colors hover:underline hover:underline-offset-4"
            >
              how to make it yourself
            </Link>
          </li>
        </ol>
      </main>
    </div>
  );
}
