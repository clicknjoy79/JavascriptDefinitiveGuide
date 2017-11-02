function addStyle(styles) {
    // 먼저, 새 스타일시트를 생성한다.
    var styleElt, styleSheet;
    if (document.createStyleSheet) {            // IE 전용 API 존재하면, 해당 API를 사용한다.
        styleSheet = document.createStyleSheet();
    } else {
        var head = document.getElementsByTagName("head")[0];
        styleElt = document.createElement("style");         // 새 스타일 요소를 만든다.
        head.appendChild(styleElt);                         // 헤드에 삽입한다.
        // 새롭게 추가된 스타일 시트는 document.styleSheets의 마지막 요소일 것이다.
        styleSheet = document.styleSheets[document.styleSheets.length - 1];
    }

    // 해당 스타일시트에 스타일을 추가한다.
    if (typeof styles === "string") {
        // 전달인자가 스타일 텍스트일 때
        if (styleElt) styleElt.innerText = styles;
        else styleSheet.cssText = styles;           // IE용 API를 사용한다.
    } else {
        // 전달인자가 추가할 css 규칙 객체일 때
        var i = 0;
        for (selector in styles) {
            if (styleSheet.insertRule) {
                var rule = selector + " {" + styles[selector] + "}";
                styleSheet.insertRule(rule, i++);
            } else {
                styleSheet.addRule(selector, styles[selector], i++);
            }
        }
    }
}

addStyle("h1 { border: solid red 1px; }");
















































