import { useEffect, useState } from "react";
import { BiArrowBack, BiEdit } from "react-icons/bi";
import { FaThList } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { GrFormClose } from "react-icons/gr";
import { ipfsGateway, updateComment } from "../../constants/AppConstants";
import { useUserContext } from "../../context/UserContextProvider";
import { customPost } from "../../fetch/customFetch";
import { getInnerHtml } from "../../utils/geteInnerHtml";
import { timeAgo } from "../../utils/timeAgo";
import { updateContent } from "../../utils/updateContent";
import PostProfile from "./PostProfile";

const Comment = ({ comments, setRefetch, postId }: any) => {
  const [isUpdatePopup, setIsUpdatePopup] = useState(false);
  const [commentDetails, setCommentDetails] = useState<any>();
  const [commentId, setCommentId] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const [postProfileStatus, setPostProfileStatus] = useState(false);
  const [commentedProfileAddress, setCommentedProfileAddress] = useState(false);
  const { appState }: any = useUserContext();
  const [fetchData, setFetchData] = useState<any>();

  useEffect(() => {
    setCommentDetails({});
    setIsUpdated(false);
  }, []);

  useEffect(() => {
    if (fetchData?.status) {
      setRefetch(true);
      setIsUpdatePopup(false);
      setIsUpdated(true);
      setTimeout(() => {
        setIsUpdated(false);
      }, 3000);
    }
  }, [fetchData]);

  const commentUpdate = () => {
    const params = {
      postId: postId,
      commentId: commentDetails?.commentId,
      comment: getInnerHtml("updated-comment").innerHTML,
      commenter: appState?.action?.user?.address,
      tags: [],
      timestamp: commentDetails?.timestamp,
    };
    customPost(params, updateComment, "POST", setFetchData, "updating comment");
  };

  return (
    <>
      {postProfileStatus && (
        <div className="w-100 fixed z-10  top-0 bottom-0 right-0 left-0 items-center m-auto h-screen bg-blackOverlay">
          <div className="text-white flex items-center justify-center flex m-auto h-screen">
            <div className=" w-90 2xl:w-40 md:w-40  border rounded-lg text-black bg-white duration-75">
              <div className="flex justify-between p-3 border-b ">
                <p className="text-xl font-bold">Profile Details</p>
                <div
                  className="px-1 py-1 rounded-full cursor-pointer hover:bg-gray-300"
                  onClick={() => {
                    setPostProfileStatus(false);
                    setRefetch(true);
                  }}
                >
                  <GrFormClose color="black" fontSize={25} />
                </div>
              </div>
              <PostProfile post={commentedProfileAddress} />
            </div>
          </div>
        </div>
      )}

      {isUpdated && (
        <div
          className="absolute text-center  top-0 right-0 left-0 bottom-0 "
          style={{ zIndex: 13, height: "30px" }}
        >
          <p className="text-violet-700 font-semibold text-xl pt-3">Success!</p>
        </div>
      )}
      {comments?.length > 0 ? (
        <div
          className="relative p-3"
          onClick={() => {
            if (isUpdatePopup) {
              setIsUpdatePopup(false);
            }
          }}
        >
          {comments.map((comment: any, index: number) => {
            const imageUrl = `${ipfsGateway}${comment?.commenterProfilePic}`;

            return (
              <div key={index} className="mb-5 relative ">
                <div className="">
                  {/* user profile */}

                  <div className="flex gap-3 justify-between">
                    <div className="flex gap-3">
                      <div
                        style={{ height: "50px", width: "50px" }}
                        className="cursor-pointer"
                        onClick={() => {
                          setCommentedProfileAddress(comment?.commenter);
                          setPostProfileStatus(true);
                        }}
                      >
                        <img
                          alt="profile-picture"
                          height="50px"
                          width="50px"
                          className="border rounded-full"
                          src={imageUrl}
                          loading="lazy"
                        ></img>{" "}
                      </div>
                      <div className="text-md flex flex-col gap-3 ">
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setCommentedProfileAddress(comment?.commenter);
                            setPostProfileStatus(true);
                          }}
                        >
                          <p className="flex gap-2 font-bold">
                            {comment?.commenterDisplayName}{" "}
                            <span className="text-md  text-gray-500 font-none">
                              @{comment?.commenterHandle}
                            </span>
                          </p>

                          <span className="font-normal text-gray">
                            {" "}
                            {timeAgo(comment?.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {comment?.commenter === appState?.action?.user?.address && (
                      <div className="px-3">
                        <button
                          className="border rounded-full p-2 hover:bg-bgHover"
                          onClick={() => {
                            if (isUpdatePopup) {
                              setIsUpdatePopup(false);
                            } else {
                              setIsUpdatePopup(true);
                              setCommentId(comment?.commentId);
                            }
                            setCommentDetails(comment);
                          }}
                        >
                          <BiEdit size={20} />
                        </button>{" "}
                      </div>
                    )}
                  </div>
                  <div>
                    {" "}
                    <div className=" flex flex-col gap-1 whitespace-nowrap ml-14 md:ml-16">
                      {/* comment content */}
                      {comment?.commenter === appState?.action?.user?.address ? (
                        <>
                          {isUpdatePopup && commentId === comment?.commentId ? (
                            <div
                              dangerouslySetInnerHTML={{ __html: comment?.comment }}
                              id="updated-comment"
                              contentEditable="true"
                              onClick={(e) => e.stopPropagation()}
                              className="overflow-y-auto resize-none text-black outline-none prevent-select rounded-lg p-2"
                              style={
                                isUpdatePopup && comment?.commentId == commentId
                                  ? { maxHeight: "100px", border: "1px solid grey" }
                                  : {}
                              }
                            ></div>
                          ) : (
                            <div
                              className=" resize-none text-black prevent-select outline-none overflow-y-auto"
                              style={{ maxHeight: "100px" }}
                              dangerouslySetInnerHTML={{ __html: updateContent(comment?.comment) }}
                            ></div>
                          )}
                        </>
                      ) : (
                        <div
                          className="resize-none text-black prevent-select outline-none"
                          dangerouslySetInnerHTML={{ __html: updateContent(comment?.comment) }}
                        ></div>
                      )}
                    </div>
                  </div>
                </div>
                {isUpdatePopup && commentId == comment?.commentId && (
                  <div className="absolute right-0 bottom-1 px-3">
                    <div className="flex gap-2">
                      <div>
                        <button
                          className=" p-1 rounded-full bg-bgHover hover:bg-bgActive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsUpdatePopup(false);
                          }}
                        >
                          <BiArrowBack fontSize={20} />
                        </button>
                      </div>
                      <div>
                        <button
                          className="p-1 rounded-full text-black bg-bgHover hover:bg-bgActive"
                          onClick={(e) => {
                            e.stopPropagation();
                            commentUpdate();
                          }}
                        >
                          <GiCheckMark fontSize={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-7 flex justify-center bg-white  rounded-lg ">
          <div className="flex flex-col items-center gap-2 text-violet-700 ">
            <FaThList fontSize={20} />
            <h1 className=" text-md text-slate-400">No Comments!</h1>
          </div>
        </div>
      )}

      <style>
        {`
        .handle {
            background: rgb(203,66,252);
            background: linear-gradient(90deg, rgba(203,66,252,1) 22%, rgba(252,91,216,1) 79%);
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
        }`}
      </style>
    </>
  );
};

export default Comment;
