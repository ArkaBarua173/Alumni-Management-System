import { yupResolver } from "@hookform/resolvers/yup";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .min(7)
    .max(10)
    .matches(/\d/, "Password must have a number")
    .matches(/^\S*$/, "White Spaces are not allowed")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default function Register() {
  const [show, setShow] = useState(false);
  const [showCP, setShowCP] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsDisable(true);
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    await fetch("/api/auth/signup", options)
      .then((res) => res.json())
      .then((data) => {
        if (data) push("/");
      });
    setIsDisable(false);
  };

  return (
    <div className="my-10 sm:mx-auto sm:w-full sm:max-w-md">
      <h1 className="my-3 text-center text-lg font-bold">Register</h1>
      <div className="py-8 px-6 shadow rounded-lg sm:px-10 bg-base-300">
        <form className="mb-0 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="name" className="block label">
            <span className="label-text font-bold">Name</span>
          </label>
          <div className="mt-1">
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="w-full input input-bordered"
              {...register("name")}
            />
          </div>
          <p className="text-error ml-1 mt-1">{errors.name?.message}</p>
          <label htmlFor="email" className="block label">
            <span className="label-text font-bold">Email</span>
          </label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full input input-bordered"
              {...register("email")}
            />
          </div>
          <p className="text-error ml-1 mt-1">{errors.email?.message}</p>
          <label htmlFor="password" className="block label">
            <span className="label-text font-bold">Password</span>
          </label>
          <div className="relative mt-1">
            <input
              id="password"
              type={`${show ? "text" : "password"}`}
              placeholder="Password"
              className="w-full input input-bordered"
              {...register("password")}
            />
            <span
              className="absolute top-2 right-0 icon flex items-center px-4 cursor-pointer"
              onClick={() => setShow(!show)}
            >
              {show ? (
                <FaEye size={25} color={"gray"} />
              ) : (
                <FaEyeSlash size={25} color={"gray"} />
              )}
            </span>
          </div>
          <p className="text-error ml-1 mt-1">{errors.password?.message}</p>
          <label htmlFor="corfirmPassword" className="block label">
            <span className="label-text font-bold">Confirm Password</span>
          </label>
          <div className="relative mt-1">
            <input
              id="confirmPassword"
              type={`${showCP ? "text" : "password"}`}
              placeholder="Confirm Password"
              className="w-full input input-bordered"
              {...register("confirmPassword")}
            />
            <span
              className="absolute top-2 right-0 icon flex items-center px-4 cursor-pointer"
              onClick={() => setShowCP(!showCP)}
            >
              {showCP ? (
                <FaEye size={25} color={"gray"} />
              ) : (
                <FaEyeSlash size={25} color={"gray"} />
              )}
            </span>
          </div>
          <p className="text-error ml-1 mt-1">
            {errors.confirmPassword?.message}
          </p>
          <div>
            <button
              disabled={isDisable}
              type="submit"
              className="w-full flex justify-center py-2 px-4 btn no-animation text-white"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session)
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
