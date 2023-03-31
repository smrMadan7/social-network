import { useNavigate } from "react-router";
import { defaultUserProfile, getUser, ipfsGateway } from "../../constants/AppConstants";
import { timeAgo } from "../../utils/timeAgo";
import { useEffect, useState } from "react";
import { customGet } from "../../fetch/customFetch";
import defaultProfile from "./.././../assets/Form/default-user.svg";


const SocketNotification = (props: any) => {
  const [notificationContent, setNotificationContent] = useState("");
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState(defaultProfile)
  const [userDetails, setUserDetails] = useState<any>();
  
  const goTo = async (e: any, actionId: any) => {
    navigate(`/explore?${actionId}`)
    const element: any = document.getElementById(actionId);
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  };


  useEffect(() => {
    if (userDetails?.status) {
      setUserImage(`${ipfsGateway}${userDetails?.data?.profilePictureUrl}`)
    }
  }, [userDetails])

  
  useEffect(() => {
    const notificationType = props?.notification?.type;
    if (notificationType === "like") {
      setNotificationContent("has liked your post")
    } else if (notificationType === "comment") {
      setNotificationContent("has commented on your post");
    } else if (notificationType === "share") {
      setNotificationContent("has shared your post");
    } else if (notificationType === "tag" && props?.notification?.details?.actionItem === "post") {
      setNotificationContent("has tagged you in a post")
    } else if (notificationType === "tag" && props?.notification?.details?.actionItem === "comment") {
      setNotificationContent("has tagged you in a comment");
    } else {
      setNotificationContent("has followed your profile");
    }
    customGet(`${getUser}${props?.notification?.performedBy}`, setUserDetails, "getting user details for notification")
  }, [])

  return (
    <div className="flex gap-2 items-center mt-3 mb-3">
      <div className=" rounded-full">
        <img className="rounded-full " height="50px" width="50px" src={userImage}></img>
      </div>

      <div>

        {userDetails?.data?.handle && (
          <p className="font-xs">
            {userDetails?.data?.handle} {notificationContent}
          </p>
        )
        }

        <div>
          <p>{`${timeAgo(props?.notification.timestamp)}`}</p>
        </div>
        <div className="flex items-center mt-1">
          <button className="border rounded-lg px-3 bg-bgHover bg-bgActive font-semibold"
            onClick={(event: any) => { goTo(event, props?.notification?.details?.actionId) }}>
            View
          </button>
        </div>
      </div>


    </div>
  )
}

export default SocketNotification;