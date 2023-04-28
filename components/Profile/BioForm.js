import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  bio: yup
    .string()
    .required("Bio cannot leave empty while updating bio")
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
});

const getBio = async () => {
  const response = await axios.get("/api/profile/getBio");
  return response.data.data;
};

export default function UserNameForm() {
  const [isDisabled, setIsDisabled] = useState(false);
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery({
    queryFn: getBio,
    queryKey: ["getBio"],
  });
  //   if(data) const { name } = data;
  console.log(data);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bio: "",
    },
    resolver: yupResolver(schema),
  });

  const { mutate } = useMutation(
    async (data) => await axios.put("/api/profile/editBio", data),
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
        queryClient.invalidateQueries(["getBio"]);
        toast.success(`Your bio has successfully updated`);
        // replace("/forum");
      },
    }
  );

  if (isLoading) return <p>Loading</p>;
  if (error) return error;

  //   console.log(data?.name);

  const onSubmit = async (data) => {
    setIsDisabled(true);
    mutate(data);
    setIsDisabled(false);
  };

  return (
    <form className="mb-0 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* <p>{data}</p> */}
      <label htmlFor="bio" className="block label">
        <span className="label-text font-bold">Bio</span>
      </label>
      <div className="mt-1 flex gap-4">
        <textarea
          id="bio"
          cols="30"
          rows="10"
          placeholder={data?.bio}
          className="w-full input input-bordered h-32"
          {...register("bio")}
        ></textarea>
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
      <p className="text-red-700 ml-1 mt-1">{errors.bio?.message}</p>
    </form>
  );
}
