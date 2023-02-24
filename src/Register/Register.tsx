import React from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar/Navbar";
import PoweredBy from "../components/PoweredBy/PoweredBy";
import fileCoinLogo from "./.././assets/Auth/filecoin-logo.svg";
import ipfsLogo from "./.././assets/Auth/ipfs-logo.svg";
import member from "./.././assets/Auth/member.png";
import teamImg from "./.././assets/Auth/team.png";
import logo from "./.././assets/Navbar/logo.svg";

const Register = () => {
  const navigate = useNavigate();
  const registrationHandler = (e: React.SyntheticEvent, mode: string) => {
    if (mode === "member") {
      navigate("/register/member");
    } else if (mode === "team") {
      navigate("/register/team");
    }
  };

  return (
    <>
      <div className="flex justify-start items-center flex-col h-screen">
        <Navbar />
        <div className="relative w-full h-full">
          <div className=" absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 text-center ">
            <div className="p-5 flex justify-between items-center  gap-10 top-0">
              <img alt="ipfs logo" src={ipfsLogo} width="48px" height="48px"></img>

              <img alt="app logo" src={logo} width="100px" height="100px"></img>
              <img alt="filecoin logo" src={fileCoinLogo} width="38px" height="38px"></img>
            </div>
            {/* register card */}
            <div className="border flex flex-col bg-white w-300  rounded-lg">
              <div className="flex items-center justify-center text-2xl font-bold">
                <h1 className="mt-3">Register</h1>
              </div>
              <div className="py-4 flex flex-col gap-2">
                <div className="px-5 py-1">
                  <button
                    className="border-black flex border rounded-lg justify-between w-full px-4 py-3 hover:text-white hover:bg-black font-semibold"
                    onClick={(e) => registrationHandler(e, "member")}
                  >
                    As a Member
                    <img
                      alt="member icon"
                      loading="lazy"
                      src={member}
                      width="30px"
                      height="20px"
                    ></img>
                  </button>
                </div>
                <div className="px-5">
                  <button
                    className="border-black flex border rounded-lg justify-between w-full px-4 py-3 hover:text-white hover:bg-black font-semibold"
                    onClick={(e) => registrationHandler(e, "team")}
                  >
                    As a Team
                    <img alt="team icon" src={teamImg} width="30px" height="20px"></img>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PoweredBy />
    </>
  );
};

export default Register;
