// window.getSelection() 은 페이지에서 선택한 영역을 반환한다.(Selection 객체 반환): HTML5 표준 메서드....
// 익스에서는 document.selection을 사용한다.
// 테스트 : baseball을 선택한 후 링크를 누른다.

var link = document.createElement("a");
link.href = "javascript: var q; " +
    "if (window.getSelection) q = window.getSelection().toString(); " +
    "else if (document.selection) q = document.selection.createRange().text; " +
    "void window.open('http://en.wikipedia.org/wiki/' + q);";
link.appendChild(document.createTextNode("Search in wikipedia"));
document.body.insertBefore(link, document.body.firstChild);


window.onload = function() {
    var editor = document.getElementById("editor");
    editor.contentDocument.designMode = "on";
}

function createLink(elt) {
    var url = prompt("Enter link destination");
    if (url) document.execCommand("createlink", false, url);
    console.log(elt);
    var editor = document.getElementsByTagName('div')[0];
    editor.contentEditable = "false"
}
