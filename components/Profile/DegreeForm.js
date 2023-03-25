import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import toast from "react-hot-toast";
import Loading from "../Loading";
import { format, parseISO } from "date-fns";

const getDepartments = async () => {
  const response = await axios.get("/api/profile/degrees/getdepartments");
  return response.data.data;
};
const getProfileDegree = async () => {
  const response = await axios.get("/api/profile/getProfileDegree");
  return response.data.data;
};

export default function UserNameForm() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isSelectDisabled, setIsSelectDisabled] = useState(true);
  const [degrees, setDegrees] = useState([]);
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery({
    queryFn: getDepartments,
    queryKey: ["departments"],
  });
  const {
    data: degreeInfo,
    error: degreeError,
    isLoading: isDegreeLoading,
  } = useQuery({
    queryFn: getProfileDegree,
    queryKey: ["getProfileDegree"],
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      department: "",
      degree: "",
      resultPublishedDate: null,
    },
  });
  const { mutate } = useMutation(
    async (data) => await axios.put("/api/profile/editDegree", data),
    {
      onError: (error) => {
        toast.error(error?.response?.data.message, {
          position: "bottom-center",
        });
      },
      onSuccess: (data) => {
        reset();
        queryClient.invalidateQueries(["getProfileDegree"]);
        toast.success(`Your Degree has successfully updated`);
      },
    }
  );

  if (isLoading) return <Loading />;
  if (error) return error;

  if (isDegreeLoading) return <Loading />;
  if (degreeError) return error;

  const handleDepartment = async (e) => {
    const resDeg = await fetch(`/api/profile/degrees/${e.target.value}`);
    const getDeg = await resDeg.json();
    setDegrees(await getDeg);
    setIsSelectDisabled(false);
  };

  const onSubmit = async (data) => {
    setIsDisabled(true);
    mutate(data);
    setIsDisabled(false);
  };

  return (
    <form className="mb-0 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
        <p className="text-red-700 ml-1 mt-1">{errors.department?.message}</p>
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
          disabled={isSelectDisabled}
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
        htmlFor="joiningDate"
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
          className="w-full border-gray-300 rounded-lg shadow-sm"
          {...register("resultPublishedDate")}
        />
        <p className="text-red-700 ml-1 mt-1">
          {errors.resultPublishedDate?.message}
        </p>
      </div>
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
