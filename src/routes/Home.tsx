import { useEffect, useState } from "react";
import { BiMenu, BiMessageAltEdit } from "react-icons/bi";
import { FaThList, FaUserAlt } from "react-icons/fa";
import { Outlet } from "react-router-dom";

import { create } from "ipfs-http-client";
import { useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { AiFillStar, AiOutlineReload, AiOutlineItalic } from "react-icons/ai";
import { GrFormClose } from "react-icons/gr";
import { MdOutlinePermMedia, MdOutlineScience } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import Web3 from "web3";
import Notification from "../components/Cards/Notification";
import Warning from "../components/Cards/Warning";
import { createPost, getPostById, ipfsPostUrl } from "../constants/AppConstants";
import { useUserContext } from "../context/UserContextProvider";
import getCroppedImage from "../utils/crop";
import { Tooltip } from "react-tooltip";
import Loading from "../components/Loading/Loading";
import Post from "../components/Cards/Post";

const Home = () => {
  const [filterStatus, setFilterStatus] = useState("timeline");
  const { appState }: any = useUserContext();

  const [isPost, setIsPost] = useState(false);
  const [filePath, setFilePath] = useState("");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [uploadImage, setUploadImage] = useState<any>();
  const [warning, setWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cropStatus, setCropStatus] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedPixel, setCroppedPixel] = useState<Area>();
  const [zoom, setZoom] = useState(1);
  const [posts, setPosts] = useState<any>([]);
  const [ipfsPath, setIpfsPath] = useState<any>();
  const [isReload, setIsReload] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    setIsBold(false);
    setIsItalic(false);
    setWarning(false);
    setIsCode(false);
  }, []);

  useEffect(() => {
    getAllPosts();
  }, [isReload]);

  useEffect(() => {
    setFilterStatus("timeline");
    if (!appState?.action?.user) {
      window.location.reload();
    }
    setIsPost(false);
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

  const ipfs = create({ url: ipfsPostUrl });

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

    const contentElement: any = document.getElementById("content");
    var content = contentElement.innerHTML;
    if (isBold && content) {
      content = `<span class="font-bold">${content}</span>`;
    } else if (isItalic && content) {
      content = `<span class="italic">${content}</span>`;
    } else if (isBold && isItalic && content) {
      content = `<span class="font-bold italic">${content}</span>`;
    } else {
      content = content;
    }

    if (content !== "") {
      try {
        ipfsClient(uploadImage)
          .then(async (path) => {
            setIsLoading(true);
            if (path !== undefined) {
              setIpfsPath(path);
            } else {
              setIsLoading(true);
            }
            const provider: any = window.ethereum;
            const web3: any = new Web3(provider);
            const userAccount = await web3.eth.getAccounts();
            const address = userAccount[0];
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
            const post = {
              postId: uuidv4(),
              address: address,
              postData: uri,
            };
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var requestOptions: any = {
              method: "POST",
              headers: myHeaders,
              body: JSON.stringify(post),
              redirect: "follow",
            };
            fetch(createPost, requestOptions)
              .then((response) => response.json())
              .then((result) => {
                if (result.status !== false) {
                  setIsPost(false);
                  setIsLoading(false);
                  setFilePath("");
                  getAllPosts();
                }
              })
              .catch((error) => {});
          })
          .catch((error) => {
            setWarningMessage("Something went wrong!");
            setWarning(true);
            setTimeout(() => {
              setWarningMessage("");
              setWarning(false);
            }, 100);
            console.log("Error occured while publishing post", error);
          });
      } catch (e) {
        setWarning(true);
      }
    } else {
      setWarningMessage("Content is required!");
      setWarning(true);
      setIsLoading(false);
      setTimeout(() => {
        setWarning(false);
        setWarningMessage("");
      }, 2000);
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
      console.log("Error occured while getGroppedImage", e);
    }
  }, [croppedPixel]);

  const getAllPosts = async () => {
    const provider: any = window.ethereum;
    const web3: any = new Web3(provider);
    const userAccount = await web3.eth.getAccounts();
    const address = userAccount[0];

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions: any = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${getPostById}${address}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status !== false) {
          setPosts(result.data);
        }
      })
      .catch((error) => {
        console.log("Error occured while get all posts", error);
      });
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="p-5 flex flex-col w-full overflow-y-auto bg-gray-100 h-screen">
        <div style={{ height: "90px" }}></div>

        <div className="flex gap-5" style={{ height: "78vh" }}>
          <div className="flex gap-5 flex-col w-full md:w-65 ">
            {/* Enter message  */}
            <div className="flex gap-4 p-7 px-2 md:px-7 border rounded-lg bg-white">
              <div className="">
                <div className="border rounded-full px-4 py-4 bg-black">
                  <FaUserAlt color="white" />
                </div>
              </div>
              <div
                className="flex  gap-2 md:gap-3 text-center items-center bg-gray-100 border w-full rounded-lg px-3 py-3 cursor-pointer "
                onClick={() => setIsPost(true)}
              >
                <BiMessageAltEdit fontSize={25} />
                <p className="items-center whitespace-nowrap">What's happening?</p>
              </div>
            </div>

            {/* Filter section */}

            <div className="flex justify-between items-center">
              <div className="flex gap-9 items-center text-gray-700">
                <button
                  className="flex gap-2 items-center p-2 rounded-lg hover:bg-violte-200"
                  style={
                    filterStatus === "timeline"
                      ? { background: "rgb(196 181 253)" }
                      : { background: "" }
                  }
                  onClick={() => setFilterStatus("timeline")}
                >
                  <BiMenu
                    fontSize={20}
                    className="origin-center hover:rotate-45"
                    style={{ transition: "1s" }}
                  />
                  Timeline
                </button>
                <button
                  className="flex gap-2  items-center p-2 rounded-lg hover:bg-violet-200 d-none"
                  onClick={() => {
                    setIsReload(true);
                  }}
                >
                  <AiOutlineReload
                    fontSize={23}
                    className="origin-center hover:rotate-180"
                    style={{ transition: "1s" }}
                  />
                  Reload
                </button>
              </div>

              {/* <div className="flex gap-9 items-center">
                <button className="flex hover:bg-violet-200 p-2 rounded-lg">
                  <div className="flex items-center gap-2 text-center">
                    <div className="rounded-full bg-black px-1 py-1">
                      <FaUserAlt color="white" />
                    </div>
                    My Feed
                    <div className="items-center flex ">
                      <RiArrowDownSLine fontSize={23} />
                    </div>
                  </div>
                </button>
                <div className="cursor-pointer p-2 hover:bg-violet-200 rounded-lg">
                  <FiFilter />
                </div>
              </div> */}
            </div>

            {/* post section */}

            <div className="border rounded-lg">
              {posts?.length === 0 ? (
                <div className="p-7 flex justify-center bg-white border rounded-lg ">
                  <div className="flex flex-col items-center gap-2 text-violet-700 ">
                    <FaThList fontSize={20} />
                    <h1 className=" text-md text-slate-400 text-center">
                      You haven't posted anything yet!
                    </h1>
                  </div>
                </div>
              ) : (
                <div className=" mb-9 md:mb-2">
                  {posts?.map((post: any, index: any) => {
                    return (
                      <div key={uuidv4()}>
                        <Post post={post} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Who to follow section */}
          <div className="flex-col hidden md:flex md:w-30 ">
            <div className="border-orange-300	text-yellow-600 w-full bg-amber-100  rounded-lg">
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
      </div>
      {/* Add new post */}

      {isPost && (
        <div className=" absolute w-full top-0 h-screen m-auto ">
          <div className=" flex top-0 bottom-0 right-0 left-0  m-auto">
            <div
              className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay"
              style={{ zIndex: 10 }}
            >
              {/* new post content */}
              <div className="relative flex flex-col w-90 md:w-50 bg-white rounded-lg overflow-y-auto m-auto h-5/6 md:h-5/6">
                <div className="flex justify-between p-4 w-100">
                  <p className="font-semibold text-xl">Create Post</p>
                  <div
                    className="px-1 py-1 rounded-full cursor-pointer hover:bg-gray-300"
                    onClick={() => {
                      setIsPost(false);
                    }}
                  >
                    <GrFormClose fontSize={25} />
                  </div>
                </div>
                {/* new post */}
                <div className="border-t-2  w-100 ">
                  <form onSubmit={publishPost}>
                    {cropStatus ? (
                      <div className="absolute z-10 flex flex-col items-center top-0 right-0 left-0 bottom-0 w-full h-full m-auto justify-center ">
                        <div className=" relative w-90 sm:w-50" style={{ height: "50vh" }}>
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
                        <div className="flex flex-col gap-4 w-90 md:w-50 bg-gray-700 ">
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
                    {warning && <Warning message={warningMessage}></Warning>}
                    <div className="flex gap-4 justify-between p-4">
                      <div className="flex gap-8">
                        <button
                          type="button"
                          id="bold"
                          className="font-bold text-violet-900 text-2xl cursor-pointer rounded-full hover:bg-grey "
                          style={isBold ? { fontWeight: "900" } : { fontWeight: "" }}
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
                          type="button"
                          id="italic"
                          className="font-semibold text-violet-900 text-xl italic mt-1"
                          style={isItalic ? { fontWeight: "700" } : { fontWeight: "" }}
                          onClick={() => {
                            if (isItalic) {
                              setIsItalic(false);
                            } else {
                              setIsItalic(true);
                            }
                          }}
                        >
                          <AiOutlineItalic />
                        </button>
                        {/* <button
                          type="button"
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
                        </button> */}
                      </div>
                      <div>
                        <button
                          type="button"
                          className="cursor-default flex gap-2 items-center border rounded-lg  px-2 py-1 text-yellow-600  bg-amber-100"
                        >
                          <AiFillStar className="mt-1" />
                          Beta
                        </button>
                      </div>
                    </div>
                    <Tooltip
                      anchorId="bold"
                      place="bottom"
                      content="Bold"
                      className="z-10 absolute bg-black text-white border rounded-lg px-2"
                    />
                    <Tooltip
                      anchorId="italic"
                      place="bottom"
                      content="Italic"
                      className="z-10 absolute bg-black text-white border rounded-lg px-2"
                    />
                    <div className="w-full border-t-2">
                      <div className="mt-3 p-4">
                        {/* <input
                          placeholder="Share something!"
                          value={content}
                          onChange={(e) => {
                            setContent(e.target.value);
                            if (e.target.value.includes("http")) {
                              const firstIndex = e.target.value.indexOf("http");
                              const lastIndex = e.target.value.indexOf(" ", firstIndex);
                              console.log("first index is", firstIndex, "last index is", lastIndex);
                            }
                          }}
                          className="cursor-pointer focus:outline-none select-text whitespace-pre-wrap break-words h-15"
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
                        ></input> */}
                        <div
                          className="cursor-pointer focus:outline-none select-text whitespace-pre-wrap break-words h-15"
                          contentEditable="true"
                          id="content"
                          onKeyDown={(e: any) => {}}
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

                    <div className=" overflow-y-auto h-150 md:h-225 ml-5 md:ml-10">
                      {filePath && !cropStatus && (
                        <img
                          alt="uploaded Image"
                          className="h-150 md:h-225"
                          src={filePath}
                          loading="lazy"
                        ></img>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 bpx-5 flex justify-end w-full items-center gap-5 mt-3 md:mt-0 mb-2">
                      <div className="flex gap-4 text-violet-700 font-semibold">
                        <div className="relative cursor-pointer" onClick={mediaUpload}>
                          <MdOutlinePermMedia fontSize={20} />
                        </div>
                        {/* <div className="cursor-pointer">
                          <AiOutlineFileGif fontSize={20} />
                        </div> */}
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="rounded-lg bg-violet-700 px-3 py-1 text-white"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
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
      )}
      <Outlet />
    </>
  );
};

export default Home;
