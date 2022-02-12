var xhttpSTexts = new XMLHttpRequest();
xhttpSTexts.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var SText = JSON.parse(this.response).result;
        console.log(SText)
    }
};
xhttpSTexts.open("POST", "/api");
xhttpSTexts.setRequestHeader("Content-Type", "application/json");
xhttpSTexts.send(JSON.stringify({ "jsonrpc": "2.0", "method": "exists_img", "id": 1, "params": [] }));