import Size from "./types/Size";

let size: Size = {
    width: window.innerWidth,
    height: window.innerHeight
};

chrome.runtime.sendMessage({action: "setResolution", size: size});
