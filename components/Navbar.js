import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  console.log(session);

  function handleSignOut() {
    signOut();
  }

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">
          Alumni Management System
        </a>
      </div>
      <div className="flex gap-2">
        <ul className="menu menu-vertical lg:menu-horizontal bg-base-100 rounded-box">
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>Forum</a>
          </li>
          <li>
            <a>Events</a>
          </li>
        </ul>
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
              className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
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
              className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">Profile</a>
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
