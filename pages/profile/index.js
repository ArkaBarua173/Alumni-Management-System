import Loading from "@/components/Loading";
import UserProfileLayout from "@/components/UserProfileLayout";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ImProfile } from "react-icons/im";

const getProfile = async () => {
  const response = await axios.get("/api/profile/getprofile");
  return response.data.data;
};

export default function Profile() {
  const { replace } = useRouter();
  const { data: session } = useSession();
  const { data, error, isLoading } = useQuery({
    queryFn: getProfile,
    queryKey: ["profile"],
  });
  if (error) return error;
  if (isLoading) return <Loading />;
  console.log(data);
  return (
    <>
      <UserProfileLayout>
        {data ? (
          <div className="p-4 flex flex-col justify-center items-center">
            <div className="self-center">
              <img
                src={session?.user?.image || "/assets/user_profile.svg"}
                referrerPolicy="no-referrer"
                className="w-full border-8 rounded-full"
              />
              <h1 className="text-xl uppercase font-bold my-4">
                welcome, {data?.username}
              </h1>
            </div>
            <div className="w-4/5 mt-4">
              <div className="flex w-full">
                <div className="grid h-15 w-1/2 font-semibold border p-2">
                  Username
                </div>
                <div className="grid h-15 w-1/2 border p-2">
                  {data?.username}
                </div>
              </div>
              <div className="flex w-full">
                <div className="grid h-15 w-1/2 font-semibold border p-2">
                  Email
                </div>
                <div className="grid h-15 w-1/2 border p-2">
                  {data?.user?.email}
                </div>
              </div>
              <div className="flex w-full">
                <div className="grid h-15 w-1/2 font-semibold  border p-2">
                  Bio
                </div>
                <div className="grid h-15 w-1/2 border p-2">{data?.bio}</div>
              </div>
              <p className="text-lg py-4 font-bold">Degree Information</p>
              <div className="flex w-full">
                <div className="grid h-15 w-1/2 font-semibold  border p-2">
                  Department
                </div>
                <div className="grid h-15 w-1/2 border p-2">
                  {data?.degree?.department}
                </div>
              </div>
              <div className="flex w-full">
                <div className="grid h-15 w-1/2 font-semibold  border p-2">
                  Degree
                </div>
                <div className="grid h-15 w-1/2 border p-2">
                  {data?.degree?.name}
                </div>
              </div>
              <div className="flex w-full">
                <div className="grid h-15 w-1/2 font-semibold  border p-2">
                  Result Published Date
                </div>
                <div className="grid h-15 w-1/2 border p-2">
                  {format(
                    parseISO(data?.resultPublishedDate, new Date()),
                    "do LLL, yyyy"
                  )}
                </div>
              </div>
              <p className="text-lg py-4 font-bold">Job Information</p>
              {data?.jobStatus === "EMPLOYED" ? (
                <>
                  <div className="flex w-full">
                    <div className="grid h-15 w-1/2 font-semibold  border p-2">
                      Job Title
                    </div>
                    <div className="grid h-15 w-1/2 border p-2">
                      {data?.designation}
                    </div>
                  </div>
                  <div className="flex w-full">
                    <div className="grid h-15 w-1/2 font-semibold  border p-2">
                      Job Company
                    </div>
                    <div className="grid h-15 w-1/2 border p-2">
                      {data?.company}
                    </div>
                  </div>
                  <div className="flex w-full">
                    <div className="grid h-15 w-1/2 font-semibold  border p-2">
                      Joined
                    </div>
                    <div className="grid h-15 w-1/2 border p-2">
                      Since{" "}
                      {format(
                        parseISO(data?.joiningDate, new Date()),
                        "LLL, yyyy"
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex w-full">
                    <div className="grid h-15 w-1/2 font-semibold  border p-2">
                      Job Status
                    </div>
                    <div className="grid h-15 w-1/2 border p-2">
                      {data?.jobStatus}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 flex flex-col justify-center items-center">
            <p className="text-xl">Don't have profile?</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                replace("/profile/create");
              }}
            >
              Create Profile{" "}
              <span className="ml-3">
                <ImProfile size={20} color="white" />
              </span>
            </button>
          </div>
        )}
      </UserProfileLayout>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: { session },
  };
}
