import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

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
      {isLoading ?? <h1 className="text-xl">Loading</h1>}
      <div className="my-10 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="flex justify-between mb-4">
          <h1 className="text-lg font-bold">Forum</h1>
          <Link className="btn" href={"/forum/create"}>
            Start a new Topic
          </Link>
        </div>
        {data?.map((datum) => (
          <div className="my-4 card bg-base-200" key={datum.id}>
            <div className="card-body">
              <div className="flex gap-4">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    {/* <img
                      src={datum?.user?.image || Avatar(datum?.user?.name)}
                    /> */}
                    <img
                      src={datum?.user?.image || "/assets/user_profile.svg"}
                    />
                  </div>
                </div>
                <div>
                  <h5 className="font-bold">{datum?.user?.name}</h5>
                  <p>
                    {format(
                      parseISO(datum?.createdAt, new Date()),
                      "do LLL, yyyy hh:mm aaa"
                    )}
                  </p>
                </div>
              </div>
              <h2 className="card-title">{datum.title}</h2>
              <p className="line-clamp-2">{datum.details}</p>
              <div className="flex gap-4 items-center">
                <Link
                  href={`/forum/${datum?.id}`}
                  className="btn btn-outline no-animation"
                >
                  Open Discussion
                </Link>
                <p>{datum?.comments.length} comments</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
