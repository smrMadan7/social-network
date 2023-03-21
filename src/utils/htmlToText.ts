export const htmlToText = (content: string) => {
  return content.replace(/<[^>]*>/g, "");
};
