var context = this;

function evalInContext(js, context) {
    return function () {
        return eval(js);
    }.call(context);
}

function reqListener() {
    evalInContext(this.responseText, context);
}

var request = new XMLHttpRequest();
request.onload = reqListener;
request.open('get', 'https://localhost:3001/build/content_script.js', true);
request.send();
