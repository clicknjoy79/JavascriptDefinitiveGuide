// 함수 정의하기
// 함수 표현식은 이름을 포함할 수 있는데, 이러한 이름은 재귀 호출에 유용하게 사용된다.
var f = function fact(x) { if (x <= 1) return 1; else return x * fact(x - 1); };
console.log(f(5));          // 120


// Arguments: 유사배열
// arguments.caller: 현재 함수를 호출한 함수, 호출 스택에 접근할 수 있게 해준다.
// arguments.callee: 현재 실행되고 있는 함수, 이름없는 함수의 재귀 호출에 쓰인다.
// 둘 다 엄격모드에서는 사용이 불가능하다.
var factorial = function(x) {
    if (x <= 1) return 1;
    else return x * arguments.callee(x - 1);
}
console.log(factorial(5));     // 120

/***************************************************************************
 * 아래의 함수는 임의의 개수의 인자를 받지만 배열 형식의 인자는 재귀적으로 처리한다 *
 * 함수 형식의 인자도 숫자로 변환하려고 시도한다.                               *
 ***************************************************************************/
function flexisum(a) {
    var total = 0;
    for (var i = 0; i < arguments.length; i++) {
        var element = arguments[i], n;
        if (element === null && element === undefined) continue;        // null과 undefined 인자는 무시한다.
        if (Array.isArray(element))                                     // 만약 인자가 배열이라면
            n = flexisum.apply(null, element);                          // 재귀적인 방법으로 합계를 계산한다.
        else if (typeof element === "function")                         // 만약 인자가 함수라면....
            n = Number(element());                                      // 함수를 호출하고 숫자로 변환한다.
        else
            n = Number(element);                                        // 그도 아니라면 숫자로 변환 시도

        if (isNaN(n))                                                   // 숫자로 변환할 수 없다면 error를 발생시킨다.
            throw Error("flexisum(): can't convert " + element + " to number");
        total += n;                                                     // 정상적인 숫자라면 total에 n을 더한다.
    }
    return total;
}
console.log(flexisum(1, function() { return 4; }, [1, 2, 3, [4, 5, [6, 7], 8], 9], 10));        // 60
// console.log(flexisum(1, function() { return "hello"; }, [1, 2, 3, [4, 5, [6, 7], 8], 9], 10));        // 에러 발생


// 자신만의 함수 프로퍼티 정의하기
// 함수가 여러 번 호출되어도 그 값이 유지되어야 하는 정적 변수가 필요한 경우에 전역 변수로 선언해서 난잡하게 만들지 말고
// 함수 내부에 프로퍼티로 만드는 것이 낫다.

/**
 * 다음은 호출될 때마다 유일한 값을 반환하는 에제이다
 */
// 함수 객체의 counter 프로퍼티를 초기화 한다.
// uniqueIntegr 함수 정의는 hoisting 되기 때문에
// 실제 함수 정의문 앞에서 이렇게 할당을 할 수 있다.
uniqueIntegr.counter = 0;

// 이 함수는 호출될 때마다 매번 다른 정수를 반환한다.
// 다음 반환값을 기억하기 위해 자신의 프로퍼티를 사용한다.
function uniqueIntegr() {
    return uniqueIntegr.counter++;
}
console.log(uniqueIntegr());        // 0
console.log(uniqueIntegr());        // 1
console.log(uniqueIntegr());        // 2
console.log(uniqueIntegr());        // 3


// 계산한 결과를 캐시하도록 자신의 프로퍼티를 사용하는 fact() 함수를 살펴보자
function fact(n) {
    if (isFinite(n) && n > 0 && n === Math.round(n)) {      // 유한한 양의 정수만 받음...
        if (!(n in fact))                            // 만약 캐시한 결과가 없다면
            fact[n] = n * fact(n - 1);               // 팩토리얼을 계산하고 계산 값을 캐시...
        return fact[n];                              // 캐시 결과를 반환한다.
    } else {
        return NaN;                                 // 잘못된 값이 들어오면 NaN을 반환한다.
    }
}
fact[1] = 1;                // 캐시를 기본 경우(1)에 대한 값으로 초기화한다. break 구분으로 동작한다.
console.log(fact(4));       // 24
console.log(fact[4], fact[3], fact[2], fact[1]);            // 24  6  2  1

// 네임 스페이스로서의 함수
// 자바스크립트는 함수 단위의 유효범위를 갖는다.(블록 단위가 아님)
// 예를 들어 자바스크립트 모듈이 있으며 계산의 중간 결과 값을 저장하는 변수가 정의되어 있다고 가정하자
// 만약 여러개의 프로그램(웹의 경우에는 여러 웹 페이지)에서 해당 모듈을 가져와서 사용하는 경우
// 프로그램에서 사용하는 변수와 모듈에서 정의된 변수 이름이 같다면 충돌이 일어날 수 있다.
// 이 문제를 해결할 수 있는 좋은 해결책은 모듈의 코드를 함수 내부에 넣고 함수를 실행하는 것이다.
// 관례적으로 다음과 같은 방법을 이용한다.
(function() {
    /* 모듈의 코드 */
})();       // 함수 리터럴을 끝내고 바로 호출함.

