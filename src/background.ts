import Size from "./types/Size";

declare var MediaRecorder: any;

const captureOptions = function (size: Size) {
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

const recorderOptions = {
    mimeType: "video/webm" // only webm is supported
};

let stream: MediaStream = null;
let startTimestamp: number = null;
let recorder = null;
let chunks: Array<Blob> = null;

const helper = {
    state: function () {
        if (recorder && recorder.state === "recording") {
            return "recording";
        } else {
            return "init";
        }
    },
    record: function (size: Size): boolean {
        console.log("Starting stream");
        startTimestamp = Date.now();
        chrome.tabCapture.capture(captureOptions(size), function (s: MediaStream) {
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
    stop: function (): boolean {
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
    save: function (): boolean|string {
        if (chunks.length === 0) {
            console.log("No data saved yet");
            return false;
        }

        let blob = new Blob(chunks, {type: chunks[0].type});

        return URL.createObjectURL(blob);
    }
};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    let response = {
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

                let videoData = helper.save();
                if (videoData) {
                    response.state = "init";
                    response.videoData = videoData;

                    sendResponse(response);
                }
            }

            sendResponse(response);
            break;

        default:
            throw new Error(`Action ${message.action} doesn't exist`);
    }
});