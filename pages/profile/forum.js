import Loading from "@/components/Loading";
import SingleForum from "@/components/SingleForum";
import UserProfileLayout from "@/components/UserProfileLayout";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getUserTopics = async () => {
  const response = await axios.get("/api/forum/userForum");
  return response.data;
};

export default function UserForum() {
  const { data, error, isLoading } = useQuery({
    queryFn: getUserTopics,
    queryKey: ["getUserTopics"],
  });

  if (error) return error;
  if (isLoading) return <Loading />;

  console.log(data);

  return (
    <>
      <UserProfileLayout>
        <div className="my-8 ml-8">
          <h1 className="text-2xl font-bold my-8">Forum</h1>
          <p className="font-semibold">
            You started {data?.topic?.length} discussions and got{" "}
            {data?.commentCount} comments
          </p>
        </div>
        {data?.topic?.map((datum) => (
          <div className="m-8 card bg-base-200" key={datum.id}>
            <SingleForum topic={datum} />
          </div>
        ))}
      </UserProfileLayout>
    </>
  );
}
