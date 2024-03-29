import { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { GrFormClose } from "react-icons/gr";
import { getLikedUsers, getPostByPostId, ipfsGateway } from "../../constants/AppConstants";
import { customGet, customPost } from "../../fetch/customFetch";
import Loading from "../Loading/Loading";
import defaultProfile from "./../././../assets/Form/default-user.svg";
import PostProfile from "./PostProfile";

const LikedAndSharedProfile = ({ post, mode, setLikedProfileStatus, setSharedStatus }: any) => {
  const [likedProfiles, setLikedProfiles] = useState<any>();
  const [postProfileStatus, setPostProfileStatus] = useState(false);
  const [likedProfileAddress, setLikedProfileAddress] = useState();
  const [isEmpty, setIsEmpty] = useState(false);
  const [postResult, setPostResult] = useState<any>();

  useEffect(() => {
    setPostProfileStatus(false);
    setIsEmpty(false);
    getPost();
  }, []);

  useEffect(() => {
    if (postResult?.status) {
      if (mode === "liked") {
        if (postResult?.data?.data?.likes?.length === 0) {
          setIsEmpty(true);
        } else {
          getLikedOrSharedProfiles(postResult?.data?.data?.likes);
        }
      } else {
        if (postResult?.data?.data?.shares) {
          getLikedOrSharedProfiles(postResult?.data?.data?.shares);
        }
      }
    }
  }, [postResult]);

  const getLikedOrSharedProfiles = (likes: any) => {
    const params = {
      address: likes,
    };
    customPost(params, getLikedUsers, "POST", setLikedProfiles, "getting liked profiles");
  };

  const getPost = () => {
    customGet(`${getPostByPostId}${post?.post?.postId}`, setPostResult, "getting post details");
  };

  return (
    <>
      {postProfileStatus && (
        <div className="w-100 fixed z-10  top-0 bottom-0 right-0 left-0 items-center m-auto h-screen bg-blackOverlay ">
          <div className="text-white flex items-center justify-center flex m-auto h-screen">
            <div className=" w-90 2xl:w-23 md:w-40  border rounded-lg text-black bg-white">
              <div className="flex gap-3 p-3 border-b items-center w-full justify-between">
                <div className="flex gap-2 ">
                  <div
                    className="rounded-full hover:bg-bgHover p-1 cursor-pointer"
                    onClick={() => {
                      setPostProfileStatus(false);
                      getPost();
                    }}
                  >
                    <BiArrowBack color="black" className="cursor-pointer" fontSize={25} />
                  </div>
                  <p className="text-xl font-bold">Profile Details</p>
                </div>

                <div
                  className="px-1 py-1 rounded-full cursor-pointer hover:bg-gray-300"
                  onClick={() => {
                    if (setLikedProfileStatus) {
                      setLikedProfileStatus(false);
                    } else if (setSharedStatus) {
                      setSharedStatus(false);
                    }
                  }}
                >
                  <GrFormClose color="black" fontSize={25} />
                </div>
              </div>
              <PostProfile post={likedProfileAddress} />
            </div>
          </div>
        </div>
      )}
      {likedProfiles ? (
        <>
          {likedProfiles?.data?.map((likedProfile: any, index: number) => {
            const imageUrl = `${ipfsGateway}${likedProfile.profilePictureUrl}`;

            return (
              <div key={index} className="flex p-3 text-sm gap-3 items-center">
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setLikedProfiles(false);
                    setLikedProfileAddress(likedProfile.address);
                    setIsEmpty(true);
                    setPostProfileStatus(true);
                  }}
                >
                  <img alt="user" src={imageUrl} height="60px" width="60px" className="border rounded-full"></img>
                </div>
                <div
                  className="flex flex-col cursor-pointer"
                  onClick={() => {
                    setIsEmpty(true);
                    setLikedProfiles(false);
                    setLikedProfileAddress(likedProfile.address);

                    setPostProfileStatus(true);
                  }}
                >
                  <div className="font-bold">
                    {likedProfile?.displayName} {likedProfile?.organizationName}{" "}
                  </div>

                  <div>
                    <span className="text-md  text-gray-500">@{likedProfile?.handle}</span>
                  </div>
                </div>
              </div>
            );
          })}{" "}
        </>
      ) : (
        <>
          <div className="absolute w-full flex items-center justify-center m-auto">
            {!likedProfiles && !isEmpty ? (
              <Loading />
            ) : (
              <div className="absolute top-0 ">
                <>{mode === "liked" ? <span>No Likes Yet! </span> : <span>Profiles Not Found!</span>}</>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default LikedAndSharedProfile;
