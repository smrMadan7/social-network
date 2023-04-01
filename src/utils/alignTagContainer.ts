export const alignTagContainer = (containerId: string) => {
  var selection: any = window.getSelection();
  if (selection.rangeCount > 0) {
    var tagElement: any = document.querySelector(`.${containerId}`);

    if (tagElement !== null) {
      var range = selection.getRangeAt(0);
      var boundingReact = range.getBoundingClientRect();
      var x = boundingReact.left + boundingReact.width / 2;
      var y = boundingReact.top + boundingReact.height / 2;
      tagElement.style.left = x + "px";
      tagElement.style.top = y + "px";
    }
  }
};


export const  alignContainerByElement = () => {
    var tagElement:any = document.querySelector('div[style*="background-color: white"]');
    if(tagElement !== null) {
      var selection: any = window.getSelection();
      tagElement.style = {};
      tagElement.style.backgroundColor = "white";
      tagElement.style.position = "fixed";
      tagElement.style.zIndex = "100";
      tagElement.style.height = "190px";
      tagElement.style.width = "30%";
      tagElement.style.top = "35%";
      tagElement.style.bottom = "0";
      tagElement.style.overflow = "scroll";
      tagElement.style.border = "1px solid";
      tagElement.style.left = "0";
      tagElement.style.right = "0";
      tagElement.style.margin = "auto";
      tagElement.style.padding = "10px";
      tagElement.style.borderRadius = "10px";



    }

  
}