import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import toast from "react-hot-toast";

// const schema = yup.object().shape({
//   name: yup.string().required(),
// });

const getUserName = async () => {
  const response = await axios.get("/api/profile/getUserName");
  return response.data.data;
};

export default function UserNameForm() {
  const [isDisabled, setIsDisabled] = useState(false);
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery({
    queryFn: getUserName,
    queryKey: ["getUserName"],
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
    },
    // resolver: yupResolver(schema),
  });

  const { mutate } = useMutation(
    async (data) => await axios.put("/api/profile/editUserName", data),
    {
      onError: (error) => {
        console.log(error);
        toast.error(error?.response?.data.message, {
          position: "bottom-center",
        });
      },
      onSuccess: (data) => {
        reset();
        console.log(data);
        queryClient.invalidateQueries(["getUserName"]);
        toast.success(`Your name has successfully updated`);
      },
    }
  );

  if (isLoading) return <p>Loading</p>;
  if (error) return error;

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
      <label htmlFor="username" className="block label">
        <span className="label-text font-bold">Username</span>
      </label>
      <div className="mt-1 flex gap-4">
        <input
          id="username"
          type="text"
          required
          placeholder={data?.username}
          className="w-full input input-bordered"
          {...register("username")}
        />
        <button
          disabled={isDisabled}
          type="submit"
          className={`btn no-animation text-white ${
            isDisabled ? "text-gray-500 hover:bg-slate-600" : ""
          }`}
        >
          Change
        </button>
      </div>
    </form>
  );
}
