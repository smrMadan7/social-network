import { FaThList } from "react-icons/fa";

const EmptyPost = ({ content }: any) => {
  return (
    <div className="p-7 flex justify-center bg-white  rounded-lg ">
      <div className="flex flex-col items-center gap-2 text-violet-700 ">
        <FaThList fontSize={20} />
        <h1 className=" text-md text-slate-400 text-center">{content}</h1>
      </div>
    </div>
  );
};

export default EmptyPost;
