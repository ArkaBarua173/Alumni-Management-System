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
      "can be empty or with string at least 10 characters and not more than 300",
      (val) => {
        if (val === undefined) {
          return true;
        }
        return val.length == 0 || (val.length >= 10 && val.length <= 300);
      }
    ),
  department: yup.string().required(),
  degree: yup.string().required(),
  resultPublishedDate: yup.date().required(),
});

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

  const handleDepartment = async (e) => {
    const department = e.target.value;
    if (department === "Software Engineering Program")
      setDegrees([
        "B.Sc.in Software Engineering",
        "Post Graduate Diploma in Information Technology (PGDIT)",
      ]);
    if (
      department ===
      "Department of Computer Science and Telecommunication Engineering"
    )
      setDegrees([
        "B.Sc. Eng. in Computer Science and Telecommunication Engineering",
        "M.Sc. Eng. in Computer Science and Telecommunication Engineering",
      ]);
    setIsDisabled(false);
  };

  const onSubmit = async (data) => {
    console.log(data);
    mutate(data);
  };
  console.log(watchJobStatus);

  return (
    <>
      <Layout />
      <div className="my-10 max-w-2xl sm:mx-auto sm:w-full">
        <h1 className="my-3 text-center text-lg font-bold">
          Create your profile
        </h1>
        <div className="py-8 px-6 shadow rounded-lg sm:px-10 bg-base-300">
          <form
            className="mb-0 space-y-6 form-control"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label htmlFor="username" className="block label">
              <span className="label-text font-bold">Username</span>
            </label>
            <div className="mt-1">
              <input
                id="username"
                type="text"
                placeholder="Enter your user name"
                className="w-full input input-bordered"
                {...register("username")}
              />
              <p className="text-red-700 ml-1 mt-1">
                {errors.username?.message}
              </p>
            </div>
            <label htmlFor="bio" className="block label">
              <span className="label-text font-bold">Add Bio</span>
            </label>
            <div className="mt-1">
              <textarea
                id="bio"
                cols="30"
                rows="10"
                className="w-full input input-bordered h-60"
                {...register("bio")}
              ></textarea>
              <p
                className={`font-bold text-sm ml-1 mt-2 ${
                  watch("bio").length <= 10 || watch("bio").length > 300
                    ? "text-red-700"
                    : "text-base-content"
                }`}
              >{`${watch("bio").length}/300`}</p>
              <p className="text-red-700 ml-1 mt-1">{errors.bio?.message}</p>
            </div>
            {err && <p className="text-red-700 ml-1 mt-1"></p>}
            <h1 className="">Provide your latest degree information</h1>
            <label htmlFor="department" className="block label">
              <span className="label-text font-bold">Department</span>
            </label>
            <div className="mt-1">
              <select
                id="department"
                name="department"
                type="text"
                defaultValue={""}
                {...register("department")}
                onChange={(e) => handleDepartment(e)}
                className="w-full input input-bordered"
              >
                <option value={""} disabled>
                  Choose department
                </option>
                <option value={"Software Engineering Program"}>
                  Software Engineering Program
                </option>
                <option
                  value={
                    "Department of Computer Science and Telecommunication Engineering"
                  }
                >
                  Department of Computer Science and Telecommunication
                  Engineering
                </option>
              </select>
              <p className="text-red-700 ml-1 mt-1">
                {errors.department?.message}
              </p>
            </div>
            <label htmlFor="degree" className="block label">
              <span className="label-text font-bold">Degree</span>
            </label>
            <div className="mt-1">
              <select
                id="degree"
                type="text"
                defaultValue={""}
                disabled={isDisabled}
                className="w-full input input-bordered"
                {...register("degree")}
              >
                <option value={""} disabled>
                  Choose degree
                </option>
                {degrees?.map((degree) => (
                  <option value={degree} key={degree}>
                    {degree}
                  </option>
                ))}
              </select>
              <p className="text-red-700 ml-1 mt-1">{errors.degree?.message}</p>
            </div>
            <label htmlFor="resultPublishedDate" className="block label">
              <span className="label-text font-bold">
                Result Published Date
              </span>
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
                className="w-full input input-bordered"
                {...register("resultPublishedDate")}
              />
              <p className="text-red-700 ml-1 mt-1">
                {errors.resultPublishedDate?.message}
              </p>
            </div>
            <div className="mt-1">
              <label className="block label">
                <span className="label-text font-bold">
                  Select your current job status:
                </span>
              </label>
              <div className="mb-3 flex gap-3 items-center">
                <input
                  id="jobStatus"
                  type="radio"
                  value={"UNEMPLOYED"}
                  className="radio"
                  {...register("jobStatus")}
                />
                <label htmlFor="jobStatus" className="block label">
                  <span className="label-text font-bold">Unemployed</span>
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
                  className="radio"
                  {...register("jobStatus")}
                />
                <label htmlFor="jobStatus" className="block label">
                  <span className="label-text font-bold">Employed</span>
                </label>
              </div>
              <p className="text-red-700 ml-1 mt-1">
                {errors.jobStatus?.message}
              </p>
            </div>
            {watchJobStatus === "EMPLOYED" ? (
              <>
                <label htmlFor="designation" className="block label">
                  <span className="label-text font-bold">Job Title</span>
                </label>
                <div className="mt-1">
                  <input
                    id="designation"
                    type="text"
                    required
                    placeholder="Job Title"
                    className="w-full input input-bordered"
                    {...register("designation")}
                  />
                  <p className="text-red-700 ml-1 mt-1">
                    {errors.designation?.message}
                  </p>
                </div>
                <label htmlFor="company" className="block label">
                  <span className="label-text font-bold">Job Company</span>
                </label>
                <div className="mt-1">
                  <input
                    id="company"
                    type="text"
                    required
                    placeholder="Job Company"
                    className="w-full input input-bordered"
                    {...register("company")}
                  />
                  <p className="text-red-700 ml-1 mt-1">
                    {errors.company?.message}
                  </p>
                </div>
                <label htmlFor="joiningDate" className="block label">
                  <span className="label-text font-bold">Joining Date</span>
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
                    className="w-full input input-bordered"
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
                className="w-full flex justify-center py-2 px-4 btn no-animation text-white"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
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
