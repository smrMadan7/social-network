import { useEffect } from "react";
import { SlUserFollow } from "react-icons/sl";
import { getUser, ipfsGateway } from "../../constants/AppConstants";

const Follow = (props:any) => {


  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-3">
        <img
          alt="user profile"
          src={`${ipfsGateway}${props.userProfile?.profile}`}
          height={50}
          width={50}
          className=" rounded-full"
          loading="lazy"
        ></img>
        <div>
          <p className="font-semibold ">{props?.userProfile?.name}</p>
          <p className=" text-gray-500">@{props?.userProfile?.display}</p>
        </div>
      </div>
      <div className="cursor-pointer text-black hover:bg-bgHover border rounded-lg">
        <div className="px-3 py-2 border border-violet-600 rounded-lg">
          <p>Follow</p>
        </div>
      </div>

      <style>
        {`
          .userid-background {
            background: rgb(203,66,252);
            background: linear-gradient(90deg, rgba(203,66,252,1) 22%, rgba(252,91,216,1) 79%);
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
        }`}
      </style>
    </div>
  );
};

export default Follow;
