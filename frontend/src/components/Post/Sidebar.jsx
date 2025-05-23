import { Link } from "react-router-dom";
import { File } from "lucide-react";
import { FaUserFriends, FaPhotoVideo, FaMusic, FaBook } from "react-icons/fa";
import { useThemeStore } from "../../store/useThemeStore";

function Sidebar() {
  const { theme } = useThemeStore();
  const commonClass =
    "font-semibold pl-1 flex w-full gap-4 h-10 items-center hover:bg-gray-300 hover:text-black hover:border-l-4 border-primary duration-100 ease-linear hover:translate-x-1 transition-transform";
  return (
    <div
      className=" flex flex-col gap-2 w-full rounded-br-md bg-white text-gray-600"
      data-theme={theme}
    >
      <Link to="/" className={commonClass}>
        <File className="w-6 h-6" />
        <span>Files</span>
      </Link>
      <Link to="/" className={commonClass}>
        <FaUserFriends className="w-6 h-6" />
        <span>Friends</span>
      </Link>
      <Link to="/" className={commonClass}>
        <FaPhotoVideo className="w-6 h-6" />
        <span>Videos</span>
      </Link>
      <Link to="/" className={commonClass}>
        <FaMusic className="w-6 h-6" />
        <span>Music</span>
      </Link>
      <Link to="/" className={commonClass}>
        <FaBook className="w-6 h-6" />
        <span>Books</span>
      </Link>
    </div>
  );
}

export default Sidebar;
