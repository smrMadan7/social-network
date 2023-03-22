export const updateContent = (content: any) => {
  const anchorRegex = /(<a\s.*?>.*?<\/a>)/g;

  const hasAnchor = anchorRegex.test(content);

  if (hasAnchor) {
    return content.replace(anchorRegex, "<a style='color: blue;' $1");
  } else {
    const urlPattern =
      /((http|https|ftp):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/gi;

    return content?.replace(urlPattern, '<a href="$1" target="_blank" style="color: blue;">$1</a>');
  }
};
