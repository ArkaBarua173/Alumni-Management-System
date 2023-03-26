import { format, parseISO } from "date-fns";
import Link from "next/link";

export default function ({ datum }) {
  return (
    <div className="flex xs:flex-col">
      <img src={`/images/${datum?.banner}`} className="w-full h-96" />
      <div className="p-12">
        <h2 className="text-3xl font-bold">{datum?.title}</h2>
        <p className="line-clamp-4 mt-4 text-lg font-semibold">
          {datum?.description}
        </p>
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
