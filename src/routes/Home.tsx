import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { BiMessageAltEdit, BiMenu } from "react-icons/bi";
import { HiLightBulb } from "react-icons/hi";
import { FaThList } from "react-icons/fa";
import { BsStars } from "react-icons/bs";

import Follow from "../components/Cards/Follow";
import { CiCircleMore } from "react-icons/ci";

import NewPost from "../components/Cards/NewPost";
import { GrFormClose } from "react-icons/gr";

const Home = () => {
  const [filterStatus, setFilterStatus] = useState("timeline");
  const [isPost, setIsPost] = useState(false);

  useEffect(() => {
    setFilterStatus("timeline");
    setIsPost(false);
  }, []);

  const posts = [];

  const users = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

  return (
    <>
      <div className="p-5 flex flex-col w-full overflow-y-auto bg-gray-100">
        <div style={{ height: "90px" }}></div>

        <div className="flex gap-5 " style={{ height: "78vh" }}>
          <div className="flex gap-5 flex-col w-full md:w-65 ">
            {/* Enter message  */}
            <div className="flex gap-4 p-7 border rounded-lg bg-white">
              <div className="border rounded-full px-4 py-4 bg-black">
                <FaUserAlt color="white" />
              </div>
              <div
                className="flex  gap-3 text-center items-center bg-gray-100 border w-full rounded-lg px-3 py-3 cursor-pointer "
                onClick={() => setIsPost(true)}
              >
                <BiMessageAltEdit fontSize={25} />
                <p className="items-center">What's happening?</p>
              </div>
            </div>

            {/* Filter section */}

            <div className="flex justify-between items-center">
              <div className="flex gap-9 items-center text-gray-700">
                <button
                  className="flex gap-2 items-center p-2 rounded-lg hover:bg-violte-200"
                  style={
                    filterStatus === "timeline" ? { background: "#cfc6f0" } : { background: "" }
                  }
                  onClick={() => setFilterStatus("timeline")}
                >
                  <BiMenu fontSize={20} />
                  Timeline
                </button>
                <button
                  className="flex gap-2  items-center p-2 rounded-lg hover:bg-violet-200"
                  style={
                    filterStatus === "highlight" ? { background: "#cfc6f0" } : { background: "" }
                  }
                  onClick={() => setFilterStatus("highlight")}
                >
                  <HiLightBulb fontSize={23} />
                  Highlights
                </button>
              </div>

              {/* <div className="flex gap-9 items-center">
                <button className="flex hover:bg-violet-200 p-2 rounded-lg">
                  <div className="flex items-center gap-2 text-center">
                    <div className="rounded-full bg-black px-1 py-1">
                      <FaUserAlt color="white" />
                    </div>
                    My Feed
                    <div className="items-center flex ">
                      <RiArrowDownSLine fontSize={23} />
                    </div>
                  </div>
                </button>
                <div className="cursor-pointer p-2 hover:bg-violet-200 rounded-lg">
                  <FiFilter />
                </div>
              </div> */}
            </div>

            {/* post section */}

            <div className="border rounded-lg">
              {posts.length === 0 ? (
                <div className="p-7 flex justify-center bg-white border rounded-lg ">
                  <div className="flex flex-col items-center gap-2 text-violet-700 ">
                    <FaThList fontSize={20} />
                    <h1 className="font-semibold text-md text-black">No Posts Yet!</h1>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>

          {/* Who to follow section */}
          <div className="hidden md:block flex flex-col md:gap-5 md:w-35 follow-container ">
            <div className="flex gap-3 items-center">
              <BsStars color="orange" fontSize={20} />
              <p className="font-semibold">Who to follow</p>
            </div>
            <div className=" flex flex-col gap-7 p-3 px-5 border bg-white h-4/5 mt-4 rounded-t-lg overflow-y-auto">
              {/* follow card */}
              {users.map((user: object, index: number) => {
                return (
                  <div key={index}>
                    <Follow />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3 px-5 p-3 border rounded-b-lg bg-gray-200 cursor-pointer items-center text-center hover:bg-gray-300">
              <CiCircleMore fontSize={20} />
              <p>More</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add new post */}

      {isPost && (
        <div className=" absolute w-full top-0 h-screen ">
          <div className=" flex top-0 bottom-0 right-0 left-0  m-auto">
            <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
              {/* new post content */}
              <div className="relative flex flex-col  md:w-50 sm:w-70 bg-white rounded-lg overflow-y-auto h-5/6 ">
                <div className="flex justify-between p-4">
                  <p className="font-semibold text-xl">Create Post</p>
                  <div
                    className="px-1 py-1 rounded-full cursor-pointer hover:bg-gray-300"
                    onClick={() => {
                      setIsPost(false);
                    }}
                  >
                    <GrFormClose fontSize={25} />
                  </div>
                </div>
                <NewPost />
              </div>
            </div>
          </div>
        </div>
      )}
      <Outlet />
    </>
  );
};

export default Home;
