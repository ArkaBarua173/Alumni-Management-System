import Layout from "@/components/Layout";
import Link from "next/link";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { BsFacebook, BsTwitter } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Contact() {
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    user_name: "",
    user_email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);
    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_SERVICE_ID,
        process.env.NEXT_PUBLIC_TEMPLATE_ID,
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log(result.text);
          setIsLoading(false);
          toast("You will get back to you as soon as possible", {
            icon: "😊",
          });
          setForm({
            user_name: "",
            user_email: "",
            message: "",
          });
        },
        (error) => {
          console.log(error.text);
        }
      );
  };
  return (
    <>
      <Layout />
      <div>
        <div className="flex w-4/5 mx-auto">
          <div className="flex-1">
            <div className="my-10 md:w-11/12 md:max-w-5xl sm:mx-auto sm:w-full sm:max-w-md">
              <h1 className="mb-8 text-center text-lg font-bold">
                Send us a message
              </h1>
              <div className="py-4 px-6 shadow rounded-lg sm:px-10 bg-base-300">
                <form
                  className="mb-0 space-y-6 form-control"
                  ref={formRef}
                  onSubmit={sendEmail}
                >
                  <label htmlFor="user_name" className="block label">
                    <span className="label-text font-bold">Name</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="user_name"
                      value={form.user_name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full input input-bordered"
                      required
                    />
                  </div>
                  <label htmlFor="user_email" className="block label">
                    <span className="label-text font-bold">Email</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="user_email"
                      value={form.user_email}
                      onChange={handleChange}
                      placeholder="Enter your mail"
                      className="w-full input input-bordered"
                      required
                    />
                  </div>
                  <label htmlFor="user_email" className="block label">
                    <span className="label-text font-bold">Message</span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      name="message"
                      rows={7}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Write your message"
                      className="w-full input input-bordered"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-2 px-4 btn no-animation text-white"
                      value={"Send"}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="w-2/5">
            <div className="my-10">
              <h1 className="mb-8 text-center text-lg font-bold">Contact</h1>
              <div className="py-4 px-6 shadow rounded-lg sm:px-10 bg-base-300">
                <p className="mb-4 mt-4">
                  <span className="font-semibold">Email: </span>{" "}
                  arkbarua@gmail.com
                </p>
                <p className="mb-4">
                  <span className="font-semibold">Phone: </span> 01101 110011
                </p>
                <p className="mb-4">
                  <span className="font-semibold">Address: </span> Science and
                  Technology University Sonapur, University Rd, Noakhali 3814
                </p>
              </div>
            </div>
            <div className="my-10">
              <h1 className="mb-8 text-center text-lg font-bold">Follow Us</h1>
              <div className="py-4 px-6 shadow rounded-lg sm:px-10 bg-base-300 text-center">
                <Link
                  href={"https://www.facebook.com/"}
                  target="_blank"
                  className="mb-5 mt-4 flex items-center gap-4"
                >
                  <span className="">
                    <BsFacebook size={20} />
                  </span>{" "}
                  Facebook
                </Link>
                <Link
                  href={"https://www.instagram.com"}
                  target="_blank"
                  className="mb-5 mt-4 flex gap-4"
                >
                  <span>
                    <FaInstagram size={20} />
                  </span>{" "}
                  Instagram
                </Link>
                <Link
                  href={"https://www.twitter.com"}
                  target="_blank"
                  className="mb-4 mt-4 flex gap-4"
                >
                  <span className="">
                    <BsTwitter size={20} />
                  </span>{" "}
                  Twitter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
