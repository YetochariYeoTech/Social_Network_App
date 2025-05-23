import { User } from "lucide-react";
import React from "react";

function ProfileBadge({ name, email }) {
  return (
    <div className="flex my-auto bg-slate-500 rounded py-1 ">
      <User className="w-10 h-10" />
      <div className="">
        <h3 className="font-bold">{name}</h3>
        <span>{email}</span>
      </div>
    </div>
  );
}

export default ProfileBadge;
