import React from "react";
import ProfileBadge from "../ProfileBadge";
import Sidebar from "./Sidebar";
import { useAuthStore } from "../../store/useAuthStore";

function LeftSidePanel() {
  const { authUser } = useAuthStore();
  return (
    <>
      {authUser && (
        <div className="flex flex-col justify-center gap-6">
          <ProfileBadge
            profilePic={authUser?.profilePic}
            name={authUser?.fullName}
            email={authUser?.email}
          />
          <Sidebar />
        </div>
      )}
    </>
  );
}

export default LeftSidePanel;
