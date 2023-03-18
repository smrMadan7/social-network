import { useEffect, useState } from "react";
import { AiTwotoneHeart } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsHeart } from "react-icons/bs";
import { FaShareSquare } from "react-icons/fa";
import { GrFormClose } from "react-icons/gr";
import { TbMessage } from "react-icons/tb";
import { Tooltip } from "react-tooltip";
import { getComment, getUser, ipfsGateway } from "../../constants/AppConstants";
import { useUserContext } from "../../context/UserContextProvider";
import { timeAgo } from "../../utils/timeAgo";
import Comment from "./Comment";
import LikedProfile from "./LikedAndSharedProfile";

const Post = (post: any) => {
  const [postDetails, setPostDetails] = useState<any>();
  const { appState }: any = useUserContext();
  const [likedProfileStatus, setLikedProfileStatus] = useState(false);
  const [postComments, setPostComments] = useState<any>();
  const [commentStatus, setCommentStatus] = useState(false);
  const [userDetails, setUserDetails] = useState<any>();
  const [refetch, setRefetch] = useState(false);
  const [convertedDate, setConvertedDate] = useState<any>();
  const [postContent, setPostContent] = useState<any>();
  // const convertedDate = date.toLocaleString();

  useEffect(() => {
    const date = new Date(post?.post?.timestamp);

    setConvertedDate(timeAgo(date));
  }, []);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  useEffect(() => {
    setCommentStatus(false);
    setLikedProfileStatus(false);
    getUserDetails();
    getPostDetails();
    getPostComments();
  }, []);

  const getUserDetails = async () => {
    fetch(`${getUser}${post?.post?.createdBy}`, {})
      .then((response) => response.json())
      .then((result) => {
        if (result.status !== false) {
          setUserDetails(result?.data);
        }
      })
      .catch((error) => {
        console.log("error in new post is ", error);
      });
  };

  useEffect(() => {
    getPostComments();
    setRefetch(false);
  }, [refetch]);

  const getPostDetails = () => {
    fetch(`${ipfsGateway}${post?.post?.postURI}`, {})
      .then((response) => response.json())
      .then((result) => {
        if (result.status !== false) {
          setPostDetails(result);
        }
      })
      .catch((error) => {
        console.log("error in new post is ", error);
      });
  };

  // Get the post comments
  const getPostComments = async () => {
    fetch(`${getComment}${post?.post?.postId}`, {})
      .then((response) => response.json())
      .then((result) => {
        if (result.status !== false) {
          setPostComments(
            result?.data?.comments?.sort((firstComment: any, secondComment: any) => {
              return firstComment.timestamp - secondComment.timestamp;
            })
          );
        }
      })
      .catch((error) => {
        console.log("Erro while getting comments ", error);
      });
  };

  useEffect(() => {
    const urlPattern =
      /((http|https|ftp):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/gi;

    setPostContent(
      postDetails?.content?.replace(
        urlPattern,
        '<a href="$1" target="_blank" style="color: blue;">$1</a>'
      )
    );
  }, [postDetails]);

  return (
    <>
      {likedProfileStatus && (
        <div className="w-100 fixed z-10  top-0 bottom-0 right-0 left-0 items-center m-auto h-screen bg-blackOverlay ">
          <div className="text-white flex items-center justify-center flex m-auto h-screen">
            <div
              className="relative w-90 md:w-50 border  rounded-lg text-black bg-white overflow-y-auto"
              style={{
                maxHeight: "300px",
                height: "300px",
                maxWidth: "250px",
                width: "250px",
              }}
            >
              <div className="flex justify-between p-3 border-b ">
                <p className="text-xl font-bold">Liked By</p>
                <div
                  className="px-1 py-1 rounded-full cursor-pointer hover:bg-gray-300"
                  onClick={() => {
                    setLikedProfileStatus(false);
                  }}
                >
                  <GrFormClose color="black" fontSize={25} />
                </div>
              </div>
              <div className="h-2/3 overflow-y-auto mt-2 ">
                <LikedProfile
                  post={post}
                  mode={"liked"}
                  setLikedProfileStatus={setLikedProfileStatus}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {commentStatus && (
        <div className="w-100 fixed z-10  top-0 bottom-0 right-0 left-0 items-center m-auto h-screen bg-blackOverlay ">
          <div className="text-white flex items-center justify-center flex m-auto h-screen">
            <div className="relative w-90 md:w-50 border h-4/6 rounded-lg text-black bg-white">
              <div className="flex justify-between p-3 border-b ">
                <p className="text-xl font-bold">Comments</p>
                <div
                  className="px-1 py-1 rounded-full cursor-pointer hover:bg-gray-300"
                  onClick={() => {
                    setCommentStatus(false);
                    getPostComments();
                  }}
                >
                  <GrFormClose color="black" fontSize={25} />
                </div>
              </div>
              <div className="h-2/3 overflow-y-auto mt-2 ">
                <Comment
                  comments={postComments}
                  postId={post?.post?.postId}
                  setRefetch={setRefetch}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {postDetails ? (
        <>
          <div className="px-5 flex flex-col border-b rounded-t-lg bg-white hover:bg-slate-100 w-full cursor-pointer">
            {post?.post?.createdBy !== appState.action?.user?.address && (
              <div className="w-full py-2  italic border-b flex gap-2 iems-center">
                <div
                  className=" rounded-full flex items-center justify-center"
                  style={{ width: "50px" }}
                >
                  <img
                    src={`${ipfsGateway}${appState?.action?.user?.profilePictureUrl}`}
                    width="20px"
                    height="20px"
                    className="rounded-full"
                  ></img>
                </div>
                <p>You re-posted this post</p>
              </div>
            )}

            <div className=" py-3 flex justify-between">
              <div className="flex gap-2">
                <div>
                  <img
                    src={`${ipfsGateway}${userDetails?.profilePictureUrl}`}
                    alt="user-profile"
                    height={50}
                    width={50}
                    className=" rounded-full"
                    loading="lazy"
                  ></img>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-center">
                    <p className="text-lg font-semibold">
                      {userDetails?.displayName}
                      {userDetails?.organizationName}
                    </p>

                    <p className=" text-gray-500">@{userDetails?.handle}</p>
                    {/* <MdVerified fontSize={18} color="blue" /> */}
                  </div>
                  <div className="flex gap-2 items-center text-center relative">
                    <p className="text-sm ">{convertedDate}</p>
                    {/* {isDateHovered && (
                      <div className="absolute items-center top-6 text-sm border rounded-lg px-2 py-1 ">
                        {convertToLocal(post?.post?.timestamp)}{" "}
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
              <div className="flex justify-center text-center items-center">
                <div className="">
                  <BiDotsVerticalRounded
                    fontSize={18}
                    className="rounded-full hover:bg-slate-300"
                  />
                </div>
              </div>
            </div>
            <div
              className="description-container"
              dangerouslySetInnerHTML={{ __html: postContent }}
            ></div>
            {postDetails?.media[0]?.file && (
              <div className=" description-container w-180 md:w-320">
                <img
                  alt="post-image"
                  src={`${ipfsGateway}${postDetails?.media[0]?.file}`}
                  height="100"
                  loading="lazy"
                ></img>
              </div>
            )}
            <div className="mb-3 flex gap-7 bottom-menu-container items-center">
              <div
                className="rounded-full hover:bg-indigo-200 px-2  py-2 text-indigo-500 flex items-center gap-1 "
                onClick={() => setCommentStatus(true)}
              >
                <TbMessage fontSize={18} />
                <p>{postComments?.length ? postComments?.length : 0}</p>
              </div>

              <div
                id="share"
                className="rounded-full hover:bg-indigo-200 px-2  py-2 text-indigo-500 flex items-center gap-1 "
              >
                <FaShareSquare fontSize={18} className="text-violet-500" />

                <p className=" ">{post?.post?.shares?.length}</p>
              </div>

              <div className="flex items-center text-center">
                <div
                  id="like"
                  className="relative rounded-full hover:bg-fuchsia-200 px-2  py-2 text-fuchsia-500 flex justify-center items-center gap-1 m-auto"
                >
                  {post?.post?.likes.length > 0 ? (
                    <>
                      <AiTwotoneHeart
                        fontSize={15}
                        className="text-fuchsia-500 mt-1"
                        onClick={() => setLikedProfileStatus(true)}
                      />
                    </>
                  ) : (
                    <>
                      <BsHeart
                        fontSize={15}
                        className="text-fuchsia-500 mt-1 "
                        onClick={() => setLikedProfileStatus(true)}
                      />
                    </>
                  )}
                  <p className="prevent-default" onClick={() => setLikedProfileStatus(true)}>
                    {post?.post?.likes.length}
                  </p>
                </div>
              </div>
            </div>
            <style>
              {`
        .userid-background {
            background: rgb(203,66,252);
            background: linear-gradient(90deg, rgba(203,66,252,1) 22%, rgba(252,91,216,1) 79%);
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
        }

        .description-container {
            margin-left: 60px;
            margin-top: 20px;
        }
        .bottom-menu-container {
            margin-left: 55px;
            margin-top: 20px;

        }
`}
            </style>
          </div>
        </>
      ) : (
        // <div className="flex items-center fixed z-10 top-24 bottom-0 left-0 right-0 m-auto">
        //   {/* <Loading /> */}
        // </div>
        <> </>
      )}
    </>
  );
};

export default Post;
