import { create } from "ipfs-http-client";
import { useCallback, useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { AiFillStar, AiOutlineFileGif } from "react-icons/ai";
import { MdOutlinePermMedia } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { createPost, ipfsPostUrl } from "../../constants/AppConstants";
import { useUserContext } from "../../context/UserContextProvider";
import { customPost } from "../../fetch/customFetch";
import getCroppedImage from "../../utils/crop";
import Loading from "../Loading/Loading";
import Warning from "./Warning";

const NewPost = ({ postStatus }: any) => {
  const [filePath, setFilePath] = useState("");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [uploadImage, setUploadImage] = useState<any>();
  const [warning, setWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cropStatus, setCropStatus] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedPixel, setCroppedPixel] = useState<Area>();
  const [isPost, setIsPost] = useState(postStatus);
  const [zoom, setZoom] = useState(1);
  const [postResult, setPostResult] = useState();
  const [content, setContent] = useState();
  const ipfs = create({ url: ipfsPostUrl });
  const { appState }: any = useUserContext();

  useEffect(() => {
    setIsBold(false);
    setIsItalic(false);
    setWarning(false);
    setIsCode(false);
  }, []);

  const mediaUpload = () => {
    let input: HTMLInputElement = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      if (input.files != null) {
        let files = Array.from(input.files);
        setFilePath(URL.createObjectURL(files[0]));
        setCropStatus(true);
      }
    };
    input.click();
  };

  const ipfsClient = async (croppedImg: any) => {
    try {
      const file = await ipfs.add(croppedImg);
      return file.path;
    } catch (error) {
      return;
    }
  };

  const cropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedPixel(croppedAreaPixels);
  };

  const publishPost = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const contentElement: any = document.getElementById("content");
    setContent(contentElement.innerHTML);

    try {
      ipfsClient(uploadImage)
        .then(async (path) => {
          if (path !== undefined) {
            const currentTimeStamp = Math.floor(Date.now() / 1000);
            const uri: any = {
              version: "1.0.0",
              description: "",
              content: content,
              coverImage: "",
              media: [
                {
                  file: path,
                  type: uploadImage?.type,
                  timestamp: currentTimeStamp,
                },
              ],
            };

            const params = {
              profileId: uuidv4(),
              address: appState?.action?.user?.address,
              postData: uri,
            };

            customPost(params, createPost, "POST", setPostResult, "creating post");
          } else {
            setWarning(true);

            setTimeout(() => {
              setWarning(false);
            }, 3000);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          setWarning(true);
        });
    } catch (e) {
      console.log(e);
      setWarning(true);
    }
  };

  const getGroppedImage = useCallback(async () => {
    setWarning(false);
    try {
      const { file, url }: any = await getCroppedImage(filePath, croppedPixel);

      setFilePath(url);
      setUploadImage(file);

      setCropStatus(false);
    } catch (e) {
      setWarning(true);
      console.log(e);
    }
  }, [croppedPixel]);

  return (
    <>
      {isLoading && (
        <div className="">
          <Loading />
        </div>
      )}

      {isPost && (
        <div className="border-t-2  w-100 ">
          <form onSubmit={publishPost}>
            {cropStatus ? (
              <div className="absolute z-10 flex flex-col items-center top-0 right-0 left-0 bottom-0 w-50 h-full m-auto justify-center sm:w-full">
                <div className=" relative w-50 sm:w-100" style={{ height: "50vh" }}>
                  <div>
                    <Cropper
                      image={filePath}
                      crop={crop}
                      zoom={zoom}
                      aspect={4 / 3}
                      onCropChange={setCrop}
                      onCropComplete={cropComplete}
                      onZoomChange={setZoom}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-50 bg-gray-700 ">
                  <div className="flex justify-center items-center mt-3">
                    <input
                      id="small-range"
                      type="range"
                      min={1}
                      max={50}
                      value={zoom}
                      onChange={(e: any) => {
                        setZoom(e.target.value);
                      }}
                      className="w-50 h-2 bg-blue-100 appearance-none"
                    />
                  </div>

                  <div className="flex items-center justify-center mb-3">
                    <button
                      type="button"
                      className="px-3 py-2 bg-violet-700 hover:bg-violet-900 rounded-lg text-white"
                      onClick={getGroppedImage}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div></div>
            )}
            {warning && <Warning message="Something went wrong. Please try again?"></Warning>}

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
              <div className="mt-3 p-4 relative">
                <div className=" border " id="tagContainer" style={{ fontSize: "20rem" }}>
                  abc
                </div>
                <div
                  className="cursor-pointer focus:outline-none select-text whitespace-pre-wrap break-words h-15"
                  contentEditable="true"
                  id="content"
                  onMouseMove={(e: any) => {
                    var containerElement: any = document.getElementById("tagContainer");
                    console.log("containerElement: " + containerElement);
                    const x = e.clientX;
                    const y = e.clientY;
                    containerElement.left = x + "px";
                    containerElement.style.top = y + "px";
                  }}
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

            <div className=" overflow-y-auto " style={{ height: "230px" }}>
              {filePath && !cropStatus && (
                <img alt="uploaded Image" src={filePath} loading="lazy"></img>
              )}
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
                <button type="submit" className="rounded-lg bg-violet-700 px-3 py-1 text-white">
                  Publish
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
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

            #tagContainer {
              height: 20px;
              width:"20px";
              background-color:black;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color:black;
            }

            `}
      </style>
    </>
  );
};
export default NewPost;
