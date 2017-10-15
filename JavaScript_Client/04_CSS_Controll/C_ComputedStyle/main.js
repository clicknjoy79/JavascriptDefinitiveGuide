// Computed Style은 요소에 적용되어 있는 모든 css 속성을 의미한다.
// window.getComputedStyle(e, null)을 하면 CSSStyleDeclaration 객체를 가져오는 데 이 객체는 읽기 전용이다.
// 항상 기대하는 결과를 제공하지 않는다. font-family나 top, left 값으 경우 auto를 가져옴..사용이 제한적이다.
// 학습상의 목적이며 실제 사용하지는 말자.
/**
 * 계산된 스타일을 가져온 다음 인라인 스타일로 설정하기
 * @param e             : 요소
 * @param factor        : 콜백 함수
 */
function scale(e, factor) {
    // 계산된 스타일을 통해 텍스트의 현재 크기를 가져온다.
    var size = parseInt(window.getComputedStyle(e, "").fontSize);
    // 인라인 스타일을 사용해 크기를 조정한다.
    e.style.fontSize = factor * size + "px";
}

/**
 * 전달인자 factor를 사용해 요소 e 의 배경색을 변경한다.
 * factor가 1보다 크면 밝아지고 작으면 어두워 진다.
 * @param e
 * @param factor
 */
function scaleColor(e, factor) {
    // 현재 배경색을 가져온다.
    var color = window.getComputedStyle(e, "").backgroundColor;
    var components = color.match(/[\d.]+/g);    //rgba의 구성요소인 빨간색, 녹색, 파란색(r,g,b)과 투명도(a)로 분류한다.

    for (var i = 0; i < 3; i++) {           // a는 제외하고 r g b만 순회한다.
        var x = Number(components[i] * factor);
        x = Math.round(Math.min(Math.max(x, 0), 255));

        components[i] = String(x);
    }
    if (components.length === 3)            // rgb() 색상을 사용할 때
        e.style.backgroundColor = "rgb(" + components.join() + ")";
    else                                    // rgba() 색상을 사용할 때
        e.style.backgroundColor = "rgba(" + components.join() + ")";
}

window.onload = function() {
    var para = document.getElementsByTagName("p")[0];
    setTimeout(scale, 2000, para, 2);
    setTimeout(scaleColor, 4000, para, 2);

}
















































