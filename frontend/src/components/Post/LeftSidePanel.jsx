import React from "react";
import ProfileBadge from "../ProfileBadge";
import Sidebar from "./Sidebar";
import { useAuthStore } from "../../store/useAuthStore";

function LeftSidePanel() {
  const { authUser } = useAuthStore();
  return (
    <div className="flex-col justify-center">
      {authUser && (
        <>
          <ProfileBadge name={authUser?.fullName} email={authUser?.email} />
          <Sidebar />
        </>
      )}
    </div>
  );
}

export default LeftSidePanel;
