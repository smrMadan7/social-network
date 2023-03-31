import { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { sharePosts } from "../../constants/AppConstants";
import { useUserContext } from "../../context/UserContextProvider";
import { customPost } from "../../fetch/customFetch";
import { useSocketContext } from "../../context/SocketCotextProvider";

const Repost = ({
  setIsReposted,
  setIsRepost,
  setIsSuccessfull,
  postId,
  sharedCount,
  setSharedCount,
  post
}: any) => {
  const { appState }: any = useUserContext();
  const [repostResult, setRepostResult] = useState<any>();
  const {socketContext}:any = useSocketContext();


  useEffect(() => {
    if (repostResult?.status) {
      setIsReposted(true);
      setIsRepost(false);
      setSharedCount(sharedCount + 1);
      setIsSuccessfull(true);
      sendNotification();
      setTimeout(() => {
        setIsSuccessfull(false);
      }, 2000);
    }
  }, [repostResult]);

  const sendNotification = () => {
    if(post?.createdBy !== appState?.action?.user?.address) {
    socketContext?.socket.emit("sendNotifications", {
    type: "share",
    performedBy: appState?.action?.user?.address,
    subjectId: post?.post?.createdBy,
    details: {
      actionItem : "share", 
      actionId: post?.post?.postId,
    }
    });
  }
}
  const rePost = () => {
    const params = {
      postId: postId,
      sharedBy: appState?.action?.user?.address,
    };
    customPost(params, `${sharePosts}`, "POST", setRepostResult, "repost");
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
              <p className="text-xl font-bold">Confirmation</p>
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
