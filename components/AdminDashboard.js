import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineHome } from "react-icons/ai";
import { MdSpaceDashboard, MdEvent } from "react-icons/md";
import { RiDiscussFill } from "react-icons/ri";
import { TfiGallery } from "react-icons/tfi";
import { ImExit } from "react-icons/im";
import { FaUsers } from "react-icons/fa";

export default function DashboardLayout({ children }) {
  const { pathname } = useRouter();
  return (
    <>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            Open Dashboard
          </label>
          <main>{children}</main>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-72 bg-neutral text-neutral-content gap-4">
            <h1 className="text-4xl font-bold ml-4 my-4">Admin</h1>

            <li className="flex">
              <Link
                className={`active:bg-neutral ${
                  pathname === "/admin" ? "border-l-2" : ""
                }`}
                style={{ borderRadius: "0px" }}
                href="/admin"
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
                  pathname === "/admin/events" ? "border-l-2" : ""
                }`}
                style={{ borderRadius: "0px" }}
                href="/admin/events"
              >
                <span>
                  <MdEvent size={20} color="white" />
                </span>
                Events
              </Link>
            </li>
            <li>
              <Link
                className={`active:bg-neutral ${
                  pathname === "/admin/forums" ? "border-l-2" : ""
                }`}
                style={{ borderRadius: "0px" }}
                href="/admin/forums"
              >
                <span>
                  <RiDiscussFill size={20} color="white" />
                </span>
                Discussions
              </Link>
            </li>
            <li>
              <Link
                className={`active:bg-neutral ${
                  pathname === "/admin/gallery" ? "border-l-2" : ""
                }`}
                style={{ borderRadius: "0px" }}
                href="/admin/gallery"
              >
                <span>
                  <TfiGallery size={20} color="white" />
                </span>
                Gallery
              </Link>
            </li>
            <li>
              <Link
                className={`active:bg-neutral ${
                  pathname === "/admin/users" ? "border-l-2" : ""
                }`}
                style={{ borderRadius: "0px" }}
                href="/admin/users"
              >
                <span>
                  <FaUsers size={20} color="white" />
                </span>
                Users
              </Link>
            </li>
            <div className="w-full bg-slate-50 h-1 my-2"></div>
            <li>
              <Link style={{ borderRadius: "0px" }} href="/">
                <span>
                  <AiOutlineHome size={20} color="white" />
                </span>
                Back To Home
              </Link>
            </li>
            <li>
              <Link style={{ borderRadius: "0px" }} href="/">
                <span>
                  <ImExit size={20} color="white" />
                </span>
                Sign Out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
