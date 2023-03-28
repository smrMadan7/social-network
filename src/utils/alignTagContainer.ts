export const alignTagContainer = (containerId: string) => {
  var selection: any = window.getSelection();
  if (selection.rangeCount > 0) {
    var tagElement: any = document.querySelector(`.${containerId}`);

    console.log("element is ", tagElement);
    if (tagElement !== null) {
      tagElement.style = {};
      tagElement.removeAttribute("style");
      var range = selection.getRangeAt(0);
      var boundingReact = range.getBoundingClientRect();
      var x = boundingReact.left + boundingReact.width / 2;
      var y = boundingReact.top + boundingReact.height / 2;
      tagElement.style.left = x + "px";
      tagElement.style.top = y + "px";
    }
  }
};
