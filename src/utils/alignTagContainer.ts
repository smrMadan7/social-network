export const alignTagContainer = (containerId: string) => {
  var selection: any = window.getSelection();
  if (selection.rangeCount > 0) {
    var tagElement: any = document.getElementById(containerId);
    var range = selection.getRangeAt(0);
    var boundingReact = range.getBoundingClientRect();
    var x = boundingReact.left / 4 + boundingReact.width / 4;
    var y = boundingReact.top + boundingReact.height / 2;
    tagElement.style.left = x + "px";
    tagElement.style.top = y + "px";
  }
};
