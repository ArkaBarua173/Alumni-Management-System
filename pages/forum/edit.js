import UserProfileLayout from "@/components/UserProfileLayout";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export async function getServerSideProps({ query }) {
  const { id, title, details } = query;
  const props = { id, title, details };
  return { props };
}

const schema = yup.object().shape({
  title: yup.string().required(),
  details: yup.string().required(),
});

export default function EditForum({ id, title, details }) {
  const [err, setErr] = useState("");
  const { replace } = useRouter();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    async (data) => await axios.put("/api/forum/edit", data),
    {
      onError: (error) => {
        console.log(error);
        setErr(error?.response?.data.message);
      },
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries(["topics"]);
        queryClient.invalidateQueries(["getUserTopics"]);
        replace("/profile/forum");
      },
    }
  );
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title,
      details,
    },
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    data.id = id;
    mutate(data);
    // console.log(data);
  };
  return (
    <UserProfileLayout>
      <div className="my-10 md:w-11/12 md:max-w-5xl sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mb-8 text-center text-lg font-bold">Edit Discussion</h1>
        <div className="py-4 px-6 shadow rounded-lg sm:px-10 bg-base-300">
          <form
            className="mb-0 space-y-6 form-control"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label htmlFor="title" className="block label">
              <span className="label-text font-bold">Title</span>
            </label>
            <div className="mt-1">
              <input
                id="title"
                type="text"
                placeholder="Enter the title of the event"
                className="w-full input input-bordered"
                {...register("title")}
              />
              <p
                className={`font-bold text-sm mt-2 ml-1 ${
                  watch("title").length > 150
                    ? "text-red-700"
                    : "text-base-content"
                }`}
              >{`${watch("title").length}/150`}</p>
              <p className="text-red-700 ml-1 mt-1">{errors.title?.message}</p>
            </div>
            <label htmlFor="details" className="block label">
              <span className="label-text font-bold">Details</span>
            </label>
            <div className="mt-1">
              <textarea
                id="details"
                cols="30"
                rows="10"
                className="w-full input input-bordered h-60"
                {...register("details")}
              ></textarea>
              <p
                className={`font-bold text-sm ml-1 mt-2 ${
                  watch("details").length > 1000
                    ? "text-red-700"
                    : "text-base-content"
                }`}
              >{`${watch("details").length}/1000`}</p>
              <p className="text-red-700 ml-1 mt-1">
                {errors.details?.message}
              </p>
            </div>
            {err && <p className="text-red-700 ml-1 mt-1"></p>}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 btn no-animation text-white"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </UserProfileLayout>
  );
}
