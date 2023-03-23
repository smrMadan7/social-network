import React from "react";
import { v4 as uuidv4 } from "uuid";
import { postComment } from "../../constants/AppConstants";
import { useUserContext } from "../../context/UserContextProvider";
import { customPost } from "../../fetch/customFetch";
import { getInnerHtml } from "../../utils/geteInnerHtml";

const AddComment = ({ postId, setAddCommentResult }: any) => {
  const { appState }: any = useUserContext();

  // Add a new comment
  const addComment = async (e: any) => {
    e.preventDefault();
    const params = {
      postId: postId,
      commentId: uuidv4(),
      commenter: appState?.action?.user?.address,
      comment: getInnerHtml("content").innerHTML,
      tage: ["@madan"],
    };

    customPost(params, postComment, "POST", setAddCommentResult, "adding comment");
  };

  return (
    <div className="absolute w-full bottom-2 px-5 py-3 flex gap-2">
      <form onSubmit={addComment} className="flex w-full gap-2">
        <div
          style={{ maxHeight: "43px" }}
          className="w-full p-2 overflow-y-auto cursor-pointer focus:outline-none select-text whitespace-pre-wrap break-words border rounded-lg"
          contentEditable="true"
          id="content"
          onKeyDown={(e: any) => {}}
          data-placeholder="Add a comment..."
        ></div>
        <div>
          <button
            className="border rounded-lg bg-violet-700 hover:bg-violet-900 py-2 px-4 text-white"
            type="submit"
          >
            ADD
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddComment;
