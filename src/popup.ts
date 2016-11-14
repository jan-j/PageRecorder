const recordButton = document.getElementById("record");
const stopButton = document.getElementById("stop");

const log = function (...args: any[]) {
    chrome.runtime.sendMessage({action: "log", args: args});
};

const renderState = function (state) {
    if (state === "init") {
        recordButton.classList.remove("hidden");
        stopButton.classList.add("hidden");
    } else if (state === "recording") {
        recordButton.classList.add("hidden");
        stopButton.classList.remove("hidden");
    } else {
        throw new Error(`Invalid state "${state}"`);
    }
};

chrome.runtime.sendMessage({action: "state"}, function (response) {
    renderState(response.state);
});

recordButton.addEventListener("click", function () {
    chrome.runtime.sendMessage({action: "record"}, function (response) {
        renderState(response.state);
    });
});

stopButton.addEventListener("click", function () {
    chrome.runtime.sendMessage({action: "stopAndSave"}, function (response) {
        renderState(response.state);
    });
});
