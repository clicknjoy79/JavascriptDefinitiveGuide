/**
 * 자바스크립트에서 보안 상 주의해야 할 부분
 * 1. eval(), Function()은 임의의 코드 문자열을 실행할 수 있으므로 사용에 주의해야 한다.
 * 2. with 구문은 코드의 정적 분석을 힘들게 한다.
 * 3. this 키워드는 전역 객체에 접근하게 하므로 문제가 있다. 너무 강력하다.
 * 4. document 객체 역시 페이지에 대한 강력한 메서드를 제공하므로 자유로운 접근은 문제가 있다.
 * 5. 강력한 권한을 주는 프로퍼티나 메서드들 역시 문제가 있다.(함수 내의 arguments.caller, arguments.callee 등등)
 *    사실 call(), apply() 메서드도 강력하다.
 */
function* fibonacci() {
    let x = 0, y = 1;
    while (true) {
        yield y;
        [x, y] = [y, x + y];
    }
}
var gen = fibonacci();
for (let i = 0; i < 10; i++) console.log(gen.next().value);     // 1 1 2 3 5 8 13 21 34 55

// yield 값을 변경
function* counter(initial) {
    let nextValue = initial;
    while (true) {
        try {
            let increment = yield nextValue;       // yield 값을 받는 변수가 정의되어 있는 경우에는 외부에서 전달한 값을 받겠다는 의미이다.
            if (increment) {                        // 전달 값이 있는 경우
                nextValue += increment;
            }
            else nextValue++;
        } catch(e) {
            if (e === "reset")
                nextValue = initial;
            else throw e;
        }
    }
}
let c = counter(10);
console.log(c.next().value);            // 10
console.log(c.next().value);            // 11
console.log(c.next().value);            // 12
console.log(c.next(2).value);           // 14  :  외부에서 2를 전달함...
console.log(c.throw("reset").value);    // 10























































