import React, { useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { sharePosts } from "../../constants/AppConstants";
import { useUserContext } from "../../context/UserContextProvider";

const Repost = ({
  isRepost,
  setIsRepost,
  setIsSuccessfull,
  postId,
  sharedCount,
  setSharedCount,
}: any) => {
  const { appState }: any = useUserContext();

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const rePost = () => {
    const sharedObj = {
      postId: postId,
      sharedBy: appState?.action?.user?.address,
    };
    var requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(sharedObj),
      redirect: "follow",
    };
    fetch(`${sharePosts}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === true) {
          setIsRepost(false);
          setSharedCount(sharedCount + 1);
          setIsSuccessfull(true);
          setTimeout(() => {
            setIsSuccessfull(false);
          }, 2000);
        }
      })
      .catch((error) => {
        console.log("Erro while getting comments ", error);
      });
  };

  return (
    <>
      <div className="w-100 fixed z-10  top-0 bottom-0 right-0 left-0 items-center m-auto h-screen bg-blackOverlay ">
        <div className="text-white flex items-center justify-center flex m-auto h-screen">
          <div
            className="relative bg-black relative border  rounded-lg text-black bg-white overflow-y-auto"
            style={{ width: "250px", height: "150px" }}
          >
            <div className="flex justify-between p-3 border-b ">
              <p className="text-xl font-bold">Conformation</p>
              <div
                className="px-1 py-1 rounded-full cursor-pointer hover:bg-gray-300"
                onClick={() => {
                  setIsRepost(false);
                }}
              >
                <GrFormClose color="black" fontSize={25} />
              </div>
            </div>
            <div className="flex flex-col ">
              <div className="px-3 font-semibold">
                <p>Are you sure to re-post this post?</p>
              </div>
              <div className="flex justify-end  gap-4 px-3 absolute right-0 bottom-0 p-2">
                <button
                  className="border py-1 flex items-center rounded-lg px-4 hover:bg-bgActive  hover:font-bold"
                  onClick={rePost}
                >
                  Yes
                </button>
                <button
                  className="border py-1 flex items-center rounded-lg px-4 hover:bg-bgActive  hover:font-bold"
                  onClick={() => {
                    setIsRepost(false);
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Repost;
