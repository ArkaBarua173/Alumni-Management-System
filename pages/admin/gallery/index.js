import AdminDashboard from "@/components/AdminDashboard";
import AdminPhoto from "@/components/AdminPhoto";
import Loading from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { useRouter } from "next/router";

const getPhotos = async () => {
  const response = await axios.get("/api/gallery");
  return response.data.data;
};

export default function Gallery() {
  const { replace } = useRouter();
  const { data, error, isLoading } = useQuery({
    queryFn: getPhotos,
    queryKey: ["getPhotos"],
  });
  if (error) return error;
  if (isLoading) return <Loading />;

  return (
    <AdminDashboard>
      <div className="my-10 mx-8">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">Gallery</h1>
          <button
            className="btn btn-outline"
            onClick={() => replace("/admin/gallery/create")}
          >
            Add Photo
          </button>
        </div>

        <div className="flex flex-wrap gap-12">
          {data?.map((datum) => (
            <AdminPhoto datum={datum} key={datum.id} />
          ))}
        </div>
      </div>
    </AdminDashboard>
  );
}
