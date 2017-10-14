// 요소의 innerHTML을 지정하기 위한 간단한 '스트리밍 API'를 정의한다.
function ElementStream(elt) {
    if (typeof elt === "string") elt = document.getElementById(elt);
    this.elt = elt;
    this.buffer = "";
}

// 모든 전달 인자들을 버퍼에 추가한다.
ElementStream.prototype.write = function() {
    this.buffer += Array.prototype.join.call(arguments, "");
};

ElementStream.prototype.writeln = function() {
    this.buffer += Array.prototype.join.call(arguments, "") + "<br/>";
};

// 버퍼에 있는 내용을 요소에 저장하고 버퍼를 비운다.
ElementStream.prototype.close = function() {
    this.elt.innerHTML = this.buffer;
    this.buffer = "";
};

var elemStream = new ElementStream(document.getElementById("elm"));
elemStream.writeln("Hello World");
elemStream.write("Hello World!!!");
elemStream.close();



