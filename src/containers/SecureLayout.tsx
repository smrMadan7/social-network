import { MetaMaskInpageProvider } from "@metamask/providers";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import Web3 from "web3";
import Reload from "../components/Cards/Reload";
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
  const [isInstall, setIsInstall] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
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
            navigate("/sign-in");
          });
      } else {
        borwserWalletHandler();
      }
    };
    getCurrentUser();

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

    const connectWallet = async () => {
      try {
        const currentProvider: any = window.ethereum;

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
          <Loading />
          <Reload refreshStatus={refresh} />
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
