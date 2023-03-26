import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";
import Loading from "@/components/Loading";
import SingleForum from "@/components/SingleForum";

const getTopics = async () => {
  const response = await axios.get("http://localhost:3000/api/forum");
  return response.data.data;
};

export default function Forum() {
  const { data, error, isLoading } = useQuery({
    queryFn: getTopics,
    queryKey: ["topics"],
  });
  if (error) return error;
  if (isLoading) return <Loading />;

  // const Avatar = async (seed) => {
  //   console.log(seed);
  //   const avatar = createAvatar(initials, {
  //     seed,
  //   });
  //   console.log(avatar.toDataUri());
  //   return avatar.toDataUri();
  // };

  console.log(data);

  return (
    <Layout>
      {/* {isLoading ?? <h1 className="text-5xl w-full text-center">Loading</h1>} */}
      <div className="my-10 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="flex justify-between mb-4">
          <h1 className="text-lg font-bold">Forum</h1>
          <Link className="btn btn-outline no-animation" href={"/forum/create"}>
            Start a new discussion
          </Link>
        </div>
        {data?.map((datum) => (
          <div className="my-4 card bg-base-200" key={datum.id}>
            <SingleForum topic={datum} />
          </div>
        ))}
      </div>
    </Layout>
  );
}
