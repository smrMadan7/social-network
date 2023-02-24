import { create, urlSource } from "ipfs-http-client";

const ipfs = create();

export const ipfsClient = async () => {
  const file = await ipfs.add(urlSource("https://ipfs.io/images/ipfs-logo.svg"));
  console.log(file);
};
