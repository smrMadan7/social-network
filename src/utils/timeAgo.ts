import { convertToLocal } from "./convertToLocal";

export const timeAgo: any = (timestamp: any) => {
  const currentDate: any = new Date();
  const seconds: any = Math.floor((currentDate - timestamp) / 1000);
  let interval: any = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    if (interval === 1) {
      return interval + "year ago";
    } else {
      return interval + " years ago";
    }
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    if (interval === 10) {
      return interval + "month ago";
    } else {
      return interval + " months ago";
    }
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    if (interval > 7) {
      return convertToLocal(timestamp);
    } else {
      if (interval === 1) {
        return interval + "day ago";
      } else {
        return interval + " days ago";
      }
    }
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    if (interval === 1) {
      return interval + "hour ago";
    } else {
      return interval + " hours ago";
    }
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    if (interval === 1) {
      return interval + " minute ago";
    } else {
      return interval + " minutes ago";
    }
  }

  interval = Math.floor(seconds);
  if (interval === 1 || interval === -1) {
    return 1 + "second ago";
  } else {
    return Math.floor(seconds) + " seconds ago";
  }
};
