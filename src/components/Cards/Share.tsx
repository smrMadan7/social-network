import React, { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import { GrFormClose } from "react-icons/gr";
import { getAllProfiles, ipfsGateway, sharePosts } from "../../constants/AppConstants";
import { RiSendPlaneFill } from "react-icons/ri";
import PostProfile from "./PostProfile";

const Share = ({ address, postId, setShareTo, callback }: any) => {
  const [allProfiles, setAllProfiles] = useState<any>();
  const [selectedProfiles, setSelectedProfiles] = useState<any>([]);
  const [isSuccessfull, setIsSuccessfull] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [postProfileStatus, setPostProfileStatus] = useState(false);
  const [profileAddress, setProfileAddress] = useState();

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  useEffect(() => {
    getProfiles();
    setIsSuccessfull(false);
    setIsLoading(false);
  }, []);

  const getProfiles = async () => {
    fetch(`${getAllProfiles}`, {})
      .then((response) => response.json())
      .then((result) => {
        if (result.status !== false) {
          setAllProfiles(result.data);
        }
      })
      .catch((error) => {
        console.log("Erro while getting comments ", error);
      });
  };

  const share = () => {
    setIsLoading(true);
    const sharedObj = {
      postId: postId,
      sharedBy: address,
      address: selectedProfiles,
    };
    var requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(sharedObj),
      redirect: "follow",
    };
    fetch(`${sharePosts}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        callback(selectedProfiles.length);
        setIsLoading(false);
        setIsSuccessfull(true);
        setTimeout(() => {
          setIsSuccessfull(false);
          setSelectedProfiles([]);
          // setShareTo(false);
        }, 1000);
        if (result.status !== false) {
        }
      })
      .catch((error) => {
        console.log("Erro while getting comments ", error);
      });
  };

  return (
    <>
      {postProfileStatus && (
        <div className="w-100 fixed z-10  top-0 bottom-0 right-0 left-0 items-center m-auto h-screen bg-blackOverlay">
          <div className="text-white flex items-center justify-center flex m-auto h-screen">
            <div className=" w-90 2xl:w-40 md:w-40  border rounded-lg text-black bg-white duration-75">
              <div className="flex justify-between p-3 border-b ">
                <p className="text-xl font-bold">Profile Details</p>
                <div
                  className="px-1 py-1 rounded-full cursor-pointer hover:bg-gray-300"
                  onClick={() => {
                    setPostProfileStatus(false);
                    getProfiles();
                  }}
                >
                  <GrFormClose color="black" fontSize={25} />
                </div>
              </div>
              <PostProfile post={profileAddress} />
            </div>
          </div>
        </div>
      )}
      {isLoading && <Loading />}
      {isSuccessfull && (
        <div
          className="absolute text-center  top-0 right-0 left-0 bottom-0 "
          style={{ zIndex: 100, height: "30px" }}
        >
          <p className="text-violet-700 font-semibold text-xl pt-3">Success!</p>
        </div>
      )}
      <div className="w-full px-2 py-1">
        {/* <div className="w-full border rounded-lg ">
          <input
            placeholder="Search here!"
            className="outline-none border rounded-lg w-full p-1"
            onChange={filterUser}
          />
        </div> */}

        <div className="overflow-y-auto mt-3 border-b" style={{ height: "250px" }}>
          {allProfiles ? (
            <>
              {allProfiles?.map((profile: any, index: number) => {
                const imageUrl = `${ipfsGateway}${profile?.profilePictureUrl}`;
                if (profile.address != address) {
                  return (
                    <div
                      key={index}
                      className="flex justify-between p-3 text-sm gap-3 items-center"
                    >
                      <div className="flex  gap-2 items-center">
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setProfileAddress(profile.address);
                            setPostProfileStatus(true);
                          }}
                        >
                          <img
                            src={imageUrl}
                            height="60px"
                            width="60px"
                            className="border rounded-full"
                          ></img>
                        </div>
                        <div
                          className="flex flex-col"
                          onClick={() => {
                            setProfileAddress(profile.address);
                            setPostProfileStatus(true);
                          }}
                        >
                          <div className="font-semibold">
                            @{profile?.displayName} {profile?.organizationName}
                          </div>
                          <div className="handle font-bold">@{profile.handle}</div>

                          <div>
                            <span className="handle font-bold" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <div>
                          {selectedProfiles?.includes(profile.address) ? (
                            <button
                              className="p-1 rounded-full text-black bg-bgHover hover:bg-bgActive"
                              onClick={(e) => {
                                e.stopPropagation();
                                let profiles: any = [...selectedProfiles];
                                var removablIndex = profiles.indexOf(profile.address);
                                profiles.splice(removablIndex, 1);
                                setSelectedProfiles(profiles);
                              }}
                            >
                              <GrFormClose fontSize={23} />
                            </button>
                          ) : (
                            <button
                              className="p-1 rounded-full text-black bg-bgHover hover:bg-bgActive"
                              onClick={(e) => {
                                e.stopPropagation();
                                let profiles: any = [...selectedProfiles];
                                profiles.push(profile.address);
                                setSelectedProfiles(profiles);
                              }}
                            >
                              <RiSendPlaneFill fontSize={23} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </>
          ) : (
            <>
              <div className="absolute w-full flex items-center justify-center m-auto">
                {!allProfiles ? (
                  <div className="absolute top-0 ">No Profiles Found!</div>
                ) : (
                  <Loading />
                )}
              </div>
            </>
          )}
        </div>
        <div className="flex justify-between items-center px-2 py-2">
          <div>
            <p>{selectedProfiles?.length} - profiles selected</p>
          </div>
          <div>
            <button
              className="border px-2 p-1 flex items-center justify-center rounded-lg bg-bgHover hover:bg-bgActive"
              onClick={share}
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Share;
