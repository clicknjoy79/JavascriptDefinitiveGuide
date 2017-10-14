/**
 * 뷰포트: 브라우저에서 실제로 문서가 표시되는 영역. 메뉴나 툴바 등은 제외된다.
 * 문서 좌표와 뷰포트 좌포(창 좌표)를 구분해야 한다.
 * 문서 좌표: 스크롤을 해도 변하지 않는다.
 * 뷰포트 좌표: 스크롤에 영향을 받는다.
 * 어떤 요소가 Y축으로 문서 좌표 200 픽셀에 있고 사용자가 75픽셀을
 * 스크롤해서 내려싿면 이 요소의 뷰포트 좌표는 Y좌표 125 픽셀이다.
 * 뷰포트 X좌표가 400인데 이미 사용자가 X좌표 200을 스크롤한 상태라면
 * 이 요소의 문서좌표는 X좌표 600 픽셀이다.
 *
 * 아래의 예제는 창의 스크롤바 위치를 가져오는 함수이다.
 */
function getScrollOffsets(w) {
    w = w || window;
    // IE8 이하 버전의 IE를 제외한 모든 브라우저에서 동작.
    if (w.pageXOffset != null) return {x: w.pageXOffset, y: w.pageYOffset};

    // 표준 모드 IE(혹은 다른 브라우저)에서 동작.
    var d = w.document;
    if (document.compatMode == "CSS1Compat")    // 표준 모드인 경우
        return {x: d.documentElement.scollLeft, y: d.documentElement.scrollTop };

    // 쿼크모드의 브라우저에서 동작.
    return {x: d.body.scrollLeft, y: d.body.scrollTop};
}
for (var i = 0; i < 100; i++) {
    for (var j = 0; j < 100; j++) {
        document.write(j);
    }
    document.write("<br/>");
}
console.log(getScrollOffsets());

/**
 * 창의 뷰포트 가져오기.
 * 브라우저 설정에서 원래 크기(100%) 대로 해야 제대로 동작한다.
 */
function getViewportSize(w) {
    var w = w || window;
    // IE8 이하 버전을 제외한 모든 브라우저에서 동작.
    if (w.innerWidth != null) return {x: w.innerWidth, y: w.outerHeight };
    // 표준 모드에서 동작.
    var d = window.document;
    if (document.compatMode == "CSS1Compat")
        return {x: d.documentElement.clientWidth, y: d.documentElement.clientHegiht };
    // 쿼크 모드의 브라우저에서 동작.
    return {x: d.body.clientWidth, h: d.body.clientHeight };
}
alert(getViewportSize().x);
alert(getViewportSize().y);



































