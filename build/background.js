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
	var captureOptions = function (size) {
	    return {
	        video: true,
	        audio: false,
	        videoConstraints: {
	            mandatory: {
	                minWidth: size.width,
	                minHeight: size.height,
	                maxWidth: size.width,
	                maxHeight: size.height
	            }
	        }
	    };
	};
	var recorderOptions = {
	    mimeType: "video/webm" // only webm is supported
	};
	var stream = null;
	var startTimestamp = null;
	var recorder = null;
	var chunks = null;
	var helper = {
	    state: function () {
	        if (recorder && recorder.state === "recording") {
	            return "recording";
	        }
	        else {
	            return "init";
	        }
	    },
	    record: function (size) {
	        console.log("Starting stream");
	        startTimestamp = Date.now();
	        chrome.tabCapture.capture(captureOptions(size), function (s) {
	            stream = s;
	            chunks = [];
	            recorder = new MediaRecorder(stream, recorderOptions);
	            recorder.ondataavailable = function (e) {
	                chunks.push(e.data);
	            };
	            recorder.start();
	            console.log("Stream started");
	        });
	        return true;
	    },
	    stop: function () {
	        if (!stream) {
	            console.log("Stream not started");
	            return false;
	        }
	        console.log("Stopping stream");
	        stream.getVideoTracks()[0].stop();
	        recorder.stop();
	        recorder = null;
	        stream = null;
	        startTimestamp = null;
	        console.log("Stream stopped");
	        return true;
	    },
	    save: function () {
	        if (chunks.length === 0) {
	            console.log("No data saved yet");
	            return false;
	        }
	        var blob = new Blob(chunks, { type: chunks[0].type });
	        return URL.createObjectURL(blob);
	    }
	};
	chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	    var response = {
	        state: "init",
	        startTimestamp: null,
	        videoData: null
	    };
	    switch (message.action) {
	        case "log":
	            console.log.apply(console, message.args);
	            break;
	        case "state":
	            response.state = helper.state();
	            if (response.state === "recording") {
	                response.startTimestamp = startTimestamp;
	            }
	            sendResponse(response);
	            break;
	        case "record":
	            if (helper.record(message.size)) {
	                response.state = "recording";
	                response.startTimestamp = startTimestamp;
	            }
	            sendResponse(response);
	            break;
	        case "stop":
	            if (helper.stop()) {
	                response.state = "stopped";
	            }
	            sendResponse(response);
	            break;
	        case "save":
	            if (helper.stop()) {
	                response.state = "init";
	            }
	            sendResponse(response);
	            break;
	        case "stopAndSave":
	            if (helper.stop()) {
	                response.state = "stopped";
	                var videoData = helper.save();
	                if (videoData) {
	                    response.state = "init";
	                    response.videoData = videoData;
	                    sendResponse(response);
	                }
	            }
	            sendResponse(response);
	            break;
	        default:
	            throw new Error("Action " + message.action + " doesn't exist");
	    }
	});


/***/ }
/******/ ]);