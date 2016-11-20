/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "https://localhost:3001/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";
	var recordButton = document.getElementById("record");
	var stopButton = document.getElementById("stop");
	var timer = document.getElementById("timer");
	var log = function () {
	    var args = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        args[_i - 0] = arguments[_i];
	    }
	    console.log.apply(console, args);
	    chrome.runtime.sendMessage({ action: "log", args: args });
	};
	var padZero = function (str, n) {
	    if (n === void 0) { n = 2; }
	    if (str.length >= n) {
	        return str;
	    }
	    else {
	        return (new Array(n - str.length + 1)).join("0") + str;
	    }
	};
	var formatDuration = function (duration) {
	    var hours, minutes, seconds;
	    seconds = duration % 60;
	    minutes = ((duration - seconds) % (60 * 60)) / 60;
	    hours = (duration - (minutes * 60) - seconds) / (60 * 60);
	    return padZero(hours.toString()) + ":" + padZero(minutes.toString()) + ":" + padZero(seconds.toString());
	};
	var timerIntervalHandler = null;
	var startTimer = function (startTimestamp) {
	    var currentDuration = 0;
	    timerIntervalHandler = setInterval(function () {
	        currentDuration = Math.floor((Date.now() - startTimestamp) / 1000);
	        timer.innerHTML = formatDuration(currentDuration);
	    }, 100);
	};
	var stopTimer = function () {
	    clearInterval(timerIntervalHandler);
	    timer.innerHTML = "Start recording";
	};
	var renderState = function (state, response) {
	    if (state === "init") {
	        recordButton.classList.remove("hidden");
	        stopButton.classList.add("hidden");
	        stopTimer();
	    }
	    else if (state === "recording") {
	        recordButton.classList.add("hidden");
	        stopButton.classList.remove("hidden");
	        startTimer(response.startTimestamp);
	    }
	    else {
	        throw new Error("Invalid state \"" + state + "\"");
	    }
	};
	chrome.runtime.sendMessage({ action: "state" }, function (response) {
	    renderState(response.state, response);
	});
	recordButton.addEventListener("click", function () {
	    chrome.tabs.executeScript(null, { file: "get_window_size.js" }, function (params) {
	        var size = JSON.parse(params[0]);
	        chrome.runtime.sendMessage({ action: "record", size: size }, function (response) {
	            renderState(response.state, response);
	        });
	    });
	});
	stopButton.addEventListener("click", function () {
	    chrome.runtime.sendMessage({ action: "stopAndSave" }, function (response) {
	        renderState(response.state, response);
	        if (response.videoData) {
	            var a = document.createElement("a");
	            a.href = response.videoData;
	            a.download = "video.webm";
	            a.style.display = "none";
	            document.body.appendChild(a);
	            a.click();
	            a.href = "";
	        }
	    });
	});


/***/ }
/******/ ]);