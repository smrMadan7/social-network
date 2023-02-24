import { ipfsGateway } from "../../constants/AppConstants";
import { useUserContext } from "../../context/UserContextProvider";

const TeamProfile = () => {
  const { appState }: any = useUserContext();

  const imageUrl = `${ipfsGateway}${appState?.action?.user?.profilePath}`;
  return (
    <>
      <div className=" p-5 md:gap-16 gap-4  w-full  flex flex-col items-center justify-center">
        <div className="bg-black" style={{ height: "20px" }}></div>

        <div className="  sm:w-90 md:w-70 h-5/6 border rounded-lg">
          {/*Team */}

          <div className="flex flex-col bg-white border rounded-lg">
            <div>
              <h1 className="text-center text-xl font-bold p-3 border-b">Team Details</h1>
              <form className="text-sm w-100  overflow-y-auto member-form" name="member">
                <div className=" w-full flex flex-col md:flex-row sm:flex-col xs:flex-col gap-3">
                  <div className="sm:w-100 md:w-90 ">
                    <div className="flex flex-col mt-3 mx-1 ">
                      {/* OrganizationName */}
                      <div className="flex w-full px-3  md:mb-0 sm:mt-3 items-center gap-3">
                        <label className="md:w-30 sm:w-40 block tracking-wide text-gray-700 font-bold mb-2">
                          Org Name:
                        </label>
                        <input
                          readOnly
                          className=" md:w-full sm:w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          id="organization-name"
                          type="text"
                          name="organizationName"
                          placeholder="Organization Name"
                          value={appState?.action?.user?.organizationName}
                        ></input>
                      </div>

                      {/* Website */}

                      <div className="text-sm flex w-full w-1/2 px-3  md:mb-0 items-center gap-3 ">
                        <label className=" md:w-30 sm:w-40 block tracking-wide text-gray-700 text-md font-bold mb-2">
                          Website:
                        </label>
                        <input
                          readOnly
                          className="md:w-full sm:w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          id="website"
                          name="website"
                          type="url"
                          value={appState?.action?.user?.website}
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
                        readOnly
                        className="md:w-full sm:w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        id="contact-email"
                        name="contactEmail"
                        type="email"
                        placeholder="Contact Email"
                        value={appState?.action?.user?.email}
                      ></input>
                    </div>
                    {/* Twitter */}
                    <div className="text-sm flex w-full w-1/2 px-4  md:mb-0 items-center gap-3 ">
                      <label className=" md:w-30 sm:w-40 block tracking-wide text-gray-700 text-md font-bold mb-2">
                        Twitter
                      </label>
                      <input
                        readOnly
                        className="md:w-full sm:w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        id="twitter"
                        name="twitter"
                        type="url"
                        placeholder="Twitter"
                        value={appState?.action?.user?.social?.twitter}
                      ></input>
                    </div>
                    {/* Discord */}
                    <div className="text-sm flex w-full w-1/2 px-4  md:mb-0 items-center gap-3 ">
                      <label className=" md:w-30 sm:w-40 block tracking-wide text-gray-700 text-md font-bold mb-2">
                        Discord
                      </label>
                      <input
                        readOnly
                        className="md:w-full sm:w-full appearance-none block  bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        id="discord"
                        name="discord"
                        type="url"
                        placeholder="Discord"
                        value={appState?.action?.user?.social?.discord}
                      ></input>
                    </div>{" "}
                  </div>
                  <div className="gap-2 flex flex-col items-center text-center sm:w-50 md:mt-2">
                    <div className="items-center text-center flex md:justify-center sm:justify-start">
                      <div className=" cursor-pointer" style={{ width: "140px", height: "140px" }}>
                        <img
                          alt="user-profile"
                          src={imageUrl}
                          className="border rounded-full"
                          height="140px"
                          width="140px"
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

                {/* Description */}
                <div className="flex  mx-1 mt-3  ">
                  <div className="w-full md:w-full px-3  md:mb-0">
                    <label className="text-md font-bold block tracking-wide text-gray-700 font-bold mb-2">
                      Description:
                    </label>
                    <textarea
                      id="desacription"
                      name="description"
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      placeholder="Write your thoughts here..."
                      value={appState?.action?.user?.description}
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`


    .member-form {
        height: calc(100vh - 30vh);

    }`}
      </style>
    </>
  );
};

export default TeamProfile;
