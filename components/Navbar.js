import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";
// import Loading from "./Loading";

export default function Navbar() {
  const { data: session, status } = useSession();

  function handleSignOut() {
    signOut();
  }

  const avatar = useMemo(() => {
    return createAvatar(initials, {
      size: 128,
      seed: session?.name,
    }).toDataUriSync();
  }, []);

  return (
    <div className="navbar bg-base-300">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-5 p-2 shadow bg-base-300 rounded-box w-52"
          >
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/forum">Forum</Link>
            </li>
            <li>
              <Link href="/events">Events</Link>
            </li>
            <li>
              <Link href="/gallery">Gallery</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="flex gap-3 ml-2 cursor-pointer normal-case text-xl ">
          <span>
            <Image
              src={"/assets/nstu_logo.svg"}
              width={37}
              height={37}
              alt={"Nstu logo"}
              className="text-white"
            />
          </span>
          <div className="font-bold pt-3">
            <h1 className="text-xs">
              Noakhali Science and Technology University
            </h1>
            <h1 className="text-lg">Alumni Management System</h1>
          </div>
        </div>
      </div>
      <div className="navbar hidden lg:flex lg:justify-end">
        <ul className="menu menu-horizontal px-1 gap-x-2">
          <li>
            <Link href="/" className="font-bold">
              Home
            </Link>
          </li>
          <li>
            <Link href="/forum" className="font-bold active:bg-neutral">
              Forum
            </Link>
          </li>
          <li>
            <Link href="/events" className="font-bold active:bg-neutral">
              Events
            </Link>
          </li>
          <li>
            <Link href="/gallery" className="font-bold active:bg-neutral">
              Gallery
            </Link>
          </li>
          <li>
            <Link href="/about" className="font-bold active:bg-neutral">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="font-bold active:bg-neutral">
              Contact
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end lg:justify-end lg:w-auto">
        {status === "unauthenticated" ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <Image
                  src={"/assets/user_profile.svg"}
                  width={100}
                  height={100}
                  alt={"User image"}
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-5 p-2 shadow menu menu-compact dropdown-content bg-base-300 rounded-box w-52"
            >
              <li>
                <Link
                  className="justify-between active:bg-neutral"
                  href="/auth/signin"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  className="justify-between active:bg-neutral"
                  href="/auth/register"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                {status === "authenticated" ? (
                  <Image
                    src={session?.user.image || avatar}
                    width={100}
                    height={100}
                    alt={"User image"}
                  />
                ) : (
                  <Image
                    src={"/assets/user_profile.svg"}
                    width={100}
                    height={100}
                    alt={"User image"}
                  />
                )}
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-5 p-2 shadow menu menu-compact dropdown-content bg-base-300 rounded-box w-52"
            >
              <li>
                <Link
                  className="justify-between active:bg-neutral"
                  href={"/profile"}
                >
                  Profile
                </Link>
              </li>
              {session?.role === "ADMIN" && (
                <li>
                  <Link
                    className="justify-between active:bg-neutral"
                    href={"/admin"}
                  >
                    Admin Dashboard
                  </Link>
                </li>
              )}
              <li>
                <a onClick={handleSignOut}>Logout</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
