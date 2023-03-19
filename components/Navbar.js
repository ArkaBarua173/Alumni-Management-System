import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
// import Loading from "./Loading";

export default function Navbar() {
  const { data: session, status } = useSession();

  function handleSignOut() {
    signOut();
  }

  return (
    <div className="navbar bg-accent text-primary-content">
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
            className="menu menu-compact dropdown-content mt-5 p-2 shadow bg-primary rounded-box w-52"
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
          </ul>
        </div>
        <div className="flex gap-3 ml-2 cursor-pointer normal-case text-xl ">
          <span>
            <Image
              src={"/assets/nstu_logo.png"}
              width={37}
              height={37}
              alt={"Nstu logo"}
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
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-x-2">
          <li>
            <Link href="/" className="font-bold active:bg-neutral">
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
            <Link href="/events" className="font-bold active:bg-neutral">
              About
            </Link>
          </li>
          <li>
            <Link href="/events" className="font-bold active:bg-neutral">
              Contact
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
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
              className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-primary rounded-box w-52"
            >
              <li>
                <a href="/auth/signin">Login</a>
              </li>
              <li>
                <a href="/auth/register">Register</a>
              </li>
            </ul>
          </div>
        ) : (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                {/* <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" /> */}
                <Image
                  src={session?.user.image || "/assets/user_profile.svg"}
                  width={100}
                  height={100}
                  alt={"User image"}
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-5 p-2 shadow menu menu-compact dropdown-content bg-primary rounded-box w-52"
            >
              <li>
                <Link
                  className="justify-between active:bg-neutral"
                  href={"/profile"}
                >
                  Profile
                </Link>
              </li>
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
