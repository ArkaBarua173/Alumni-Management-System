import AdminDashboard from "@/components/AdminDashboard";
import AdminForum from "@/components/AdminFourm";
import Loading from "@/components/Loading";
import SingleForum from "@/components/SingleForum";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

const getTopics = async () => {
  const response = await axios.get("/api/forum");
  return response.data.data;
};

export default function Forums() {
  const [query, setQuery] = useState("");
  const { data, error, isLoading } = useQuery({
    queryFn: getTopics,
    queryKey: ["topics"],
  });
  if (error) return error;
  if (isLoading) return <Loading />;

  console.log(data);

  const search = (data) => {
    return data.filter(
      (datum) =>
        datum.title.toLowerCase().includes(query) ||
        datum.user.name.toLowerCase().includes(query)
    );
  };

  return (
    <AdminDashboard>
      <div className="my-10 sm:mx-auto sm:w-full sm:max-w-6xl">
        <h1 className="text-2xl font-bold">Forum</h1>
        <div className="form-control my-8">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search…"
              className="input input-bordered w-full"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-square">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
        {data && <AdminForum data={search(data)} />}
      </div>
    </AdminDashboard>
  );
}
