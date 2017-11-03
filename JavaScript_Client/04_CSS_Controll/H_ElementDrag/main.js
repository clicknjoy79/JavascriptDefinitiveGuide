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
/**
 * 절대 위치가 지정된 HTML요소를 드래그하기.
 *
 * 이 모듈은 onmousedown 이벤트 핸들러에서 호출하도록 설계된 drag() 함수를 정의한다.
 * 뒤따라오는 mousemove 이벤트가 지정한 요소를 움직이고, mouseup 이벤트가 드래그를 종료한다.
 * 이 모듈은 표준 이벤트 모델과 IE 이벤트 모듈 모두를 구현하였다.
 *
 * parameter:
 *  elementToDrag: mousedown 이벤트가 일어난 요소 혹은 이 요소를 담고 있는 요소.
 *                 절대 위치가 지정되어 있어야 한다.
 *                 사용자가 드래그할 때 style.left와 style.top값이 변경된다.
 *  event: mousedown 이벤트의 이벤트 객체.
 */
function drag(elementToDrag, event) {
    // 최초의 마우스 좌표를 문서 좌표계로 변환
    var scroll = getScrollOffsets();
    var startX = event.clientX + scroll.x;
    var startY = event.clientY + scroll.y;

    // 드래그 할 요소의 문서 좌표상의 원래 좌표
    // elementToDrag가 절대 위치이므로,
    // 이 요소의 offsetParent는 문서의 body요소라고 가정한다.
    var origX = elementToDrag.offsetLeft;
    var origY = elementToDrag.offsetTop;

    // mousedown 이벤트가 발생한 위치와 이 요소의 상단 좌측 모서리 간의 거리를 계산한다.
    // 마우스를 움직이면 이 거리를 유지하며 요소를 움직인다.
    var deltaX = startX - origX;
    var deltaY = startY - origY;
    // mousedown 이벤트 이후에 뒤따라 발생하는 mousemove와 mouseup 이벤트에 반응할
    // 이벤트 핸들러를 등록한다.
    if (document.addEventListener) {        // 표준 이벤트 모델
        // 문서에 캡처링 이벤트 핸들러를 등록한다.
        document.addEventListener("mousemove", moveHandler, true);
        document.addEventListener("mouseup", upHandler, true);
    } else if (document.attachEvent) {      // IE 5 부터 IE 8까지를 위한 IE 이벤트 모델
        // 이벤트를 잡아내기 위해 해당 요소에서 setCapture()를 호출해서 이벤트를 캡처링한다.
        elementToDrag.setCapture();
        elementToDrag.attachEvent("onmousemove", moveHandler);
        elementToDrag.attachEvent("onmouseup", upHandler);
        // mouseup 이벤트로 마우스 캡처링이 유실된 것을 처리한다.
        elementToDrag.attachEvent("onlosecapture", upHandler);
    }

    // 이벤트가 처리됐다. 전파를 막는다.
    if (event.stopPropagation) event.stopPropagation();     // 표준 모델
    else event.cancelBubble = true;                         // IE 모델

    // 모든 기본 동작을 막는다.
    if (event.preventDefault) event.preventDefault();
    else event.returnValue = false;

    /**
     * 요소가 드래그 되고 있을 때 mousemove 이벤트를 캡처링하는 핸들러.
     * 요소의 이동을 담당.
     */
    function moveHandler(e) {
        if (!e) e = window.event;       // IE 이벤트 모델

        // 현재 마우스 위치로 요소를 이동시킨다. 이동 위치는 스크롤바 위치와
        // 최초 마우스 클릭 위치의 차이를 보정한 위치다.
        var scroll = getScrollOffsets();
        elementToDrag.style.left = (e.clientX + scroll.x - deltaX) + "px";
        elementToDrag.style.top = (e.clientY + scroll.y - deltaY) + "px";

        console.log(elementToDrag.style.left);
        console.log(elementToDrag.style.top);

        // 그리고 이벤트 전파를 막는다.
        if (e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;
    }

    /**
     * 드래그의 끝에 발생하는 최종 이벤트인 mouseup 을 캡처링하는 핸들러다.
     */
    function upHandler(e) {
        if (!e) e = window.event;       // IE 이벤트 모델

        // 캡처링 이벤트 핸들러 등록을 취소한다.
        if (document.removeEventListener) {
            document.removeEventListener("mouseup", upHandler, true);
            document.removeEventListener("mousemove", moveHandler, true);
        } else if (document.detachEvent) {
            elementToDrag.detachEvent("onlosecapture", upHandler);
            elementToDrag.detachEvent("onmouseup", upHandler);
            elementToDrag.detachEvent("onmousemove", moveHandler);
            elementToDrag.releaseCapture();
        }

        // 이벤트 전파를 막는다.
        if (e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;
    }
}


















































