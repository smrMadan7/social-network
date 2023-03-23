import { ipfsGateway } from "../constants/AppConstants";
import defaultUser from "./../assets/Form/default-user.svg";

export const setProfile = (profilePictureUrl: any, setImageUrl: any) => {
  const imageUrl = `${ipfsGateway}${profilePictureUrl}`;

  if (profilePictureUrl === "empty" || profilePictureUrl === undefined) {
    setImageUrl(defaultUser);
  } else {
    setImageUrl(imageUrl);
  }
};
