whenReady(function() {
    enclose(document.getElementById("content"), 400, 200, -200, -300);
});

// enclose 함수는 최소 50 * 50 으로 폭과 높이를 지정한 프레임이나
// 뷰포트 내용으로 쓸 요소를 감싼다.
// 선택적 전달인자인 contextX와 contextY는 프레임을 기준으로 내용의
// 초기 오프셋을 명시할 때 쓰인다. (x와 y는 0보다 작아야 한다.)
// 프레임에는 mousewheel 이벤트 핸들러가 있다. 이 핸들러를 이용해서 사용자는
// 프레임 안의 요소를 스크롤할 수 있고, 프레임을 늘리거나 줄일 수 있다.

function enclose(content, framewidth, frameheight, contentX, contentY) {
    // 이 함수의 전달인자들은 단순한 초기 값이 아니다.
    // 이 전달인자들은 현재 상태를 유지하면서
    // 마우스 휠 핸드러에 의해서 사용되고 수정된다.
    framewidth = Math.max(framewidth, 50);          // 프레임 폭은 최소 50이상
    frameheight = Math.max(frameheight, 50);
    contentX = Math.min(contentX, 0) || 0;          // 컨텐트의 x 좌표는 0이하.
    contentY = Math.min(contentY, 0) || 0;

    // 프레임으로 쓸 요소를 생성하고 CSS의 클래스 명과 스타일을 지정한다.
    var frame = document.createElement("div");
    frame.className = "enclosure";              // 스타일시트에서 이 스타일을 정의할 수 있다.
    frame.style.width = framewidth + "px";      // 프레임 크기 지정.
    frame.style.height = frameheight + "px";
    frame.style.overflow = "hidden";            // 스크롤바는 없고, 프레임보다 큰 내용은 가린다.
    frame.style.boxSizing = "border-box";       // 프레임의 크기 변경 계산을 단순화한다.
    frame.style.webkitBoxSizing = "border-box";
    frame.style.mozBoxSizing = "border-box";

    // 문서에 프레임 요소를 넣고, 프레임 안으로 전달인자의 요소를 이동시킨다.
    content.parentNode.insertBefore(frame, content);
    frame.appendChild(content);

    // 프레임을 기준으로 요소의 상대적 위치를 잡는다.
    content.style.position = "relative";
    content.style.left = contentX + "px";
    content.style.top = contentY + "px";

    // 몇몇 브라우저의 쿼크 모드에서도 작동되어야 한다.
    var isMacWebkit = (navigator.userAgent.indexOf("Macintosh") !== -1 &&
        navigator.userAgent.indexOf("WebKit") !== -1);
    var isFirefox = (navigator.userAgent.indexOf("Gecko") !== -1);

    // 마우스 휠 이벤트 핸들러를 등록한다.
    frame.onwheel = wheelHandler;           // 미래의 브라우저
    frame.onmousewheel = wheelHandler;      // 최신 브라우저들
    if (isFirefox)                          // 파이어 폭스 전용
        frame.addEventListener("DOMMouseScroll", wheelHandler, false);

    function wheelHandler(event) {
        var e = event || window.event;          // 표준 이벤트 객체와 IE 전용 객체
        console.log(e.deltaX);
        console.log(e.deltaY);

        // 마우스를 한 칸 돌리면 30픽셀이 되도록 delta값을 조절한다.
        var deltaX = e.deltaX * -1  ||          // wheel 이벤트
                                  0;            // 프로퍼티가 정의되지 않은 경우
        var deltaY = e.deltaY * -1  ||          // wheel 이벤트
                      e.detail* -10 ||          // 파이어폭스 DOMMouseScroll 이벤트
                                  0;            // 관련 프로퍼티가 모두 정의되지 않은 경우.
        // 대다수 브라우저는 마우스 휠 한 칸당 120 delta인 상태로 이벤트를 한 번 생성한다.
        // 하지만 맥의 마우스 휠은 가속되기도 해서 delta 값은 종종 120의 매수로 커진다.
        // 특히 애플 마우스가 그렇다.
        // 이런 문제를 해결하기 위해서는 브라우저별 테스트를 시행해야 한다.
        if (isMacWebkit) {
            deltaX /= 30;
            deltaY /= 30;
        }

        // 차후에 파이어 폭스에서 mousewheel 이벤트나 wheel 이벤트가 잡힌다면,
        // 더 이상 DOMMouseScroll 은 필요없다.
        if (isFirefox && e.type !== "DOMMouseScroll")
            frame.removeEventListener("DOMMouseScroll", wheelHandler, false);
        // 내용 요소의 현재 크기를 가져온다.
        var contentbox = content.getBoundingClientRect();
        var contentwidth = contentbox.right - contentbox.left;
        var contentheight = contentbox.bottom - contentbox.top;

        if (e.altKey) {         // alt 키를 눌렀다면 프레임 크기를 조정
            if (deltaX) {
                framewidth -= deltaX;                               // 프레임의 폭을
                framewidth = Math.min(framewidth, contentwidth);    // 내용보다는 작게
                framewidth = Math.max(framewidth, 50);              // 50픽셀보다는 크게 한다.
                frame.style.width = framewidth + "px";          // 프레임에 새로운 폭을 적용
            }
            if (deltaY) {
                frameheight -= deltaY;          // 프레임의 높이도 동일하게 처리한다.
                frameheight = Math.min(frameheight, contentheight);
                frameheight = Math.max(frameheight, 50);
                frame.style.height = frameheight + "px";
            }
        } else {            // alt 키를 누르지 않았다면, 프레임 앞의 내용을 돌린다.
            if (deltaX) {
                // 최소 스크롤 값 지정
                var minoffset = Math.min(framewidth - contentwidth, 0);
                // contentX에 deltaX를 넣지만 minoffset보다 작을 수는 없다.
                contentX = Math.max(contentX + deltaX, minoffset);
                contentX = Math.min(contentX, 0);           // 0보다 작아야 한다.
                content.style.left = contentX + "px";       // 새로운 오프셋을 적용.
            }
            if (deltaY) {
                var minoffset = Math.min(frameheight - contentheight, 0);
                contentY = Math.max(contentY + deltaY, minoffset);
                contentY = Math.min(contentY, 0);
                content.style.top = contentY + "px";
            }
        }

        // 이벤트 버블링이 일어나지 않도록 모든 기본 동작을 막는다.
        // 이제 브라우저가 문서를 스크롤하기 위해 마우스 휠 이벤트를 사용할 수 없다.
        // 다행히도 wheel 이벤트의 preventDefault()를 호출하면
        // 동일한 마우스 회전에 대한 mousewheel 이벤트 발생도 같이 막힌다.
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    }
}











































































