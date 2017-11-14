whenReady(function(){
    // 모든 <input> 요소를 찾는다.
    var inputtags = document.getElementsByTagName("input");
    // 찾은 input요소를 순회한다.
    for (var i = 0; i < inputtags.length; i++) {
        var tag = inputtags[i];
        // 텍스트 필드가 아니거나 data-allowed-chars 속성이 없으면 무시한다.
        if (tag.type !== "text" || !tag.getAttribute("data-allowed-chars"))
            continue;
        // input 태그에 이벤트 핸들러 함수를 등록한다.
        // keypress 는 모든 환경에서 작동이 보장되는 오래된 이벤트다.
        // textInput(대문자 주의)는 2010년부터 사파리와 크롬에서 지원했다.
        // textinput(소문자 주의)는 DOM Level 3 이벤트 초안에서 정의된 이벤트다.
        if (tag.addEventListener) {
            // keypress는 영문, 숫자에서만 이벤트가 발생하고 한글 입력시에는 이벤트가 발생하지 않는다.
            tag.addEventListener("keypress", filter, false);
            tag.addEventListener("textInput", filter, false);
            tag.addEventListener("textinput", filter, false);
        } else {
            // textinput은 addEventListener()가 없는 IE 구 버전을 지원하지 않는다.
            tag.attachEvent("onkeypress", filter);
        }
    }

    // 사용자 입력을 필터링하는 keypress와 textInput 핸들러다.
    function filter(event) {
        // 이벤트 객체를 가져오고 타깃 객체를 지정한다.
        var e = event || window.event;              // 표준 혹은 IE
        var target = e.target || e.srcElement;      // 표준 혹은 IE
        var text = null;                // 입력된 텍스트

        // 입력된 문자나 문자열을 가져온다.
        if (e.type === "textinput" || e.type === "textInput") { text = e.data; console.log("cccc"); }
        else {          // keypress 이벤트인 경우
            // 파이어 폭스는 화면에 출력되는 키 입력 이벤트에 대해 charCode 프로퍼티를 사용한다.
            var code = e.charCode || e.keyCode;
            // 키 입력이 펑션 키라면, 필터링하지 않는다.
            if (code < 32 ||                // ASCII 관리 문자
                e.charCode == 0 ||          // 파이어폭스용 펑션 키 혹은
                e.ctrlKey || e.altKey) {     // 옵션 키가 눌렸으면
                console.log("aaaa");
                return;                     // 이 이벤트를 필터링하지 않는다.
            }
            // 문자 코드를 문자열로 변환한다.
            var text = String.fromCharCode(code);
            console.log(code);
            console.log("bbbb");
            console.log(text);
        }

        // input 요소에서 필요한 정보를 가져온다.
        var allowed = target.getAttribute("data-allowed-chars");        // 허용한 문자열
        var messageid = target.getAttribute("data-messageid");           // 메세지 요소 ID
        if (messageid) // 메세지 요소 id가 있다면 해당 요소를 가져온다.
            var messageElement = document.getElementById(messageid);

        // 입력 텍스트의 문자를 순회한다.
        for (var i = 0; i < text.length; i++) {
            var c = text.charAt(i);
            if (allowed.indexOf(c) == -1) {     // 허용하지 않은 문자열에 속하는가?
                // 메세지 요소를 출력한다.
                if (messageElement) messageElement.style.visibility = "visible";

                // 기본 동작을 취소하고 텍스트를 입력하지 않는다.
                if (e.preventDefault) e.preventDefault();
                if (e.returnValue) e.returnValue = false;
                return false;
            }
        }

        // 모든 문자가 적합하면, 메세지를 숨긴다.
        if (messageElement) messageElement.style.visibility = "hidden";
    }
});































































