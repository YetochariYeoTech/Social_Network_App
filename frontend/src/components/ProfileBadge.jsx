import React from "react";
import { Link } from "react-router-dom";

function ProfileBadge({ name, email, profilePic }) {
  return (
    <Link
      to={"/profile"}
      className="flex my-auto bg-white rounded-lg py-1 gap-2 hover:scale-[1.01] transition-transform duration-200"
    >
      <img
        src={profilePic || "/avatar.png"}
        className="w-10 h-10 ml-1 my-auto bg-white rounded-full"
      />
      <div className="">
        <h3 className="font-bold">{name.slice(0, 14) + "..."}</h3>
        <span className="italic text-sm">{email.slice(0, 14) + "..."}</span>
      </div>
    </Link>
  );
}

export default ProfileBadge;
