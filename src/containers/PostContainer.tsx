import { memo } from "react";
import { FaThList } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import EmptyPost from "../components/Cards/EmptyPost";
import Post from "../components/Cards/Post";

const PostContainer = memo(({ posts }: any) => {
  return (
    <div className="border rounded-lg">
      {posts?.length === 0 ? (
        <>
          <EmptyPost content={"You haven't posted anything yet!"} />
        </>
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
