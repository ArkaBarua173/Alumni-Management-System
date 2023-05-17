import AdminDashboard from "@/components/AdminDashboard";
import EventsTable from "@/components/EventsTable";
import Loading from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";

const getEvents = async () => {
  const response = await axios.get("/api/events");
  return response.data.data;
};

export default function Events() {
  const { replace } = useRouter();
  const { data, error, isLoading } = useQuery({
    queryFn: getEvents,
    queryKey: ["events"],
  });
  if (error) return error;
  if (isLoading) return <Loading />;

  const upcomingEvent = data?.filter(
    (datum) => new Date(datum?.date).getTime() > Date.now()
  );

  return (
    <AdminDashboard>
      <div className="my-10 mx-8">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">Events</h1>
          <button
            className="btn btn-outline"
            onClick={() => replace("/admin/events/create")}
          >
            Create Event
          </button>
        </div>
        <EventsTable name={"upcoming events"} data={upcomingEvent} />
        <EventsTable name={"events"} data={data} />
      </div>
    </AdminDashboard>
  );
}
