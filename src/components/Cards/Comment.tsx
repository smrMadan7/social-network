import React, { useEffect, useState } from "react";

const Comment = ({ post, postDetails }: any) => {
  const [isComment, setIsComment] = useState(false);

  useEffect(() => {
    setIsComment(false);
  }, []);
  const comments = [{}, {}, {}, {}, {}];
  return (
    <div className="p-3">
      {comments.map((comment: any, index: number) => {
        return <div></div>;
      })}
    </div>
  );
};

export default Comment;
