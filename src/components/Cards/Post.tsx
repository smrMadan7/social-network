import { useEffect, useState } from "react";
import { AiTwotoneHeart } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsArrowLeftRight, BsHeart } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { TbMessage } from "react-icons/tb";
import { ipfsGateway } from "../../constants/AppConstants";
import { useUserContext } from "../../context/UserContextProvider";

const Post = (post: any) => {
  const [postDetails, setPostDetails] = useState<any>();
  const { appState }: any = useUserContext();

  const userImageUrl = `${ipfsGateway}${appState?.action?.user?.profilePictureUrl}`;
  const date = new Date(post?.post?.timestamp);
  const convertedDate = date.toLocaleString();

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  useEffect(() => {
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
  });

  return (
    <>
      {postDetails ? (
        <>
          <div className="p-5 flex flex-col border-b rounded-t-lg bg-white hover:bg-slate-100 w-full cursor-pointer">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <img
                  alt="user-profile"
                  src={userImageUrl}
                  height={50}
                  width={50}
                  className=" rounded-full"
                ></img>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-center">
                    <p className="text-lg">
                      {appState?.action?.user?.firstName}
                      {appState?.action?.user?.organizationName}
                    </p>
                    <MdVerified fontSize={18} color="blue" />
                  </div>
                  <div className="flex gap-2 items-center text-center">
                    <p className="text-sm userid-background font-bold ">
                      @{appState?.action?.user?.handle} .
                    </p>

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
                <img
                  alt="post-image"
                  src={`${ipfsGateway}${postDetails?.media[0]?.file}`}
                  height="100"
                ></img>
              </div>
            )}
            <div className=" flex gap-7 bottom-menu-container items-center">
              <div className=" px-2 py-2 ">
                <TbMessage fontSize={18} className="text-indigo-200  " />{" "}
              </div>
              <div className="flex items-center">
                <div className=" px-2 py-2 ">
                  <BsArrowLeftRight fontSize={18} className="text-violet-200" />
                </div>
                <p className="text-sm text-violet-700 ">{post?.chat?.mirrors}</p>
              </div>

              <div className="flex items-center text-center">
                <div className="rounded-full hover:bg-fuchsia-200 px-2  py-2 text-fuchsia-500 flex justify-center items-center gap-1 m-auto">
                  {post?.post?.likes > 0 ? (
                    <>
                      <AiTwotoneHeart fontSize={15} className="text-fuchsia-500 mt-1" />
                    </>
                  ) : (
                    <>
                      <BsHeart fontSize={15} className="text-fuchsia-500 mt-1 " />
                    </>
                  )}
                  <p>{post?.post?.likes}</p>
                </div>
                <p className="text-sm text-fuchsia-700 ">{post?.chat?.likes}</p>
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

export default Post;
