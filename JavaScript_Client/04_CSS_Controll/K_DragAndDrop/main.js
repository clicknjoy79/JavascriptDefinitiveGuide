/**
 * https://www.w3schools.com/html/html5_draganddrop.asp
 */

/**
 * DnD API는 상당히 복잡하고, 브라우저 간에 완벽하게 호환되진 않는다.
 * 이 예제는 기본적으로는 오류가 없지만 각 브라우저가 조금씩 다르고, 그들만의 버그도 있다.
 * 아러한 브라우저별 작업 환경을 고려하지는 않았다.
 */
whenReady(function() {
    // 모든 <ul class="dnd">를 찾고, 해당하는 요소 각각에 대해 dnd() 함수를 호출한다.
    var lists = document.getElementsByTagName("ul");
    var regexp = /\bdnd\b/;
    for (var i = 0; i < lists.length; i++) {
        if (regexp.test(lists[i].className)) dnd(lists[i]);
    }

    // list 요소에 드래그 앤 드롭 이벤트 핸들러를 추가한다.
    function dnd(list) {
        var original_class = list.className;         // 원래 CSS class를 저장함.
        var entered = 0;                            // 드래그 객체가 드나드는 것을 추적한다.

        // 이 핸들러는 드래그 소스가 list 요소에 처음 진입할 때 호출된다.
        // list 요소가 다룰 수 있는 형태의 테이터를 담고 있는지 확인하여,
        // 드롭이 일어났음을 알리기 위해 false를 반환한다.
        // 그리고 사용자가 알 수 있도록 드롭 타깃에 변화를 준다.
        list.ondragenter = function(e) {
            e = e || window.event;              // 표준과 IE 이벤트 객체
            var from = e.relatedTarget;         // 빠져나오는 요소
            console.log(e.target);
            console.log(e.relatedTarget && e.relatedTarget.id);
            // dragenter와 dragleave 이벤트는 버블링되므로,
            // <li> 요소를 가진 <ul> 같은 경우는 타깃 요소를 변화를 주었다가 되돌리기가 까다롭다.
            // 브라우저에는 이를 추적할 수 있는 relatedTarget 프로퍼티가 있지만,
            // 여기서는 타깃 객체에 들어오고 나가는 횟수를 센다.

            // 바깥쪽에서 list에 진입하거나 이 함수가 처음 실행되었을 때 처리할 내용들
            entered++;
            console.log("dragenter enter: " + entered);
            if ((from && !ischild(from, list)) || entered === 1) {
                // DnD와 관련된 모든 정보는 dataTransfer 객체 안에 있다.
                var dt = e.dataTransfer;

                // dt.types 객체는 드래그 중인 데이터의 타입이나 형태를 나열한다.
                // HTML5 표준에서는 types 객체에 contains() 메서드가 정의되어 있다.
                // 몇몇 브라우저에는 indexOf 메서드가 있는 배열이지만,
                // IE8 이하에는 존재하지 않는다.
                var types = dt.types;               // 안에 들어있는 데이터 형태.

                // 데이터 타입이 없거나 일반 텍스트 형태라면,
                // 드롭된 목록을 사용자가 알 수 있도록 list를 강조하고
                // 브라우저도 알도록 false를 반환한다.
                if (!types ||                       // IE
                    (types.contains && types.contains("text/plain")) ||     // HTML5
                    (types.indexOf && types.indexOf("text/plain") !== -1)) {        // Webkit
                    list.className = original_class + " droppable";
                    return false;
                }
                // 알 수 없는 데이터 타입이라면, 드롭이 일어나지 않아야 한다.
                return;        // 이벤트 취소 없이 핸들러 종료. ==> 이벤트를 취소해야 dragover로 넘어간다.
            }
            return false;       // 처음 발생하는 게 아니라면 false를 반환해서 다음 단계로 넘어간다.
        };

        // 이 핸들러는 마우스가 list 위를 이동할 때 발생한다.
        // 이 핸들러는 반드시 정의해야 하며, false를 반환하거나 드래그를 취소할 수 있다.
        list.ondragover = function(e) { return false; };

        // 이 핸들러는 드래그 중인 객체가 list나 list의 자식 요소 밖으로 이동할 때 발생한다.
        // list 자식 요소 간 이동이 아니라 진짜로 list를 떠나면, 강조한 것을 되돌린다.
        list.ondragleave = function(e) {
            e = e || window.event;
            var to = e.relatedTarget;           // 떠나는 요소

            // list 밖으로 빠져나가거나, 들어오고 나간 횟수가 어긋나면 강조한 것을 되돌린다.
            entered--;
            console.log("dragleave enter: " + entered);
            if ((to && !ischild(to, list)) || entered <= 0) {
                list.className = original_class;
                entered = 0;
            }
            return false;
        };

        // 이 핸들러는 실제로 드롭했을 때 발생한다.
        // 드래그해 온 텍스트로 새로운 <li> 태그를 만든다.
        list.ondrop = function(e) {
            e = e || window.event;      // 이벤트 객체

            // 드롭된 데이터를 일반 문자열로 가져온다.
            // "Text"는 "text/plain"의 별칭이다.
            // IE가 "text/plain"을 지원하지 않으므로 "Text"를 사용한다.
            var dt = e.dataTransfer;            // dataTrasfer 객체
            var text = dt.getData("Text");
            // 드롭된 객체를 일반 텍스트로 가져온다.
            // 텍스트를 얻었으면 list 맨 끝에 새 <li>를 생성한다.
            console.log("drop enter: " + entered);
            if (text) {
                var item = document.createElement("li");            // 새로운 <li> 생성
                item.draggable = true;                      // 드래그 가능하도록 속성 추가
                item.appendChild(document.createTextNode(text));        // 텍스트 추가
                list.appendChild(item);
                // list의 원래 CSS 스타일로 되돌리고 entered 값을 초기화 한다.
                list.className = original_class;
                entered = 0;
                console.log("entered became 0");
                return false;
            }
        };

        // list의 모든 항목에 draggable 설정을 한다.
        var items = list.getElementsByTagName("li");
        for (var i = 0; i < items.length; i++)
            items[i].draggable = true;

        // list 항목의 드래그에 대해 이벤트 핸들러를 등록한다.
        // list에 핸들러를 지정하고 list의 항목에서 이벤트가 버블링되게 처리한 것을 주목하라.

        // 이 핸들러는 드래그가 list 안에서 시작될 때 발생한다.
        list.ondragstart = function(e) {
            var e = e || window.event;
            var target = e.target || e.srcElement;
            // <li>가 아닌 요소에서 버블링이 일어나면 무시한다.
            if (target.tagName !== "LI") return false;
            // 이 핸들러의 핵심인 dataTransfer 객체를 가져온다
            var dt = e.dataTransfer;
            // 드래그할 때 담을 데이터와 형태를 지정한다.
            dt.setData("Text", target.innerText || target.textContent);
            dt.effectAllowed = "copyMove";
            console.log("dragstart enter: " + entered);
        };

        // 이 핸들러는 무사히 드롭된 후에 발생한다.
        list.ondragend = function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement;

            // 전송 방법이 "move" 이면 list 항목을 삭제한다.
            // IE8에서는 앞의 ondrop 핸들러에서 명확히 지정하지 않는 한 "none"이다.
            // IE에서 이 값을 "move"로 강제하면 다른 브라우저에서 사용자가
            // "move"와 "copy" 중 선택할 수 있는 기회를 잃는다.
            if (e.dataTransfer.dropEffect === "move")
                target.parentNode.removeChild(target);
            console.log("dragend entered: " + entered);
        };

        // ondragenter와 ondragleave에서 사용하는 유틸리티 함수
        // a가 b의 자식 객체이면 true를 반환
        function ischild(a, b) {
            for (; a; a = a.parentNode) if (a === b) return true;
            return false;
        }

    }
});





































































