import { useState } from "react";
import ProfileContent from "./ProfileContent";
import ForumContent from "./ForumContent";

export default function UserTab({ user }) {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="bg-neutral text-neutral-content w-9/12 self-center my-8 rounded p-8">
      <div className="tabs justify-center my-8">
        <div
          className={`tab tab-bordered ${
            activeTab === "Profile" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("Profile")}
        >
          Profile
        </div>
        <div
          className={`tab tab-bordered ${
            activeTab === "Discussions" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("Discussions")}
        >
          Discussions
        </div>
      </div>
      {activeTab === "Profile" ? (
        <ProfileContent data={user} />
      ) : (
        <ForumContent data={user?.topic} />
      )}
    </div>
  );
}
