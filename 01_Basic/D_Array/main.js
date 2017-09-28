// 희소배열(sparse array)
var a1 = new Array(5);       // 길이가 5인 희소배열: 인덱스 위치에 property가 존재하지 않는다.
console.log(a1.length);      // 5
console.log(0 in a1);        // false
console.log(a1[0]);          // undefined

var a2 = [,1,,]                  // 길이가 3인 배열. 배열 리터럴로도 희소배열을 만들 수 있다.(교재의 오류인듯)
console.log(a2.length);     // 3
console.log(0 in a2);       // false
console.log(1 in a2);       // true
console.log(a2[0]);         // undefined

// concat() : 새로운 배열을 만들어 리턴한다.
var a = [1, 2, 3];
console.log(a.concat(4, 5));     // [1, 2, 3, 4, 5]
console.log(a);                  // [1, 2, 3]
console.log(a.concat([4, 5]));   // [1, 2, 3, 4, 5]     배열을 인자로 전달하면 1 depth의 원소를 추가한다.
console.log(a.concat([4, 5], [6, 7]));      // [1, 2, 3, 4, 5, 6, 7]
console.log(a.concat(4, [5, [6, 7]]));      // [1, 2, 3, 4, 5, [6, 7]]

// splice(): 새로운 배열을 만들지 않고 해당 배열을 수정한다.
var a = [1, 2, 3, 4, 5, 6, 7, 8];
a.splice(4);        // [5, 6, 7, 8]을 반환
console.log(a);     // [1, 2, 3, 4]
a.splice(1, 2);     // a는 [1, 4]가 되었다
a.splice(1, 1);     // a는 [1]이됨
console.log(a);     // [1]

var a = [1, 2, 3, 4, 5];
a.splice(2, 0, 'a', 'b');       // 시작 인덱스의 앞에 삽입된다. 주의할 것
console.log(a);     // [1, 2, "a", "b", 3, 4, 5]
a.splice(2, 2, [1, 2], 3);
console.log(a);             // [1, 2, [1, 2], 3, 3, 4, 5]

// toString(): 필요한 경우 원소의 toString() 메서드를 호출한다.
console.log([1, [2, "c"]].toString());      // 1,2,c

// ECMAScript5 배열 메서드
// 아래의 메서드들은 첫번째 인자로 함수를 받는데 함수의 첫번째 인자는 배열의 값, 두번째 인자는 배열의 인덱스, 세번째 인자는 배열 자체이다
// 아래의 메서드들은 두번째 인자를 받을 수도 있는데 이 인자는 첫번째 인자인 함수 내부에서 this 값으로 쓰인다.

// forEach(): 배열을 순회하는 메서드
var data = [1, 2, 3, 4, 5];
// 배열에 속한 모든 원소의 합을 계산한다.
var sum = 0;
data.forEach(function(value) { sum += value;});
console.log(sum);       // 15

// 각 원소의 값을 증가시킨다.
data.forEach(function(v, i, a) { a[i]++; });
console.log(data);      // [2, 3, 4, 5, 6]

// 희소배열에서 빈 원소 제거하기
var a = [,2,,];
var a1 = a.filter(function () { console.log(arguments[0]); return true; });   // 원소가 없는 경우에는 함수가 실행되지 않는다.
console.log(a1);        // [2]


// 빈 원소 제거 및 null, undefined 제거하기
var a = [,2,null,undefined,3,];
a = a.filter(function(x) { return x !== null && x !== undefined; });
console.log(a);     // [2, 3]

// reduce()와 reduceRight(): 배열을 감소시켜 하나의 값으로 결합한다.
// 두 개의 인자를 갖는데 첫번째 인자는 감소함수 이고 두번재 인자는 초깃값이다.
// 초깃값이 있는 경우에는 초깃값이 감소함수의 첫번째 인자로 배열의 원소가 두번째 인자로 전달되며
// 이 후부터는 감소함수의 첫 번째 인자는 이전 감소함수 실행 결과가 전달되고 두번째 인자는 배열의 원소가 순서대로 전달된다.

var a = [1, 2, 3, 4, 5];
var sum = a.reduce(function(x, y) { return x + y; }, 10);
console.log(sum);       // 25
var product = a.reduce(function(x, y) { return x * y; }, 4);
console.log(product);       // 480 (4 * 1 * 2 * 3 * 4 * 5)

// reduceRight(): 배열의 끝부터 반대방향으로 처리한다.
var a = [2, 3, 4];
// 2 ^ (3 ^ 4)를 계산한다. 거듭제곱 계산은 오른쪽에서 왼쪽으로 진행된다.
var big = a.reduceRight(function(accumulator, value) {  // accumulator: 4, value: 3
    return Math.pow(value, accumulator);
});
console.log(big);   // 2.4178516392292583e+24(2의 81승을 의미한다)

// reduce()와 union()을 사용하면 객체 결합 작업을 쉽게 할 수 있다.
var objects = [{x:1}, {y:2}, {z:3}];
var merged = objects.reduce(union);
console.log(merged);      // {x: 1, y: 2, z: 3}

