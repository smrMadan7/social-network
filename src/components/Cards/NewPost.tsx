import { useEffect, useState } from "react";
import { AiFillStar, AiOutlineFileGif } from "react-icons/ai";
import { MdOutlinePermMedia } from "react-icons/md";

const NewPost = () => {
  const [filePath, setFilePath] = useState("");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isCode, setIsCode] = useState(false);

  useEffect(() => {
    setIsBold(false);
    setIsItalic(false);
    setIsCode(false);
  }, []);

  const mediaUpload = () => {
    let input: HTMLInputElement = document.createElement("input");
    input.type = "file";
    input.onchange = () => {
      if (input.files != null) {
        let files = Array.from(input.files);
        setFilePath(URL.createObjectURL(files[0]));
      }
    };
    input.click();
  };

  return (
    <>
      <div className="border-t-2  w-100 ">
        <div className="flex gap-4 justify-between p-4">
          <div className="flex gap-8">
            <button
              className="font-semibold text-violet-900 text-xl cursor-pointer rounded-full "
              style={isBold ? { fontWeight: "700" } : { fontWeight: "" }}
              onClick={() => {
                if (isBold) {
                  setIsBold(false);
                } else {
                  setIsBold(true);
                }
              }}
            >
              B
            </button>

            <button
              className="font-semibold text-violet-900 text-xl italic"
              style={isItalic ? { fontWeight: "700" } : { fontWeight: "" }}
              onClick={() => {
                if (isItalic) {
                  setIsItalic(false);
                } else {
                  setIsItalic(true);
                }
              }}
            >
              I
            </button>
            <button
              className="font-semibold text-violet-900 text-xl"
              style={isCode ? { fontWeight: "700" } : { fontWeight: "" }}
              onClick={() => {
                if (isCode) {
                  setIsCode(false);
                } else {
                  setIsCode(true);
                }
              }}
            >
              {"</>"}
            </button>
          </div>
          <div>
            <button className="flex gap-2 items-center border rounded-lg  px-2 py-1 text-white bg-violet-700">
              <AiFillStar color="white" className="mt-1" />
              Beta
            </button>
          </div>
        </div>
        <div className="w-full border-t-2">
          <div className="mt-3 p-4">
            <div
              className="focus:outline-none select-text whitespace-pre-wrap break-words h-16"
              contentEditable="true"
              data-placeholder="What's happening?"
              style={
                isBold
                  ? { fontWeight: "bold" }
                  : isCode
                  ? { background: "gray" }
                  : isItalic
                  ? { fontStyle: "italic" }
                  : isBold && isCode && isItalic
                  ? {
                      fontWeight: "bold",
                      background: "grap",
                      fontStyle: "italic",
                    }
                  : isCode && isItalic
                  ? {
                      background: "gray",
                      fontStyle: "italic",
                    }
                  : isBold && isItalic
                  ? {
                      fontStyle: "italic",
                      fontWeight: "bold",
                    }
                  : {}
              }
            ></div>
          </div>
        </div>
        <div className=" overflow-y-auto" style={{ height: "230px" }}>
          <img alt="user profile" src={filePath}></img>
        </div>

        <div className="absolute bottom-2 px-5 flex justify-between  w-full items-center">
          <div className="flex gap-4 text-violet-700 font-semibold">
            <div className="relative cursor-pointer" onClick={mediaUpload}>
              <MdOutlinePermMedia fontSize={20} />
            </div>
            <div className="cursor-pointer">
              <AiOutlineFileGif fontSize={20} />
            </div>
          </div>
          <div>
            <button className="rounded-lg bg-violet-700 px-3 py-1 text-white">Publish</button>
          </div>
        </div>

        <style>
          {`
          div:empty:before {
            content:attr(data-placeholder);
            color:gray
          }
          div:empty:before {
            content:attr(data-placeholder);
            color:gray
          }
          
          `}
        </style>
      </div>
    </>
  );
};

export default NewPost;
