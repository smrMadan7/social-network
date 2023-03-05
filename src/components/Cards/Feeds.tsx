import { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsArrowLeftRight, BsHeart } from "react-icons/bs";
import { GrFormClose } from "react-icons/gr";
import { MdVerified } from "react-icons/md";
import { TbMessage } from "react-icons/tb";
import { ipfsGateway, likeApi } from "../../constants/AppConstants";
import PostProfile from "./PostProfile";

const Feeds = (post: any) => {
  const [postDetails, setPostDetails] = useState<any>();
  const [like, setLike] = useState(post?.post?.likes);
  const [postProfile, setPostProfile] = useState(false);
  const [likeCount, setLikeCount] = useState(1);

  const userImageUrl = `${ipfsGateway}${post?.post?.profilePictureUrl}`;

  const date = new Date(post?.post?.timestamp);
  const convertedDate = date.toLocaleString();

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  useEffect(() => {
    setPostProfile(false);
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
  }, []);

  const incrementLike = (e: any, postData: any) => {
    setLikeCount(likeCount + 1);
    console.log("like count is ", likeCount);
    const postIdData = {
      postId: postData?.post?.postId,
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
        setLike(post?.post?.likes + likeCount);
      })
      .catch((error) => {});
  };

  return (
    <>
      {postDetails ? (
        <>
          <div className="">
            {postProfile && (
              <div className="w-100 fixed z-10  top-0 bottom-0 right-0 left-0 items-center m-auto h-screen bg-blackOverlay ">
                <div className="text-white flex items-center justify-center flex m-auto h-screen">
                  <div className=" w-70 md:w-50 h-3/6 border rounded-lg text-black bg-white">
                    <div className="flex justify-between p-3 ">
                      <p className="text-xl font-bold">User Details</p>
                      <div
                        className="px-1 py-1 rounded-full cursor-pointer hover:bg-gray-300"
                        onClick={() => {
                          setPostProfile(false);
                        }}
                      >
                        <GrFormClose color="black" fontSize={25} />
                      </div>
                    </div>
                    <div className="border"></div>
                  </div>
                  <PostProfile postDetails={postDetails} post={post} />
                </div>
              </div>
            )}
            <div className=""></div>
          </div>
          <div className="p-5 flex flex-col border-b rounded-t-lg bg-white hover:bg-slate-100 w-full cursor-pointer">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <img
                  src={userImageUrl}
                  height={50}
                  width={50}
                  className=" rounded-full"
                  onClick={() => setPostProfile(true)}
                ></img>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-center">
                    <p className="text-lg userid-background">@{post?.post?.handle}</p>
                    <MdVerified fontSize={18} color="blue" />
                  </div>
                  <div className="flex gap-2 items-center text-center">
                    {/* <p className="text-sm userid-background font-bold ">@{post?.post?.handle} .</p> */}

                    <p className="text-sm ">{convertedDate}</p>
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
              dangerouslySetInnerHTML={{ __html: postDetails?.content }}
            ></div>
            {postDetails?.media[0]?.file && (
              <div className="description-container" style={{ width: "200px", height: "200px" }}>
                <img src={`${ipfsGateway}${postDetails?.media[0]?.file}`} height="100"></img>
              </div>
            )}

            <div className=" flex gap-7 bottom-menu-container items-center">
              <div className=" px-2 py-2 ">
                <TbMessage fontSize={18} className="text-indigo-300  rounded-full" />{" "}
              </div>
              <div className="flex items-center">
                <div className=" px-2 py-2 ">
                  <BsArrowLeftRight fontSize={18} className="text-violet-300 rounded-full " />
                </div>
                <p className="text-sm text-violet-700 ">{post?.chat?.mirrors}</p>
              </div>

              <div className="flex items-center text-center">
                <div
                  className="rounded-full hover:bg-fuchsia-200 px-2  py-2 flex items-center gap-1 text-fuchsia-500"
                  onClick={(e) => incrementLike(e, post)}
                >
                  <BsHeart fontSize={15} className="text-fuchsia-500 mt-1 " />
                  {like}
                </div>
                {/* <p className="text-sm text-fuchsia-700 ">{like}</p> */}
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
        <div className="flex items-center fixed z-10 top-24 bottom-0 left-0 right-0 m-auto">
          {/* <Loading /> */}
        </div>
      )}
    </>
  );
};

export default Feeds;