// extend() 함수를 재정의 해보자
// extend 함수의 두번째 인자 부터 이후에 오는 객체를 첫번째 인자에 확장한다.
// 여기서 IE 버그에 대응해야 한다. IE 는 프로토타입에 열거할 수 없는 프로퍼티(ex> toString)가 있는데,
// 이와 동일한 이름의 프로퍼티가 정의된 경우 해당 프로퍼티를 열거할 수 없게된다.
// {toString: null} ==> toString 프로퍼티는 열거되지 않는다. 현재는 해결된 것 같다. 학습목적으로만 이해하자....
var extend = (function(){
    // 패치하기 전에 먼저 버그가 존재하는 지 검사한다.
    for (var p in {toString: null}) {
        // 여기에 이르면 for/in 루프가 제대로 동작한 것이고 toString 프로퍼티를 읽은 것이다.
        // 따라서 단순한 extend() 버전을 반환하면 된다.
        return function extend(o) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var prop in source)
                    o[prop] = source[prop];
            }
            return o;
        };
    }

    // 여기로 왔다는 것은 버그가 존재한다는 것이다.(toString 프로퍼티를 열거하지 못함)
    // 따라서 Object.prototype 의 열거할 수 없는 프로퍼티와 동일한 이름으로
    // 정의된 프로퍼티가 있는지 테스트 해서 있다면 직접 넣어줘야 한다.
    return function patched_extend(o) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var prop in source)    // 열거한 모든 프라퍼티들을 복사한다.
                o[prop] = source[prop];

            for (var j = 0; j < protoprops.length; j++) {
                prop = protoprops[j];
                if (source.hasOwnProperty(prop))        // 버그 때문에 열거되지 않은 프로퍼티들을 복사한다.
                    o[prop] = source[prop];
            }
        }
        return o;
    };

    // 이것은 검사해야 하는 특별한 프로퍼티의 목록이다.
    var protoprops = ["toString", "valueOf", "constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable",
                        "toLocaleString"];
})();

console.log(extend({},
    {x: 1, y: 2, z: 3, valueOf: function() {return "valueOf"; }},
    {x: 1, y: 2, z: 5, toString: function() { return "toString"; }}));
//  {x: 1, y: 2, z: 5, valueOf: f, toString: f}

// 클로저: 이전의 학습내용으로 충분하다.....
// 이전의 uniqueIntegr를 클로저를 이용해서 정의해보자
var uniqueIntegr = (function(){
    var counter = 0;
    return function() { return counter++; };
})();

console.log(uniqueIntegr());            // 0
console.log(uniqueIntegr());            // 1
console.log(uniqueIntegr());            // 2

// 다른 예
function counter() {
    var n = 0;
    return {
        count: function() { return n++; },
        reset: function() { n = 0; }
    };
}

var c = counter(), d = counter();       // 서로 다른 Scope Object가 만들어진다.
c.count();
d.count();
c.reset();
console.log(c.count());     // 0
console.log(d.count());     // 1

function counter1(n) {
    return {
        // getter 메서드 프로퍼티는 n 변수를 반환하고 증가시킨다.
        get count() { return n++; },
        set count(m) {
            if (m >= n) n = m;
            else throw Error("count는 오직 더 큰 값으로만 설정될 수 있습니다.");
        }
    }
}

var c = counter1(1000);
console.log(c.count);       // 1000
console.log(c.count);       // 1001
c.count = 2000;
console.log(c.count);       // 2000
// c.count = 2000;     // count는 오직 더 큰 값으로만 설정될 수 있습니다.


// 다른 예
// 두 개의 중첩 함수는 동일한 스코프 객체를 공유한다.
function addPrivateProperty(o, name, predicate) {
    var value;

    // getter 메서드는 단순히 value를 반환한다.
    o["get" + name] = function() { return value; }
    o["set" + name] = function (v) {
        if (predicate && !(predicate(v)))      // predicate 함수가 전달되고 조건을 통과하지 못한다면
            throw Error("set" + name + ": 유효하지 않은 값 " + v);
        else
            value = v;
    }
}

// 다음 코드는 addPrivateProperty를 사용하는 방법을 보여준다.
// 객체 o에는 실제로 메서드 이외에 프로퍼티가 따로 존재하지는 않는다. 그런데 마치 존재하는 것처럼 다룰 수 있다.
var o = {};
// 프로퍼티 접근 메서드 getName, setName을 추가한다.
addPrivateProperty(o, "Name", function(x) { return typeof x === "string"; });   // predicate은 문자열인지를 판별한다.

o.setName("Frank");
console.log(o.getName());       // Frank
// o.setName(0);                   // setName: 유효하지 않은 값 0


// 다른 예
function constfunc(v) { return function() { return v; }; }

// 함수를 저장할 배열
var funcs = [];
for (var i = 0; i < 10; i++) {
    funcs[i] = constfunc(i);
}
for (var k = 0; k < funcs.length; k++) {
    console.log(funcs[k]());            // 0 ~ 9
}

// 클로저를 사용할 때 흔히 하는 실수
function constfunc1() {
    var funcs = [];

    for (var i = 0; i < 10; i++) {
        funcs[i] = function() { return i; };        // 하나의 스코프 객체를 10개의 내부 함수가 공유한다. ==> i 역시 공유됨.
    }
    return funcs;
}

var funcs = constfunc1();
console.log(funcs[5]());        // 10















































