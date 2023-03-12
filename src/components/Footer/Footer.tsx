import React, { useEffect, useState } from "react";
import { AiFillBug, AiFillHome } from "react-icons/ai";
import { MdOutlineTravelExplore } from "react-icons/md";
import { FiMoreHorizontal } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { IoIosContact } from "react-icons/io";

const Footer = () => {
  const navigate = useNavigate();
  const exactPath = useLocation().pathname.slice(1);
  const [routerStatus, setRouterStatus] = useState("");
  const user = localStorage.getItem("signedIn");
  const isRegistered = localStorage.getItem("registered");
  const [moreStatus, setMoreStatus] = useState(false);

  useEffect(() => {
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
  return (
    <div className="md:hidden absolute bottom-0 w-full flex  justify-around bg-white py-2 border-t">
      <NavLink to={"/home"}>
        <div
          className="items-center flex flex-col justify-center font-semibold px-4 py-1"
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
          <AiFillHome fontSize={23} />
        </div>
      </NavLink>

      <NavLink to={"/explore"}>
        <div
          className="items-center flex flex-col justify-center font-semibold px-4 py-1"
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
          <MdOutlineTravelExplore fontSize={25} />
        </div>
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
          <FiMoreHorizontal fontSize={25} />
        </li>
        {moreStatus && (
          <div
            className="fixed border mt-1 gap-2 rounded-lg flex flex-col px-4 py-2 bg-white z-10 bottom-14 right-5 "
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
    </div>
  );
};

export default Footer;
