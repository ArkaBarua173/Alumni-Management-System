import { getSession } from "next-auth/react";
import Layout from "@/components/Layout";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useRouter } from "next/router";

const schema = yup.object().shape({
  username: yup.string().required(),
  bio: yup
    .string()
    .required()
    .test(
      "len",
      "can be empty or with string at least 10 characters and not more than 250",
      (val) => {
        if (val === undefined) {
          return true;
        }
        return val.length == 0 || (val.length >= 10 && val.length <= 250);
      }
    ),
  department: yup.string().required(),
  degree: yup.string().required(),
  resultPublishedDate: yup.date().required(),
});

const getDepartments = async () => {
  const response = await axios.get("/api/profile/degrees/getdepartments");
  return response.data.data;
};

export default function Create() {
  const [err, setErr] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [degrees, setDegrees] = useState([]);

  const { replace } = useRouter();

  const { mutate } = useMutation(
    async (data) => await axios.post("/api/profile/create", data),
    {
      onError: (error) => {
        console.log(error);
        setErr(error?.response?.data.message);
      },
      onSuccess: (data) => {
        console.log(data);
        replace("/profile");
      },
    }
  );

  const {
    register,
    unregister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      bio: "",
      department: "",
      degree: "",
      resultPublishedDate: null,
      jobStatus: "UNEMPLOYED",
      designation: "",
      company: "",
      joiningDate: null,
    },
    resolver: yupResolver(schema),
  });

  const watchJobStatus = watch("jobStatus");

  useEffect(() => {
    if (watchJobStatus === "EMPLOYED") {
      register("designation");
      register("company");
      register("joiningDate");
    } else {
      unregister("designation");
      unregister("company");
      unregister("joiningDate");
    }
  }, [register, unregister, watchJobStatus]);

  const { data, error, isLoading } = useQuery({
    queryFn: getDepartments,
    queryKey: ["departments"],
  });
  if (error) return error;
  if (isLoading) return <Loading />;

  const handleDepartment = async (e) => {
    const resDeg = await fetch(`/api/profile/degrees/${e.target.value}`);
    const getDeg = await resDeg.json();
    setDegrees(await getDeg);
    setIsDisabled(false);
    console.log(degrees);
  };

  const onSubmit = async (data) => {
    console.log(data);
    mutate(data);
  };
  console.log(watchJobStatus);

  return (
    <Layout>
      <div className="my-10 max-w-2xl sm:mx-auto sm:w-full">
        <h1 className="my-3 text-center text-lg font-bold">
          Create your profile
        </h1>
        <div className="py-8 px-6 shadow rounded-lg sm:px-10 bg-slate-200">
          <form className="mb-0 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="mt-1">
              <input
                id="username"
                type="text"
                placeholder="Enter your user name"
                className="w-full border-gray-300 rounded-lg shadow-sm"
                {...register("username")}
              />
              <p className="text-red-700 ml-1 mt-1">
                {errors.username?.message}
              </p>
            </div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Add Bio
            </label>
            <div className="mt-1">
              <textarea
                id="bio"
                cols="30"
                rows="10"
                className="w-full border-gray-300 rounded-lg shadow-sm h-32"
                {...register("bio")}
              ></textarea>
              <p
                className={`font-bold text-sm ml-1 mt-2 ${
                  watch("bio").length <= 10 || watch("bio").length > 250
                    ? "text-red-700"
                    : "text-gray-700"
                }`}
              >{`${watch("bio").length}/250`}</p>
              <p className="text-red-700 ml-1 mt-1">{errors.bio?.message}</p>
            </div>
            {err && <p className="text-red-700 ml-1 mt-1"></p>}
            <h1 className="">Provide your latest degree information</h1>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700"
            >
              Department
            </label>
            <div className="mt-1">
              <select
                id="department"
                name="department"
                type="text"
                defaultValue={""}
                {...register("department")}
                onChange={(e) => handleDepartment(e)}
                className="w-full border-gray-300 rounded-lg shadow-sm invalid:text-gray-500"
              >
                <option value={""} disabled>
                  Choose department
                </option>
                {data?.map((datum) => (
                  <option value={datum?.department} key={datum?.department}>
                    {datum?.department}
                  </option>
                ))}
              </select>
              <p className="text-red-700 ml-1 mt-1">
                {errors.department?.message}
              </p>
            </div>
            <label
              htmlFor="degree"
              className="block text-sm font-medium text-gray-700"
            >
              Degree
            </label>
            <div className="mt-1">
              <select
                id="degree"
                type="text"
                defaultValue={""}
                disabled={isDisabled}
                className="w-full border-gray-300 rounded-lg shadow-sm invalid:text-gray-500"
                {...register("degree")}
              >
                <option value={""} disabled>
                  Choose degree
                </option>
                {degrees?.data?.map((degree) => (
                  <option value={degree.name} key={degree.name}>
                    {degree.name}
                  </option>
                ))}
              </select>
              <p className="text-red-700 ml-1 mt-1">{errors.degree?.message}</p>
            </div>
            <label
              htmlFor="resultPublishedDate"
              className="block text-sm font-medium text-gray-700"
            >
              Result Published Date
            </label>
            <div className="mt-1">
              <input
                id="resultPublishedDate"
                type="text"
                min={format(new Date("2011-06-01"), "y-LL-cc")}
                max={format(new Date(), "y-LL-cc")}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                placeholder="2011-06-01"
                className="w-full border-gray-300 rounded-lg shadow-sm"
                {...register("resultPublishedDate")}
              />
              <p className="text-red-700 ml-1 mt-1">
                {errors.resultPublishedDate?.message}
              </p>
            </div>
            <div className="mt-1">
              <p className="block text-sm font-medium text-gray-700 mb-3">
                Select your current job status:
              </p>
              <div className="mb-3 flex gap-3 items-center">
                <input
                  id="jobStatus"
                  type="radio"
                  value={"UNEMPLOYED"}
                  className="border-gray-300 rounded-lg shadow-sm"
                  {...register("jobStatus")}
                />
                <label
                  htmlFor="jobStatus"
                  className="text-sm font-medium text-gray-700"
                >
                  Unemployed
                </label>
              </div>
              <p className="text-red-700 ml-1 mt-1">
                {errors.jobStatus?.message}
              </p>
              <div className="flex gap-3 items-center">
                <input
                  id="jobStatus"
                  type="radio"
                  value={"EMPLOYED"}
                  className="border-gray-300 rounded-lg shadow-sm"
                  {...register("jobStatus")}
                />
                <label
                  htmlFor="jobStatus"
                  className="text-sm font-medium text-gray-700"
                >
                  Employed
                </label>
              </div>
              <p className="text-red-700 ml-1 mt-1">
                {errors.jobStatus?.message}
              </p>
            </div>
            {watchJobStatus === "EMPLOYED" ? (
              <>
                <label
                  htmlFor="designation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job Title
                </label>
                <div className="mt-1">
                  <input
                    id="designation"
                    type="text"
                    required
                    placeholder="Job Title"
                    className="w-full border-gray-300 rounded-lg shadow-sm"
                    {...register("designation")}
                  />
                  <p className="text-red-700 ml-1 mt-1">
                    {errors.designation?.message}
                  </p>
                </div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job Company
                </label>
                <div className="mt-1">
                  <input
                    id="company"
                    type="text"
                    required
                    placeholder="Job Company"
                    className="w-full border-gray-300 rounded-lg shadow-sm"
                    {...register("company")}
                  />
                  <p className="text-red-700 ml-1 mt-1">
                    {errors.company?.message}
                  </p>
                </div>
                <label
                  htmlFor="joiningDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Joining Date
                </label>
                <div className="mt-1">
                  <input
                    id="joiningDate"
                    type="text"
                    required
                    min={format(new Date("2011-06"), "y-LL")}
                    max={format(new Date(), "y-LL")}
                    onFocus={(e) => (e.target.type = "month")}
                    onBlur={(e) => (e.target.type = "text")}
                    placeholder="April 2011"
                    className="w-full border-gray-300 rounded-lg shadow-sm"
                    {...register("joiningDate")}
                  />
                  <p className="text-red-700 ml-1 mt-1">
                    {errors.joiningDate?.message}
                  </p>
                </div>
              </>
            ) : null}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  console.log(session);
  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  // const getProfile = await prisma.profile.findUnique({
  //   where: { userId: session?.id },
  // });

  // if (!getProfile)
  //   return {
  //     redirect: {
  //       destination: "/profile",
  //       permanent: false,
  //     },
  //   };

  return {
    props: { session },
  };
}
