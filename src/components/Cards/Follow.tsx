import { useEffect, useState } from "react";
import { SlUserFollow } from "react-icons/sl";
import { getUser } from "../../constants/AppConstants";

const Follow = () => {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions: any = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${getUser}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {})
      .catch((error) => {});
  });

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-3">
        <img
          alt="user profile"
          src="https://user-content.lenster.xyz/300x300/https://gateway.ipfscdn.io/ipfs/bafybeigcmbs2wfkccazb5xifosfxymrt33j7u2smgfhxt7khlzwtddxl4m"
          height={50}
          width={50}
          className=" rounded-full"
        ></img>
        <div>
          <p className="font-semibold ">Alan</p>
          <p className="font-semibold userid-background">@donosonaumczuk</p>
        </div>
      </div>
      <div className="cursor-pointer text-violet-600">
        <div className="px-3 py-2 border border-violet-600 rounded-lg">
          <SlUserFollow className=" " />
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
