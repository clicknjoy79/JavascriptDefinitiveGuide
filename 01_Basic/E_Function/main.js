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

// 함수의 length 프로퍼티
/**
 * 이 함수는 arguments.callee를 사용하고,
 * 따라서 엄격모드에서는 작동하지 않는다.
 */
function check(args) {
    var actual = args.length;
    var expected = args.callee.length;

    if (actual !== expected) throw Error("Expected " + expected + " args; got " + actual);
}

function f1(x, y, z) {
    check(arguments);
    return x + y + z;
}
console.log(f1(1, 2, 3));       // 6
// console.log(f1(1, 2));          // Expected 3 args; got 2

// call(), apply() 와 관련한 약간의 부분
// 엄격모드에서 실행되는 경우 첫번째 인자는 호출 함수 내부에서 this로 쓰인다 ==> 마치 메서드 처럼 쓰인다
// 비 엄격 모드에서는 약간 다른데 첫번째 인자로 null, undefined를 넘기면 전역객체로 변경되며
// 원시 값은 이에 상응하는 래퍼 객체로 바뀐다.


// Monkey-patching 방식
/**
 * 객체 o의 메서드 m을, 호출 전후에 로그 메세지를 남기는 버전으로 교체한다.
 * o: 객체, m: 메서드의 이름
 */
function trace(o, m) {
    var original = o[m];    // 원본 메서드를 클로저에 기억한다.

    o[m] = function() {     // 새로운 메서드를 정의한다.
        console.log(new Date(), "Entering: " + m);
        var result = original.apply(this, arguments);       // 원본 메서드를 기억한다.
        console.log(new Date(), "Exiting: " + m);
        return result;
    };
}

var o = {sayHello: function(name) { console.log("Hello " + name); }};
trace(o, "sayHello");
o["sayHello"]("Frank");


// bind(): ECMAScript5 에 추가되었으나 하위 버전에서도 같은 기능을 쉽게 구현할 수 있다.
// 이름에서 알 수 있듯이 함수와 객체를 서로 묶는 역할을 한다.
function f3(y) { return this.x + y; }    // 바인드되어야 하는 함수
var o = { x: 1};                        // 바인드 될 객체.
var g = f3.bind(o);                      // g(x)를 호출하면 o.f3(x)가 호출된다.
console.log(g(2));      // 3

// 이런식의 바인딩은 다음과 같은 코드를 통해서도 구현할 수 있다.

// o의 메서드로서 f를 호출하는 함수를 반환한다. 인자 또한 모두 전달된다.
function bind(f, o) {
    if (f.bind) return f.bind(o);       // bind 메서드가 있으면 사용한다.
    else return function() {            // 없으면 o를 대상으로 f를 호출하는 함수를 반환한다.
        return f.apply(o, arguments);
    };
}

// bind() 메서드를 이용해 파셜 애플리케이션(Partial Application)을 구현: Currying
var sum = function(x, y) { return x + y; };
// sum과 비슷한 새 함수를 생성하지만, this 값은 null로 바인딩 되고
// 첫 번째 인자는 1로 바인딩 된다. 새로운 함수는 단지 하나의 인자만을 요구한다.
var succ = sum.bind(null, 1);       // x => 1로 바인딩 된다.
console.log(succ(2));       // 3

function f2(y ,z) { return this.x + y + z; }
var g = f2.bind({x: 1}, 2);      // this는 {x: 1}로 바인딩되고 y는 2로 바인딩 된다.
console.log(g(3));         // 6


// ECMAScript3 에서의 Function.bind() 메서드
if (!Function.prototype.bind) {
    Function.prototype.bind = function(o /*, args*/) {
        // this와 인자 값을 변수에 저장함으로써 중첩 함수에서 사용할 수 있다.
        var self = this, boundArgs = arguments;

        // bind() 메서드에서 반환 값은 함수이다.
        return function() {                            // 클로저는 self와 boundArgs를 기억한다.
            // 인자 목록을 작성하는데, 첫 번째 이후의 인자부터
            // 나머지 모든 인자를 이 함수에 전달한다.
            var args = [], i;
            for (i = 1; i < boundArgs.length; i++) args.push(boundArgs[i]);     // bind() 호출시 넘어온 2번째 인자부터 저장한다.
            for (i = 0; i < arguments.length; i++) args.push(arguments[i]);     // 넘어온 모든 인자를 저장
            return self.apply(o, args);
        }
    }
}

