import Layout from "@/components/Layout";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

const schema = yup.object().shape({
  name: yup.string().required(),
  department: yup.string().required(),
});

export default function Create() {
  const [err, setErr] = useState("");
  const queryClient = useQueryClient();
  const { replace } = useRouter();
  const { mutate } = useMutation(
    async (data) => await axios.post("/api/profile/admin/degrees/create", data),
    {
      onError: (error) => {
        console.log(error);
        setErr(error?.response?.data.message);
      },
      onSuccess: (data) => {
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
      name: "",
      department: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    mutate(data);
  };

  return (
    <Layout>
      <div className="my-10 md:w-11/12 md:max-w-5xl sm:mx-auto sm:w-full sm:max-w-md ">
        <h1 className="mb-8 text-center text-lg font-bold">Add a new degree</h1>
        <div className="py-4 px-6 shadow rounded-lg sm:px-10 bg-slate-200">
          <form className="mb-0 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div className="mt-1">
              <input
                id="name"
                type="text"
                placeholder="Enter the name of the degree"
                className="w-full border-gray-300 rounded-lg shadow-sm"
                {...register("name")}
              />
              <p
                className={`font-bold text-sm mt-2 ml-1 ${
                  watch("name")?.length > 100 ? "text-red-700" : "text-gray-700"
                }`}
              >{`${watch("name")?.length}/100`}</p>
              <p className="text-red-700 ml-1 mt-1">{errors.name?.message}</p>
            </div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700"
            >
              Department
            </label>
            <div className="mt-1">
              <input
                id="department"
                type="text"
                placeholder="Enter the name of the department"
                className="w-full border-gray-300 rounded-lg shadow-sm"
                {...register("department")}
              />
              <p
                className={`font-bold text-sm ml-1 mt-2 ${
                  watch("department")?.length > 100
                    ? "text-red-700"
                    : "text-gray-700"
                }`}
              >{`${watch("department")?.length}/100`}</p>
              <p className="text-red-700 ml-1 mt-1">
                {errors.department?.message}
              </p>
            </div>
            {err && <p className="text-red-700 ml-1 mt-1">{err}</p>}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 btn no-animation text-white"
              >
                Add Degree
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

  if (!session || session?.role !== "ADMIN")
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
