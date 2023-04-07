import AdminDashboard from "@/components/AdminDashboard";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

const schema = yup.object().shape({
  title: yup.string().required(),
  photo: yup
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
        return value && SUPPORTED_FORMATS.includes(value[0].type);
      }
    )
    .test("FileSize", "File size should be less than 1 mb", (value) => {
      return value && value[0].size <= 1024 * 1024;
    }),
});

export default function Create() {
  const [err, setErr] = useState("");
  const { replace } = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      photo: "",
    },
    resolver: yupResolver(schema),
  });

  const { mutate } = useMutation(
    async (form) =>
      await axios.post("/api/gallery/create", form, {
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
        replace("/admin/gallery");
      },
    }
  );

  const onSubmit = (data) => {
    const form = new FormData();
    form.append("title", data?.title);
    form.append("photo", data?.photo[0]);
    mutate(form);
  };
  return (
    <AdminDashboard>
      <div className="my-10 md:w-11/12 md:max-w-5xl sm:mx-auto sm:w-full sm:max-w-md ">
        <h1 className="mb-8 text-center text-lg font-bold">Add Photo</h1>
        <div className="py-4 px-6 shadow rounded-lg sm:px-10 bg-base-200">
          <form className="mb-0 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="title" className="block label">
              <span className="label-text font-bold">Title</span>
            </label>
            <div className="mt-1">
              <input
                id="title"
                type="text"
                placeholder="Enter the title of the photo"
                className="w-full input input-bordered"
                {...register("title")}
              />
              <p
                className={`font-bold text-sm mt-2 ml-1 ${
                  watch("title").length > 50
                    ? "text-red-700"
                    : "text-base-content"
                }`}
              >{`${watch("title").length}/50`}</p>
              <p className="text-red-700 ml-1 mt-1">{errors.title?.message}</p>
            </div>
            <div className="mt-1">
              <input
                id="photo"
                type="file"
                className="block w-full rounded-lg shadow-sm text-base-content 
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-base-100 file:text-base-content
                hover:file:bg-base-200"
                {...register("photo")}
              />
              <p className="text-red-700 ml-1 mt-1">{errors.photo?.message}</p>
            </div>
            {err && <p className="text-red-700 ml-1 mt-1">{err}</p>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 btn no-animation text-white"
              >
                Add Photo
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminDashboard>
  );
}
