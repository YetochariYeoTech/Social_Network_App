import LeftSidePanel from "../components/Post/LeftSidePanel";
import MiddlePanel from "../components/Post/MiddlePanel";
import RightSidePanel from "../components/Post/RightSidePanel";

const PostPage = () => {
  return (
    <div className="flex pt-20 justify-around w-full">
      {/* Hidden on small screens */}
      <div className="hidden md:block rounded w-2/12 overflow-visible">
        <LeftSidePanel />
      </div>

      {/* Main Content */}
      <div className="rounded text-neutral-content w-full md:w-6/12">
        <MiddlePanel />
      </div>

      {/* Right Panel */}
      <div className="hidden md:block rounded w-2/12 bg-green-900">
        <RightSidePanel />
      </div>
    </div>
  );
};

export default PostPage;
