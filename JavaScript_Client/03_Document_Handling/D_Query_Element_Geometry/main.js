/**
 * getBoundingClientRect(): 요소의 좌측 상단과 우측 하단의 좌표를 반환(margin은 제외한다). 사각 형들을 결합.
 * getClientRects(): 사각형들의 배열 반환.
 */
var rect1 = document.getElementById("img1").getBoundingClientRect();
var rect2 = document.getElementById("img2").getBoundingClientRect();
var rect3 = document.getElementById("img3").getBoundingClientRect();
var rect4 = document.getElementById("img4").getBoundingClientRect();
console.log(rect1);
console.log(rect2);
console.log(rect3);
console.log(rect4);

var ital = document.getElementById("ital");
console.log(ital.getBoundingClientRect());
// 이탤릭 부분은 3개의 사각형이 결합된 것으로 보인다.
console.log(ital.getClientRects());


// scrollTo() 메서드: X, Y 좌표를 넘기면 해당 위치가 뷰포트의 좌측 상단이 된다.
/**
 * 다음은 브라우저를 스크롤해서 문서의 가장 아래쪽을 보여준다.
 */
// 문서와 뷰포트의 높이를 가져온다.
    // 교재에는 예시가 잘못되어 있는데 offsetHeight는 visible content + scrollbar + padding + border 까지를 의미한다.
var documentHeight = document.documentElement.scrollHeight;     // 원래 문서의 높이를 가져온다.
var viewportHeight = window.innerHeight;            // 뷰포트의 높이를 가져온다.
// 그리고 스크롤되어서 뷰포트의 마지막 페이지를 보여준다.
// 이렇게 구성한 이유는 브라우저 때문이다. 브라우저는 페이지 스크롤의 위치를 기억하고 있다.
// 브라우저는 load 이벤트를 실행한 이후에 기억하고 있는 스크롤 위치로 이동시킨다. 타이밍 상의 이슈가 있다.
window.onload = function() {
    setTimeout(function() { window.scrollTo(0, documentHeight - viewportHeight)}, 5000);
    setTimeout(function() { document.getElementById("img3").scrollIntoView(); }, 1000);
    // window.scrollTo(0 ,documentHeight - viewportHeight);
}

// scrollBy() 는 스크롤 오프셋에 전달된 인자를 더한다.
// 200 밀리초마다 5픽셀씩 아래로 스크롤 된다.
// setInterval(function() { window.scrollBy(0, 5)}, 200);

// scrollIntoView(): 인자로 전달한 요소로 이동한다. 이것 역시 위와 동일한 이슈로 로딩시 스크롤 되었다 롤백된다.
// document.getElementById("img3").scrollIntoView();


// offsetHeight ; offsetWidth ==> 요소의 패딩, 보더를 포함하나 마진은 제외하며 스크롤바는 포함된다. 눈에 보이는 영역만 포함된다.


// 모든 HTML 요소에는 X, Y 좌표를 반환하는 offsetLeft, offsetTop 프로퍼티가 존재한다.
// 이런데 이 좌표는 절대적인 것이 아니라 부모 요소(offsetParent가 존재하는 경우)를 기준으로 하는 상대적인 위치여서
// 문서 좌표를 제대로 표현하기 위해서는 아래와 같이 반복문을 순회해야 한다.
// 아래 함수는 요소의 절대적인 문서 좌표를 구한다.
function getElementPosition(e) {
    var x = 0, y = 0;
    while (e != null) {
        x += e.offsetLeft;
        y += e.offsetTop;
        e = e.offsetParent;
    }
    return { x: x, y: y};
}
console.log(getElementPosition(document.getElementById("img3")));
console.log(getElementPosition(document.getElementById("img4")));

// clientWidth, clientHeight ==> 스크롤바 제외, 패딩까지만 포함한다.


























































































