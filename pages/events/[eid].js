import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/router";

export default function Events() {
  const { query } = useRouter();
  const { eid } = query;
  const getEvent = async () => {
    const response = await axios.get(`http://localhost:3000/api/events/${eid}`);
    return response.data;
  };
  const { isLoading, error, data } = useQuery({
    queryKey: ["eventData"],
    queryFn: getEvent,
  });

  // const { id, title, date, description, banner } = data?.data;

  if (error) return error;
  if (isLoading) return "Loading";

  console.log(data);

  return (
    <Layout>
      <div className="my-10 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <figure>
            <img
              src={`/images/${data?.data?.banner}`}
              alt="event banner"
              className="w-full h-64 object-fill"
            />
          </figure>
          <div className="card-body">
            <h2 className="text-4xl font-bold">{data?.data?.title}</h2>
            <p className="text-xl">
              <strong>Date: </strong>
              {format(
                parseISO(data?.data?.date, new Date()),
                "do LLL, yyyy hh:mm aaa"
              )}
            </p>
            <p>{data?.data?.description}</p>

            {/* <div className="card-actions justify-end">
              <button className="btn btn-primary">Listen</button>
            </div> */}
          </div>
        </div>
      </div>
    </Layout>
  );
}
