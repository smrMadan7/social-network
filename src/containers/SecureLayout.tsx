import { MetaMaskInpageProvider } from "@metamask/providers";
import { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { Outlet, useLocation, useNavigate } from "react-router";
import Web3 from "web3";
import Loading from "../components/Loading/Loading";

import Navbar from "../components/Navbar/Navbar";
import { chainId, getUser, network, verifyUser } from "../constants/AppConstants";
import { useUserContext } from "../context/UserContextProvider";
import metamaskLogo from "./../assets/Auth/metamask-logo.svg";
import logo from "./../assets/Navbar/logo.svg";

import fileCoinLogo from "./../assets/Auth/filecoin-logo.svg";
import ipfsLogo from "./../assets/Auth/ipfs-logo.svg";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    web3?: any;
  }
}

const SecureLayout = () => {
  const { appState, appStatedispatch }: any = useUserContext();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [warning, setWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [warningMessage, setWarningMessage] = useState("Please Install MetaMask");
  const [isaddress, setIsAddress] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [isWallet, setIsWallet] = useState(false);

  useEffect(() => {
    setCurrentLocation(location.pathname);
    setLoading(true);
    getCurrentUser();
  }, []);

  const provider: any = window.ethereum;
  const web3: any = new Web3(provider);

  const getCurrentUser = async () => {
    if (window.ethereum) {
      const userAccount = await web3.eth.getAccounts();
      const address = userAccount[0];

      if (address) {
        if (localStorage.getItem("isRegistered")) {
          fetchUser();
        } else {
          setIsAddress(true);
        }
      } else {
        setIsLoading(false);
        setIsWallet(true);
      }
    } else {
      setWarning(true);
    }
  };

  const detectProvider = () => {
    let provider: MetaMaskInpageProvider;
    if (window.ethereum) {
      provider = window.ethereum;
      return provider;
    } else {
      setWarning(true);
      setIsLoading(false);
    }
    return;
  };

  const connectWallet = async () => {
    try {
      const currentProvider: any = detectProvider();

      if (currentProvider) {
        await currentProvider?.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();

        accountChanged(userAccount[0]);
        setIsWallet(false);
        getCurrentUser();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const accountChanged = async (accountName: string) => {
    localStorage.setItem("signedIn", accountName);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const fetchUser = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions: any = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const userAccount = await web3.eth.getAccounts();
    const address = userAccount[0];
    fetch(`${getUser}${address}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result?.status === true) {
          const user = result.data;
          appStatedispatch({
            user,
          });
          setLoading(false);
          navigate(currentLocation);
          localStorage.setItem("isRegistered", "yes");
        } else {
          setLoading(false);
          navigate("/register");
        }
      })
      .catch((error) => {});
  };

  const borwserWalletHandler = async () => {
    setIsLoading(true);
    if (window.ethereum?.chainId !== Web3.utils.toHex(chainId)) {
      try {
        await window.ethereum?.request({
          method: "wallet_addEthereumChain",
          params: [network],
        });

        connectWallet();
      } catch (error) {
        console.log(error);
      }
    } else {
      connectWallet();
    }
  };

  const signUser = async () => {
    setIsLoading(true);
    const currentProvider: any = detectProvider();

    if (currentProvider !== undefined) {
      const web3 = new Web3(currentProvider);
      const userAccount = await web3.eth.getAccounts();
      const signature = await web3.eth.personal.sign(
        `pln social wants you to sign in`,
        userAccount[0],
        ""
      );

      const body = {
        signature: signature,
        address: userAccount[0],
        message: `pln social wants you to sign in`,
      };
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions: any = {
        method: "POST",
        body: JSON.stringify(body),
        headers: myHeaders,
        redirect: "follow",
      };
      setIsLoading(true);
      fetch(verifyUser, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status === false) {
            setWarning(true);
            setWarningMessage("Something went wrong!!");
          } else {
            fetchUser();
          }
        })
        .catch((error) => {
          console.log("error is ", error);
        });
    }
  };

  return (
    <>
      {loading ? (
        <div>
          <Navbar />
          {isLoading && <Loading />}

          {/* reload */}

          <div className="relative w-full h-screen">
            <div className=" absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 text-center ">
              {(isaddress || isWallet) && (
                <div className="p-5 flex justify-between items-center  gap-10 top-0">
                  <img src={ipfsLogo} alt="ipfs-logo" width="48px" height="48px"></img>

                  <img alt="app-logo" src={logo} width="100px" height="100px"></img>
                  <img alt="file coin logo" src={fileCoinLogo} width="38px" height="38px"></img>
                </div>
              )}
              {localStorage.getItem("isRegistered") && <Loading />}

              <div
                className="border flex flex-col bg-white w-300  rounded-lg"
                style={isaddress || isWallet ? { border: "1px solid #ebecf0" } : { border: "0px" }}
              >
                <>
                  <div className="flex flex-col items-center justify-center font-bold">
                    {isaddress && (
                      <>
                        <h1 className="text-2xl m-3">Welcome!!</h1>

                        <div className="flex flex-col gap-3 font-medium">
                          <div className="px-5 py-4">
                            <button
                              className="text-xl border-black flex border gap-2 rounded-lg justify-between w-full px-4 py-2 hover:bg-gray-300"
                              onClick={signUser}
                            >
                              Sign-In
                              <img src={logo} width="35px" height="35px"></img>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    {isWallet && (
                      <>
                        <h1 className="text-2xl m-3">Welcome!!</h1>
                        <div className="flex flex-col gap-3 font-medium">
                          <div className="px-5 py-4">
                            <button
                              className="text-xl border-black flex border gap-2 rounded-lg justify-between w-full px-4 py-3 hover:bg-gray-300"
                              onClick={borwserWalletHandler}
                            >
                              Browser Wallet
                              <img src={metamaskLogo} width="30px" height="20px"></img>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div> 
                </>
              </div>
            </div>
          </div>

          {/* is meta mask is not installed */}
          {warning && (
            <div className="z-10 absolute top-2 items-center flex justify-center w-full right-0 left-0 ">
              <div
                className="flex items-center justify-between bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded relative w-300"
                role="alert"
              >
                <div>
                  <strong className="font-bold">{warningMessage}</strong>
                </div>

                <div
                  className=" cursor-pointer px-2 py-2 rounded-full hover:bg-white hover:animate-none"
                  onClick={() => setWarning(false)}
                >
                  <GrFormClose fontSize={25} />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <Navbar />
          <Outlet />
        </>
      )}
    </>
  );
};
export default SecureLayout;
