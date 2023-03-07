import React, { useEffect, useState } from "react";
import { BiLike } from "react-icons/bi";

const Comment = ({ post, postDetails }: any) => {
  const [isComment, setIsComment] = useState(false);

  useEffect(() => {
    setIsComment(false);
  }, []);
  const comments = [{}, {}, {}, {}, {}, {}, {}];
  return (
    <div className="p-3 ">
      {comments.map((comment: any, index: number) => {
        return (
          <div key={index} className="mb-5">
            <div className="flex gap-3">
              {/* user profile */}
              <div>
                <img
                  alt="profile-picture"
                  height="50px"
                  width="50px"
                  className="border rounded-full"
                  src="http://44.214.42.39:8080/ipfs/QmNPLd1Lnd8aBXAqQj45DSptYUr7JryXmzZcH9ho9FK2yi"
                  loading="lazy"
                ></img>
              </div>

              {/* User anme */}
              <div className="flex flex-col gap-1">
                <div className="text-md font-bold">
                  White <span className="font-normal"> 1 year ago</span>
                </div>
                {/* comment content */}
                <div>
                  Good morning to everyone this is going to the test comment. and no need to test.
                </div>
                {/* like  */}
                <div className="flex gap-1">
                  <BiLike className="cursor-pointer mt-1 " />
                  <span className="mb-1">2</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Comment;
