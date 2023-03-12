import { useEffect, useState } from "react";
import { BsHeart } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import Web3 from "web3";
import { ipfsGateway, updateComment } from "../../constants/AppConstants";
import { BiEdit } from "react-icons/bi";
import { GrFormClose } from "react-icons/gr";

const Comment = ({ comments, setRefetch, postId }: any) => {
  const [address, setAddress] = useState();
  const [isUpdatePopup, setIsUpdatePopup] = useState(false);
  const [updatedComment, setUpdatedComment] = useState("");
  const [commentDetails, setCommentDetails] = useState<any>();

  useEffect(() => {
    getAddress();
    setCommentDetails({});
  }, []);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const getAddress = async () => {
    const provider: any = window.ethereum;
    const web3: any = new Web3(provider);
    const userAccount = await web3.eth.getAccounts();
    setAddress(userAccount[0]);
  };

  const commentUpdate = () => {
    const updatedObj = {
      postId: postId,
      commentId: commentDetails?.commentId,
      comment: updatedComment,
      tags: commentDetails?.tags,
    };
    var requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(updatedObj),
      redirect: "follow",
    };

    fetch(`${updateComment}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status !== false) {
          setRefetch(true);
          setIsUpdatePopup(false);
        }
      })
      .catch((error) => {
        console.log("Erro while getting comments ", error);
      });
  };
  return (
    <>
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
            const date = new Date(comment?.timestamp);
            const convertedDate = date.toLocaleString();

            const imageUrl = `${ipfsGateway}${comment?.commenterProfilePic}`;
            return (
              <div key={index} className="mb-5 ">
                <div className="">
                  {/* user profile */}
                  <div className="flex gap-3 justify-between">
                    <div className="flex gap-3">
                      <div>
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
                        <div>
                          <p className="flex gap-2 font-semibold">
                            {comment?.commenterDisplayName}{" "}
                            <span className="handle font-bold">@{comment?.commenterHandle}</span>
                          </p>

                          <span className="font-normal text-gray"> {convertedDate}</span>
                        </div>

                        <div>
                          {" "}
                          <div className="flex flex-col gap-1">
                            {/* comment content */}
                            <div className="text-black">{comment?.comment}</div>
                            {/* like  */}
                            <div className="flex gap-1 items-center text-fuchsia-500 cursor-pointer">
                              <BsHeart fontSize={15} className="text-fuchsia-500 cursor-pointer " />

                              <span className="mb-1">2</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {comment?.commenter === address && (
                      <div className="px-3">
                        <button
                          className="border rounded-full p-2 hover:bg-bgHover"
                          onClick={() => {
                            if (isUpdatePopup) {
                              setIsUpdatePopup(false);
                            } else {
                              setIsUpdatePopup(true);
                              setUpdatedComment(comment?.comment);
                            }
                            setCommentDetails(comment);
                          }}
                        >
                          <BiEdit size={20} />
                        </button>{" "}
                      </div>
                    )}
                  </div>
                </div>
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
      {isUpdatePopup && (
        <div className="absolute flex flex-col top-0 bottom-0 right-0 left-0 flex  w-90 md:w-50 h-2/6 border rounded-lg bg-white z-4 m-auto">
          <div className="w-full">
            <div className="flex justify-between  p-3 items-center border-b">
              <h1 className="text-xl font-semibold ">Update</h1>
              <div
                className="px-1 py-1 rounded-full cursor-pointer hover:bg-gray-300"
                onClick={() => {
                  setIsUpdatePopup(false);
                }}
              >
                <GrFormClose color="black" fontSize={25} />
              </div>
            </div>
          </div>

          <div className="w-full flex gap-3 p-3">
            <div>
              <input
                className="outline-none border rounded-lg p-2"
                value={updatedComment}
                onChange={(e) => setUpdatedComment(e.target.value)}
              ></input>
            </div>
            <div>
              <button
                className="border rounded-lg p-2 bg-violet-700 hover:bg-violet-900 text-white"
                onClick={commentUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
