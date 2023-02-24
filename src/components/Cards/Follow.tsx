import { SlUserFollow } from "react-icons/sl";

const Follow = () => {
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
          <p className="font-semibold">Alan</p>
          <p>@donosonaumczuk</p>
        </div>
      </div>
      <div className="cursor-pointer text-violet-600">
        <div className="px-3 py-2 border border-violet-600 rounded-lg">
          <SlUserFollow className=" " />
        </div>
      </div>
    </div>
  );
};

export default Follow;
