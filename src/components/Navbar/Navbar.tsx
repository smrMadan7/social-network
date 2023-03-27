import React, { useEffect, useState } from "react";

import { AiFillBug } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { IoIosContact, IoMdNotificationsOutline } from "react-icons/io";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ipfsGateway, roles } from "../../constants/AppConstants";
import { useUserContext } from "../../context/UserContextProvider";
import Loading from "../Loading/Loading";
import UserNotification from "../UserNotification/UserNotification";
import defaultUser from "./.././.././assets/Form/default-user.svg";
import logo from "./.././.././assets/Navbar/nav-logo.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const exactPath = useLocation().pathname.slice(1);
  const [routerStatus, setRouterStatus] = useState("");
  const [moreStatus, setMoreStatus] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [greeting, setGreeting] = useState("");
  const { appState }: any = useUserContext();
  const user = localStorage.getItem("signedIn");
  const isRegistered = localStorage.getItem("registered");
  const [profileStatus, setProfileStatus] = useState(false);
  const [isNotification, setIsNotification] = useState(false);

  const imageUrl = `${ipfsGateway}${appState?.action?.user?.profilePictureUrl}`;

  useEffect(() => {});

  var profileRoute = "";

  if (appState?.action?.user?.type === roles[0]) {
    profileRoute = "/member-profile";
  } else {
    profileRoute = "/team-profile";
  }

  useEffect(() => {
    setProfileStatus(false);
    setMoreStatus(false);
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  useEffect(() => {
    setIsLogout(false);
    setMoreStatus(false);
    if (exactPath === "" || exactPath === "home") {
      setRouterStatus("home");
    } else if (exactPath === "explore") {
      setRouterStatus("explore");
    } else if ((exactPath === "" || exactPath === "sign-in") && !user && !isRegistered) {
      setRouterStatus("logout");
    } else {
      setRouterStatus("profile");
    }
  }, [exactPath]);

  const logoutHandler = async () => {
    setProfileStatus(false);
    setMoreStatus(false);
    setIsLogout(true);
    localStorage.clear();

    setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 2000);
  };

  const logoOnClickHandler = () => {
    navigate("/home");
  };

  return (
    <>
      {moreStatus || profileStatus ? (
        <div
          className="fixed w-full h-screen"
          onClick={() => {
            setMoreStatus(false);
            setProfileStatus(false);
          }}
        ></div>
      ) : (
        <div></div>
      )}

      <div className="fixed z-10 flex  items-center px-4 py-2 nav-container w-full border justify-between bg-white ">
        <div className="flex gap-11">
          <div className="flex cursor-pointer rounded-lg" onClick={logoOnClickHandler}>
            <img
              alt="app-log "
              src={logo}
              loading="lazy"
              style={imageUrl === null ? { padding: "0px" } : { padding: "10px" }}
            ></img>
          </div>

          <div className=" text-center items-center hidden md:flex">
            {appState?.action?.user?.profilePictureUrl !== undefined && (
              <ul className="flex gap-6 font-semibold ">
                <NavLink to={"/home"}>
                  <li
                    className="cursor-pointer hover:bg-bgHover hover:rounded-lg px-3 py-2 "
                    style={
                      routerStatus === "home"
                        ? {
                            background: "rgb(196 181 253)",
                            color: "black",
                            borderRadius: "10px",
                          }
                        : { background: "" }
                    }
                  >
                    Home
                  </li>
                </NavLink>

                <NavLink to={"/explore"}>
                  <li
                    className="cursor-pointer hover:bg-bgHover hover:rounded-lg px-3 py-2 "
                    style={
                      routerStatus === "explore"
                        ? {
                            background: "rgb(196 181 253)",
                            color: "black",
                            borderRadius: "10px",
                          }
                        : { background: "" }
                    }
                  >
                    Explore
                  </li>
                </NavLink>
                <div>
                  <li
                    className="flex flex gap-2 items-center justify-center cursor-pointer hover:bg-bgHover hover:rounded-lg px-3 py-2 "
                    onMouseOver={(e: React.SyntheticEvent) => {
                      setMoreStatus(true);
                      e.stopPropagation();
                    }}
                    onMouseLeave={(e: React.SyntheticEvent) => {
                      setMoreStatus(false);
                      e.stopPropagation();
                    }}
                  >
                    More
                    {/* {moreStatus ? (
                      <div>
                        <MdKeyboardArrowDown size={20} className="mt-1" />
                      </div>
                    ) : (
                      <div>
                        <MdKeyboardArrowUp size={20} className="mt-1" />
                      </div>
                    )} */}
                  </li>
                  {moreStatus && (
                    <div
                      className="fixed border mt-1 gap-2 rounded-lg flex flex-col px-4 py-2 bg-white "
                      onMouseOver={(e: React.SyntheticEvent) => {
                        setMoreStatus(true);
                        e.stopPropagation();
                      }}
                      onMouseLeave={(e: React.SyntheticEvent) => {
                        setMoreStatus(false);
                        e.stopPropagation();
                      }}
                    >
                      <a
                        href="mailto:spaceport-admin@protocol.ai"
                        className="p-2 flex gap-3 items-center cursor-pointer font-light  rounded-lg hover:bg-bgHover"
                      >
                        <IoIosContact color="gray" />
                        Contact Us
                      </a>
                      <a
                        rel="noreferrer"
                        href="https://github.com/memser-spaceport/pl-network-hub"
                        target="_blank"
                        className="p-2 flex gap-3 items-center cursor-pointer font-light rounded-lg hover:bg-bgHover"
                        onClick={() => setMoreStatus(false)}
                      >
                        <AiFillBug color="gray" />
                        Report a bug
                      </a>
                    </div>
                  )}
                </div>
              </ul>
            )}
          </div>
        </div>

        <div className="flex gap-6 items-center justify-center">
          {/* <button
            className="bg-violet-700 hover:bg-violet-900 px-3 py-2 text-white font-bold py-2 px-3 rounded-lg"
            onClick={logoutHandler}
          >
            Logout
          </button> */}
          {/* Notification */}

          {appState?.action?.user ? (
            <>
              <div
                className="relative cursor-pointer prevent-select"
                onClick={() => {
                  if (isNotification) {
                    setIsNotification(false);
                  } else {
                    setIsNotification(true);
                  }
                }}
              >
                <p className="absolute bottom-4 left-4 text-7xl text-red-500 ">.</p>

                <div className="cursor-pointer  rounded-full p-1 hover:bg-bgActive bg-bgHover">
                  <IoMdNotificationsOutline size={20} />
                </div>
              </div>
              <div className="hidden md:block font-semibold prevent-select">
                {greeting}, {appState?.action?.user?.firstName} {appState?.action?.user?.organizationName}
              </div>
            </>
          ) : (
            <div></div>
          )}

          <div
            className="border rounded-full cursor-pointer flex flex-col"
            onMouseOver={() => setProfileStatus(true)}
            onMouseOut={() => setProfileStatus(false)}
          >
            {appState?.action?.user?.profilePictureUrl !== undefined && (
              <>
                <img alt="user profile" height="45px" width="45px" src={imageUrl} className="rounded-full" loading="lazy"></img>
              </>
            )}

            {profileStatus && (
              <div
                className="fixed z-40 border mt-1 gap-2 rounded-lg flex flex-col px-4 py-2 bg-white right-4"
                style={{ marginTop: "47px" }}
              >
                <div
                  style={routerStatus === "profile" ? { background: "rgb(196 181 253)" } : { background: "" }}
                  className="p-2 flex gap-3 items-center cursor-pointer font-light  rounded-lg hover:bg-bgHover"
                  onClick={() => {
                    setProfileStatus(false);
                    navigate(profileRoute);
                  }}
                >
                  <IoIosContact style={routerStatus === "profile" ? { color: "black" } : { color: "gray" }} />
                  Profile
                </div>

                <div
                  className="p-2 flex gap-3 items-center cursor-pointer font-light rounded-lg hover:bg-bgHover"
                  onClick={() => {
                    logoutHandler();
                    setMoreStatus(false);
                  }}
                >
                  <BiLogOut
                    color="
                  gray"
                  />
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isNotification && <UserNotification isNotification={isNotification} setIsNotification={setIsNotification} />}
      {isLogout && <Loading />}
    </>
  );
};

export default Navbar;
