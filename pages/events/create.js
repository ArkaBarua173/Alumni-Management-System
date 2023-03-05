import { getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "@/components/Layout";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

const schema = yup.object().shape({
  title: yup.string().required(),
  date: yup.date().required(),
  banner: yup
    .mixed()
    .nullable()
    .required()
    .test("file", "You need to provide a file", (value) => {
      return value?.length > 0;
    }),
  description: yup.string().required(),
});

export default function Create({ session }) {
  const [err, setErr] = useState("");
  const { replace } = useRouter();
  const { mutate } = useMutation(
    async (form) =>
      await axios.post("/api/events/create", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    {
      onError: (error) => {
        console.log(error);
        setErr(error?.response?.data.message);
      },
      onSuccess: (data) => {
        console.log(data);
        replace("/events");
      },
    }
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      date: "",
    },
    resolver: yupResolver(schema),
  });

  if (session && session.user.role !== "ADMIN") {
    return <p>You are not admin</p>;
  }

  const onSubmit = async (data) => {
    const form = new FormData();
    form.append("title", data?.title);
    form.append("date", data?.date);
    form.append("description", data?.description);
    form.append("banner", data?.banner[0]);
    mutate(form);
  };

  return (
    <Layout>
      <div className="my-10 sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="my-3 text-center text-lg font-bold">Create an Event</h1>
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
              <p className="text-red-700 ml-1 mt-1">{errors.title?.message}</p>
            </div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <div className="mt-1">
              <input
                id="date"
                type="datetime-local"
                className="w-full border-gray-300 rounded-lg shadow-sm"
                {...register("date")}
              />
              <p className="text-red-700 ml-1 mt-1">{errors.date?.message}</p>
            </div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Banner
            </label>
            <div className="mt-1">
              <input
                id="banner"
                type="file"
                className="block w-full rounded-lg shadow-sm 
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-50 file:text-gray-700
                hover:file:bg-violet-100"
                {...register("banner")}
              />
              <p className="text-red-700 ml-1 mt-1">{errors.banner?.message}</p>
            </div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                cols="30"
                rows="10"
                className="w-full border-gray-300 rounded-lg shadow-sm"
                {...register("description")}
              ></textarea>
              <p className="text-red-700 ml-1 mt-1">
                {errors.description?.message}
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

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session?.role !== "ADMIN")
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  return {
    props: { session },
  };
}