// bind()로 생성된 함수가 생성자로 사용되는 경우
function ori(y, z) {
    return new String(this.x + y + z);
}
var test = ori.bind({x: "Hello "}, "Mr.");
console.log(test.length);           // 1
console.log(test("Frank"));         // Hello Mr.Frank

// test 대신 원본 ori함수가 생성자로 사용된다. 함수 내부의 this는 무시(바인딩에서 제외)되며 바인딩 된 인자들이 원본 함수에 전달된다.(나머지 인자들은 바인딩이 적용된다)
var aaa = new test("John");
console.log(aaa);       // undefinedMr.John


// Function 생성자
// 생성자는 호출될 때마다 함수 몸체를 parsing 해서 새로운 함수 객체를 생성하므로 비효율적이다(루프 내부, 자주 호출되는 함수 내부)
// 반면에 중첩 함수나 함수 표현식은 루프 안에 있어도 매번 컴파일 하지 않는다.
// 또한 함수 생성자가 생성하는 함수는 항상 최상위 레벨 함수로 컴파일 된다.
// 코드에서 이 생성자를 사용할 일은 없으므로 학습목적으로만 ....
for (var i = 0; i < 3; i++) {
    var funcArr = [];
    funcArr.push(function () { return "hello"; });
}
console.log(funcArr[0] === funcArr[1]);     // false    ==> 매번 파싱하지 않는다는 의미이지 서로 다른 함수가 생성된다.

var scope = "global";
function constructFunction() {
    var scope = "local";
    return new Function("return scope");        // 지역 변수를 포착하지 않는다. 클로저 해당 사항 없음.
}
var func_a = constructFunction();
console.log(func_a());          // global

// map() 과 reduce() 함수의 구현
var map = Array.prototype.map ?
    function(a, f) { return a.map(f); } :       // map 메서드가 존재하면, 그것을 사용하고
    function(a, f) {                            // 존재하지 않으면 별도로 구현한다.
        var result = [];
        for (var i = 0, len = a.length; i < len; i++) {
            if (i in a) result[i] = f.call(null, a[i], i, a);
        }
        return result;
    };


// Array.prototype.reduce = null;              // 새로 정의한 reduce 함수가 쓰이도록 한다.
// console.log(Array.prototype.reduce);        // null

// 함수 f와 초기 값 인자를 사용하여 배열 a를 단일 값으로 만든다.(Reduce)
// 만약 Array.prototype.reduce 가 이미 정의되어 있다면 그것을 사용한다.
var reduce = Array.prototype.reduce ?
    function(a, f, initial) {
        if (arguments.length > 2) {     // 초깃 값이 전달되었다면
            return a.reduce(f, initial);
        } else {                        // 초깃 값이 없는 경우.
            return a.reduce(f);
        }
    } :
    function(a, f, initial) {           // ECMAScript5 명세에 따라 구현.
        var i = 0, len = a.length, accumulator;

        // 지정된 초기 값이나 a 의 첫번째 값으로 시작한다.
        if (arguments.length > 2) accumulator = initial;        // 초깃값을 지정한 경우
        else {      // 초깃값을 지정하지 않은 경우. 배열의 첫번째 원소를 찾는다.(희소배열 까지 고려해서 첫번째로 나타나는 원소를 찾는다.)
            if (len === 0) throw TypeError();
            while (i < len) {
                if (i in a) {
                    accumulator = a[i++];
                    break;
                }
                else i++;
            }
            // 처음 등장하는 원소가 배열의 마지막 인덱스인 경우 or
            // 배열에 원소가 존재하지 않는 경우(희소 배열) 에는 에러가 발생한다.
            if (i === len) throw TypeError();
        }

        // 배열의 나머지 요소에 대해 f를 호출한다.
        while (i < len) {
            if (i in a)
                accumulator = f.call(undefined, accumulator, a[i], i, a);
            i++;
        }

        return accumulator;
    };

// data의 표준 편차를 구해보자
var data = [1, 1, 3, 5, 5];
var sum = function(x, y) { return x + y; };
var square = function(x)  {return x * x; };
var mean = reduce(data, sum) / data.length;
var deviations = map(data, function(x) { return x - mean; });
var stddev = Math.sqrt(reduce(map(deviations, square), sum) / (data.length - 1));
console.log(stddev);                // 2


// reduce 에러 상황을 만들어 보자
var error_data = [,,,3,];       // 처음 등장하는 원소가 마지막 인덱스에 있다
// reduce(error_data, sum);        // main.js:403 Uncaught TypeError at reduce (main.js:403)

