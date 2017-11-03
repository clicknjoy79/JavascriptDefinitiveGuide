var whenReady = (function() {       // 이 함수는 whenReady()를 반환한다.
    var funcs = [];                 // 이벤트가 일어났을 때 실행할 함수 배열
    var ready = false;              // handler가 실핸되면 true 로 바꾼다.
    // 문서가 준비되면 호출되는 이벤트 핸들러
    function handler(e) {
        console.log(e.type);        // 발생한 이벤트를 확인
        // 이미 한 번 실행했으면 그냥 반환
        if (ready) return;

        // readystatechange 이벤트 상태 값이 'complete'가 아니라면 아직 준비되지 않았다.
        if (e.type === "readystatechange" && document.readyState !== 'complete')
            return;

        // 등록된 모든 함수를 실행한다.
        // funcs.length를 확인하여 하나씩 함수를 실행한다.
        for (var i = 0; i < funcs.length; i++)
            funcs[i].call(document);
        // ready에 true를 등록하고 함수를 비운다.
        ready = true;
        funcs = null;
    }

    // 고려해야 할 이벤트에 handler를 등록한다.
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", handler, false);
        document.addEventListener("readystatechange", handler, false);
        window.addEventListener("load", handler, false);
    } else {
        document.attachEvent("onreadystatechange", handler);
        window.attachEvent("onload", handler);
    }
    // whenReady() 함수를 반환한다.
    return function whenReady(f) {
        if (ready) f.call(document);        // ready가 true면 전달된 함수를 실행한다.
        else funcs.push(f);                 // 아니면, 실행할 함수 목록에 추가한다.
    };
})();