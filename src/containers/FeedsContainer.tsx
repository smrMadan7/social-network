import { MdOutlineScience } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import EmptyPost from "../components/Cards/EmptyPost";
import Feeds from "../components/Cards/Feeds";
import Notification from "../components/Cards/Notification";
import { useUserContext } from "../context/UserContextProvider";


const FeedsContainer = ({ feeds }: any) => {
  const { appState }: any = useUserContext();
  // useEffect(() => {
  //   const element: any = document.getElementById("0a0f65ab-163b-4274-a6c8-3c4224cae30a");
  //   element.scrollIntoView({ behavior: "smooth", block:"center" }); 
  // }, [])
  return (
    <div className=" gap-6 mt-6 flex bg-white w-full px-5 feeds-container">
      <div className="w-full md:w-70 border rounded-lg ">
        {feeds?.length > 0 ? (
          <>
            {feeds?.map((post: any, index: number) => {
              return (
                <div id={post?.postId} key={index + uuidv4()}>
                  <Feeds post={post} address={appState?.action?.user?.address} />
                </div>
              );
            })}
          </>
        ) : (
          <>
            <EmptyPost content={"No one posted anything yet!"} />
          </>
        )}
      </div>

      <div className="flex-col hidden md:flex md:w-30 sticky top-4 right-0 z-1" style={{ left: "70vw" }}>
        <div className="border-orange-300	text-yellow-600 w-full bg-amber-100 rounded-lg">
          <Notification
            headerImg={<MdOutlineScience />}
            title={"Beta Warning"}
            description={
              "This Decentralized social network is still in the beta phase, things may break, please handle us with care."
            }
          />
        </div>
      </div>
    </div>
  );
}

export default FeedsContainer;
