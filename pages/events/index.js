import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import SingleEvent from "@/components/SingleEvent";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getEvents = async () => {
  const response = await axios.get("/api/events");
  return response.data.data;
};

export default function Events() {
  const { data, error, isLoading } = useQuery({
    queryFn: getEvents,
    queryKey: ["events"],
  });
  if (error) return error;
  if (isLoading) return <Loading />;
  console.log(data);

  return (
    <>
      <Layout />
      {data?.length === 0 && (
        <p className="flex justify-center my-8 font-bold">
          There are no events
        </p>
      )}
      {data?.map((datum) => (
        <SingleEvent key={datum.id} datum={datum} />
      ))}
    </>
  );
}
