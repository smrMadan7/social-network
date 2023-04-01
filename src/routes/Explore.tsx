import { useEffect, useState } from "react";
import { BiMenu } from "react-icons/bi";
import { getFeeds } from "../constants/AppConstants";
import FeedsContainer from "../containers/FeedsContainer";
import { useFeedsContext } from "../context/FeedsContextProvider";
import { useSocketContext } from "../context/SocketCotextProvider";
import { useUserContext } from "../context/UserContextProvider";
import { customGet } from "../fetch/customFetch";
import banner from "./../assets/Explore/banner.jpg";

const Explore = () => {
  const { appState }: any = useUserContext();
  const [allFeeds, setAllFeeds] = useState();
  const [fetchedFeeds, setFetchedFeeds] = useState<any>();
  const { feeds, setFeeds }: any = useFeedsContext();
  const {socketContext}:any = useSocketContext();


  useEffect(() => {
    getAllFeeds();
    if (!appState?.action?.user) {
      window.location.reload();
    }
  }, []);


  useEffect(() => {
    if (fetchedFeeds?.staus) {
      setAllFeeds(fetchedFeeds?.data);
      const feeds = fetchedFeeds?.data;
      setFeeds({
        feeds,
      });
    }
  }, [fetchedFeeds]);

  const getAllFeeds = async () => {
    customGet(`${getFeeds}${appState?.action?.user?.address}`, setFetchedFeeds, "getting all feeds");
  };


  useEffect(() => {

    socketContext?.socket.on("receiveNotifications", (data:any) => {
      getAllFeeds();
    });
  
    }, [socketContext?.socket])
  

  return (
    <>
      <div className="relative home-container h-screen  flex flex-col w-full overflow-y-auto " style={{ paddingTop: "90px" }}>
        <div className=" featured w-full border-b">
          <div className="m-auto flex w-full px-5 py-8 text-center sm:py-20 sm:text-left">
            <div className="flex flex-col space-y-3">
              <div className="text-3xl font-900 sm:text-4xl">Protocol Labs Social Network👋</div>
              <div className="sm:w-70">The Protocol Labs Network drives breakthroughs in computing to push humanity forward.</div>
            </div>
          </div>
        </div>

        <div className="flex gap-9 items-center text-gray-700 px-5 mt-6">
          <button className="flex gap-2 items-center p-2 rounded-lg bg-bgActive">
            <BiMenu fontSize={20} className="origin-center hover:rotate-45" style={{ transition: "1s" }} />
            Timeline
          </button>

        </div>

        <FeedsContainer feeds={allFeeds} />
      </div>

      <style>
        {`
          .warning-container {
            border-color: rgb(253 186 116);
          }
          .featured {
            width: 100%;
            height: 300px;
            background: linear-gradient(90deg, #fff, #fff 10%, transparent),
              url(${banner});
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
    </>
  );
}

export default Explore;
