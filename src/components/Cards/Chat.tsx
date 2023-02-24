import React from "react";
import { IChat, IChatProps } from "../../Types/interface";
import { MdVerified } from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { TbMessage } from "react-icons/tb";
import { BsArrowLeftRight } from "react-icons/bs";
import { BsHeart } from "react-icons/bs";

const Chat = (chat: IChatProps) => {
  return (
    <div className="p-5 flex flex-col border-b rounded-t-lg bg-white hover:bg-slate-100 w-full cursor-pointer">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <img src={chat?.chat.imageUrl} height={50} width={50} className=" rounded-full"></img>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-center">
              <p className="text-lg">{chat?.chat?.userName}</p>
              {chat?.chat?.isVerified && <MdVerified fontSize={18} color="blue" />}
            </div>
            <div className="flex gap-2 items-center text-center">
              <p className="text-sm userid-background font-bold ">{chat?.chat?.userId} .</p>

              <p className="text-sm ">{chat?.chat?.date}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center text-center items-center">
          <div className="">
            <BiDotsVerticalRounded fontSize={18} className="rounded-full hover:bg-slate-300" />
          </div>
        </div>
      </div>

      <div className="description-container">{chat?.chat?.message}</div>
      <div className=" flex gap-7 bottom-menu-container items-center">
        <div className="hover:bg-slate-300 rounded-full px-2 py-2 ">
          <TbMessage fontSize={18} className="text-indigo-500 hover:bg-slate-300 rounded-full" />
        </div>
        <div className="flex items-center">
          <div className="hover:bg-violet-200 rounded-full px-2 py-2 ">
            <BsArrowLeftRight fontSize={18} className="text-violet-500 rounded-full " />
          </div>
          <p className="text-sm text-violet-700 ">{chat?.chat?.mirrors}</p>
        </div>

        <div className="flex items-center text-center">
          <div className="rounded-full hover:bg-fuchsia-200 px-2  py-2 ">
            <BsHeart fontSize={15} className="text-fuchsia-500 " />
          </div>
          <p className="text-sm text-fuchsia-700 ">{chat?.chat?.likes}</p>
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
  );
};

export default Chat;
