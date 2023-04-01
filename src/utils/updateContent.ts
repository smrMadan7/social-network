export const updateContent = (content: any) => {

  const anchorRegex = /(<a\s.*?>.*?<\/a>)/g;
  const tagRegex = /\[(\w+)\]\(\w+\)/g;
  const urlPattern = /((http|https|ftp):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/gi;

const result = content.replace(tagRegex, '<span style="color: blue;">$1</span>').replace(/@/g, '<span style="color: blue;">@</span>');
  const hasAnchor = anchorRegex.test(result);

  if (hasAnchor) {
    return result.replace(anchorRegex, "<a style='color: blue;' $1");
  } else {
    return result?.replace(urlPattern, '<a href="$1" target="_blank" style="color: blue;">$1</a>');
  }
};
