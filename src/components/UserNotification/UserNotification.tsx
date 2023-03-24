import { GrFormClose } from "react-icons/gr";
import commingSoon from "./../././../assets/Notification/coming-soon.jpg";

const UserNotification = ({ isNotification, setIsNotification }: any) => {
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
            <img alt="notification" src={commingSoon} height="100px"></img>
          </div>
        </div>
      )}
    </>
  );
};

export default UserNotification;
