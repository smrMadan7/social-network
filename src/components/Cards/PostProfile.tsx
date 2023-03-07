import { useEffect, useState } from "react";
import { AiFillTwitterCircle } from "react-icons/ai";
import { BsDiscord } from "react-icons/bs";
import { TbWorld } from "react-icons/tb";
import { getUser, roles, ipfsGateway } from "../../constants/AppConstants";
import Loading from "../Loading/Loading";

const PostProfile = ({ postDetails, post }: any) => {
  const [details, setDetails] = useState<any>();
  const [isMember, setIsMember] = useState(false);
  const [isTeam, setIsTeam] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    setIsLoading(false);
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setIsLoading(true);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions: any = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${getUser}${post?.post?.createdBy}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setIsLoading(false);
        if (result.status === true) {
          setDetails(result.data);
          setProfileUrl(`${ipfsGateway}${result?.data?.profilePictureUrl}`);
          if (result?.data?.type === roles[0]) {
            setIsMember(true);
          } else if (result?.data?.type === roles[1]) {
            setIsTeam(true);
          }
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("Error while fetching user", error);
      });
  };

  return (
    <>
      {isMember && (
        <div className="w-full flex flex-col text-black font-2xl">
          <div className="w-full text-black flex flex-col md:flex-row justify-between px-5 mt-5">
            <div className="w-20">
              <img
                height="100px"
                width="100px"
                className="rounded-full border"
                src={profileUrl}
              ></img>
            </div>
            <div className="w-80">
              {/* display Name */}
              <div className="flex  w-full items-center gap-3 ">
                <label className=" w-45 block tracking-wide text-gray-700 font-bold ">
                  Display Name (handle):
                </label>
                <div className="w-50 bg-black appearance-none block  bg-gray-200 text-gray-700 border  rounded px-4 leading-tight focus:outline-none focus:bg-white py-2">
                  {`${details?.firstName}`}
                  <span className="handle"> @{details?.handle}</span>
                </div>
              </div>
              {/* Role */}
              <div className="flex  w-full items-center gap-3 mt-2">
                <label className="w-45 block tracking-wide text-gray-700 font-bold ">Role:</label>
                <div className="w-50 flex gap-2 overflow-x-scroll bg-black appearance-none block  bg-gray-200 text-gray-700 border  rounded px-4 leading-tight focus:outline-none focus:bg-white py-2">
                  {details?.role?.map((role: any, index: any) => {
                    return (
                      <div
                        key={index}
                        className="whitespace-nowrap border border-black rounded-lg  px-3 flex "
                      >
                        <p className="mb-1">{role}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Organization */}
              <div className="flex  w-full items-center gap-3 mt-2">
                <label className="w-45 block tracking-wide text-gray-700 font-bold ">
                  Organization:
                </label>
                <div className="w-50 flex gap-2 overflow-x-scroll bg-black appearance-none block  bg-gray-200 text-gray-700 border  rounded px-4 leading-tight focus:outline-none focus:bg-white py-2">
                  {details?.organization?.map((organization: any, index: any) => {
                    return (
                      <div
                        key={index}
                        className="whitespace-nowrap border border-black rounded-lg  px-3 flex"
                      >
                        <p className="mb-1">{organization}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Skills */}
              <div className="flex  w-full items-center gap-3 mt-2">
                <label className="w-45 block tracking-wide text-gray-700 font-bold ">Skill:</label>
                <div className="w-50 flex gap-2 overflow-x-scroll bg-black appearance-none block  bg-gray-200 text-gray-700 border  rounded px-4 leading-tight focus:outline-none focus:bg-white py-2">
                  {details?.skill?.map((skill: any, index: any) => {
                    return (
                      <div
                        key={index}
                        className="whitespace-nowrap border border-black rounded-lg  px-3 flex"
                      >
                        <p className="mb-1">{skill}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* open for work */}
              <div className="flex  w-full items-center gap-3 mt-2">
                <label className="w-45 block tracking-wide text-gray-700 font-bold ">
                  Open for work:
                </label>
                <div className="w-50 flex gap-2 overflow-x-scroll bg-black appearance-none block bg-gray-200 text-gray-700 border  rounded px-4 leading-tight focus:outline-none focus:bg-white py-2">
                  <div className="rounded-lg  px-3 flex">
                    <p className="mb-1">{details?.openForWork}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Bio */}
          <div className="flex  mx-1 w-100 mt-2">
            <div className="w-full md:w-full px-3  md:mb-0">
              <label className="px-1 text-md font-bold block tracking-wide text-gray-700 font-bold mb-2">
                Bio:
              </label>
              <textarea
                value={details?.bio}
                readOnly
                id="bio"
                name="bio"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              ></textarea>
            </div>
          </div>
        </div>
      )}

      {isTeam && (
        <div className="w-full flex flex-col text-black font-2xl">
          <div className="text-black flex flex-col md:flex-row justify-between px-5 mt-5">
            <div className="w-20">
              <div>
                <img
                  height="100px"
                  width="100px"
                  className="rounded-full border"
                  src={profileUrl}
                ></img>
              </div>
            </div>
            <div className="w-80">
              {/* Organization Name */}
              <div className="flex  w-full items-center gap-3 ">
                <label className="w-25 block tracking-wide text-gray-700 font-bold ">
                  Org Name:
                </label>
                <div className="w-75 bg-black appearance-none block  bg-gray-200 text-gray-700 border  rounded px-4 leading-tight focus:outline-none focus:bg-white py-2">
                  {`${details?.organizationName}`}
                  <span className="handle"> @{details?.handle}</span>
                </div>
              </div>

              {/* Social */}

              <div className="flex  w-full items-center gap-3 mt-3">
                <label className="w-25 block tracking-wide text-gray-700 font-bold ">Social:</label>
                <div className="flex gap-3 w-75">
                  <a href={details?.social?.twitter} target="_blank">
                    <AiFillTwitterCircle size={30} color="blue" />
                  </a>
                  <a href={details?.social?.discord} target="_blank">
                    <BsDiscord size={30} color="blue" />
                  </a>
                  <a href={details?.website} target="_blank">
                    <TbWorld size={30} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Description */}
          <div className="flex  mx-1 w-100 mt-2">
            <div className="w-full md:w-full px-3  md:mb-0">
              <label className="px-1 text-md font-bold block tracking-wide text-gray-700 font-bold mb-2">
                Description:
              </label>
              <textarea
                readOnly
                value={details?.bio}
                id="bio"
                name="bio"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              ></textarea>
            </div>
          </div>
        </div>
      )}

      {!isMember && !isTeam && (
        <div className="relative">
          <Loading />
        </div>
      )}

      <style>
        {`
        .handle{
          background: rgb(203,66,252);
          background: linear-gradient(90deg, rgba(203,66,252,1) 22%, rgba(252,91,216,1) 79%);
          -webkit-text-fill-color: transparent;
          -webkit-background-clip: text;
       }
          ::-webkit-scrollbar {
            height:2px;
            width: 4px;
        }

        ::-webkit-scrollbar-track {
            box-shadow: inset 0 0 5px whitesmoke;
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
            background: #c4d7e4;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #b3df1;
        }`}
      </style>
    </>
  );
};

export default PostProfile;
