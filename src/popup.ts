const recordButton = document.getElementById("record");
const stopButton = document.getElementById("stop");
const saveButton = document.getElementById("save");

const log = function (...args: any[]) {
    chrome.runtime.sendMessage({ action: "log", args: args});
};

recordButton.addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "captureStart" });
});

stopButton.addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "captureStop" });
});

saveButton.addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "save" });
});
