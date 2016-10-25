/// <reference path="../node_modules/@types/chrome/index.d.ts"/>

chrome.runtime.sendMessage({action: "captureStart"}, function (response) {
    // calback
});