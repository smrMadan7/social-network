import React, { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { getLikedUsers, getPostByPostId, ipfsGateway } from "../../constants/AppConstants";
import Loading from "../Loading/Loading";
import PostProfile from "./PostProfile";

const LikedProfile = ({ post }: any) => {
  const [likedProfiles, setLikedProfiles] = useState<any>();
  const [postProfileStatus, setPostProfileStatus] = useState(false);
  const [likedProfileAddress, setLikedProfileAddress] = useState();
  const [isEmpty, setIsEmpty] = useState(false);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  useEffect(() => {
    setPostProfileStatus(false);
    getPost();
  }, []);

  const getLikedProfiles = (likes: any) => {
    const postIdData = {
      address: likes,
    };
    var requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(postIdData),
      redirect: "follow",
    };

    fetch(getLikedUsers, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status !== false) {
          setLikedProfiles(result.data);
        }
      })
      .catch((error) => {
        console.log("Error occured while getting liked profiles", error);
      });
  };

  const getPost = () => {
    fetch(`${getPostByPostId}${post?.post?.postId}`, {})
      .then((response) => response.json())
      .then((result) => {
        if (result.status !== false) {
          if (result.data?.data?.likes.length > 0) {
            getLikedProfiles(result.data?.data?.likes);
          } else {
            setIsEmpty(true);
          }
        }
      })
      .catch((error) => {
        console.log("Error occured while getting liked profiles", error);
      });
  };

  return (
    <>
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
                    getPost();
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
          {likedProfiles?.map((likedProfile: any, index: number) => {
            const imageUrl = `${ipfsGateway}${likedProfile.profilePictureUrl}`;

            return (
              <div key={index} className="flex p-3 text-sm gap-3 items-center">
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setLikedProfiles(false);
                    setLikedProfileAddress(likedProfile.address);
                    setPostProfileStatus(true);
                  }}
                >
                  <img
                    src={imageUrl}
                    height="60px"
                    width="60px"
                    className="border rounded-full"
                  ></img>
                </div>
                <div className="flex flex-col">
                  <div>{likedProfile?.displayName} </div>

                  <div>
                    <span className="handle font-bold">@{likedProfile?.handle}</span>
                  </div>
                </div>
              </div>
            );
          })}{" "}
        </>
      ) : (
        <>
          <div className="absolute w-full flex items-center justify-center m-auto">
            {isEmpty ? <div className="absolute top-0 ">No Likes Yet!</div> : <Loading />}
          </div>
        </>
      )}
    </>
  );
};

export default LikedProfile;
