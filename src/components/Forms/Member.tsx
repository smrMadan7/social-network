import React, { useCallback, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";

import { MetaMaskInpageProvider } from "@metamask/providers";
import { create } from "ipfs-http-client";
import Cropper, { Area } from "react-easy-crop";
import { GrFormAdd } from "react-icons/gr";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";
import Web3 from "web3";
import { addMember, handleCheck, ipfsPostUrl } from "../../constants/AppConstants";
import { useUserContext } from "../../context/UserContextProvider";
import getCroppedImage from "../../utils/crop";
import Warning from "../Cards/Warning";
import Loading from "../Loading/Loading";
import Navbar from "../Navbar/Navbar";
import PoweredBy from "../PoweredBy/PoweredBy";
import defaultProfile from "./.././../assets/Form/default-user.png";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    web3?: any;
  }
}

const Member = () => {
  const [formStatus, setFormStatus] = useState("");
  const [inputData, setInputData] = useState("");
  const [bio, setBio] = useState("");
  const [inputPlaceholder, setInputPlaceholder] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userImage, setUserImage] = useState<any>(defaultProfile);
  const [uplodFile, setUploadFile] = useState<any>();

  const [selectedOrganization, setSelectedOrganization] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [cropStatus, setCropStatus] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedPixel, setCroppedPixel] = useState<Area>();
  const [zoom, setZoom] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string>();
  const { appState, appStatedispatch }: any = useUserContext();
  const [toast, setToast] = useState(false);
  const [warning, setWarning] = useState(false);
  const [handle, setHandle] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setFormStatus("");
    setInputData("");
    setIsLoading(false);
    setBio("");
    setUserImage(defaultProfile);
    setCropStatus(false);
    setToast(false);
    setWarning(false);
    setHandle(false);
  }, []);

  const inputFormSubmitHandler = (event: React.SyntheticEvent) => {
    setFormStatus("");
    if (formStatus === "role" && inputData) {
      const list = selectedRoles;
      if (!list.includes(inputData)) {
        list.push(inputData);
      }
      setSelectedRoles(list);
      setInputData("");
      setFormStatus("");
    } else if (formStatus === "organization" && inputData) {
      const list = selectedOrganization;
      if (!list.includes(inputData)) {
        list.push(inputData);
      }
      setSelectedOrganization(list);
      setInputData("");
      setFormStatus("");
    } else if (formStatus === "skill" && inputData) {
      const list = selectedSkills;
      if (!list.includes(inputData)) {
        list.push(inputData);
      }
      setSelectedSkills(list);
      setInputData("");
      setFormStatus("");
    }
    event.preventDefault();
  };

  const cancelEnteredValue = (event: React.SyntheticEvent, value: string, field: string) => {
    if (field === "role") {
      const roleList: string[] = [];
      selectedRoles.map((role: string) => {
        if (role !== value) {
          roleList.push(role);
        }
      });

      setSelectedRoles(roleList);
    } else if (field === "organization") {
      const organizationList: string[] = [];
      selectedOrganization.map((organization: string) => {
        if (organization !== value) {
          organizationList.push(organization);
        }
      });
      setSelectedOrganization(organizationList);
    } else if (field === "skill") {
      const skillList: string[] = [];
      selectedSkills.map((skill: string) => {
        if (skill !== value) {
          skillList.push(skill);
        }
      });
      setSelectedSkills(skillList);
    }
  };

  const ipfs = create({ url: ipfsPostUrl });

  const ipfsClient = async (croppedImg: any) => {
    try {
      const file = await ipfs.add(croppedImg);
      return file.path;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const checkHandle = (event: any) => {
    if (event.target.value.length > 3) {
      var requestOptions: any = {
        method: "GET",
        redirect: "follow",
      };

      fetch(`${handleCheck}${event.target.value}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status === true) {
            setHandle(false);
          } else {
            setHandle(true);
          }
        });
    }
  };
  const formSubmitHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (uploadedImage) {
      setIsLoading(true);
      ipfsClient(uplodFile).then(async (path) => {
        if (path !== undefined && handle === false) {
          const target = event.target as typeof event.target & {
            firstName: { value: string };
            lastName: { value: string };
            displayName: { value: string };
            open: { value: string };
            handle: { value: string };
          };

          const provider: any = window.ethereum;
          const web3: any = new Web3(provider);

          const userAccount = await web3.eth.getAccounts();
          const address = userAccount[0];

          const user = {
            firstName: target.firstName.value,
            lastName: target.lastName.value,
            handle: target.handle.value,
            displayName: target.displayName.value,
            bio: bio,
            role: selectedRoles,
            organization: selectedOrganization,
            skill: selectedSkills,
            openForWork: target.open.value,
            address: address,
            profilePictureUrl: path,
          };

          var requestOptions: any = {
            method: "POST",
            mode: "cors",
            redirect: "follow",
          };
          setIsLoading(true);

          var raw = JSON.stringify(user);
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          var requestOptions: any = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };

          fetch(addMember, requestOptions)
            .then((response) => response.json())
            .then((result) => {
              if (result.status !== false) {
                localStorage.setItem("registered", "true");
                const user = result.data;
                appStatedispatch({
                  user,
                });
                setTimeout(() => {
                  navigate("/home");
                }, 1000);
              }
            });
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
      setUploadFile(file);

      setCropStatus(false);
    } catch (e) {
      console.log(e);
    }
  }, [croppedPixel]);

  return (
    <>
      <div className="relative w-full h-screen">
        {warning && <Warning message="Something went wrong. Please try again!"></Warning>}
        {toast && <Warning message="Upload Profile "></Warning>}
        {cropStatus ? (
          <div className="absolute z-10 flex flex-col items-center top-0 right-0 left-0 bottom-0  h-full m-auto justify-center sm:w-full">
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
            {/* Member */}

            {formStatus !== "" && (
              <div className="absolute flex items-center top-0 right-0 left-0 bottom-0 w-50 h-full m-auto justify-center">
                <div className="relative z-10 border p-9 bg-white flex flex-col gap-4 w-70 rounded-lg items-center">
                  <form name="inputForm" onSubmit={inputFormSubmitHandler}>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white"
                      id="role"
                      type="text"
                      name="role"
                      placeholder={inputPlaceholder}
                      onChange={(event) => setInputData(event.target.value)}
                    ></input>
                    <div className="flex w-full items-center justify-center text-white">
                      <button
                        type="submit"
                        className="rounded-lg bg-violet-700 mt-4 items-center w-50 p-2"
                      >
                        Add
                      </button>
                    </div>
                  </form>

                  <div
                    className="top-0 right-0 text-2xl absolute p-2 cursor-pointer "
                    onClick={() => {
                      setFormStatus("");
                    }}
                  >
                    <IoIosClose />
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col bg-white border rounded-lg">
              <div>
                <h1 className="text-center text-xl font-bold p-3 border-b">Member Details</h1>
                <form
                  className="text-sm w-100  overflow-y-auto member-form"
                  name="member"
                  onSubmit={formSubmitHandler}
                >
                  <div className="flex-col w-full flex flex-col md:flex-row sm:flex-col xs:flex-col gap-3">
                    <div className="sm:w-100 md:w-90 ">
                      <div className="flex flex-col mt-3 mx-1 ">
                        {/* First Name */}
                        <div className="flex  w-full px-3  md:mb-0 sm:mt-3 items-center gap-3">
                          <label className="w-50 sm:w-40 md:w-50  block tracking-wide text-gray-700 font-bold mb-2">
                            First Name:
                          </label>
                          <input
                            required
                            className="w-60 md:w-full  bg-black appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="first-name"
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                          ></input>
                        </div>

                        {/* Last Name */}

                        <div className="text-sm flex w-full w-1/2 px-3  md:mb-0 items-center gap-3 ">
                          <label className="w-50 md:w-50 sm:w-40 block tracking-wide text-gray-700 text-md font-bold mb-2">
                            Last Name:
                          </label>
                          <input
                            required
                            className="w-60 md:w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="last-name"
                            name="lastName"
                            type="text"
                            placeholder="Last Name"
                          ></input>
                        </div>
                      </div>

                      {/* Display Name */}
                      <div className="text-sm flex w-full w-1/2 px-4  md:mb-0 items-center gap-3 ">
                        <label className="w-50 md:w-50 sm:w-40 block tracking-wide text-gray-700 text-md font-bold mb-2">
                          Display Name:
                        </label>
                        <input
                          required
                          className="w-60 md:w-full  appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          id="display-name"
                          name="displayName"
                          type="text"
                          placeholder="Display Name"
                        ></input>
                      </div>

                      {/* Handle  */}
                      {handle && (
                        <div className=" text-red-700 flex justify-end px-5 py-1">
                          *handle already taken
                        </div>
                      )}

                      <div className="text-sm flex w-full w-1/2 px-4  md:mb-0 items-center gap-3 ">
                        <label className="w-50 md:w-50 sm:w-40 block tracking-wide text-gray-700 text-md font-bold mb-2">
                          Handle:
                        </label>
                        <input
                          required
                          className="w-60 md:w-full  appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          id="handle"
                          name="handle"
                          type="text"
                          placeholder="Handle"
                          min={3}
                          onChange={checkHandle}
                        ></input>
                      </div>

                      {/* open to work */}

                      <div className="text-sm flex  px-4  md:mb-0 items-center gap-2">
                        <label className="w-50 md:w-50 sm:w-40 block tracking-wide text-gray-700 text-md font-bold ">
                          Open To Work:
                        </label>
                        <div className="w-60 sm:w-75 md:w-full relative cursor-pointer ">
                          <select
                            id="isWork"
                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                            name="open"
                          >
                            <option>No</option>
                            <option>Yes</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 px-5">
                            <svg
                              className="fill-current h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
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

                  {/* Bio */}
                  <div className="flex  mx-1 mt-3  ">
                    <div className="w-full md:w-full px-3  md:mb-0">
                      <label className="text-md font-bold block tracking-wide text-gray-700 font-bold mb-2">
                        Bio:
                      </label>
                      <textarea
                        onChange={(e) => setBio(e.target.value)}
                        value={bio}
                        id="message"
                        form="member"
                        name="bio"
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        placeholder="Write your thoughts here..."
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex mb-3 sm:flex-col md:flex-row sm:gap-2 justify-between">
                    {/* Role Selection */}
                    <div className="md:w-50 flex mx-1 justify-between">
                      <div className="md:flex md:items-center md:gap-4 w-full md:w-full  px-3  md:mb-0">
                        <label className="text-md font-bold block tracking-wide text-gray-700 sm:mb-2">
                          Role:
                        </label>
                        <div
                          className="bg-gray-200 focus:bg-white flex justify-between py-2 px-4  border rounded-lg cursor-pointer md:w-full"
                          onClick={() => {
                            setFormStatus("role");
                            setInputPlaceholder(`Enter your role`);
                          }}
                        >
                          <div className="text-gray-700 flex gap-2 ">
                            {selectedRoles?.length === 0 ? (
                              <>
                                <p className="sm:d-block text-gray-400">Add Your Role</p>
                              </>
                            ) : (
                              <>
                                <p className="flex gap-3 flex-wrap">
                                  {selectedRoles?.map((role: string, index: number) => {
                                    return (
                                      <>
                                        <div
                                          key={uuidv4() + index}
                                          className="border flex items-center gap-4 justify-between border-black rounded-full py-1 px-2  "
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {role}
                                          <IoIosClose
                                            fontSize={20}
                                            color="black"
                                            className="mt-1 cursor-pointer hover:bg-gray-700 rounded-full"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              cancelEnteredValue(e, role, "role");
                                            }}
                                          />
                                        </div>
                                      </>
                                    );
                                  })}
                                </p>
                              </>
                            )}
                          </div>
                          <div
                            className="font-bold text-xl cursor-pointer"
                            onClick={() => {
                              setFormStatus("role");
                              setInputPlaceholder(`Enter your role`);
                            }}
                          >
                            <GrFormAdd
                              fontSize={20}
                              className="border rounded-full hover:bg-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Organization */}
                    <div className=" md:w-50 flex mx-1 justify-between ">
                      <div className="md:flex md:items-center md:gap-4 w-full md:w-full px-3  md:mb-0">
                        <label className="text-md font-bold block  tracking-wide text-gray-700 sm:mb-2">
                          Organization:
                        </label>
                        <div
                          className="w-full bg-gray-200 focus:bg-white flex justify-between py-2 px-4  border rounded-lg cursor-pointer"
                          onClick={() => {
                            setInputPlaceholder("Enter your organization");
                            setFormStatus("organization");
                          }}
                        >
                          <div className="text-gray-700 flex gap-2 role-container">
                            {selectedOrganization?.length === 0 ? (
                              <>
                                <p className="text-gray-400">Add Organization</p>
                              </>
                            ) : (
                              <>
                                <p className="flex gap-3 flex-wrap">
                                  {selectedOrganization?.map(
                                    (organization: string, index: number) => {
                                      return (
                                        <>
                                          <div
                                            key={uuidv4()}
                                            className="border flex items-center gap-4 justify-between border-black rounded-full py-1 px-2 "
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            {organization}
                                            <IoIosClose
                                              fontSize={20}
                                              color="black"
                                              className="mt-1 cursor-pointer hover:bg-gray-700 rounded-full"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                cancelEnteredValue(e, organization, "organization");
                                              }}
                                            />
                                          </div>
                                        </>
                                      );
                                    }
                                  )}
                                </p>
                              </>
                            )}
                          </div>
                          <div
                            className="font-bold text-xl cursor-pointer"
                            onClick={() => {
                              setFormStatus("organization");

                              setInputPlaceholder("Enter your organization");
                            }}
                          >
                            <GrFormAdd
                              fontSize={20}
                              className="border rounded-full hover:bg-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}

                  <div className="md:w-50 flex mx-1 justify-between">
                    <div className="md:flex md:items-center md:gap-4 w-full md:w-full px-3  md:mb-0">
                      <label className="text-md font-bold block tracking-wide text-gray-700">
                        Skill:
                      </label>
                      <div
                        className="w-full bg-gray-200 focus:bg-white flex justify-between py-2 px-4  border rounded-lg cursor-pointer"
                        onClick={() => {
                          setFormStatus("skill");
                          setInputPlaceholder("Enter your skill");
                        }}
                      >
                        <div className="text-gray-700 flex gap-2 role-container">
                          {selectedSkills?.length === 0 ? (
                            <>
                              <p className="text-gray-400">Add Your Skills</p>
                            </>
                          ) : (
                            <>
                              <p className="flex gap-3 flex-wrap">
                                {selectedSkills?.map((skill: string, index: number) => {
                                  return (
                                    <>
                                      <div
                                        key={uuidv4()}
                                        className="border flex items-center gap-4 justify-between border-black rounded-full py-1 px-2 "
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {skill}
                                        <IoIosClose
                                          fontSize={20}
                                          color="black"
                                          className="mt-1 cursor-pointer hover:bg-gray-700 rounded-full"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            cancelEnteredValue(e, skill, "skill");
                                          }}
                                        />
                                      </div>
                                    </>
                                  );
                                })}
                              </p>
                            </>
                          )}
                        </div>
                        <div
                          className="font-bold text-xl cursor-pointer"
                          onClick={() => {
                            setInputPlaceholder("Enter your skill");
                            setFormStatus("skill");
                          }}
                        >
                          <GrFormAdd
                            fontSize={20}
                            className="border rounded-full hover:bg-gray-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* actions  */}
                  <div className="flex justify-end py-4 md:py-1 gap-4 px-5 text-white  ">
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

export default Member;
