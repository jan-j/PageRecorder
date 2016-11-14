declare var MediaRecorder: any;

const captureOptions = {
    video: true,
    audio: false,
    videoConstraints: {
        mandatory: {
            minWidth: 1920,
            minHeight: 1080,
            maxWidth: 1920,
            maxHeight: 1080
        }
    }
};
const recorderOptions = {
    mimeType: "video/webm" // only webm is supported
};

let stream: MediaStream = null;
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
    record: function (): boolean {
        console.log("Starting stream");
        chrome.tabCapture.capture(captureOptions, function (s: MediaStream) {
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
        console.log("Stream stopped");

        return true;
    },
    save: function (): boolean {
        if (chunks.length === 0) {
            console.log("No data saved yet");
            return false;
        }

        let blob = new Blob(chunks, {type: chunks[0].type});

        chrome.downloads.download({
                url: URL.createObjectURL(blob),
                filename: "video.webm",
                saveAs: true
            },
            function (downloadId) {
                console.log(`Download with id = ${downloadId} started`);
            }
        );

        return true;
    }
};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    let response = {
        state: "init"
    };

    switch (message.action) {
        case "log":
            console.log.apply(console, message.args);
            break;

        case "state":
            response.state = helper.state();

            sendResponse(response);
            break;

        case "record":
            if (helper.record()) {
                response.state = "recording";
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
                response.state = "saved";
            }

            sendResponse(response);
            break;

        case "stopAndSave":
            if (helper.stop()) {
                response.state = "stopped";

                if (helper.save()) {
                    response.state = "init";

                    sendResponse(response);
                }
            }

            sendResponse(response);
            break;

        default:
            throw new Error(`Action ${message.action} doesn't exist`);
    }
});