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

let stream: MediaStream = null;
let recorder = null;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.action) {
        case "log":
            console.log.apply(console, message.args);

            break;
        case "captureStart":
            console.log("Starting stream");
            chrome.tabCapture.capture(captureOptions, function (s: MediaStream) {
                stream = s;
                recorder = new MediaRecorder(stream);
                recorder.ondataavailable = function (e) {
                    sendResponse(URL.createObjectURL(e.data));
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
        default:
            throw new Error(`Action ${message.action} doesn't exist`);
    }
});