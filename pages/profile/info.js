import UserNameForm from "@/components/Profile/UserNameForm";
import BioForm from "@/components/Profile/BioForm";
import DegreeForm from "@/components/Profile/DegreeForm";
import JobForm from "@/components/Profile/JobForm";
import UserProfileLayout from "@/components/UserProfileLayout";
import axios from "axios";
import Loading from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const getProfile = async () => {
  const response = await axios.get("/api/profile/getProfile");
  return response.data.data;
};

export default function Info() {
  const { replace } = useRouter();
  const { data, error, isLoading } = useQuery({
    queryFn: getProfile,
    queryKey: ["profile"],
  });
  if (error) return error;
  if (isLoading) return <Loading />;

  if (data === null) replace("/profile");

  return (
    <>
      <UserProfileLayout>
        <div className="my-8 ml-8">
          <h1 className="text-2xl font-bold my-8">
            Change Profile Information
          </h1>
          <div className="flex flex-col gap-8">
            <div className="w-3/5">
              <UserNameForm />
            </div>
            <div className="w-3/5">
              <BioForm />
            </div>
            <p className="text-xl font-semibold">Update degree information</p>
            <div className="w-3/5">
              <DegreeForm />
            </div>
            <p className="text-xl font-semibold">Update job information</p>
            <div className="w-3/5">
              <JobForm />
            </div>
          </div>
        </div>
      </UserProfileLayout>
    </>
  );
}
