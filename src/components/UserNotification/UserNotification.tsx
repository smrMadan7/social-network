import { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { useLocation, useNavigate } from "react-router";
import { io } from "socket.io-client";
import { baseUrl, defaultUserProfile, getNotifications, getUser, ipfsGateway } from "../../constants/AppConstants";
import { useFeedsContext } from "../../context/FeedsContextProvider";
import { useNotificationsContext } from "../../context/NotificationsContextProvider";
import { useUserContext } from "../../context/UserContextProvider";
import { customGet } from "../../fetch/customFetch";
import { eventList } from "../../utils/event";
import { timeAgo } from "../../utils/timeAgo";
import SocketNotification from "../Cards/SocketNotification";

const UserNotification = ({ isNotification, setIsNotification }: any) => {
  const {notifications, setNotifications}:any = useNotificationsContext();

  console.log("notifications is ", notifications);

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
            {
              notifications?.action?.notifications?.map((notification: any, index: any) => {
                // customGet(getUser, setUserDetails, "getting user detai")
                return (
                  <div key={index}>
                  <SocketNotification  notification = {notification}/>

                    </div>
                 
                )
              })


            }
          </div>
        </div>
      
    </>
  );
};

export default UserNotification;
