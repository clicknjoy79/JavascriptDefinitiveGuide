/**
 *  Strict Mode와 표준 모드 차이점
 *  1. with 구문 사용불가
 *  2. var 없이 변수 선언 불가
 *  3. 메서드 아닌 일반 함수의 this는 undefined를 의미
 *  4. eval에 전달되는 스크립트는 자체적인 유효범위를 가지고 있다.==> eval을 호출한 함수에 지역변수 선언 불가능. 수정 불가능
 *  5. 위의 경우에 유효범위는 eval이 종료되면 사라진다.
 *  6. 함수내의 arguments 객체와 실제 parameter가 별개로 구분되어 서로 영향을 미치지 않는다.
 *  7. delete 다음에 var로 선언한 변수, 함수 등이 오면 SyntaxError가 발생한다. 표준모드에서는 false 반환.
 *  8. 객체에 동일한 property가 중복 선언되면 문법에러가 발생한다.
 *  9. 8진수 리터럴을 사용할 수 없다.
 *  10. arguments.caller, arguments.callee 를 사용할 수 없다.
 */


// Object.create()
function inherit(p) {
    if (p === null) throw TypeError();
    if (Object.create) {
        return Object.create(p);
    }

    var t = typeof p;

    if  (t !== 'object' && t !== 'function') throw TypeError();

    function f() {};
    f.prototype = p;
    return new f();
}

function library_function(obj) {
    obj.__proto__.x = "난 변해 버렸어!!!";        // 여기서 수정됨
}

var o = { x: "난 변하지 않을까?" };

library_function(inherit(o));   // 객체 o 가 실수로 수정되는 것을 막는다로 설명 되어 있으나 상황에 따라서는 수정될 수도 있다.

console.log(o);



















































