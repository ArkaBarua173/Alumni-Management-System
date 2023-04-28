import { yupResolver } from "@hookform/resolvers/yup";
import { getSession, signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Signin() {
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [signDisable, setSignDisable] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const router = useRouter();

  const onSubmit = async (data) => {
    setSignDisable(true);
    const status = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: "http://localhost:3000",
    });

    if (status.error) {
      setErr(status.error);
      setSignDisable(false);
    }

    if (status.ok) {
      router.push(status.url);
      setSignDisable(false);
    }
  };

  async function handleGoogleSignin() {
    signIn("google", { callbackUrl: "http://localhost:3000" });
  }

  return (
    <div className="my-10 sm:mx-auto sm:w-full sm:max-w-md">
      <h1 className="my-3 text-center text-lg font-bold">Sign In</h1>
      <div className="py-8 px-6 shadow rounded-lg sm:px-10 bg-base-300">
        <form
          className="mb-0 space-y-6 form-control"
          onSubmit={handleSubmit(onSubmit)}
        >
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
              placeholder="Enter your password"
              className="w-full input input-bordered"
              {...register("password")}
            />
            <span
              className="absolute top-2 right-0 icon flex items-center px-4 cursor-pointer"
              onClick={() => setShow(!show)}
            >
              {show ? <FaEye size={25} /> : <FaEyeSlash size={25} />}
            </span>
          </div>
          <p className="text-error ml-1 mt-1">{errors.password?.message}</p>
          {err && <p className="text-error">{err}</p>}
          <div>
            <button
              disabled={signDisable}
              type="submit"
              className="w-full flex justify-center py-2 px-4 btn no-animation text-white"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 btn no-animation text-white gap-3"
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
