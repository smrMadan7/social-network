export const convertToLocal = (timestamp: any) => {
  //   const date = new Date(timestamp);
  //   return date.toLocaleString();
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};
