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

export const signMessage =
  "https://plnsocialnetwork.com wants you to sign in with your Ethereum account:";

export const ipfsGateway = "http://localhost:9090/ipfs/";
export const ipfsPostUrl = "http://127.0.0.1:5002/api/v0";
