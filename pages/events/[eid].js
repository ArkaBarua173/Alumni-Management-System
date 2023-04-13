import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { sanitize } from "dompurify";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Events() {
  const { query } = useRouter();
  const { eid } = query;
  const getEvent = async () => {
    const response = await axios.get(`http://localhost:3000/api/events/${eid}`);
    return response.data.data;
  };
  const { isLoading, error, data } = useQuery({
    queryKey: ["eventData"],
    queryFn: getEvent,
  });

  if (error) return error;
  if (isLoading) return <Loading />;

  return (
    <>
      <Layout />
      {isLoading && <Loading />}
      <div className="my-10 sm:mx-auto sm:w-full sm:max-w-6xl">
        <div className="card bg-base-100 shadow-xl rounded-md">
          <figure className="w-full h-80 object-cover relative">
            <Image
              fill
              src={`/images/${data?.banner}`}
              alt="event banner"
              className="object-cover"
            />
          </figure>
          <div className="card-body bg-base-300">
            <h2 className="text-4xl font-bold">{data?.title}</h2>
            <p className="text-xl">
              <strong>Date: </strong>
              {data?.date &&
                format(
                  parseISO(data?.date, new Date()),
                  "do LLL, yyyy hh:mm aaa"
                )}
            </p>
            <div
              className="mt-8 no-tailwindcss-base"
              dangerouslySetInnerHTML={{ __html: sanitize(data?.description) }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
