import { BsStars } from "react-icons/bs";
import { getAllProfiles } from "../../constants/AppConstants";
import { getAllProfilesForMention } from "../../fetch/customFetch";

import Follow from "../Cards/Follow";

const WhoToFollow = (props:any) => {


  return (
    <div className="hidden md:block flex flex-col md:gap-5 md:w-35 follow-container ">
      <div className="flex gap-3 items-center">
        <BsStars color="orange" fontSize={20} />
        <p className="font-semibold">Who to follow</p>
      </div>
      <div className=" flex flex-col gap-7 p-3 px-5 border bg-white h-4/5 mt-4 rounded-t-lg overflow-y-auto">
        {/* follow card */}
        {props?.allProfiles?.map((profile: object, index: number) => {
          return (
            <div key={index}>
              <Follow userProfile ={profile}/>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 px-5 p-3 border rounded-b-lg bg-gray-200 cursor-pointer items-center text-center hover:bg-gray-300">
        <p>More</p>
      </div>
    </div>
  );
};
export default WhoToFollow;
