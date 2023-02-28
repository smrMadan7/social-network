export interface INotificationProps {
  headerImg?: React.ReactElement<any, any>;
  title?: string;
  description?: string;
  footerImg?: React.ReactElement<any, any>;
  footerContent?: string;
}

export interface IChat {
  imageUrl?: string;
  userId?: string;
  userName?: string;
  isVerified?: boolean;
  message?: string;
  likes?: number;
  mirrors?: number;
  date?: string;
}

export interface IChatProps {
  chat: {
    imageUrl?: string;
    userId?: string;
    userName?: string;
    isVerified?: boolean;
    postImage?: string;
    message?: string;
    likes?: number;
    mirrors?: number;
    date?: string;
  };
}

export interface IUserProps {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  role: string[];
  organization?: string[];
  skills?: string[];
  openForWork?: boolean;
  profilePath?: string;
}

export interface IRoleProps {
  name?: string;
  isChecked?: boolean;
}

export interface IWarningProps {
  message?: string;
}
