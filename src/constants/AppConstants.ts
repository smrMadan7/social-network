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

// server setup
export const ipfsGateway = "http://44.214.42.39:8080/ipfs/";
export const ipfsPostUrl = "http://44.214.42.39:5001/";
export const baseUrl = "http://44.214.42.39:3000";

// local set up
// export const baseUrl = "http://localhost:3000";
// export const ipfsGateway = "http://127.0.0.1:9090/ipfs/";
// export const ipfsPostUrl = "http://127.0.0.1:5002/";

export const verifyUser = `${baseUrl}/api/user/verify`;
export const addMember = `${baseUrl}/api/user/registerMember`;
export const addTeam = `${baseUrl}/api/user/registerTeam`;
export const handleCheck = `${baseUrl}/api/user/checkHandleAvailability/`;
export const getUser = `${baseUrl}/api/user/getProfile/`;
export const createPost = `${baseUrl}/api/post/create`;
export const getPostById = `${baseUrl}/api/post/getPostByWallet/`;
export const getFeeds = `${baseUrl}/api/feed/getFeed/`;
export const likeApi = `${baseUrl}/api/post/like`;

export const roles = ["member", "team"];
