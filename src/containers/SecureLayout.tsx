import { MetaMaskInpageProvider } from "@metamask/providers";
import { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { Outlet, useNavigate } from "react-router";
import Web3 from "web3";
import Reload from "../components/Cards/Reload";
import Warning from "../components/Cards/Warning";
import Loading from "../components/Loading/Loading";

import Navbar from "../components/Navbar/Navbar";
import { chainId, getUser, network } from "../constants/AppConstants";
import { useUserContext } from "../context/UserContextProvider";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    web3?: any;
  }
}

const SecureLayout = () => {
  const { appState, appStatedispatch }: any = useUserContext();
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [refresh, setRefresh] = useState(true);
  const navigate = useNavigate();
  const [user, setUser] = useState(false);
  const [fetchUser, setFetchUser] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [defaultAccount, setDefaultAccount] = useState("");
  const [warning, setWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [warningMessage, setWarningMessage] = useState("Please Install MetaMask");
  if (!appState?.action?.user) {
    // setFetchUser(false);
  }

  // setTimeout(() => {
  //   // setRefresh(true);
  //   // setLoading(false);
  //   window.location.reload();
  // }, 5000);

  useEffect(() => {
    setLoading(true);
    setRefresh(true);
  }, []);

  const provider: any = window.ethereum;
  const web3: any = new Web3(provider);

  useEffect(() => {
    const getCurrentUser = async () => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions: any = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      if (window.ethereum) {
        const userAccount = await web3.eth.getAccounts();
        const address = userAccount[0];
        setAccount(address);
        if (address) {
          fetch(`${getUser}${address}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
              console.log("response status", result);
              if (result?.status === true) {
                const user = result.data;
                appStatedispatch({
                  user,
                });
                setLoading(false);
                navigate("/home");
              } else {
                setLoading(false);
                navigate("/sign-in");
              }
            })
            .catch((error) => {
              setWarningMessage("Something went wrong!!");
              setWarning(true);
              navigate("/sign-in");
            });
        } else {
          borwserWalletHandler();
        }
      } else {
        setWarning(true);
      }
    };
    getCurrentUser();

    const detectProvider = () => {
      let provider: MetaMaskInpageProvider;
      if (window.ethereum) {
        provider = window.ethereum;
        return provider;
      } else {
        setWarning(true);
        setIsLoading(false);
        setErrorMessage("Install MetaMask Please");
      }
      return;
    };

    const connectWallet = async () => {
      try {
        const currentProvider: any = detectProvider();
        console.log("current provider: ", currentProvider);

        if (currentProvider) {
          await currentProvider?.request({ method: "eth_requestAccounts" });
          const web3 = new Web3(currentProvider);
          console.log("provider in signin card", currentProvider);
          const userAccount = await web3.eth.getAccounts();

          accountChanged(userAccount[0]);
          getCurrentUser();
        }
      } catch (err) {
        console.log(err);
      }
    };

    const accountChanged = async (accountName: string) => {
      setDefaultAccount(accountName);

      localStorage.setItem("signedIn", accountName);

      setTimeout(() => {
        setIsLoading(false);
        setIsConnected(true);
      }, 3000);
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
  }, []);

  return (
    <>
      {loading ? (
        <div>
          <Navbar />
          {isLoading && <Loading />}

          <Reload refreshStatus={refresh} />
          {/* is meta mask is not installed */}
          {warning && (
            <div className="absolute top-2 items-center flex justify-center w-full right-0 left-0 ">
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
