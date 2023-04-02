import React, { useCallback, useEffect, useState } from "react";

import { create } from "ipfs-http-client";
import { Area } from "react-easy-crop";
import { GrFormClose } from "react-icons/gr";
import { useNavigate } from "react-router";
import Web3 from "web3";
import { addTeam, defaultUserProfile, handleCheck, ipfsPostUrl } from "../../constants/AppConstants";
import { useUserContext } from "../../context/UserContextProvider";
import { customPost } from "../../fetch/customFetch";
import getCroppedImage from "../../utils/crop";
import Crop from "../Cards/Crop";
import Warning from "../Cards/Warning";
import Loading from "../Loading/Loading";
import Navbar from "../Navbar/Navbar";
import PoweredBy from "../PoweredBy/PoweredBy";
import defaultProfile from "./../././.././assets/Form/default-user.svg";

const Team = () => {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userImage, setUserImage] = useState(defaultProfile);
  const [uploadFile, setUploadFile] = useState<any>();
  const [toast, setToast] = useState(false);

  const [cropStatus, setCropStatus] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedPixel, setCroppedPixel] = useState<Area>();
  const [zoom, setZoom] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string>();
  const {appState, appStatedispatch }: any = useUserContext();
  const [toastMessage, setToastMessage] = useState("");
  const [handle, setHandle] = useState(true);
  const [handleWarning, setHandleWarning] = useState(false);
  const [teamResult, setTeamResult] = useState<any>();

  const [isWebsiteWarning, setIsWebsiteWarning] = useState(true);
  const [isTwitterWarning, setIsTwitterWarning] = useState(true);
  const [isDiscordWarning, setIsDiscordWarning] = useState(true);
  const urlRegex = /^(https?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;

  const navigate = useNavigate();

  useEffect(() => {
      if (appState?.action?.user) {
        navigate("/")
      } else {
        setIsLoading(false);
        setDescription("");
        setUserImage(defaultProfile);
        setToast(false);
        setCropStatus(false);
        setHandle(true);
      }
  
  }, []);

  useEffect(() => {
    if (teamResult?.status) {
      const user = teamResult?.data;
      appStatedispatch({
        user,
      });
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } else if (!teamResult?.status) {
      setIsLoading(false);
    }
  }, [teamResult]);
  const ipfs = create({ url: ipfsPostUrl });

  const ipfsClient = async (croppedImg: any) => {
    try {
      const file = await ipfs.add(croppedImg);
      return file.path;
    } catch (error) {
      return;
    }
  };

  const checkHandle = (event: any) => {
    if (event.target.value.length > 1) {
      var requestOptions: any = {
        method: "GET",
        redirect: "follow",
      };

      fetch(`${handleCheck}${event.target.value}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status === true) {
            setHandle(true);
            setHandleWarning(false);
          } else {
            setHandle(false);
            setHandleWarning(true);
          }
        })
        .catch((error) => {
          console.log("Error while checking handle", error);
        });
    }
  };

  const formSubmitHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      organizationName: { value: string };
      website: { value: string };
      contactEmail: { value: string };
      twitter: { value: string };
      discord: { value: string };
      handle: { value: string };
    };

    const provider: any = window.ethereum;
    const web3: any = new Web3(provider);
    const userAccount = await web3.eth.getAccounts();
    const address = userAccount[0];
    setIsWebsiteWarning(urlRegex.test(target?.website?.value));
    setIsTwitterWarning(urlRegex.test(target?.twitter?.value));
    setIsDiscordWarning(urlRegex.test(target?.discord?.value));
    if (
      description &&
      handle &&
      urlRegex.test(target?.discord?.value) &&
      urlRegex.test(target?.twitter?.value) &&
      urlRegex.test(target?.website?.value)
    ) {
   
      if (uploadFile) {
        setIsLoading(true);
        ipfsClient(uploadFile).then(async (path) => {
          if (path !== undefined) {
            const params = {
              organizationName: target.organizationName.value,
              website: target.website.value,
              contact: target.contactEmail.value,
              social: {
                twitter: target.twitter.value,
                discord: target.discord.value,
              },
              desc: description,
              profilePictureUrl: path,
              handle: target.handle.value,
              address: address,
            };
            customPost(params, addTeam, "POST", setTeamResult, "adding team");
          } else {
            setToast(true);
            setToastMessage("Something went wrong. Please try again!");
            setIsLoading(false);
            setTimeout(() => {
              setToast(false);
              setToastMessage("");
            }, 3000);
          }
        });
      } else {
        setIsLoading(true);
        const params = {
          organizationName: target.organizationName.value,
          website: target.website.value,
          contact: target.contactEmail.value,
          social: {
            twitter: target.twitter.value,
            discord: target.discord.value,
          },
          desc: description,
          profilePictureUrl: defaultUserProfile,
          handle: target.handle.value,
          address: address,
        };
        customPost(params, addTeam, "POST", setTeamResult, "adding team");
      }
    } else {
      setIsLoading(false);
      setToast(true);
      setToastMessage("All fields are required");
      setTimeout(() => {
        setToastMessage("");
        setToast(false);
      }, 2000);
    }
  };

  const goback = () => {
    navigate(-1);
  };

  const mediaUpload = () => {
    let input: HTMLInputElement = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      if (input.files !== null) {
        let files = Array.from(input.files);

        setUploadedImage(URL.createObjectURL(files[0]));
        setCropStatus(true);
      }
    };
    input.click();
  };

  const cropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedPixel(croppedAreaPixels);
  };

  const getcroppedImage = useCallback(async () => {
    try {
      const { file, url }: any = await getCroppedImage(uploadedImage, croppedPixel);

      setUserImage(url);
      setUploadFile(file);

      setCropStatus(false);
    } catch (e) {
      console.log(e);
    }
  }, [croppedPixel]);

 
  return (
    <>
      <div className="relative w-full h-screen">
        {toast && <Warning message={toastMessage}></Warning>}

        {cropStatus && (
          <Crop
            uploadedImage={uploadedImage}
            crop={crop}
            zoom={zoom}
            setCrop={setCrop}
            cropComplete={cropComplete}
            setZoom={setZoom}
            setCropStatus={setCropStatus}
            setUserImage={setUserImage}
            setUploadFile={setUploadFile}
            getcroppedImage={getcroppedImage}
            defaultProfile={defaultProfile}
          />
        )}

        <Navbar />
        <div className="p-5 md:gap-16 gap-4 absolute w-full h-full flex items-center justify-center">
          {isLoading && (
            <div className="flex items-center bg-black h-screen absolute">
              <Loading />
            </div>
          )}
          <div className=" relative mt-16 sm:w-90 md:w-70 h-5/6 border rounded-lg">
            {/*Team */}

            <div className="flex flex-col bg-white border rounded-lg">
              <div>
                <h1 className="text-center text-xl font-bold p-3 border-b">Team Details</h1>
                <form className="text-sm w-100  overflow-y-auto member-form" name="member" onSubmit={formSubmitHandler}>
                  <div className="flex-col w-full flex flex-col md:flex-row sm:flex-col xs:flex-col gap-3">
                    <div className="sm:w-100 md:w-90 ">
                      <div className="flex flex-col mt-3 mx-1 ">
                        {/* OrganizationName */}
                        <div className="flex w-full px-3  md:mb-0 sm:mt-3 items-center gap-3">
                          <label className="w-60 md:w-30  block tracking-wide text-gray-700 font-bold mb-2">Org Name:*</label>
                          <input
                            required
                            className="w-full md:w-full  appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="organization-name"
                            type="text"
                            name="organizationName"
                            placeholder="Organization Name"
                          ></input>
                        </div>

                        {/* handle */}
                        {handleWarning && <div className=" text-red-700 flex justify-end px-5 py-1">*handle already taken</div>}

                        <div className="text-sm flex w-full w-1/2 px-4  md:mb-0 items-center gap-3 ">
                          <label className="w-60 md:w-30 block tracking-wide text-gray-700 text-md font-bold mb-2">
                            Handle:*
                          </label>
                          <input
                            required
                            className="w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="handle"
                            name="handle"
                            placeholder="Handle"
                            onChange={checkHandle}
                          ></input>
                        </div>

                        {/* Website */}

                        {!isWebsiteWarning && <div className=" text-red-700 flex justify-end px-5 py-1">*Enter a valid URL</div>}
                        <div className="text-sm flex w-full w-1/2 px-3  md:mb-0 items-center gap-3 ">
                          <label className="w-60 md:w-30  block tracking-wide text-gray-700 text-md font-bold mb-2">
                            Website:*
                          </label>
                          <input
                            required
                            className="w-full  md:w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="website"
                            name="website"
                            type="text"
                            placeholder="Website"
                          ></input>
                        </div>
                      </div>
                      {/* Contact Email */}
                      <div className="text-sm flex w-full w-1/2 px-4  md:mb-0 items-center gap-3 ">
                        <label className="w-60 md:w-30 block tracking-wide text-gray-700 text-md font-bold mb-2">Email:*</label>
                        <input
                          required
                          className="w-full sm:w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          id="contact-email"
                          name="contactEmail"
                          type="email"
                          placeholder="Contact Email"
                        ></input>
                      </div>
                      {/* Twitter */}
                      {!isTwitterWarning && <div className=" text-red-700 flex justify-end px-5 py-1">*Enter a valid URL</div>}

                      <div className="text-sm flex w-full w-1/2 px-4  md:mb-0 items-center gap-3 ">
                        <label className="w-60 md:w-30 block tracking-wide text-gray-700 text-md font-bold mb-2">Twitter:*</label>
                        <input
                          required
                          className="w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          id="twitter"
                          name="twitter"
                          type="text"
                          placeholder="Twitter"
                        ></input>
                      </div>

                      {/* Discord */}
                      {!isDiscordWarning && <div className=" text-red-700 flex justify-end px-5 py-1">*Enter a valid URL</div>}
                      <div className="text-sm flex w-full w-1/2 px-4  md:mb-0 items-center gap-3 ">
                        <label className="w-60 md:w-30 block tracking-wide text-gray-700 text-md font-bold mb-2">Discord:*</label>
                        <input
                          required
                          className="w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          id="discord"
                          name="discord"
                          type="text"
                          placeholder="Discord"
                        ></input>
                      </div>
                    </div>
                    <div className="gap-2 flex flex-col items-center text-center sm:w-50 md:mt-2">
                      <div className="items-center text-center flex md:justify-center sm:justify-start">
                        <div className="relative cursor-pointer" style={{ width: "140px", height: "140px" }}>
                          <img
                            className="border rounded-full"
                            alt="user"
                            height="140px"
                            width="140px"
                            src={userImage}
                            loading="lazy"
                          ></img>
                          {userImage !== defaultProfile && (
                            <div
                              className=" absolute top-0 right-0 cursor-pointer"
                              style={{ right: "-10px" }}
                              onClick={() => {
                                setCropStatus(false);
                                setUserImage(defaultProfile);
                                setUploadFile(null);
                              }}
                            >
                              <GrFormClose fontSize={28} className="hover:bg-bgHoverActive bg-bgHover rounded-full" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex md:justify-center sm:justify-start text-center items-center ">
                        <button
                          type="button"
                          className="bg-violet-700 hover:bg-violet-900 text-white px-4 p-2  border rounded-lg"
                          onClick={mediaUpload}
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex  mx-1 mt-3  ">
                    <div className="w-full md:w-full px-3  md:mb-0">
                      <label className="text-md font-bold block tracking-wide text-gray-700 font-bold mb-2">Description:*</label>
                      <textarea
                        required
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        id="desacription"
                        name="description"
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        placeholder="Write your thoughts here..."
                      ></textarea>
                    </div>
                  </div>

                  {/* actions  */}
                  <div className="flex md:justify-end justify-end gap-4 px-5 text-white py-3">
                    <button
                      type="button"
                      className="sm:w-30 md:w-20 border rounded-lg px-3 py-2 bg-violet-700 hover:bg-violet-900"
                      onClick={goback}
                    >
                      Go Back
                    </button>
                    <button
                      type="submit"
                      className="sm:w-30 md:w-20 form-control border rounded-lg px-3 px-2 bg-violet-700 hover:bg-violet-900"
                    >
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PoweredBy />

      <style>
        {`


    .member-form {
        height: calc(100vh - 30vh);

    }`}
      </style>
    </>
  );
};

export default Team;
