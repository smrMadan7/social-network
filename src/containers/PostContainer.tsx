import { memo } from "react";
import { FaThList } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import Post from "../components/Cards/Post";

const PostContainer = memo(({ posts }: any) => {
  return (
    <div className="border rounded-lg">
      {posts?.length === 0 ? (
        <div className="p-7 flex justify-center bg-white border rounded-lg ">
          <div className="flex flex-col items-center gap-2 text-violet-700 ">
            <FaThList fontSize={20} />
            <h1 className=" text-md text-slate-400 text-center">
              You haven't posted anything yet!
            </h1>
          </div>
        </div>
      ) : (
        <div className=" mb-9 md:mb-2">
          {posts?.map((post: any, index: any) => {
            return (
              <div key={uuidv4()}>
                <Post post={post} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default PostContainer;
