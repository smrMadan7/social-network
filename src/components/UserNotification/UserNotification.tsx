import { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { useLocation, useNavigate } from "react-router";
import { io } from "socket.io-client";
import { baseUrl, defaultUserProfile, getNotifications, getUser, ipfsGateway } from "../../constants/AppConstants";
import { useFeedsContext } from "../../context/FeedsContextProvider";
import { useUserContext } from "../../context/UserContextProvider";
import { customGet } from "../../fetch/customFetch";
import { eventList } from "../../utils/event";
import { timeAgo } from "../../utils/timeAgo";
import SocketNotification from "../Cards/SocketNotification";
import { useSocketContext } from "../../context/SocketCotextProvider";
import EmptyPost from "../Cards/EmptyPost";

const UserNotification = ({ isNotification, setIsNotification, setIsNewNotification}: any) => {
  const { appState }: any = useUserContext();
  const { socketContext }: any = useSocketContext();
  const [allNotifications, setAllNotifications] = useState<any>([]);


  useEffect(() => {

    socketContext?.socket.on("receiveNotifications", (data: any) => {
      setIsNewNotification(true);
       getAllNotifications();
      setAllNotifications([...allNotifications, data])

    });

  }, [socketContext?.socket]);


  useEffect(() => {
    const socketParams = {
      address: appState?.action?.user?.address,
    }
    socketContext?.socket.emit("joinNotifications", socketParams);
    if (appState?.action?.user) {
    getAllNotifications();
    }
  }, [])

  useEffect(() => {
    getAllNotifications();
  }, [appState])

  useEffect(() => {


    if(allNotifications?.status) {
      setAllNotifications(allNotifications?.data);
    }
  }, [allNotifications])



  const getAllNotifications = () => {
    customGet(`${getNotifications}${appState?.action?.user?.address}`, setAllNotifications, "getting all notifications")
  }

  return (
    <>

      <div
        className="absolute z-10 border rounded-lg right-0 px-2 bg-white w-250 md:w-320"
        style={{ marginTop: "65px", height: "65vh" }}
      >
        <div className="flex justify-between p-3 border-b">
          <div>
            <h1 className="text-xl font-bold">Notifications</h1>
          </div>
          <div
            className="px-1 py-1 rounded-full cursor-pointer hover:bg-gray-300"
            onClick={() => {
              setIsNotification(false);
            }}
          >
            <GrFormClose color="black" fontSize={25} />
          </div>
        </div>
        <div className="mt-2 overflow-y-auto w-full" style={{ height: "50vh" }}>
          {allNotifications.length > 0 ? (

            <>
              {
                allNotifications?.map((notification: any, index: any) => {
                  return (
                    <div key={index}>
                      <SocketNotification notification={notification} />

                    </div>

                  )
                })
              }

            </>
          ): (
            <div> 
              <EmptyPost content={"You don't have any notofications yet!"} />
            </div>
          )



          }
        </div>
      </div>

    </>
  );
};

export default UserNotification;
