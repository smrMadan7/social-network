import { useEffect, useState } from "react";
import { BiMenu, BiMessageAltEdit } from "react-icons/bi";
import { FaThList, FaUserAlt } from "react-icons/fa";
import { HiLightBulb } from "react-icons/hi";
import { Outlet } from "react-router-dom";

import { create } from "ipfs-http-client";
import { useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { AiFillStar, AiOutlineFileGif } from "react-icons/ai";
import { GrFormClose } from "react-icons/gr";
import { MdOutlinePermMedia, MdOutlineScience } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import Web3 from "web3";
import Notification from "../components/Cards/Notification";
import Warning from "../components/Cards/Warning";
import { createPost, getPostById, ipfsPostUrl } from "../constants/AppConstants";
import { useUserContext } from "../context/UserContextProvider";
import getCroppedImage from "../utils/crop";

import Chat from "../components/Cards/Chat";

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
  const [isLoading, setIsLoading] = useState(false);
  const [cropStatus, setCropStatus] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedPixel, setCroppedPixel] = useState<Area>();
  const [zoom, setZoom] = useState(1);
  const [posts, setPosts] = useState<any>([]);
  const [ipfsPath, setIpfsPath] = useState<any>();
  useEffect(() => {
    setIsBold(false);
    setIsItalic(false);
    setWarning(false);
    setIsCode(false);
  }, []);

  useEffect(() => {
    setFilterStatus("timeline");
    getAllPosts();

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
    setIsLoading(true);
    const contentElement: any = document.getElementById("content");
    const content = contentElement.innerHTML;

    try {
      ipfsClient(uploadImage)
        .then(async (path) => {
          if (path !== undefined) {
            setIpfsPath(path);
          } else {
            setWarning(true);

            setTimeout(() => {
              setWarning(false);
            }, 3000);
            setIsLoading(false);
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
            profileId: uuidv4(),
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

                getAllPosts();
              }
            })
            .catch((error) => {});
        })
        .catch((error) => {
          setWarning(true);
          console.log(error);
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
        console.log(error);
      });
  };

  getAllPosts();

  return (
    <>
      <div className="p-5 flex flex-col w-full overflow-y-auto bg-gray-100">
        <div style={{ height: "90px" }}></div>

        <div className="flex gap-5 " style={{ height: "78vh" }}>
          <div className="flex gap-5 flex-col w-full md:w-65 ">
            {/* Enter message  */}
            <div className="flex gap-4 p-7 border rounded-lg bg-white">
              <div className="border rounded-full px-4 py-4 bg-black">
                <FaUserAlt color="white" />
              </div>
              <div
                className="flex  gap-3 text-center items-center bg-gray-100 border w-full rounded-lg px-3 py-3 cursor-pointer "
                onClick={() => setIsPost(true)}
              >
                <BiMessageAltEdit fontSize={25} />
                <p className="items-center">What's happening?</p>
              </div>
            </div>

            {/* Filter section */}

            <div className="flex justify-between items-center">
              <div className="flex gap-9 items-center text-gray-700">
                <button
                  className="flex gap-2 items-center p-2 rounded-lg hover:bg-violte-200"
                  style={
                    filterStatus === "timeline" ? { background: "#cfc6f0" } : { background: "" }
                  }
                  onClick={() => setFilterStatus("timeline")}
                >
                  <BiMenu fontSize={20} />
                  Timeline
                </button>
                <button
                  className="flex gap-2  items-center p-2 rounded-lg hover:bg-violet-200 d-none hidden"
                  style={
                    filterStatus === "highlight" ? { background: "#cfc6f0" } : { background: "" }
                  }
                  onClick={() => setFilterStatus("highlight")}
                >
                  <HiLightBulb fontSize={23} />
                  Highlights
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
                    <h1 className="font-semibold text-md text-black">No Posts Yet!</h1>
                  </div>
                </div>
              ) : (
                <div className=" overflow-y-auto mb-2" style={{ height: "50vh" }}>
                  {posts?.map((post: any, index: any) => {
                    return (
                      <>
                        <div key={uuidv4() + index}>
                          <Chat post={post} />
                        </div>
                      </>
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
        <div className=" absolute w-full top-0 h-screen ">
          <div className=" flex top-0 bottom-0 right-0 left-0  m-auto">
            <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
              {/* new post content */}
              <div className="relative flex flex-col  md:w-50 sm:w-70 bg-white rounded-lg overflow-y-auto h-5/6 ">
                <div className="flex justify-between p-4">
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
                    {warning && (
                      <Warning message="Something went wrong. Please try again?"></Warning>
                    )}

                    <div className="flex gap-4 justify-between p-4">
                      <div className="flex gap-8">
                        <button
                          type="button"
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
                          type="button"
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
                          className="cursor-pointer focus:outline-none select-text whitespace-pre-wrap break-words h-15"
                          contentEditable="true"
                          id="content"
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
                      {filePath && !cropStatus && <img alt="uploaded Image" src={filePath}></img>}
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
