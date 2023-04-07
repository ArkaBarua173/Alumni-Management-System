import { format, parseISO } from "date-fns";
import { sanitize } from "dompurify";
import Image from "next/image";
import Link from "next/link";

export default function ({ datum }) {
  return (
    <div className="flex xs:flex-col w-screen h-96 bg-base-300">
      <figure className="relative w-full h-full">
        <Image
          fill
          src={`/images/${datum?.banner}`}
          className="object-cover object-left-top"
        />
      </figure>
      <div className="p-12 overflow-scroll overflow-x-hidden scrollbar:!w-2 scrollbar:!h-2 scrollbar:bg-transparent scrollbar-track:!bg-base-300 scrollbar-thumb:!rounded scrollbar-thumb:!bg-neutral-300 scrollbar-track:!rounded">
        <h2 className="text-3xl font-bold">{datum?.title}</h2>
        <div
          className="mt-8 no-tailwindcss-base"
          dangerouslySetInnerHTML={{ __html: sanitize(datum?.description) }}
        ></div>
        <p className="mt-3 font-semibold">
          <strong>Date: </strong>
          {format(parseISO(datum?.date, new Date()), "do LLL, yyyy hh:mm aaa")}
        </p>
        <div className="mt-8">
          <Link href={`/events/${datum?.id}`} className="btn btn-outline">
            Expand
          </Link>
        </div>
      </div>
    </div>
  );
}
