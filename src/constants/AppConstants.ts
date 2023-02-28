import Web3 from "web3";

export const chainId = 3141;

export const network = {
  chainId: Web3.utils.toHex(chainId),
  chainName: "Filecoin - Hyperspace testnet",
  nativeCurrency: {
    name: "TestFIL",
    symbol: "tFIL",
    decimals: 18,
  },
  rpcUrls: ["https://api.hyperspace.node.glif.io/rpc/v1"],
  blockExplorerUrls: ["https://hyperspace.filfox.info/en"],
};

export const signMessage = "pln social wants you to sign in!";

export const ipfsGateway = "http://localhost:9090/ipfs/";
export const ipfsPostUrl = "http://127.0.0.1:5002/api/v0";

export const ipfsPost = "https://c0ba-183-82-28-176.in.ngrok.io";

export const baseUrl = "https://d193-183-82-28-176.in.ngrok.io";

export const verifyUser = `${baseUrl}/api/user/verify`;
export const addMember = `${baseUrl}/api/user/registerMember`;
export const addTeam = `${baseUrl}/api/user/registerTeam`;
export const handleCheck = `${baseUrl}/api/user/checkHandleAvailability/`;
export const getUser = `${baseUrl}/api/user/getProfile/`;
export const createPost = `${baseUrl}/api/post/create`;
// export const whoToFollow = `${baseUrl}/api/post/create`;
export const getPostById = `${baseUrl}/api/post/getPostByWallet/`;
