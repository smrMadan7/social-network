import { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { useLocation, useNavigate } from "react-router";
import metamaskLogo from "./.././.././assets/Auth/metamask-logo.svg";
import appLogo from "././.././../assets/Navbar/logo.svg";

import { MetaMaskInpageProvider } from "@metamask/providers";
import Web3 from "web3";
import { chainId, network, signMessage } from "../../constants/AppConstants";
import Loading from "../Loading/Loading";
import PoweredBy from "../PoweredBy/PoweredBy";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    web3?: Web3;
  }
}

const SignInCard = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [defaultAccount, setDefaultAccount] = useState("");
  const [isInstall, setIsInstall] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsInstall(false);
    setIsLoading(false);
    setIsConnected(false);
  }, []);

  const detectProvider = () => {
    let provider: MetaMaskInpageProvider;
    if (window.ethereum) {
      provider = window.ethereum;
      return provider;
    } else {
      setIsInstall(true);
      setIsLoading(false);
      setErrorMessage("Install MetaMask Please");
    }
    return;
  };

  const accountChanged = async (accountName: string) => {
    setDefaultAccount(accountName);

    console.log("user current account is ", accountName);
    localStorage.setItem("signedIn", "true");

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

  const connectWallet = async () => {
    try {
      const currentProvider: any = detectProvider();

      if (currentProvider) {
        await currentProvider?.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(currentProvider);

        console.log("provider in signin card", currentProvider);

        const userAccount = await web3.eth.getAccounts();

        accountChanged(userAccount[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const signUser = async () => {
    setIsLoading(true);
    const currentProvider: MetaMaskInpageProvider | undefined | any = detectProvider();

    if (currentProvider !== undefined) {
      await currentProvider?.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(currentProvider);
      const userAccount = await web3.eth.getAccounts();

      const signature = await web3.eth.personal.sign(
        `${signMessage} ${userAccount[0]}`,
        userAccount[0],
        ""
      );

      setIsLoading(true);
    }

    setTimeout(() => {
      setIsLoading(false);
      navigate("/register");
    }, 3000);
  };

  return (
    <>
      {/* is meta mask is not installed */}
      {isInstall && (
        <div className="absolute top-2 ">
          <div
            className="flex items-center justify-between bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded relative w-300"
            role="alert"
          >
            <div>
              <strong className="font-bold">Please Install MetaMask</strong>
            </div>

            <div
              className=" cursor-pointer px-2 py-2 rounded-full hover:bg-white hover:animate-none"
              onClick={() => setIsInstall(false)}
            >
              <GrFormClose fontSize={25} />
            </div>
          </div>
        </div>
      )}

      {isLoading && <Loading />}

      <div className="border flex flex-col bg-white w-300  rounded-lg">
        {isConnected ? (
          <>
            <div className="flex items-center justify-center text-2xl font-bold">
              <h1 className="mt-3">Sign In</h1>
            </div>
            <div className="flex flex-col gap-3 font-medium">
              <div className="px-5 py-5">
                <button
                  className="border-black flex border rounded-lg justify-between w-full px-4 py-3 hover:text-white hover:bg-black"
                  onClick={signUser}
                >
                  Sign-In With Us
                  <img src={appLogo} width="30px" height="20px"></img>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center text-2xl font-bold">
              <h1 className="mt-3">Connect Your Wallet</h1>
            </div>

            <div className="flex flex-col gap-3 font-medium">
              <div className="px-5 py-7">
                <button
                  className="border-black flex border rounded-lg justify-between w-full px-4 py-3 hover:text-white hover:bg-black"
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
      <PoweredBy />
    </>
  );
};

export default SignInCard;
