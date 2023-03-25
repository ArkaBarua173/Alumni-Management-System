import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";

// const schema = yup.object().shape({
//   jobStatus: yup.string().required(),
//   designation: yup.string().required(),
//   company: yup.string().required(),
// });

const getJobInfo = async () => {
  const response = await axios.get("/api/profile/getJobInfo");
  return response.data.data;
};

export default function UserNameForm() {
  const [isDisabled, setIsDisabled] = useState(false);
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery({
    queryFn: getJobInfo,
    queryKey: ["getJobInfo"],
  });

  const {
    register,
    unregister,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      jobStatus: data?.jobStatus,
      designation: data?.designation,
      company: data?.company,
      joiningDate: data?.joiningDate
        ? format((parseISO(data?.joiningDate), new Date()), "LLL, yyyy")
        : null,
    },
    // resolver: yupResolver(schema),
  });

  const { mutate } = useMutation(
    async (data) => await axios.put("/api/profile/editJobInfo", data),
    {
      onError: (error) => {
        console.log(error);
        toast.error(error?.response?.data.message, {
          position: "bottom-center",
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["getJobInfo"]);
        // reset();
        console.log(data);
        toast.success(`Your JobInfo has successfully updated`);
      },
    }
  );
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

  if (isLoading) return <p>Loading</p>;
  if (error) return error;

  const onSubmit = async (data) => {
    setIsDisabled(true);
    mutate(data);
    setIsDisabled(false);
  };

  return (
    <form className="mb-0 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
        <p className="text-red-700 ml-1 mt-1">{errors.jobStatus?.message}</p>
        <div className="flex gap-3 items-center">
          <input
            id="jobStatus"
            type="radio"
            value={"EMPLOYED"}
            defaultChecked={data?.jobStatus === "EMPLOYED"}
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
        <p className="text-red-700 ml-1 mt-1">{errors.jobStatus?.message}</p>
      </div>
      {watchJobStatus === "EMPLOYED" && (
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
            <p className="text-red-700 ml-1 mt-1">{errors.company?.message}</p>
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
              placeholder={
                data?.joiningDate
                  ? format(
                      (parseISO(data?.joiningDate), new Date()),
                      "LLLL, yyyy"
                    )
                  : "April 2011"
              }
              className="w-full border-gray-300 rounded-lg shadow-sm"
              {...register("joiningDate")}
            />
            <p className="text-red-700 ml-1 mt-1">
              {errors.joiningDate?.message}
            </p>
          </div>
        </>
      )}
      <button
        disabled={isDisabled}
        type="submit"
        className={`btn no-animation text-white ${
          isDisabled ? "text-gray-500 hover:bg-slate-600" : ""
        }`}
      >
        Change
      </button>
    </form>
  );
}
