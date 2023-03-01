import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function Register() {
  const { register, handleSubmit } = useForm();

  const router = useRouter();

  const onSubmit = async (data) => {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    await fetch("http://localhost:3000/api/auth/signup", options)
      .then((res) => res.json())
      .then((data) => {
        if (data) router.push("http://localhost:3000");
      });
  };

  return (
    <div className="my-10 sm:mx-auto sm:w-full sm:max-w-md">
      <h1 className="my-3 text-center text-lg font-bold">Register</h1>
      <div className="py-8 px-6 shadow rounded-lg sm:px-10 bg-slate-300">
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
              placeholder="Enter your name"
              className="w-full border-gray-300 rounded-lg shadow-sm"
              {...register("name")}
            />
          </div>
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
          <div className="mt-1">
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full border-gray-300 rounded-lg shadow-sm"
              {...register("password")}
            />
          </div>
          <label
            htmlFor="cPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <div className="mt-1">
            <input
              id="cPassword"
              type="password"
              placeholder="Confirm Password"
              className="w-full border-gray-300 rounded-lg shadow-sm"
              // {...register("cPassword")}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
