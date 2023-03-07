import Layout from "@/components/Layout";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";

const schema = yup.object().shape({
  title: yup.string().required(),
  details: yup.string().required(),
});

export default function Create() {
  const [err, setErr] = useState("");
  const queryClient = useQueryClient();
  const { replace } = useRouter();
  const { mutate } = useMutation(
    async (data) => await axios.post("/api/forum/create", data),
    {
      onError: (error) => {
        console.log(error);
        setErr(error?.response?.data.message);
      },
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries(["topics"]);
        replace("/forum");
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
      title: "",
      details: "",
    },
    resolver: yupResolver(schema),
  });
  const watchAllFields = watch();
  console.log(watchAllFields);

  const onSubmit = async (data) => {
    mutate(data);
  };

  return (
    <Layout>
      <div className="my-10 md:w-11/12 md:max-w-5xl sm:mx-auto sm:w-full sm:max-w-md ">
        <h1 className="my-3 text-center text-lg font-bold">Create New Topic</h1>
        <div className="py-8 px-6 shadow rounded-lg sm:px-10 bg-slate-200">
          <form className="mb-0 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <div className="mt-1">
              <input
                id="title"
                type="text"
                placeholder="Enter the title of the event"
                className="w-full border-gray-300 rounded-lg shadow-sm"
                {...register("title")}
              />
              <p
                className={`font-bold text-sm mt-2 ${
                  watch("title").length > 100 ? "text-red-700" : "text-gray-700"
                }`}
              >{`${watch("title").length}/100`}</p>
              <p className="text-red-700 ml-1 mt-1">{errors.title?.message}</p>
            </div>
            <label
              htmlFor="details"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="details"
                cols="30"
                rows="10"
                className="w-full border-gray-300 rounded-lg shadow-sm h-60"
                {...register("details")}
              ></textarea>
              <p
                className={`font-bold text-sm mt-2 ${
                  watch("details").length > 1000
                    ? "text-red-700"
                    : "text-gray-700"
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
