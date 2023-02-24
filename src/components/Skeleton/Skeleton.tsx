import React, { Fragment, useState } from "react";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { MdOutlineScience } from "react-icons/md";
import { IChat } from "../../Types/interface";
import Chat from "../Cards/Chat";
import Warning from "../Cards/Notification";

const Skeleton = () => {
  const [isLogin, setIsLogin] = useState(false);
  const chats = [
    {
      imageUrl:
        "https://user-content.lenster.xyz/300x300/https://gateway.ipfscdn.io/ipfs/bafybeigcmbs2wfkccazb5xifosfxymrt33j7u2smgfhxt7khlzwtddxl4m",
      userName: "Yoginth",
      userId: "@Yoginth",
      isVerified: true,
      message: "Good Morning to everyone",
      likes: 4,
      mirrors: 3,
      date: "Feb 6",
    },
  ];

  return (
    <div className="absolute home-container flex flex-col w-full overflow-hidden">
      <div style={{ height: "80px" }}></div>
      <div className=" featured w-full border-b">
        <div className="m-auto flex w-full px-5 py-8 text-center sm:py-20 sm:text-left">
          <div className="flex flex-col space-y-3">
            <div className="text-3xl font-900 sm:text-4xl">Protocol Labs Social Network👋</div>
            <div className="sm:w-70">
              The Protocol Labs Network drives breakthroughs in computing to push humanity forward.
            </div>
          </div>
        </div>
      </div>
      <div className=" gap-6 mt-12 flex bg-white w-full px-5">
        <div className="w-full md:w-70 border rounded-lg overflow-hidden">
          {chats?.map((chat: IChat, index: number) => {
            return (
              <Fragment key={index}>
                <Chat chat={chat} />
              </Fragment>
            );
          })}
        </div>
        <div className="flex-col hidden md:flex md:w-30">
          <div className="border-orange-300	text-yellow-600 w-full bg-amber-100  rounded-lg">
            <Warning
              headerImg={<MdOutlineScience />}
              title={"Beta Warning"}
              description={
                "This Decentralized chat system is still in the beta phase, things may break, please handle us with care."
              }
              footerImg={<HiOutlineCurrencyDollar />}
              footerContent={"Get testnet tokens"}
            />
          </div>
        </div>
      </div>

      <style>
        {`
          .warning-container {
            border-color: rgb(253 186 116);
          }
          .featured {
            width: 100%;
            height: 300px;
            background: linear-gradient(90deg, #fff, #fff 50%, transparent),
              url(https://static-assets.lenster.xyz/images/hero.webp);
            background-size: cover;
          }
          ::-webkit-scrollbar {
              width: 4px;
          }
  
          ::-webkit-scrollbar-track {
              box-shadow: inset 0 0 5px whitesmoke;
              border-radius: 10px;
          }
  
          ::-webkit-scrollbar-thumb {
              background: #c4d7e4;
              border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb:hover {
              background: #b3df1;
          }
  
        `}
      </style>
    </div>
  );
};

export default Skeleton;
