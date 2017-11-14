/**
 * 예제가 그다지 바람직하지 않다. 일독하고 빠르게 넘어갈 것.
 */
function forceToUpperCase(element) {
    if (typeof element === "string") element = document.getElementById(element);
    element.oninput = upcase;
    element.onpropertychange = upcaseOnPropertyChange;

    // 손쉬운 경우: input 이벤트용 핸들러
    function upcase(event) { this.value = this.value.toUpperCase(); console.log("easy case") }

    // 어려운 경우: propertychange 이벤트 핸들러
    function upcaseOnPropertyChange(event) {
        var e = event || window.event;
        console.log("difficult case");
        // value 프로퍼티가 바뀌었으면
        if (e.propertyName === "value") {
            // 반복실행을 막기 위해 onpropertychange 이벤트 핸들러를 제거한다.
            this.onpropertychange = null;
            // value를 모두 대문자로 변경한다.
            this.value = this.value.toUpperCase();
            // 원래대로 propertychange 이벤트 핸들러를 복구한다.
            this.onpropertychange = upcaseOnPropertyChange;
        }
    }
}

forceToUpperCase("test");