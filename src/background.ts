class Greeter {
    constructor(private greeting: string, private color: string = "red") {}

    greet() {
        console.log(`%c ${this.greeting}`, `color: ${this.color}`);
    }
}

let greeter = new Greeter("Background", "#ee0000");

greeter.greet();


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

chrome.runtime.onMessage.addListener( function (message, sender, sendResponse) {
    console.log("Starting stream");
    if (message.action === "captureStart") {
        chrome.tabCapture.capture(captureOptions, function (stream: MediaStream) {
            console.log("Stream started", stream);

            setTimeout(() => {
                console.log("Stopping stream");
                stream.getVideoTracks()[0].stop();
            }, 2500);
        });
    }
});