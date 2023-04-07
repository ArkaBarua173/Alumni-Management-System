import { parseISO, format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/router";

export default function SingleEvent({ datum }) {
  const { id, banner, title, date } = datum;
  const formattedDate = format(
    parseISO(date, new Date()),
    "do LLL, yyyy hh:mm aaa"
  );
  const { push } = useRouter();
  console.log(formattedDate);
  return (
    <div
      className="my-10 sm:mx-auto sm:w-full sm:max-w-4xl rounded-md"
      key={id}
    >
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure className="relative lg:w-96 sm:max-w-full sm:w-full">
          <Image
            fill
            src={`/images/${banner}`}
            alt="Album"
            className="object-left-top"
          />
        </figure>
        <div className="card-body bg-base-300">
          <h2 className="card-title">{title}</h2>
          <p>
            <strong>Date: </strong>
            {formattedDate}
          </p>
          <div className="card-actions">
            <button
              className="btn btn-primary"
              onClick={() => push(`/events/${id}`)}
            >
              Expand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
