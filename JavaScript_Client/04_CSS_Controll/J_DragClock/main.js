whenReady(function() {
    var clock = document.getElementById("clock");       // 시계 요소
    var icon = new Image();
    icon.src = "clock-icon.png";

    // 시계를 출력한다.
    function displayTime() {
        var now = new Date();           // 현재 시각
        var hrs = now.getHours(), mins = now.getMinutes();
        if (mins < 10) mins = "0" + mins;
        clock.innerHTML = hrs + ":" + mins;     // 현재 시각을 출력한다.
        setTimeout(displayTime, 60000);         // 1분 후에 재실행
    }
    displayTime();

    // 시계를 드래그 가능하게 만든다.
    // <span draggable="true">.. 처럼 HTML 속성으로 할 수도 있다.
    clock.draggable = true;

    // 드래그 이벤트 핸들러
    clock.ondragstart = function(event) {
        var event = event || window.event;      // IE 호환을 위해.

        // dataTransfer 프로퍼티가 드래그 앤 드롭 API의 핵심이다.
        var dt = event.dataTransfer;

        // 드래그 할 데이터를 지정한다.
        // 타임스탬프 문자열을 반환하는 함수로 Date() 생성자가 사용됐다.
        dt.setData("Text", Date() + "\n");

        // 드래그할 타임스탬프를 나타내는 아이콘을 지정한다(지원한다면).
        // 이 코드가 없으면 브라우저는 드래그하고 있는
        // 시계 텍스트의 이미지를 사용할 것이다.
        if (dt.setDragImage) dt.setDragImage(icon, 0, 0);
    };
});



























































