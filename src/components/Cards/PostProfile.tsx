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
  const [profileAddress, setProfileAddress] = useState();

  const [moreOrg, setMoreOrg] = useState<any>();
  const [moreOrgStatus, setMoreOrgStatus] = useState(false);
  const organizations: any = [];

  const [moreSkills, setMoreSkills] = useState<any>();
  const [moreSkillsStatus, setMoreSkillsStatus] = useState(false);
  const skills: any = [];

  const [moreRoles, setMoreRoles] = useState<any>();
  const [moreRolesStatus, setMoreRolesStatus] = useState(false);
  const role: any = [];

  var orgCharLength = 0;
  var skillCharLength = 0;
  var roleCharLength = 0;

  useEffect(() => {
    setIsLoading(false);
    if (post?.post?.createdBy) {
      setProfileAddress(post?.post?.createdBy);
    } else {
      setProfileAddress(post);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [profileAddress]);

  useEffect(() => {
    setMoreOrg(organizations);
    setMoreSkills(skills);
    setMoreRoles(role);
  }, [isLoading]);

  const fetchUser = async () => {
    setIsLoading(true);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions: any = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${getUser}${profileAddress}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === true) {
          setIsLoading(false);
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
      <div
        className="overflow-y-auto relative "
        style={isMember ? { height: "250px" } : { height: "250px" }}
      >
        {isMember && (
          <div className="w-full flex flex-col text-black font-2xl">
            <div className="w-full text-black flex px-5 mt-5 gap-4">
              <div>
                <img
                  height="70px"
                  width="70px"
                  className="rounded-full border bg-black"
                  src={profileUrl}
                  loading="lazy"
                ></img>
              </div>
              <div className="flex flex-col gap-3 w-full">
                {/* display Name */}
                <div className="flex  w-full gap-3 ">
                  <div className="appearance-none block leading-tight focus:outline-none focus:bg-white">
                    {`${details?.firstName}`}
                    <span className="handle font-bold"> @{details?.handle}</span>
                  </div>
                </div>
                {/* Role */}
                <div className="flex  w-100 items-center gap-3">
                  <div className="relative w-full flex gap-2 appearance-none block leading-tight focus:outline-none focus:bg-white">
                    {details?.role?.map((roleObj: any, index: any) => {
                      roleCharLength = roleCharLength + roleObj.length;

                      if (roleCharLength <= 27) {
                        return (
                          <div
                            key={index}
                            className="whitespace-nowrap border border-gray-300 font-light rounded-full  px-3 flex "
                          >
                            <p className="mb-1">{roleObj}</p>
                          </div>
                        );
                      } else {
                        role.push(roleObj);
                      }
                    })}

                    {moreRoles.length > 0 && (
                      <div
                        style={
                          moreRoles.length >= 10
                            ? { height: "60px", width: "60px" }
                            : { height: "30px", width: "30px" }
                        }
                        className="relative rounded-full border flex items-center justify-center"
                      >
                        <span
                          className="p-2 cursor-pointer"
                          onMouseEnter={() => setMoreRolesStatus(true)}
                          onMouseLeave={() => setMoreRolesStatus(false)}
                        >
                          +{moreRoles?.length}
                        </span>
                        {moreRolesStatus && (
                          <div className="absolute whitespace-nowrap  left-8 border p-2 rounded-lg bg-white z-10 font-light">
                            {moreRoles?.map((role: any, index: any) => {
                              return (
                                <div className="whitespace-prewrap" key={index}>
                                  {role}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="text-md px-5 mt-2 font-medium flex flex-col md:flex-row md:items-center w-full">
              Skills:
              <div className="flex  w-full items-center gap-3 mt-2">
                <div className="relative w-full px-3 flex gap-1 appearance-none block leading-tight focus:outline-none focus:bg-white ">
                  {details?.skill.map((skill: any, index: any) => {
                    skillCharLength = skillCharLength + skill.length;
                    if (skillCharLength <= 27) {
                      return (
                        <div
                          key={index}
                          className="whitespace-nowrap border border-gray-300 font-light rounded-full px-3 flex"
                        >
                          <p className="mb-1">{skill}</p>
                        </div>
                      );
                    } else {
                      skills.push(skill);
                    }
                  })}
                  {moreSkills.length > 0 && (
                    <div
                      style={
                        moreOrg.length >= 10
                          ? { height: "60px", width: "60px" }
                          : { height: "30px", width: "30px" }
                      }
                      className="relative rounded-full border flex items-center justify-center"
                    >
                      <span
                        className="p-2 cursor-pointer"
                        onMouseEnter={() => setMoreSkillsStatus(true)}
                        onMouseLeave={() => setMoreSkillsStatus(false)}
                      >
                        +{moreSkills?.length}
                      </span>
                      {moreSkillsStatus && (
                        <div className="absolute whitespace-nowrap  left-8 border p-2 rounded-lg bg-white z-10 font-light">
                          {moreSkills?.map((skill: any, index: any) => {
                            return <div key={index}>{skill}</div>;
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Organization */}
            <div className="text-md w-full font-medium px-5 mt-2 flex flex-col md:flex-row md:items-center">
              Organization:
              <div className="flex  w-full items-center gap-3 mt-2">
                <div className="relative w-full px-3 flex gap-1 appearance-none block leading-tight focus:outline-none focus:bg-white">
                  {details?.organization?.map((organization: any, index: any) => {
                    orgCharLength = orgCharLength + organization.length;
                    if (orgCharLength <= 27) {
                      return (
                        <div
                          key={index}
                          className="whitespace-nowrap border border-gray-300 font-light rounded-full px-3 flex  items-center"
                        >
                          <p className="mb-1">{organization}</p>
                        </div>
                      );
                    } else {
                      organizations.push(organization);
                    }
                  })}
                  {moreOrg.length > 0 && (
                    <div
                      style={
                        moreOrg.length >= 10
                          ? { height: "60px", width: "60px" }
                          : { height: "30px", width: "30px" }
                      }
                      className="relative rounded-full border flex items-center justify-center"
                    >
                      <span
                        className="p-2 cursor-pointer"
                        onMouseEnter={() => setMoreOrgStatus(true)}
                        onMouseLeave={() => setMoreOrgStatus(false)}
                      >
                        +{moreOrg?.length}
                      </span>
                      {moreOrgStatus && (
                        <div className="absolute whitespace-nowrap  left-8 border p-2 rounded-lg bg-white z-10 font-light">
                          {moreOrg?.map((org: any, index: any) => {
                            return <div key={index}>{org}</div>;
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* open for work */}
            <div className="text-md font-medium px-5 mt-2 flex flex-col md:flex-row  md:gap-3">
              Open For Work:
              <span className="font-light px-5 md:px-0">{details?.openForWork}</span>
            </div>
            {/* About*/}

            <div className="text-md font-medium px-5 mt-2 flex flex-col md:flex-row  mb-3">
              About:
              <p className="px-4 font-light">{details?.bio}</p>
            </div>
          </div>
        )}

        {isTeam && (
          <div className="w-full flex flex-col text-black font-2xl">
            <div className="text-black flex flex-col md:flex-row px-5 mt-5 gap-3">
              <div>
                <img
                  height="70px"
                  width="70px"
                  className="rounded-full border"
                  src={profileUrl}
                  loading="lazy"
                ></img>
              </div>

              <div>
                {/* Organization Name */}
                <div className="flex  w-full gap-3 font-light">
                  <div className="appearance-none block leading-tight focus:outline-none focus:bg-white">
                    {`${details?.organizationName}`}
                    <span className="handle font-bold"> @{details?.handle}</span>
                  </div>
                </div>

                {/* about */}
                <div className="text-md font-medium mt-3 flex  gap-2">
                  About:
                  <p className=" font-light">{details?.desc}</p>
                </div>
              </div>
            </div>
            {/* Social */}

            <div className="absolute bottom-0 flex justify-end mb-3 px-5 w-full items-center gap-3 mt-3 ">
              <div className="flex gap-3">
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
      </div>
    </>
  );
};

export default PostProfile;
