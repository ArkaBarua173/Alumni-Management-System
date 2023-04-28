import Link from "next/link";
import { useRouter } from "next/router";
import { AiFillProfile, AiOutlineHome } from "react-icons/ai";
import { MdSpaceDashboard } from "react-icons/md";
import { RiDiscussFill } from "react-icons/ri";
import { ImExit } from "react-icons/im";
import { signOut } from "next-auth/react";

export default function Layout({ children }) {
  const { pathname } = useRouter();
  return (
    <>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col ">
          {/* items-center justify-center */}
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            Open drawer
          </label>
          <main>{children}</main>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-neutral text-neutral-content gap-4">
            <h1 className="text-4xl font-bold ml-4 my-4">Profile</h1>

            <li className="flex">
              <Link
                className={`active:bg-neutral ${
                  pathname === "/profile" ? "border-l-2" : ""
                }`}
                style={{ borderRadius: "0px" }}
                href="/profile"
              >
                <span>
                  <MdSpaceDashboard size={20} color="white" />
                </span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                className={`active:bg-neutral ${
                  pathname === "/profile/info" ? "border-l-2" : ""
                }`}
                style={{ borderRadius: "0px" }}
                href="/profile/info"
              >
                <span>
                  <AiFillProfile size={20} color="white" />
                </span>
                Change Info
              </Link>
            </li>
            <li>
              <Link
                className={`active:bg-neutral ${
                  pathname === "/profile/forum" ? "border-l-2" : ""
                }`}
                style={{ borderRadius: "0px" }}
                href="/profile/forum"
              >
                <span>
                  <RiDiscussFill size={20} color="white" />
                </span>
                Discussions
              </Link>
            </li>
            <div className="w-full bg-slate-50 h-1 my-6"></div>
            <li>
              <Link style={{ borderRadius: "0px" }} href="/">
                <span>
                  <AiOutlineHome size={20} color="white" />
                </span>
                Back To Home
              </Link>
            </li>
            <li>
              <div style={{ borderRadius: "0px" }} onClick={() => signOut()}>
                <span>
                  <ImExit size={20} color="white" />
                </span>
                Log Out
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