var error_data1 = [,,,3,,];     // 에러가 발생하지 않는다.
console.log(reduce(error_data1, sum));      // 3


// 고차 함수: 하나 이상의 함수를 인자로 받고, 새 함수를 반환하는 함수.
/**
 * 이 고차 함수는 자신의 인자를 f에 전달하고,
 * f 의 반환값에 논리적 부정을 계산하는 함수를 반환한다.
 */
function not(f) {
    return function() {         // 새로운 함수를 반환
        var result = f.apply(this, arguments);      // f를 호출한다.(클로저)
        return !result;
    };
}

var even = function(x) {        // 짝수 인지 판별
    return x % 2 === 0;
};

var odd = not(even);            // 홀수 인지 판별
console.log([1, 1, 3, 5, 7].every(odd));        // true

// 다른 예
function mapper(f) {
    return function(a) { return a.map(f); };
}

var increment = function(x) { return x + 1; };
var incrementer = mapper(increment);
console.log(incrementer([1, 2, 3]));        // [2, 3, 4]

// 또 다른 예
// 인자로 두 함수 f와 g를 받아서 f(g())를 계산하는 함수를 반환한다.
function compose(f, g) {
    return function() {
        // f는 하나의 값만 넘기기 때문에 call을 사용하고
        // g는 값 배열을 넘겨야 하기 때문에 apply를 사용한다.
        return f.call(this, g.apply(this, arguments));
    };
}

var square = function(x) { return x * x; };
var sum = function(x, y)  {return x + y; };
var squareOfSum = compose(square, sum);
console.log(squareOfSum(2, 3));         // 25


// 함수의 파셜 애플리케이션(함수 인자들의 쪼개서 넘기는 기법?)
/**
 * 아래의 함수는 유사 배열을 배열로 전환하는 유틸리티 함수이다.
 * @param a : 유사배열
 * @param n : 시작 인덱스
 * @returns {Array.<T>} : 배열 객체
 */
function array(a, n) {
    return Array.prototype.slice.call(a, n || 0);
}

// 이 함수에 전달된 인자는 대상 함수의 인자 목록에 대해 왼쪽으로 전달된다.
/**
 *
 * @param f : 실행하려는 함수
 * @returns {Function}  : f에 모든 인자들을 넘겨 실행한 값을 반환하는 함수.
 */
function partialLeft(f /*, ...*/) {
    var args = arguments;       // 전달된 인자들을 변수에 저장(클로저)
    return function() {
        var a = array(args, 1); // 전달된 인자들을 기억한다. 1번 이후의 인자들로 배열을 만든다.
        a = a.concat(array(arguments));        // 이후, 이 내부 함수로 전달된 인자들을 뒤쪽으로 추가한다.
        return f.apply(this, a);               // 기억하는 f를 호출한다.
    };
}

// 이 함수에 전달되는 인자는 대상 함수의 인자 목록에 대해 오른쪽으로 전달된다.
function partialRight(f /*...*/) {
    var args = arguments;
    return function() {
        var a = array(arguments);
        a = a.concat(array(args, 1));
        return f.apply(this, a);
    };
}

// 이 함수에 전달된 인자는 템플릿으로 사용된다. 인자 목록에서
// 정의되지 않은 (undefined) 값은 내부 함수에 전달된 인자의 값으로 채워진다.
function partial(f /*...*/) {
    var args = arguments;
    return function() {
        var a = array(args, 1);
        var i = 0, j = 0;
        // args에 대해 루프를 돌며, undefined 값을 만나면
        // 내부 함수에 전달된 인자 값으로 채워넣는다.
        for (; i < a.length; i++) {
            if (a[i] === undefined) a[i] = arguments[j++];
        }
        // 이제 남은 내부 인자 값들을 추가한다.
        a = a.concat(array(arguments, j));
        return f.apply(this, a);
    };
}
// 세 인자를 전달하는 함수
var pf = function(x, y, z) { return x * (y - z); };
// 이 세 파셜 애플리케이션이 서로 어떻게 다른지 살펴보라.
console.log(partialLeft(pf, 2)(3, 4));           //  -2:    2 * (3 - 4)
console.log(partialRight(pf, 2)(3, 4));          //   6:    3 * (4 - 2)
console.log(partial(pf, undefined, 2)(3, 4));    //  -6:    3 * (2 - 4)

