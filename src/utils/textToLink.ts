export const textToLink = (content: string) => {
  const urlPattern =
    /((http|https|ftp):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/gi;

  return content?.replace(urlPattern, '<a href="$1" target="_blank" style="color: blue;">$1</a>');
};
