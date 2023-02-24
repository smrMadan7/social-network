import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";

import { create } from "ipfs-http-client";
import Cropper, { Area } from "react-easy-crop";
import { GrFormAdd, GrFormClose } from "react-icons/gr";
import { useNavigate } from "react-router";
import { useUserContext } from "../../context/UserContextProvider";
import getCroppedImage from "../../utils/crop";
import Loading from "../Loading/Loading";
import Navbar from "../Navbar/Navbar";
import defaultProfile from "./.././../assets/Form/default-user.png";
import PoweredBy from "../PoweredBy/PoweredBy";
import { ipfsPostUrl } from "../../constants/AppConstants";
import Warning from "../Cards/Warning";

const Team = () => {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userImage, setUserImage] = useState(defaultProfile);
  const [uploadImage, setUploadImage] = useState();
  const [toast, setToast] = useState(false);

  const [cropStatus, setCropStatus] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedPixel, setCroppedPixel] = useState<Area>();
  const [zoom, setZoom] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string>();
  const { appState, appStatedispatch }: any = useUserContext();
  const [warning, setWarning] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(false);
    setDescription("");
    setUserImage(defaultProfile);
    setToast(false);
    setCropStatus(false);
  }, []);
  const ipfs = create({ url: ipfsPostUrl });

  const ipfsClient = async (croppedImg: any) => {
    try {
      const file = await ipfs.add(croppedImg);
      return file.path;
    } catch (error) {
      return;
    }
  };

  const formSubmitHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (uploadedImage) {
      setToast(false);

      const path = ipfsClient(uploadImage).then((path) => {
        if (path !== undefined) {
          const target = event.target as typeof event.target & {
            organizationName: { value: string };
            website: { value: string };
            contactEmail: { value: string };
            twitter: { value: string };
            discord: { value: string };
          };
          const user = {
            organizationName: target.organizationName.value,
            website: target.website.value,
            email: target.contactEmail.value,
            social: {
              twitter: target.twitter.value,
              discord: target.twitter.value,
            },
            description: description,
            profilePath: path,
          };

          localStorage.setItem("registered", JSON.stringify(user));
          console.log("user is ", user);
          appStatedispatch({
            user,
          });

          setTimeout(() => {
            navigate("/home");
          }, 5000);
        } else {
          setWarning(true);
          setIsLoading(false);
          setTimeout(() => {
            setWarning(false);
          }, 3000);
        }
      });
    } else {
      setToast(true);
      setIsLoading(false);
      setTimeout(() => {
        setToast(false);
      }, 3000);
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

  const getGroppedImage = useCallback(async () => {
    try {
      const { file, url }: any = await getCroppedImage(uploadedImage, croppedPixel);

      setUserImage(url);
      setUploadImage(file);

      setCropStatus(false);
    } catch (e) {
      console.log(e);
    }
  }, [croppedPixel]);

  return (
    <>
      <div className="relative w-full h-screen">
        {warning && <Warning message="Something went wrong. Please try again?"></Warning>}
        {toast && <Warning message="Upload Profile "></Warning>}

        {cropStatus ? (
          <div className="absolute z-10 flex flex-col items-center top-0 right-0 left-0 bottom-0 w-50 h-full m-auto justify-center sm:w-full">
            <div className=" relative w-50 sm:w-100" style={{ height: "50vh" }}>
              <div>
                <Cropper
                  image={uploadedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={5 / 5}
                  cropShape="round"
                  showGrid={false}
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
                <form
                  className="text-sm w-100  overflow-y-auto member-form"
                  name="member"
                  onSubmit={formSubmitHandler}
                >
                  <div className=" w-full flex flex-col md:flex-row sm:flex-col xs:flex-col gap-3">
                    <div className="sm:w-100 md:w-90 ">
                      <div className="flex flex-col mt-3 mx-1 ">
                        {/* OrganizationName */}
                        <div className="flex w-full px-3  md:mb-0 sm:mt-3 items-center gap-3">
                          <label className="md:w-30 sm:w-40 block tracking-wide text-gray-700 font-bold mb-2">
                            Org Name:
                          </label>
                          <input
                            required
                            className=" md:w-full sm:w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="organization-name"
                            type="text"
                            name="organizationName"
                            placeholder="Organization Name"
                          ></input>
                        </div>

                        {/* Website */}

                        <div className="text-sm flex w-full w-1/2 px-3  md:mb-0 items-center gap-3 ">
                          <label className=" md:w-30 sm:w-40 block tracking-wide text-gray-700 text-md font-bold mb-2">
                            Website:
                          </label>
                          <input
                            required
                            className="md:w-full sm:w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="website"
                            name="website"
                            type="url"
                            placeholder="website"
                          ></input>
                        </div>
                      </div>
                      {/* Contact Email */}
                      <div className="text-sm flex w-full w-1/2 px-4  md:mb-0 items-center gap-3 ">
                        <label className=" md:w-30 sm:w-40 block tracking-wide text-gray-700 text-md font-bold mb-2">
                          Contact Email:
                        </label>
                        <input
                          required
                          className="md:w-full sm:w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          id="contact-email"
                          name="contactEmail"
                          type="email"
                          placeholder="Contact Email"
                        ></input>
                      </div>
                      {/* Twitter */}
                      <div className="text-sm flex w-full w-1/2 px-4  md:mb-0 items-center gap-3 ">
                        <label className=" md:w-30 sm:w-40 block tracking-wide text-gray-700 text-md font-bold mb-2">
                          Twitter
                        </label>
                        <input
                          className="md:w-full sm:w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          id="twitter"
                          name="twitter"
                          type="url"
                          placeholder="Twitter"
                        ></input>
                      </div>
                      {/* Discord */}
                      <div className="text-sm flex w-full w-1/2 px-4  md:mb-0 items-center gap-3 ">
                        <label className=" md:w-30 sm:w-40 block tracking-wide text-gray-700 text-md font-bold mb-2">
                          Discord
                        </label>
                        <input
                          className="md:w-full sm:w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          id="discord"
                          name="discord"
                          type="url"
                          placeholder="Discord"
                        ></input>
                      </div>{" "}
                    </div>
                    <div className="gap-2 flex flex-col items-center text-center sm:w-50 md:mt-2">
                      <div className="items-center text-center flex md:justify-center sm:justify-start">
                        <div
                          className=" cursor-pointer"
                          style={{ width: "140px", height: "140px" }}
                        >
                          <img
                            className="border rounded-full"
                            height="140px"
                            width="140px"
                            src={userImage}
                          ></img>
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
                      <label className="text-md font-bold block tracking-wide text-gray-700 font-bold mb-2">
                        Description:
                      </label>
                      <textarea
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
                  <div className="flex md:justify-end sm:justify-center gap-4 px-5 text-white py-3">
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