import React, { useEffect, useState } from "react";
import { BiLike } from "react-icons/bi";
import { BsHeart } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { ipfsGateway } from "../../constants/AppConstants";
import Loading from "../Loading/Loading";

const Comment = ({ comments }: any) => {
  return (
    <>
      {comments?.length > 0 ? (
        <div className="p-3 ">
          {comments.map((comment: any, index: number) => {
            const date = new Date(comment?.timestamp);
            const convertedDate = date.toLocaleString();

            const imageUrl = `${ipfsGateway}${comment?.commenterProfilePic}`;
            return (
              <div key={index} className="mb-5">
                <div className="flex gap-3">
                  {/* user profile */}
                  <div>
                    <img
                      alt="profile-picture"
                      height="50px"
                      width="50px"
                      className="border rounded-full"
                      src={imageUrl}
                      loading="lazy"
                    ></img>
                  </div>

                  {/* User anme */}
                  <div className="flex flex-col gap-1">
                    <div className="text-md font-bold">
                      <p className="flex gap-2">
                        {comment?.commenterDisplayName}{" "}
                        <span className="handle">@{comment?.commenterHandle}</span>
                      </p>

                      <span className="font-normal text-gray"> {convertedDate}</span>
                    </div>
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
    </>
  );
};

export default Comment;
