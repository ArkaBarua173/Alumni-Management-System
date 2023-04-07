import Image from "next/image";
import Link from "next/link";

export default function Photo({ datum }) {
  return (
    <Link
      className="card w-80 h-80 text-primary-content relative"
      href={`/images/gallery/${datum.photo}`}
    >
      <span className="absolute top-[105%] left-1/2 -bottom-8 translate-x-[-50%] translate-y-[-50%] text-base-content font-semibold">
        {datum.title}
      </span>
      <Image
        alt={datum.title}
        fill
        src={`/images/gallery/${datum.photo}`}
        className="w-full h-full object-cover border border-black rounded-md"
      />
    </Link>
  );
}
