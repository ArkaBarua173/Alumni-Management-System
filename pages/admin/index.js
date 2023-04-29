import AdminDashboard from "@/components/AdminDashboard";
import Loading from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
const getModelCount = async () => {
  const response = await axios.get(
    "http://localhost:3000/api/count/countModel"
  );
  return response.data;
};
export default function Dashboard() {
  const { push } = useRouter();
  const { data, error, isLoading } = useQuery({
    queryFn: getModelCount,
    queryKey: ["getModelCount"],
  });
  if (error) return error;
  if (isLoading) return <Loading />;

  console.log(data);

  return (
    <AdminDashboard>
      <div className="my-10 mx-8">
        <h1 className="my-8 text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-6 ">
          <div className="card w-80 bg-orange-600 text-base-content">
            <div className="card-body">
              <h2 className="card-title">Upcoming Events</h2>
              <p>{data?.upcomingEventCount} Upcoming events</p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-outline text-white"
                  onClick={() => push("/admin/events")}
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
          <div className="card w-80 bg-yellow-600 text-base-content">
            <div className="card-body">
              <h2 className="card-title">Events</h2>
              <p>{data?.eventCount} Events</p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-outline text-white"
                  onClick={() => push("/admin/events")}
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
          <div className="card w-80 bg-blue-600 text-base-content">
            <div className="card-body">
              <h2 className="card-title">Discussions</h2>
              <p>{data?.topicCount} Discussions</p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-outline text-white"
                  onClick={() => push("/admin/forums")}
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
          <div className="card w-80 bg-emerald-600 text-base-content">
            <div className="card-body">
              <h2 className="card-title">Gallery</h2>
              <p>{data?.galleryCount} photos</p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-outline text-white"
                  onClick={() => push("/admin/gallery")}
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
          <div className="card w-80 bg-rose-600 text-base-content">
            <div className="card-body">
              <h2 className="card-title">Users</h2>
              <p>{data?.userCount} Users</p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-outline text-white"
                  onClick={() => push("/admin/users")}
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboard>
  );
}
