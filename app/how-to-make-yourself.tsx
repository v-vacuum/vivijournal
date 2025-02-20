import Image from "next/image";

export default function HowToMakeItYourself() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="mb-8">How to Make it Yourself</h1>
      <Image
        src="/title-vivijournal.png" // Replace with your own image
        alt="Memory Box!"
        width={200}
        height={200}
      />
    </div>
  );
}
