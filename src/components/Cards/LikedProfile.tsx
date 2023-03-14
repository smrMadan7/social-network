import React, { useEffect, useState } from "react";
import { getLikedUsers, ipfsGateway } from "../../constants/AppConstants";
import Loading from "../Loading/Loading";

const LikedProfile = ({ post }: any) => {
  const [likedProfiles, setLikedProfiles] = useState<any>();
  console.log("post is ", post?.post?.likes);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  useEffect(() => {
    getLikedProfiles();
  }, []);

  const getLikedProfiles = () => {
    const postIdData = {
      address: post?.post?.likes,
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

  return (
    <>
      {likedProfiles ? (
        <>
          {likedProfiles?.map((likedProfile: any, index: number) => {
            const imageUrl = `${ipfsGateway}${likedProfile.profilePictureUrl}`;

            return (
              <div key={index} className="flex p-3 text-sm gap-3 items-center">
                <div className="">
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
          <div className="absolute h-full w-full flex items-center justify-center m-auto">
            <Loading />
          </div>
        </>
      )}
    </>
  );
};

export default LikedProfile;