// 이 파셜 애플리케이션 함수를 사용하면 앞에서 정의한 함수들을 활용해서 흥미로운 함수를 쉽게 정의할 수 있다.
var incrementor = partialLeft(sum, 1);
console.log(incrementor(2));        // 3
var cuberoot = partialRight(Math.pow, 1/3);
console.log(cuberoot(64));          // 4

String.prototype.first = partial(String.prototype.charAt, 0);
console.log("Hello".first());       // H
String.prototype.last = partial(String.prototype.substr, -1, 1);
console.log("ABCDEF".last());       // F

// 파셜 애플리케이션은 고차 함수와 사용할 때 좀 더 흥미롭다.
// 좀 헷갈리지만 어렵진 않음...뇌가 문제...
var not_func = partialLeft(compose, function(x) { return !x; });
var even = function(x) { return x % 2 === 0; };
var odd = not_func(even)
console.log(odd(5));    // true
console.log(odd(6));    // false

var isNumber = not(isNaN);
console.log(isNumber(5));           // true
console.log(isNumber("20390"));     // true

// 평균과 표준 편차를 구하는 방법을 조합과 파셜 애플리케이션을 사용해서
// 진정한 함수형 프로그래밍 스타일로 구현할 수 있다.
var data = [1, 1, 3, 5, 5];
var sum = function(x, y) { return x + y; };
var product = function(x, y) { return x * y; };
var neg = partial(product, -1);
var squareNum = partial(Math.pow, undefined, 2);
var sqrt = partial(Math.pow, undefined, .5);
var reciprocal = partial(Math.pow, undefined, -1);

// 이제 평균과 표준 편차를 계산하자. 모든 함수 호출뿐이며 어떠한 연산자도 사용되지 않았다.
// 이 코드는 마치 리스프 코드처럼 보인다. 즉 연산자 사용없이 함수 호출만으로 계산함..
// 가독성 너무 않좋다.....
var mean = product(reduce(data, sum), reciprocal(data.length));     // 평균을 구함
var stddev = sqrt(product(reduce(map(data, compose(squareNum, partial(sum, neg(mean)))), sum),      // 표준 편차를 구함
                    reciprocal(data.length - 1)));

console.log(mean);              // 3
console.log(stddev);            // 2


// 메모이제이션: 계산 결과를 함수에 저장해 두는 방식
function memoize(f) {
    var cache = {};     // 결과 값을 캐시하는 클로저 상의 객체

    return function() {
        // 캐시키로 사용하기 위해, 인자들을 조합하여 하나의 문자열로 만든다.
        var key = arguments.length + Array.prototype.join.call(arguments, ",");
        if (key in cache) return cache[key];            // 캐시에 키가 존재하면 값을 반환
        else return cache[key] = f.apply(this, arguments);  // 키가 없으면 지정된 함수를 실행해서 키 값을 만든 후 반환.
    };
    // 즉 반환된 함수가 실행되면 f 가 실행된다는 의미이다.
    // 어차피 f를 실행한다는 점은 동일한데 이런 함수를 만드는 이유는
    // 이 함수는 함수의 실행 값을 캐시에 저장해 두고 다음 번에 동일한 시그니처로 호출되면
    // 함수의 실행 없이 캐시에서 저장된 값을 반환해버리기 때문에 메모리 상으로는 불리하나
    // 성능면에서는 유리할 수 있다.
}

// 유클리디안 알고리즘을 사용하여 두 정수의 최대 공약수를 반환한다.
function gcd(a, b) {        // a, b에 대한 형식 검사는 생략함.
    var t;                  // a, b의 값을 바꾸기 위한 임시 변수
    if (a < b) t = b, b = a, a = t;         // b가 a보다 크면 서로 바꿔준다. 즉 a >= b를 보장한다.
    while (b != 0) t = b, b = a % b, a = t;     // 최대 공약수에 대한 유클리드 알고리즘(호제법) : 증명도 확인함...ㅅㅂ
    return a;       // 어쨋든 최대 공약수를 반환한다.
}

var gcdmemo = memoize(gcd);
console.log(gcdmemo(85, 187));            // 17

var factorialMemo = memoize(function(n) { return (n <= 1) ? 1 : n * factorialMemo(n - 1); });
// 조금 복잡하나 분석을 완료하였다....디버거로 따라가면서 확인해보자...
console.log(factorialMemo(5));      // 120   또한 4, 3, 2, 1에 대한 결과도 캐시된다. 재귀적으로 캐쉬
factorialMemo(4);                   // 디버거로 확인해보자....









































































