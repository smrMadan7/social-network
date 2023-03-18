import { useEffect, useState } from "react";
import { AiTwotoneHeart } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsHeart } from "react-icons/bs";
import { FaShareSquare } from "react-icons/fa";
import { GrFormClose } from "react-icons/gr";
import { TbMessage } from "react-icons/tb";
import { Tooltip } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";
import Web3 from "web3";
import { getComment, ipfsGateway, likeApi, postComment } from "../../constants/AppConstants";
import { useUserContext } from "../../context/UserContextProvider";
import { timeAgo } from "../../utils/timeAgo";
import Comment from "./Comment";
import LikedProfile from "./LikedAndSharedProfile";
import PostProfile from "./PostProfile";
import Repost from "./Repost";

const Feeds = (post: any) => {
  const [postDetails, setPostDetails] = useState<any>();
  const [postId, setPostId] = useState("");
  const [postComments, setPostComents] = useState<any>();
  const [like, setLike] = useState(post?.post?.likes.length);
  const [postProfileStatus, setPostProfileStatus] = useState(false);
  const [commentStatus, setCommentStatus] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [isSucessfull, setIsSuccessfull] = useState(false);
  const [address, setAddress] = useState();
  const [isLiked, setIsLiked] = useState<any>(false);
  const [isDisLiked, setIsDisLiked] = useState<any>(false);
  const [sharedProfiles, setSharedProfiles] = useState(false);
  const [likedProfileStatus, setLikedProfileStatus] = useState(false);
  // const [shareTo, setShareTo] = useState(false);
  const [isRepost, setIsRepost] = useState(false);
  const [convertedDate, setConvertedDate] = useState<any>();
  const [postContent, setPostContent] = useState<any>();

  const [sharedCount, setSharedCount] = useState(post?.post?.shares.length);
  const { appState }: any = useUserContext();

  const userImageUrl = `${ipfsGateway}${post?.post?.profilePictureUrl}`;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  useEffect(() => {
    const date = new Date(post?.post?.timestamp);

    setConvertedDate(timeAgo(date));
    setPostProfileStatus(false);
    setCommentStatus(false);
    setLikedProfileStatus(false);
    setSharedProfiles(false);
    // setShareTo(false);

    setRefetch(false);
    getPostComments();
    getPostDetails();
    getAddress();
  }, []);

  const getAddress = async () => {
    const provider: any = window.ethereum;
    const web3: any = new Web3(provider);
    const userAccount = await web3.eth.getAccounts();
    setAddress(userAccount[0]);
  };

  useEffect(() => {
    getPostComments();
    setRefetch(false);
  }, [refetch]);

  useEffect(() => {
    const urlPattern =
      /((http|https|ftp):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/gi;
    setPostContent(
      postDetails?.content.replace(
        urlPattern,
        '<a href="$1" target="_blank" style="color: blue;">$1</a>'
      )
    );
  }, [postDetails]);

  // Get post details
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
          setPostComents(
            result?.data?.comments?.sort((firstComment: any, secondComment: any) => {
              return firstComment.timestamp - secondComment.timestamp;
            })
          );
          setPostId(result?.data?.postId);
        }
      })
      .catch((error) => {
        console.log("Erro while getting comments ", error);
      });
  };

  // Increment like
  const incrementAndDecrementLike = (e: any, postData: any, mode: string) => {
    if (mode === "like") {
      setLike(like + 1);
      setIsLiked(true);
    } else {
      if (like >= post?.post?.likes.length) {
        setLike(like - 1);
        setIsLiked(false);
      }
    }
    const postIdData = {
      postId: postData?.post?.postId,
      address: address,
      action: mode,
    };
    var requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(postIdData),
      redirect: "follow",
    };

    fetch(likeApi, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === true) {
          if (mode === "like") {
            setIsLiked(true);
          } else {
            setIsLiked(false);
          }
        }
      })
      .catch((error) => {});
  };

  // Add a new comment
  const addComment = async (e: any) => {
    e.preventDefault();
    const provider: any = window.ethereum;
    const web3: any = new Web3(provider);
    const userAccount = await web3.eth.getAccounts();
    const address = userAccount[0];

    const commentObj = {
      postId: post?.post?.postId,
      commentId: uuidv4(),
      commenter: address,
      comment: e.target.comment.value,
      tage: ["@madan"],
    };

    var requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(commentObj),
      redirect: "follow",
    };

    fetch(`${postComment}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status !== false) {
          setCommentValue("");
          getPostComments();
          setIsSuccessfull(true);
          setTimeout(() => {
            setIsSuccessfull(false);
          }, 500);
        }
      })
      .catch((error) => {
        console.log("error in new post is ", error);
      });
  };

  //Increment share
  // const inCrementShare = (count: any) => {
  //   console.log("method called");
  //   setSharedCount(post?.post?.shares.length + count);
  // };

  return (
    <>
      {postDetails ? (
        <>
          <div className="">
            {commentStatus && (
              <div className="w-100 fixed z-10  top-0 bottom-0 right-0 left-0 items-center m-auto h-screen bg-blackOverlay ">
                <div className="text-white flex items-center justify-center flex m-auto h-screen">
                  <div className="relative w-90 md:w-50 border h-4/6 rounded-lg text-black bg-white">
                    <div className="flex justify-between p-3 border-b ">
                      {isSucessfull && (
                        <div
                          className="absolute text-center  top-0 right-0 left-0 bottom-0 "
                          style={{ zIndex: 100, height: "30px" }}
                        >
                          <p className="text-violet-700 font-semibold text-xl pt-3">Success!</p>
                        </div>
                      )}
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
                      <Comment comments={postComments} setRefetch={setRefetch} postId={postId} />
                    </div>
                    <div className="absolute w-full bottom-2 px-5 py-3 flex gap-2">
                      <form onSubmit={addComment} className="flex w-full gap-2">
                        <input
                          className="p-2 w-full border outline-none rounded-lg"
                          name="comment"
                          value={commentValue}
                          onChange={(e) => setCommentValue(e.target.value)}
                          placeholder="Add a comment..."
                        ></input>
                        <button
                          className="border rounded-lg bg-violet-700 hover:bg-violet-900 py-2 px-4 text-white"
                          type="submit"
                        >
                          ADD
                        </button>
                      </form>
                      {/* </div> */}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {postProfileStatus && (
              <div className="w-100 fixed z-10  top-0 bottom-0 right-0 left-0 items-center m-auto h-screen bg-blackOverlay ">
                <div className="text-white flex items-center justify-center flex m-auto h-screen">
                  <div className=" w-90 2xl:w-23 md:w-40  border rounded-lg text-black bg-white">
                    <div className="flex justify-between p-3 border-b ">
                      <p className="text-xl font-bold">Profile Details</p>
                      <div
                        className="px-1 py-1 rounded-full cursor-pointer hover:bg-gray-300"
                        onClick={() => {
                          setPostProfileStatus(false);
                        }}
                      >
                        <GrFormClose color="black" fontSize={25} />
                      </div>
                    </div>
                    <PostProfile postDetails={postDetails} post={post} />
                  </div>
                </div>
              </div>
            )}

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
                      {isSucessfull && (
                        <div
                          className="absolute text-center  top-0 right-0 left-0 bottom-0 "
                          style={{ zIndex: 100, height: "30px" }}
                        >
                          <p className="text-violet-700 font-semibold text-xl pt-3">Success!</p>
                        </div>
                      )}
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

            {sharedProfiles && (
              <div className="w-100 fixed z-10  top-0 bottom-0 right-0 left-0 items-center m-auto h-screen bg-blackOverlay ">
                <div className="text-white flex items-center justify-center flex m-auto h-screen">
                  <div
                    className="bg-black relative w-90 md:w-50 border  rounded-lg text-black bg-white overflow-y-auto"
                    style={{
                      maxHeight: "300px",
                      height: "300px",
                      maxWidth: "250px",
                      width: "250px",
                    }}
                  >
                    <div className="flex justify-between p-3 border-b ">
                      {isSucessfull && (
                        <div
                          className="absolute text-center  top-0 right-0 left-0 bottom-0 "
                          style={{ zIndex: 100, height: "30px" }}
                        >
                          <p className="text-violet-700 font-semibold text-xl pt-3">Success!</p>
                        </div>
                      )}
                      <p className="text-xl font-bold">Shared By</p>
                      <div
                        className="px-1 py-1 rounded-full cursor-pointer hover:bg-gray-300"
                        onClick={() => {
                          setSharedProfiles(false);
                        }}
                      >
                        <GrFormClose color="black" fontSize={25} />
                      </div>
                    </div>
                    <div className="h-2/3 overflow-y-auto mt-2 ">
                      <LikedProfile
                        post={post}
                        mode={"shared"}
                        setSharedStatus={setSharedProfiles}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* {shareTo && (
              <div className="w-100 fixed z-10  top-0 bottom-0 right-0 left-0 items-center m-auto h-screen bg-blackOverlay ">
                <div className="text-white flex items-center justify-center flex m-auto h-screen">
                  <div
                    className="relative w-90 md:w-50 border  rounded-lg text-black bg-white overflow-y-auto"
                    style={{
                      maxWidth: "350px",
                      width: "350px",
                    }}
                  >
                    <div className="flex justify-between p-3 border-b ">
                      <p className="text-xl font-bold">Share To</p>
                      <div
                        className="px-1 py-1 rounded-full cursor-pointer hover:bg-gray-300"
                        onClick={() => {
                          setShareTo(false);
                        }}
                      >
                        <GrFormClose color="black" fontSize={25} />
                      </div>
                    </div>
                    <div className="h-2/3 overflow-y-auto mt-2 ">
                      <Share
                        address={address}
                        postId={post?.post?.postId}
                        setShareTo={setShareTo}
                        callback={inCrementShare}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            {isSucessfull && (
              <>
                <div className="w-100 fixed z-10  top-4 right-0 left-0  ">
                  <div className=" flex items-center justify-center flex">
                    <p className="text-violet-700 font-semibold text-xl ">Success!</p>
                  </div>
                </div>
              </>
            )}

            {isRepost && (
              <Repost
                isRepost={isRepost}
                setIsRepost={setIsRepost}
                setIsSuccessfull={setIsSuccessfull}
                postId={post?.post?.postId}
                sharedCount={sharedCount}
                setSharedCount={setSharedCount}
              />
            )}

            <div className=""></div>
          </div>
          <div className="relative px-5 md:mb-0 flex flex-col border-b rounded-t-lg bg-white hover:bg-slate-100 w-full cursor-pointer">
            {/* shared details */}
            {post?.post?.shares.length > 0 && (
              <div className="w-full py-2 italic border-b flex gap-2 iems-center">
                <div
                  className=" rounded-full flex items-center justify-center"
                  style={{ width: "50px" }}
                >
                  <img src={userImageUrl} width="20px" height="20px" className="rounded-full"></img>
                </div>
                <p>
                  <span
                    className="text-blue-700"
                    onClick={() => {
                      setSharedProfiles(true);
                    }}
                  >
                    {post?.post?.shares.length} more
                  </span>
                  <span> re-shared this post.</span>
                </p>
              </div>
            )}
            {/* {isSucessfull && (
              <div
                className="absolute text-center  top-0 right-0 left-0 bottom-1 items-center "
                style={{ zIndex: 100, height: "30px" }}
              >
                <p className="text-violet-700 font-semibold text-xl pt-3">Successfully Re-post</p>
              </div>
            )} */}

            <div className=" mt-2 flex justify-between">
              <div className="flex gap-2">
                <img
                  src={userImageUrl}
                  height={50}
                  width={50}
                  loading="lazy"
                  className=" rounded-full cursor-pointer"
                  onClick={() => setPostProfileStatus(true)}
                ></img>
                <div className="flex flex-col w-full">
                  <div
                    className="flex items-center gap-1 text-center"
                    onClick={() => setPostProfileStatus(true)}
                  >
                    <p className="text-md  font-semibold">{post?.post?.displayName}</p>

                    <p className="text-md  text-gray-500">@{post?.post?.handle}</p>
                    {/* <MdVerified fontSize={18} color="blue" /> */}
                  </div>
                  <div className="flex gap-2 items-center text-center relative w-full">
                    {/* <p className="text-sm userid-background font-bold ">@{post?.post?.handle} .</p> */}

                    <p className="text-sm ">{convertedDate}</p>
                    {/* {isDateHovered && (
                      <div className="w-full absolute top-6 right-0 text-sm border rounded-lg px-2 py-1 nowrap whitespace-nowrap">
                        {convertToLocal(post?.post?.timestamp)}{" "}
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
              <div className="flex justify-center text-center items-center">
                <div>
                  <BiDotsVerticalRounded
                    fontSize={18}
                    className="rounded-full hover:bg-slate-300"
                  />
                  {}
                </div>
              </div>
            </div>

            <div
              className="description-container break-words"
              dangerouslySetInnerHTML={{ __html: postContent }}
            >
              {/* <Linkify >{postDetails?.content}</Linkify> */}
            </div>
            {postDetails?.media[0]?.file && (
              <div className="description-container w-180 md:w-320">
                <img
                  src={`${ipfsGateway}${postDetails?.media[0]?.file}`}
                  height="100"
                  loading="lazy"
                ></img>
              </div>
            )}

            <div className="mb-2 flex gap-7 bottom-menu-container items-center">
              <div
                className=" flex text-indigo-500 items-center gap-2 "
                onClick={() => {
                  setCommentStatus(true);
                }}
              >
                <div
                  style={{ height: "40px", width: "40px" }}
                  id="comment"
                  className="rounded-full hover:bg-indigo-200 items-center flex justify-center gap-1 "
                >
                  <TbMessage fontSize={18} className="text-indigo-500" />

                  <span className="">{postComments?.length ? postComments?.length : 0}</span>
                </div>
                <Tooltip
                  anchorSelect="#comment"
                  place="bottom"
                  content="Comments"
                  className="text-center items-center text-sm z-10 absolute bg-gray-700 text-white border rounded-lg px-2"
                />
              </div>

              {/* Share button */}

              <div
                className=" flex text-indigo-500 items-center gap-2 "
                onClick={() => {
                  setIsRepost(true);
                  // setShareTo(true);
                }}
              >
                <div
                  style={{ height: "40px", width: "40px" }}
                  id="repost"
                  className="rounded-full hover:bg-indigo-200 items-center flex justify-center gap-1 "
                >
                  <FaShareSquare fontSize={18} className="text-indigo-500" />

                  <span className="">
                    {post?.post?.shares?.includes(appState?.action?.user?.address) ? (
                      post?.post?.shares.length
                    ) : (
                      <>{sharedCount}</>
                    )}
                  </span>
                </div>
                <Tooltip
                  anchorSelect="#repost"
                  place="bottom"
                  content="Repost"
                  className="text-center items-center text-sm z-10 absolute bg-gray-700 text-white border rounded-lg px-2"
                />
              </div>

              <div className="flex items-center text-center prevent-select">
                <div id="like">
                  {post?.post?.likes?.includes(address) ? (
                    <>
                      <div
                        style={{ height: "40px", width: "40px" }}
                        className="rounded-full hover:bg-fuchsia-200 items-center flex justify-center gap-1 text-fuchsia-500 "
                        onClick={(e) => {
                          if (!isDisLiked) {
                            setIsLiked(true);
                            setIsDisLiked(true);
                            incrementAndDecrementLike(e, post, "unlike");
                          } else {
                            setIsLiked(false);
                            setIsDisLiked(false);
                            incrementAndDecrementLike(e, post, "like");
                          }
                        }}
                      >
                        <>
                          {post?.post?.likes?.includes(address) && !isDisLiked ? (
                            <>
                              <AiTwotoneHeart fontSize={18} className="text-fuchsia-500 mt-1" />
                            </>
                          ) : (
                            <>
                              <BsHeart fontSize={18} className="text-fuchsia-500 mt-1 " />
                            </>
                          )}
                        </>
                        {like}
                      </div>
                    </>
                  ) : (
                    <>
                      {isLiked ? (
                        <div
                          style={{ height: "40px", width: "40px" }}
                          className="rounded-full hover:bg-fuchsia-200 items-center flex justify-center gap-1 text-fuchsia-500 "
                          onClick={(e) => {
                            setIsLiked(false);
                            incrementAndDecrementLike(e, post, "unlike");
                          }}
                        >
                          <AiTwotoneHeart fontSize={18} className="text-fuchsia-500 mt-1" />

                          {like}
                        </div>
                      ) : (
                        <div
                          style={{ height: "40px", width: "40px" }}
                          className="rounded-full hover:bg-fuchsia-200 items-center flex justify-center gap-1 text-fuchsia-500 "
                          onClick={(e) => {
                            setIsLiked(true);
                            incrementAndDecrementLike(e, post, "like");
                          }}
                        >
                          <BsHeart fontSize={18} className="text-fuchsia-500 mt-1 " />

                          {like}
                        </div>
                      )}
                    </>
                  )}
                  <Tooltip
                    anchorSelect="#like"
                    place="bottom"
                    content="Like"
                    className="text-center items-center text-sm z-10 absolute bg-gray-700 text-white border rounded-lg px-2"
                  />
                </div>
                {(post?.post?.likes?.length > 0 || isLiked) && (
                  <div className="cursor-pointer" onClick={() => setLikedProfileStatus(true)}>
                    likes
                  </div>
                )}
              </div>
            </div>
            <style>
              {`


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
        <> </>
        // <div className="flex items-center fixed z-10 top-24 bottom-0 left-0 right-0 m-auto">
        //   {/* <Loading /> */}
        // </div>
      )}
    </>
  );
};

export default Feeds;
