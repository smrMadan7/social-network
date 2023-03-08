import React, { useEffect, useState } from "react";
import { BiLike } from "react-icons/bi";
import { BsHeart } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import Loading from "../Loading/Loading";

const Comment = ({ comments }: any) => {
  return (
    <>
      {comments ? (
        <div className="p-3 ">
          {comments.map((comment: any, index: number) => {
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
                      src="http://44.214.42.39:8080/ipfs/QmNPLd1Lnd8aBXAqQj45DSptYUr7JryXmzZcH9ho9FK2yi"
                      loading="lazy"
                    ></img>
                  </div>

                  {/* User anme */}
                  <div className="flex flex-col gap-1">
                    <div className="text-md font-bold">
                      White <span className="font-normal text-gray"> 1 year ago</span>
                    </div>
                    {/* comment content */}
                    <div className="text-black">{comment?.comment}</div>
                    {/* like  */}
                    <div className="flex gap-1 items-center ">
                      <BsHeart fontSize={15} className="text-fuchsia-500 cursor-pointer " />

                      <span className="mb-1">2</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : comments?.length > 0 ? (
        <div className="relative">
          <Loading />
        </div>
      ) : (
        <div className="p-7 flex justify-center bg-white  rounded-lg ">
          <div className="flex flex-col items-center gap-2 text-violet-700 ">
            <FaThList fontSize={20} />
            <h1 className=" text-md text-slate-400">No Comments!</h1>
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
