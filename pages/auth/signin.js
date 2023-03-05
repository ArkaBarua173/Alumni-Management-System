import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signin() {
  const [show, setShow] = useState(false);
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    const status = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: "http://localhost:3000",
    });

    if (status.ok) router.push(status.url);
  };

  async function handleGoogleSignin() {
    signIn("google", { callbackUrl: "http://localhost:3000" });
  }

  return (
    <div className="my-10 sm:mx-auto sm:w-full sm:max-w-md">
      <h1 className="my-3 text-center text-lg font-bold">Sign In</h1>
      <div className="py-8 px-6 shadow rounded-lg sm:px-10 bg-slate-300">
        <form className="mb-0 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full border-gray-300 rounded-lg shadow-sm"
              {...register("email")}
            />
          </div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative mt-1">
            <input
              id="password"
              type={`${show ? "text" : "password"}`}
              placeholder="Enter your password"
              className="w-full border-gray-300 rounded-lg shadow-sm"
              {...register("password")}
            />
            <span
              className="absolute top-2 right-0 icon flex items-center px-4 cursor-pointer"
              onClick={() => setShow(!show)}
            >
              {show ? <FaEye size={25} /> : <FaEyeSlash size={25} />}
            </span>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex gap-2 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-slate-100 hover:bg-slate-200 focus:ring-offset-2 focus:ring-slate-50"
              onClick={handleGoogleSignin}
            >
              Sign in with Google{" "}
              <Image
                src={"/assets/google.svg"}
                width="20"
                height={20}
                alt={"Google icon"}
              ></Image>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
