import { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { useLocation, useNavigate } from "react-router";
import { useFeedsContext } from "../../context/FeedsContextProvider";
import commingSoon from "./../././../assets/Notification/coming-soon.jpg";

const UserNotification = ({ isNotification, setIsNotification }: any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { feeds, setFeeds }: any = useFeedsContext();

  // const [scrollingElement, setScrollingElement] = useState<any>(null);

  // useEffect(() => {
  //   if (
  //     feeds?.action?.feeds.some((object: any) => object.postId === "6301bf27-cdb8-43fc-9662-9e43a1398569") &&
  //     scrollingElement !== null
  //   ) {
  //     scrollingElement.scrollIntoView({ behavior: "smooth" });
  //   } else if (feeds?.action?.feeds.includes("6301bf27-cdb8-43fc-9662-9e43a1398569")) {
  //     goTo();
  //   }
  // }, [scrollingElement]);

  const goTo = async () => {
    navigate("/explore");
    console.log("f", feeds?.action?.feeds);

    if (feeds?.action?.feeds.some((object: any) => object.postId === "6301bf27-cdb8-43fc-9662-9e43a1398569")) {
      console.log("first works");
      const element: any = document.getElementById("6301bf27-cdb8-43fc-9662-9e43a1398569");
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      {isNotification && (
        <div
          className="absolute z-10 text-9xl border rounded-lg right-0 px-2 bg-white w-250 md:w-320  "
          style={{ marginTop: "65px", height: "85vh" }}
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
          <div className="mt-2">
            <img alt="notification" src={commingSoon} height="100px" onClick={goTo}></img>
          </div>
        </div>
      )}
    </>
  );
};

export default UserNotification;
