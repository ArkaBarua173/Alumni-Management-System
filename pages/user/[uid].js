import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import UserTab from "@/components/Tab/UserTab";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";

export default function User() {
  const getUserData = async (uid) => {
    const response = await axios.get(`/api/user/${uid}`);
    return response.data.data;
  };
  const { query } = useRouter();
  const { uid } = query;
  const { data, error, isLoading } = useQuery({
    queryFn: () => getUserData(uid),
    queryKey: ["getUserData", uid],
  });
  if (error) return error;
  if (isLoading) return <Loading />;

  console.log(data);
  return (
    <Layout>
      <div className="flex flex-col">
        <div className="flex self-center gap-4 mt-10 w-1/2">
          <div className="">
            <img
              src={data?.image || "/assets/user_profile.svg"}
              referrerPolicy="no-referrer"
              className="w-[200px] border-8 rounded-full"
            />
          </div>
          <div className="flex-1 mt-4 ml-2">
            <h1 className="font-bold text-2xl">{data?.name}</h1>
            <h1 className="font-semibold text-xl">{data?.profile?.username}</h1>
            <p className="">{data?.profile?.bio}</p>
          </div>
        </div>
        <UserTab user={data} />
      </div>
    </Layout>
  );
}
