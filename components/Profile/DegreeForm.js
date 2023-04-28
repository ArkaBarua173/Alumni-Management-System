import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import toast from "react-hot-toast";
import Loading from "../Loading";
import { format, parseISO } from "date-fns";

const getDegreeInfo = async () => {
  const response = await axios.get("/api/profile/getDegreeInfo");
  return response.data.data;
};

export default function UserNameForm() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isSelectDisabled, setIsSelectDisabled] = useState(true);
  const [degrees, setDegrees] = useState([]);
  const { data, error, isLoading } = useQuery({
    queryFn: getDegreeInfo,
    queryKey: ["getDegreeInfo"],
  });
  const queryClient = useQueryClient();

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
        queryClient.invalidateQueries(["getDegreeInfo"]);
        toast.success(`Your Degree has successfully updated`);
      },
    }
  );

  console.log(data);

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
    setIsDisabled(true);
    mutate(data);
    setIsDisabled(false);
  };

  return (
    <form
      className="mb-0 space-y-6 form-control"
      onSubmit={handleSubmit(onSubmit)}
    >
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
            Department of Computer Science and Telecommunication Engineering
          </option>
        </select>
        <p className="text-red-700 ml-1 mt-1">{errors.department?.message}</p>
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
        <span className="label-text font-bold">Result Published Date</span>
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
