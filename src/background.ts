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

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.action) {
        case "log":
            console.log.apply(console, message.args);

            break;

        case "captureStart":
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

            break;

        case "captureStop":
            if (!stream) {
                console.log("Stream not started");
                break;
            }

            console.log("Stopping stream");
            stream.getVideoTracks()[0].stop();
            recorder.stop();
            console.log("Stream stopped");

            break;

        case "save":
            if (chunks.length === 0) {
                console.log("No data saved yet");
                break;
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

            break;

        default:
            throw new Error(`Action ${message.action} doesn't exist`);
    }
});