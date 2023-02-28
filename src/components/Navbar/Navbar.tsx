import React, { useEffect, useState } from "react";

import { AiFillBug } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { IoIosContact } from "react-icons/io";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ipfsGateway } from "../../constants/AppConstants";
import { useUserContext } from "../../context/UserContextProvider";
import Loading from "../Loading/Loading";
import defaultUser from "./.././.././assets/Form/default-user.png";
import logo from "./.././.././assets/Navbar/logo.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const exactPath = useLocation().pathname.slice(1);
  const [routerStatus, setRouterStatus] = useState("");
  const [moreStatus, setMoreStatus] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [greeting, setGreeting] = useState("");
  const { appState, appStatedispatch }: any = useUserContext();
  const user = localStorage.getItem("signedIn");
  const isRegistered = localStorage.getItem("registered");
  const [profileStatus, setProfileStatus] = useState(false);

  var image;

  const imageUrl = `${ipfsGateway}${appState?.action?.user?.profilePictureUrl}`;

  if (appState?.action?.user?.profilePictureUrl === undefined) {
    image = defaultUser;
  } else {
    image = imageUrl;
  }

  var profileRoute = "";

  if (appState?.action?.user?.firstName) {
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

  const logoutHandler = () => {
    setProfileStatus(false);
    setMoreStatus(false);
    setIsLogout(true);

    const user = {};
    appStatedispatch({
      user,
    });

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

      <div className="fixed flex  items-center px-4 py-2 nav-container w-full border justify-between bg-white ">
        <div className="flex gap-11">
          <div className="flex cursor-pointer rounded-lg" onClick={logoOnClickHandler}>
            <img alt="app-log " height="60" width="60" src={logo} loading="lazy"></img>
            <div className="hidden md:block mt-1 ">
              <p className="font-bold text-md">Protocol Labs</p>
              <p className="font-bold text-md leading-none">Social Network</p>
            </div>
          </div>

          <div className=" text-center items-center hidden md:flex">
            {image !== defaultUser && (
              <ul className="flex gap-6 font-semibold ">
                <NavLink to={"/home"}>
                  <li
                    className="cursor-pointer hover:bg-gray-300 hover:rounded-lg px-3 py-2 "
                    style={
                      routerStatus === "home"
                        ? {
                            background: "#C5C5C5",
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
                    className="cursor-pointer hover:bg-gray-300 hover:rounded-lg px-3 py-2 "
                    style={
                      routerStatus === "explore"
                        ? {
                            background: "#C5C5C5",
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
                    className="flex flex-col cursor-pointer hover:bg-gray-300 hover:rounded-lg px-3 py-2 "
                    onClick={(e: React.SyntheticEvent) => {
                      setMoreStatus(true);
                      e.stopPropagation();
                    }}
                  >
                    More
                  </li>
                  {moreStatus && (
                    <div className="fixed border mt-2 gap-2 rounded-lg flex flex-col px-4 py-2 bg-white ">
                      <a
                        href="mailto:spaceport-admin@protocol.ai"
                        className="p-2 flex gap-3 items-center cursor-pointer font-light  rounded-lg hover:bg-gray-300"
                        onClick={() => setMoreStatus(false)}
                      >
                        <IoIosContact color="gray" />
                        Contact
                      </a>
                      <a
                        rel="noreferrer"
                        href="https://github.com/Vellaiyan-Marimuthu/social-network/issues/new"
                        target="_blank"
                        className="p-2 flex gap-3 items-center cursor-pointer font-light rounded-lg hover:bg-gray-300"
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

        <div className="flex gap-9 items-center justify-center">
          {/* <button
            className="bg-violet-700 hover:bg-violet-900 px-3 py-2 text-white font-bold py-2 px-3 rounded-lg"
            onClick={logoutHandler}
          >
            Logout
          </button> */}
          {appState?.action?.user ? (
            <div className="font-semibold">
              {greeting}, {appState?.action?.user?.firstName}{" "}
              {appState?.action?.user?.organizationName}
            </div>
          ) : (
            <div></div>
          )}

          <div
            className="border rounded-full cursor-pointer flex flex-col"
            onClick={() => setProfileStatus(true)}
          >
            {image !== defaultUser && (
              <img
                alt="user profile"
                height="45px"
                width="45px"
                src={image}
                className="rounded-full"
              ></img>
            )}
            {profileStatus && (
              <div className="fixed z-40 border mt-2 gap-2 rounded-lg flex flex-col px-4 py-2 bg-white right-8 top-14 ">
                <div
                  style={routerStatus === "profile" ? { background: "gray" } : { background: "" }}
                  className="p-2 flex gap-3 items-center cursor-pointer font-light  rounded-lg hover:bg-gray-300"
                  onClick={() => {
                    setMoreStatus(false);
                    setProfileStatus(false);
                    navigate(profileRoute);
                  }}
                >
                  <IoIosContact
                    style={routerStatus === "profile" ? { color: "black" } : { color: "gray" }}
                  />
                  Profile
                </div>

                <div
                  className="p-2 flex gap-3 items-center cursor-pointer font-light rounded-lg hover:bg-gray-300"
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
      {isLogout && <Loading />}
    </>
  );
};

export default Navbar;
