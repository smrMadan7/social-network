import { BiArrowBack } from "react-icons/bi";
import { Outlet, useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { ipfsGateway } from "../../constants/AppConstants";
import { useUserContext } from "../../context/UserContextProvider";

const MemberProfile = () => {
  const { appState }: any = useUserContext();
  const navigate = useNavigate();

  const imageUrl = `${ipfsGateway}${appState?.action?.user?.profilePictureUrl}`;

  return (
    <>
      <div className=" p-5 md:gap-16 gap-4  w-full  flex flex-col items-center justify-center">
        <div className="bg-black" style={{ height: "20px" }}></div>

        <div className="  sm:w-90 md:w-70 h-5/6 border rounded-lg">
          {/* Member */}
          <div className="flex flex-col bg-white border rounded-lg">
            <div>
              <div className="flex text-center justify-center gap-5 border-b p-2 font-bold text-xl items-center">
                <div className="md:hidden" onClick={() => navigate(-1)}>
                  <BiArrowBack />
                </div>
                <h1 className="text-center text-xl font-bold ">Member Profile</h1>
                <div></div>
              </div>
              <form className="text-sm w-100  overflow-y-auto member-form" name="member">
                <div className=" w-full flex flex-col md:flex-row sm:flex-col xs:flex-col gap-3">
                  <div className="sm:w-100 md:w-90 ">
                    <div className="flex flex-col mt-3 mx-1 ">
                      {/* First Name */}
                      <div className="flex flex-col md:flex-row w-full px-3  md:mb-0 sm:mt-3 md:items-center md:gap-3">
                        <label className="md:w-30 sm:w-40 block tracking-wide text-gray-700 font-bold mb-2">
                          First Name:
                        </label>
                        <input
                          readOnly
                          className=" md:w-full sm:w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          id="first-name"
                          type="text"
                          name="firstName"
                          value={appState?.action?.user?.firstName}
                          placeholder="First Name"
                        ></input>
                      </div>

                      {/* Last Name */}

                      <div className="text-sm flex flex-col md:flex-row w-full w-1/2 px-3  md:mb-0 md:items-center md:gap-3 ">
                        <label className=" md:w-30 sm:w-40 block tracking-wide text-gray-700 text-md font-bold mb-2">
                          Last Name:
                        </label>
                        <input
                          readOnly
                          className="md:w-full sm:w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          id="last-name"
                          name="lastName"
                          type="text"
                          placeholder="Last Name"
                          value={appState?.action?.user?.lastName}
                        ></input>
                      </div>
                    </div>

                    {/* Display Name */}
                    <div className="text-sm flex flex-col md:flex-row w-full w-1/2 px-4  md:mb-0 md:items-center md:gap-3 ">
                      <label className=" md:w-30 sm:w-40 block tracking-wide text-gray-700 text-md font-bold mb-2">
                        Display Name:
                      </label>
                      <input
                        readOnly
                        className="md:w-full sm:w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        id="display-name"
                        name="displayName"
                        type="text"
                        placeholder="Display Name"
                        value={appState?.action?.user?.displayName}
                      ></input>
                    </div>

                    {/* open to work */}
                    <div className="text-sm flex-col md:flex-row flex w-full w-1/2 px-4  md:mb-0 md:items-center md:gap-3 ">
                      <label className=" md:w-30 sm:w-40 block tracking-wide text-gray-700 text-md font-bold mb-2">
                        Open To Work:
                      </label>
                      <input
                        readOnly
                        className="md:w-full sm:w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        id="display-name"
                        name="Open To Work"
                        type="text"
                        placeholder="Display Name"
                        value={appState?.action?.user?.openForWork}
                      ></input>
                    </div>
                  </div>
                  <div className="gap-2 flex flex-col items-center text-center sm:w-50 md:mt-2">
                    <div className="items-center text-center flex md:justify-center sm:justify-start">
                      <div className=" cursor-pointer" style={{ width: "140px", height: "140px" }}>
                        <img
                          alt="user profile"
                          className="border rounded-full"
                          height="140px"
                          width="140px"
                          src={imageUrl}
                          loading="lazy"
                        ></img>
                      </div>
                    </div>
                    <div className="flex md:justify-center sm:justify-start text-center items-center ">
                      <button
                        type="button"
                        className="bg-violet-700 hover:bg-violet-900 text-white px-4 p-2  border rounded-lg"
                      >
                        Profile Image
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
                      readOnly
                      id="message"
                      form="member"
                      name="bio"
                      value={appState?.action?.user?.bio}
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    ></textarea>
                  </div>
                </div>

                <div className="flex mb-3 flex-col md:flex-row gap-2 justify-between">
                  {/* Role Selection */}
                  <div className="md:w-50 flex mx-1 justify-between">
                    <div className="md:flex md:items-center md:gap-4 w-full md:w-full  px-3  md:mb-0">
                      <label className="text-md font-bold block tracking-wide text-gray-700 sm:mb-2">
                        Role:
                      </label>
                      <div className="bg-gray-200 focus:bg-white flex justify-between py-2 px-4  border rounded-lg cursor-pointer md:w-full">
                        <div className="text-gray-700 flex gap-2 ">
                          <>
                            <div className="flex gap-3 flex-wrap">
                              {appState?.action?.user?.role.map((role: string, index: number) => {
                                return (
                                  <div
                                    key={index}
                                    className="border flex items-center gap-4 justify-between border-black rounded-full py-1 px-2  "
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {role}
                                  </div>
                                );
                              })}
                            </div>
                          </>
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
                      <div className="w-full bg-gray-200 focus:bg-white flex justify-between py-2 px-4  border rounded-lg cursor-pointer">
                        <div className="text-gray-700 flex gap-2 role-container">
                          <>
                            <div className="flex gap-3 flex-wrap">
                              {appState?.action?.user?.organization.map(
                                (organization: string, index: number) => {
                                  return (
                                    <div
                                      key={index}
                                      className="border flex items-center gap-4 justify-between border-black rounded-full py-1 px-2 "
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {organization}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}

                <div className="md:w-50 flex mx-1 justify-between mb-2">
                  <div className="md:flex md:items-center md:gap-4 w-full md:w-full px-3  md:mb-0">
                    <label className="text-md font-bold block tracking-wide text-gray-700">
                      Skill:
                    </label>
                    <div className="w-full bg-gray-200 focus:bg-white flex justify-between py-2 px-4  border rounded-lg cursor-pointer">
                      <div className="text-gray-700 flex gap-2 role-container">
                        <>
                          <div className="flex gap-3 flex-wrap">
                            {appState?.action?.user?.skill.map((skill: string, index: number) => {
                              return (
                                <div
                                  key={index}
                                  className="border flex items-center gap-4 justify-between border-black rounded-full py-1 px-2 "
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {skill}
                                </div>
                              );
                            })}
                          </div>
                        </>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
      <style>
        {`


    .member-form {
        height: calc(100vh - 30vh);

    }`}
      </style>
    </>
  );
};

export default MemberProfile;
