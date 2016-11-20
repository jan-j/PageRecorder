import Size from "./types/Size";

const recordButton = document.getElementById("record");
const stopButton = document.getElementById("stop");
const timer = document.getElementById("timer");

const log = function (...args: any[]): void {
    console.log.apply(console, args);
    chrome.runtime.sendMessage({action: "log", args: args});
};

const padZero = function (str: string, n = 2): string {
    if (str.length >= n) {
        return str;
    } else {
        return (new Array(n - str.length + 1)).join("0") + str;
    }
};

const formatDuration = function (duration: number): string {
    let hours: number, minutes: number, seconds: number;

    seconds = duration % 60;
    minutes = ((duration - seconds) % (60 * 60)) / 60;
    hours = (duration - (minutes * 60) - seconds) / (60 * 60);

    return padZero(hours.toString()) + ":" + padZero(minutes.toString()) + ":" + padZero(seconds.toString());
};

let timerIntervalHandler: number = null;

const startTimer = function (startTimestamp: number): void {
    let currentDuration = 0;
    timerIntervalHandler = setInterval(() => {
        currentDuration = Math.floor((Date.now() - startTimestamp) / 1000);
        timer.innerHTML = formatDuration(currentDuration);
    }, 100);
};

const stopTimer = function (): void {
    clearInterval(timerIntervalHandler);
    timer.innerHTML = "Start recording";
};

const renderState = function (state, response): void {
    if (state === "init") {
        recordButton.classList.remove("hidden");
        stopButton.classList.add("hidden");
        stopTimer();
    } else if (state === "recording") {
        recordButton.classList.add("hidden");
        stopButton.classList.remove("hidden");
        startTimer(response.startTimestamp);
    } else {
        throw new Error(`Invalid state "${state}"`);
    }
};

chrome.runtime.sendMessage({action: "state"}, function (response) {
    renderState(response.state, response);
});

recordButton.addEventListener("click", function () {
    chrome.tabs.executeScript(null, {file: "get_window_size.js"}, function (params) {
        let size: Size = JSON.parse(params[0]);
        chrome.runtime.sendMessage({action: "record", size: size}, function (response) {
            renderState(response.state, response);
        });
    });
});

stopButton.addEventListener("click", function () {
    chrome.runtime.sendMessage({action: "stopAndSave"}, function (response) {
        renderState(response.state, response);

        if (response.videoData) {
            let a = document.createElement("a");
            a.href = response.videoData;
            a.download = "video.webm";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            a.href = "";
        }
    });
});
