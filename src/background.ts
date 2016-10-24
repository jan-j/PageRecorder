class Greeter {
    constructor(private greeting: string, private color: string = "red") { }
    greet() {
        console.log(`%c ${this.greeting}`, `color: ${this.color}`);
    }
}

let greeter = new Greeter("Background hot reload111", "#ee0000");

greeter.greet();

// chrome.tabCapture.capture({}, function () {
//
// });