var objects = [{x:1, a:1}, {y:2, a:2}, {z:3, a:3}];
var leftunion = objects.reduce(union);
console.log(leftunion);         // {x: 1, y: 2, z: 3, a: 3}
var rightunion = objects.reduceRight(union);
console.log(rightunion);        // {x: 1, y: 2, z: 3, a: 1}

// indexOf(): 배열의 처음부터 검색, lastIndexOf(): 배열의 끝부터 검색
var a = [0, 1, 2, 1, 0];

/**
 * 배열 a에서 x값의 인덱스들을(x가 여러개인 경우) 배열로 반환한다.
 */
function findall(a, x) {
    var results = [], len = a.length, pos = 0;

    while (pos < len) {     // 검색할 원소가 있다면..
        pos = a.indexOf(x, pos);    // 검색한다.
        if (pos === -1) break;      // 찾을 수 없으면 종료한다.
        results.push(pos);
        pos++;
    }
    return results;
}

console.log(findall(a, 0));         // [0, 4]
console.log(findall(a, 1));         // [1, 3]
console.log(findall(a, 2));         // [2]


// Array.isArray(): 임의의 객체가 배열인지 판단하는 함수
console.log(Array.isArray([]));     // true
console.log(Array.isArray({}));     // false

// 유사배열 객체를 만들어 보자
var a = {};     // 일반적인 빈 객체로 시작한다.
// 배열과 유사한 객체로 만들기 위해 속성을 추가한다.
var i = 0;
while (i < 10) {
    a[i] = i * i;
    i++;
}
a.length = i;

// 이 객체가 마치 실제 배열인 것처럼 반복문을 수행한다.
var total = 0;
for (var j = 0; j < a.length; j++) {
    total += a[j];
}
console.log(total);         // 285

// Arguments 객체는 유사 배열 객체다.
// 정확하지는 않지만 아래의 함수는 유사 배열을 판별하는 함수이다
function isArrayLike(o) {
    if (o &&                                    // o는 null이나 undefined 등등이 아니다
    typeof o === 'object' &&                    // o는 객체이다.
    isFinite(o.length) &&                       // o의 길이는 유한하다.
    o.length >= 0 &&                            // o의 길이는 0이상이다.
    o.length === Math.floor(o.length) &&        // o.length 는 정수이다.
    o.length < 4294967296)                      // o.length < 2^32가 성립한다.
        return true;
    else
        return false;
}

console.log(isArrayLike(a));            // true
// 문자열에 위 함수를 적용하면 false 가 나온다. 문자열은 배열로 다루기 보다는 그 자체로 다루는 편이 최선이다.
console.log(isArrayLike("Hello World!!"));      // false

// 유사배열은 Array.prototype을 상속받지 않기 때문에 해당 메서드들을 바로 호출할 수는 없다.
// 대신 Function.prototype.call 메서드를 통해서 간접적으로 호출할 수는 있다.
var a = {"0": "a", "1": "b", "2": "c", length: 3};      // 배열과 유사한 객체
console.log(Array.prototype.join.call(a, "+"));         // a+b+c
console.log(Array.prototype.slice.call(a, 0));          //["a", "b", "c"] : 진짜 배열일 복사되어 반환됨.
console.log(Array.prototype.map.call(a, function(x) {
    return x.toUpperCase();
}));        // ["A", "B", "C"]

// 파이어 폭스에서는 Array의 정적 함수도 정의되어 있는데 다른 브라우저에서는 구현되어 있지 않다.
// 따라서 직접 polyfill을 만든 후에 적용해야 한다.
/**
 * polyfill
 */
Array.join = Array.join || function(a, sep) {
    return Array.prototype.join.call(a, sep);
};
Array.slice = Array.slice || function(a, from, to) {
    return Array.prototype.slice.call(a, from, to);
};
Array.map = Array.map || function(a, f, thisArg) {
    return Array.prototype.map.call(a, f, thisArg);
};

var a = {"0": "a", "1": "b", "2": "c", length: 3};      // 배열과 유사한 객체
console.log(Array.join(a, "+"));                                            // a+b+c
console.log(Array.slice(a, 0));                                             // ["a", "b", "c"]
console.log(Array.map(a, function(x) { return x.toUpperCase(); }));         // ["A", "B", "C"]


// 문자열을 배열처럼 사용하기
var s = "Javascript";
console.log(Array.prototype.join.call(s, " "));         // J a v a s c r i p t
// 문자열의 각 문자에 대해 Filter를 적용한다.
console.log(Array.prototype.filter.call(s, function(x) {
    return x.match(/[^aeiou]/);         // 모음의 경우에 null이 반환되며 자음의 경우에는 매칭 정보를 담은 배열이 반환된다.(true로 평가)
}).join(""));        // Jvscrpt

// 문자열은 수정이 불가능하므로 읽기 전용 배열로만 동작한다.
// 배열을 직접 수정하는 메소드들은 사용이 불가능하다(push(), sort(), reverse(), splice())
Array.prototype.push(s, "K");       // 실제 아무런 동작도 하지 않는다.
console.log(s);                     // Javascript














