import { User } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function ProfileBadge({ name, email }) {
  return (
    <Link
      to={"/profile"}
      className="flex my-auto bg-slate-500 rounded py-1 gap-2 hover:scale-[1.01] transition-transform duration-200"
    >
      <User className="w-10 h-10 ml-1 my-auto bg-white rounded-full" />
      <div className="">
        <h3 className="font-bold">{name}</h3>
        <span className="italic text-sm">{email}</span>
      </div>
    </Link>
  );
}

export default ProfileBadge;
