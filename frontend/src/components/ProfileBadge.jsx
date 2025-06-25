import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@chakra-ui/react";

function ProfileBadge({ name = "", email = "", profilePic = "" }) {
  return (
    <Link
      to={"/profile"}
      className="flex my-auto bg-base-200 text-base-content rounded-lg pl-1 pt-1 pb-1 gap-2 hover:scale-[1.01] transition-transform duration-200"
    >
      <Avatar.Root size="lg">
        <Avatar.Fallback name={name} />
        <Avatar.Image src={profilePic} />
      </Avatar.Root>
      <div className="">
        <h3 className="font-bold">
          {name?.length > 14 ? name.slice(0, 14) + "..." : name}
        </h3>
        <span className="italic text-sm">{email.slice(0, 14) + "..."}</span>
      </div>
    </Link>
  );
}

export default ProfileBadge;
