import LeftSidePanel from "../components/Post/LeftSidePanel";
import MiddlePanel from "../components/Post/MiddlePanel";
import RightSidePanel from "../components/Post/RightSidePanel";

const PostPage = () => {
  return (
    <div className="flex h-screen pt-20 justify-around w-full bg-slate-400">
      <div className="rounded w-2/12">
        <LeftSidePanel />
      </div>
      <div className="rounded bg-blue-200 w-7/12">
        <MiddlePanel />
      </div>
      <div className="rounded w-2/12 bg-green-900">
        <RightSidePanel />
      </div>
    </div>
  );
};

export default PostPage;
