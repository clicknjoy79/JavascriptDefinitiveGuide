function getElementPosition(e) {
    var x = 0, y = 0;
    while (e != null) {
        x += e.offsetLeft;
        y += e.offsetTop;
        e = e.offsetParent;
    }
    return { x: x, y: y};
}

// 아래의 함수는 요소의 뷰포트 좌표를 구한다.
// 위의 함수에서 스크롤된 거리들을 모두 제거하면 된다.
function getElementViewPosistion(elt) {
    // 요소의 절대적인 문서좌표를 구함.
    var x = 0, y = 0;
    for (var e = elt; e != null; e = e.offsetParent) {
        x += e.offsetLeft;
        y += e.offsetTop;
    }

    // 모든 조상요소의 스크롤 오프셋을 뺀다.
    for (var e = elt.parentNode; e != null && e.nodeType === 1; e = e.parentNode) {
        x -= e.scrollLeft;
        y -= e.scrollTop;
    }

    return {x: x, y: y};
}

// 스크롤바를 움직여 가며 아래를 콘솔창에 실행해보자.
getElementPosition(document.images[0]);
getElementViewPosistion(document.images[0]);


// 결론적으로 교재에서는 제이쿼리를 이용해 요소의 위치를 계산하는 것을 추천한다.

document.getElementById("btn1").addEventListener("click", function() {
    document.write("aaa");
}, false);















