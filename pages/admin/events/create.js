import { getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminDashboard from "@/components/AdminDashboard";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(import("react-quill"), { ssr: false });

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

const schema = yup.object().shape({
  title: yup.string().required(),
  date: yup.date().required(),
  banner: yup
    .mixed()
    .nullable()
    .required()
    .test("File", "You need to provide a file", (value) => {
      return value?.length > 0;
    })
    .test(
      "Format",
      "Only image file [ jpg, jpeg, png ] is allowed",
      (value) => {
        return value && SUPPORTED_FORMATS.includes(value[0]?.type);
      }
    )
    .test("FileSize", "File size should be less than 1 mb", (value) => {
      return value && value[0]?.size <= 1024 * 1024;
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
        replace("/admin/events");
      },
    }
  );
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      date: "",
    },
    resolver: yupResolver(schema),
  });
  // const [initialRenderComplete, setInitialRenderComplete] = useState(false);

  // This useEffect will only run once, during the first client render
  useEffect(() => {
    // Updating a state causes a re-render
    register("description", { required: true, minLength: 11 });
  }, [register]);

  const modules = [];

  const onEditorStateChange = (editorState) => {
    setValue("description", editorState);
  };

  const editorContent = watch("description");

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
    // console.log(data);
  };

  return (
    <AdminDashboard>
      <div className="my-10 md:w-11/12 md:max-w-5xl sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="my-3 text-center text-lg font-bold">Create an Event</h1>
        <div className="py-8 px-6 shadow rounded-lg sm:px-10 bg-base-300">
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
              <p className="text-red-700 ml-1 mt-1">{errors.title?.message}</p>
            </div>
            <label htmlFor="date" className="block label">
              <span className="label-text font-bold">Date</span>
            </label>
            <div className="mt-1">
              <input
                id="date"
                type="datetime-local"
                className="w-full input input-bordered"
                {...register("date")}
              />
              <p className="text-red-700 ml-1 mt-1">{errors.date?.message}</p>
            </div>
            <label htmlFor="banner" className="block label">
              <span className="label-text font-bold">Banner</span>
            </label>
            <div className="mt-1">
              <input
                id="banner"
                type="file"
                className="block w-full rounded-lg shadow-sm text-base-content 
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-base-100 file:text-base-content
                hover:file:bg-base-200"
                {...register("banner")}
              />
              <p className="text-red-700 ml-1 mt-1">{errors.banner?.message}</p>
            </div>
            <label htmlFor="description" className="block label">
              <span className="label-text font-bold">Description</span>
            </label>
            <div className="mt-1">
              <ReactQuill
                id="description"
                name="description"
                // theme="snow"
                className=""
                placeholder="Type description........."
                value={editorContent}
                onChange={onEditorStateChange}
              />
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
    </AdminDashboard>
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
