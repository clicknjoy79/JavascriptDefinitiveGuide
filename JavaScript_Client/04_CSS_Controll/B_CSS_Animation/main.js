/**
 * 요소의 position 속성을 relative로 바꾸고 좌우로 흔든다.
 *
 * @param elem          : 엘리먼트 객체 또는 id를 사용할 수 있다.
 * @param oncomplete    : 콜백 함수이며 애니메이션이 종료되면 호출된다(엘리먼트를 파라미터로 받는다.)
 * @param distance      : 흔들리는 거리를 지정한다. 기본값은 5픽셀이다.
 * @param time          : 흔들리는 기간을 지정한다. 기본값은 500밀리초이다.
 */
function shake(elem, oncomplete, distance, time) {
    // 파라미터를 처리한다.
    if (typeof elem === "string") elem = document.getElementById(elem);
    if (!time) time = 500;
    if (!distance) distance = 5;

    var originalStyle = elem.style.cssText;     // 본래의 스타일 값을 저장한다.
    elem.style.position = "relative";           // 포지션을 relative로 지정한다.
    var start = (new Date()).getTime();         // 애니메이션 시작 시간을 저장한다.
    animate();                                 // 애니메이션을 시작한다.

    // 함수 animate는 경과한 시간을 확인하고 elem의 위치를 수정한다.
    // 애니메이션이 종료되면 elem을 본래 상태로 복구한다.
    // 즉 elem의 위치를 수정하고 다시 실행할 준비를 한다.
    function animate() {
        var now = (new Date()).getTime();       // 현재 시각을 가져온다.
        var elapsed = now - start;              // 경과한 시간을 알아낸다.
        var fraction = elapsed / time;          // 총 시간 대비 경과한 시간의 비율을 계산한다.

        // Math.sin 값은 -1 ~ 1 이다. 사인 곡선을 확인해보면 알 수 있다. 최대 distance 까지 간다음 거꾸로 -distance 까지 간다.
        if (fraction < 1) {                     // 아직 애니메이션이 종료되지 않았다면
            // 앞 뒤로 두 번 흔들리게 한다.
            var x = distance * Math.sin(fraction * 4 * Math.PI);        // 720도 회전한다. 즉 0->1->0->-1->0 이게 2번 반복한다.
            elem.style.left = x + "px";

            // 25밀리초 혹은 더 적은 시간이 지난 후 다시 실행한다.
            // 대략 1초당 40프레임의 부드러운 애니메이션을 보여주도록 한다. 시간이 끝나가면서 좀 더 부드럽게 보여준다.(프레임 증가)
            setTimeout(animate, Math.min(25, time - elapsed));
        } else {                                        // 애니메이션이 종료되면
            elem.style.cssText = originalStyle;         // 본래 스타일로 복구한다.
            if (oncomplete) oncomplete(elem);           // 콜백 함수를 실행한다.
        }
    }
}

/**
 * time 밀리초 동안 요소 elem을 완전 불투명 상태에서 완전 투명 상태로 변화시켜서 서서히 사라지게 한다.
 * 이 함수가 실행되는 시점에는 elem이 완전 불투명 상태라고 가정한다.
 * 애니메이션이 종료될 때 콜백 함수가 실행되며 time 기본값은 500 밀리초이다.
 * @param elem          : 요소
 * @param oncomplete    : 애니메이션 종료시 호출될 콜백 함수.
 * @param time          : 경과 시간
 */
function fadeOut(elem, oncomplete, time) {
    if (typeof elem === "string") elem = document.getElementById(elem);
    if (!time) time = 500;

    // 간단한 easing 함수로 Math.sqrt를 사용하여
    // 처음에는 빠르게 사라지다가 나중에는 천천히 사라지게 한다.
    var ease = Math.sqrt;       // 간편하면서 좋은 선택인듯...

    var start = (new Date()).getTime();     // 애니메이션 시작 시각.
    animate();                              // 애니메이션 시작.

    function animate() {
        var elapsed = (new Date()).getTime() - start;           // 경과한 시간.
        var fraction = elapsed / time;                          // 경과한 비율. 예> 1이 되면 완료..
        if (fraction < 1) {                     // 아직 애니메이션이 종료하지 않은 경우
            var opacity = 1 - ease(fraction);   // 요소의 투명도를 계산한다. 처음에는 빠르게 투명해지다가 차츰 느리게 투명해짐. 수학 그래프를 생각해 볼 것.
            elem.style.opacity = String(opacity);       // 요소의 투명도를 지정.
            setTimeout(animate, Math.min(25, time - elapsed));
        } else {            // 애니메이션이 종료되면
            elem.style.opacity = "0";
            if (oncomplete) oncomplete(elem);
        }
    }
}




































































