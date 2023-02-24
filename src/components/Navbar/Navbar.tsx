import React, { useEffect, useState } from "react";

import { AiOutlineLogin } from "react-icons/ai";
import { IoIosContact } from "react-icons/io";
import { AiFillBug } from "react-icons/ai";
import defaultUser from "./.././.././assets/Form/default-user.png";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import { BiLogOut } from "react-icons/bi";
import logo from "./.././.././assets/Navbar/logo.svg";
import { useUserContext } from "../../context/UserContextProvider";
import { ipfsGateway } from "../../constants/AppConstants";

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

  const imageUrl = `${ipfsGateway}${appState?.action?.user?.profilePath}`;

  if (appState?.action?.user?.profilePath === undefined) {
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
    if ((exactPath === "" || exactPath === "home") && user && isRegistered) {
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
    localStorage.removeItem("signedIn");
    localStorage.removeItem("registered");
    setProfileStatus(false);
    setMoreStatus(false);
    setIsLogout(true);
    appStatedispatch({});

    setTimeout(() => {
      navigate("/");
    }, 3000);
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
        >
          <div className="absolute w-full h-full">abc</div>
        </div>
      ) : (
        <div></div>
      )}

      <div
        className="fixed flex  items-center px-4 py-2 nav-container w-full border justify-between bg-white"
        onClick={() => {
          setMoreStatus(false);
        }}
      >
        <div className="flex gap-11">
          <div className="flex cursor-pointer rounded-lg" onClick={logoOnClickHandler}>
            <img height="60" width="60" src={logo} loading="lazy"></img>
            <div className="hidden md:block mt-1 ">
              <p className="font-bold text-md">Protocol Labs</p>
              <p className="font-bold text-md leading-none">Social Network</p>
            </div>
          </div>

          <div className=" text-center items-center hidden md:flex">
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
                    <div
                      className="p-2 flex gap-3 items-center cursor-pointer font-light rounded-lg hover:bg-gray-300"
                      onClick={() => setMoreStatus(false)}
                    >
                      <AiFillBug color="gray" />
                      Report a bug
                    </div>
                  </div>
                )}
              </div>
            </ul>
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
            {image != defaultUser && (
              <img height="45px" width="45px" src={image} className="rounded-full"></img>
            )}
            {profileStatus && (
              <div className="fixed border mt-2 gap-2 rounded-lg flex flex-col px-4 py-2 bg-white right-8 top-14 ">
                <NavLink to={profileRoute}>
                  <div
                    style={routerStatus === "profile" ? { background: "gray" } : { background: "" }}
                    className="p-2 flex gap-3 items-center cursor-pointer font-light  rounded-lg hover:bg-gray-300"
                    onClick={() => {
                      setMoreStatus(false);
                      setProfileStatus(false);
                    }}
                  >
                    <IoIosContact
                      style={routerStatus === "profile" ? { color: "black" } : { color: "gray" }}
                    />
                    Profile
                  </div>
                </NavLink>

                <div
                  className="p-2 flex gap-3 items-center cursor-pointer font-light rounded-lg hover:bg-gray-300"
                  onClick={() => {
                    setMoreStatus(false);
                    logoutHandler();
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
