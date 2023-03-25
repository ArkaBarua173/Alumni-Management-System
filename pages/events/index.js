import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import SingleEvent from "@/components/SingleEvent";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getEvents = async () => {
  const response = await axios.get("http://localhost:3000/api/events");
  return response.data;
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
    <Layout>
      {data?.data?.map((datum) => (
        <SingleEvent key={datum.id} datum={datum} />
      ))}
    </Layout>
  );
}
