/* 객체의 프로퍼티 열거하기 */
/**
 * 객체 p의 열거 가능한 프로퍼티들을 객체 o 에 복사한 후 반환한다.
 * 만약 객체 o 와 p 가 같은 이름의 프로퍼트를 갖고 있다면, 객체 o 의 프로퍼티를 재정의 한다.
 * 이 함수는 getter/setter 메서드와 프로퍼티 속성까지 복사하지는 않는다.
 */
function extend(o, p) {
    for (prop in p) {       // p의 모든 열거가능한 프로퍼티를
        o[prop] = p[prop];  // o의 프로퍼티로 추가한다.
    }
    return o;
}

var obj = extend({}, {a: 1, b: 2, c: 3});
console.log(obj);           // { a: 1, b: 2, c: 3 }

/**
 * 객체 p의 열거 가능한 프로퍼티들을 객체 o에 복사한 후 반환한다.
 * 만약 객체 o와 p가 같은 이름의 프로퍼티를 갖고 있다면, 객체 o의 프로퍼티를 그대로 사용한다.
 * 이 함수는 getter/setter 메서드와 프로퍼티 속성까지 복사하진 않는다.
 */
function merge(o, p) {
    for (prop in p) {                           // p의 열거 가능한 모든 프로퍼티 중에
        if (o.hasOwnProperty(prop)) continue;   // 같은 이름의 프로퍼티를 제외한 나머지를
        o[prop] = p[prop];                      // 객체 o의 프로퍼티로 추가한다.
    }
    return o;
}
var obj = merge({a: 1, b: 2, c: 3}, {a: 4, e: 5, f: 6});
console.log(obj);          // {a: 1, b: 2, c: 3, e: 5, f: 6}

/**
 * 객체 o의 프로퍼티 중에 객체 p에 없는 프로퍼티들을 제거하고 o를 반환한다.
 */
function restrict(o, p) {
    for (prop in o) {
        if (!(prop in p)) delete o[prop];
    }
    return o;
}
var obj = restrict({a: 1, b: 2, c: 3}, {a: 4, b: 5});
console.log(obj);           // {a: 1, b: 2}

/**
 * 객체 p의 프로퍼티 중에 객체 o가 가진 프로퍼티와 중복되는 프로퍼티들을
 * 객체 o에서 제거한 후 반환한다.
 */
function subtract(o, p) {               // p의 열거 가능한
    for (prop in p) {           // p의 열거 가능한 모든 프로퍼티 중에
        delete o[prop];         // o와 같은 이름의 프로퍼티가 있다면 제거한다.
    }                           // [비록 존재하지 않더라고 삭제 연산은 정상적으로 진행한다.]
    return o;
}
var obj = subtract({a: 1, b: 2, c: 3}, {a: 4, b: 5});
console.log(obj);           // {c: 3}

/**
 * 객체 o와 p가 가진 프로퍼티들을 새 객체에 담아 반환한다.
 * 만약 같은 이름의 프로퍼티의 경우에는 객체에 p의 프로퍼티 값을 사용한다.
 */
function union(o, p) {
    return extend(extend({}, o), p);
}
var obj = union({a: 1, b: 2, c: 3}, {a: 4, d: 5, e: 6});
console.log(obj);           // {a: 4, b: 2, c: 3, d: 5, e: 6}

/**
 * 객체 o의 프로퍼티 중 p에도 있는 것들만 새 객체에 담아 반환한다.
 * o와 p의 교집합을 구하는 것과도 같지만,
 * 객체 p의 프로퍼티 값은 버려진다는 차이가 있다.
 */
function intersection(o, p) { return restrict(extend({}, o), p); }
var obj = intersection({a: 1, b: 2, c: 3}, {a: 4, b: 5, d: 6});
console.log(obj);           // {a: 1, b: 2}

/**
 * 객체 o가 가진 열거 가능한 고유 프로퍼티들의 이름을 배열에 담아 반환한다.
 */
function keys(o) {
    if (typeof o !== 'object') throw TypeError();       // 반드시 객체 인자가 필요함.
    var result = [];                                    // 반환할 배열
    for (var prop in o) {                               // 모든 열거 가능한 프로퍼티 중에
        if (o.hasOwnProperty(prop))                     // 고유 프로퍼티인 경우에
            result.push(prop);                          // 배열에 프로퍼티 이름을 추가한다.
    }
    return result;                      // 배열을 반환한다.
}
var obj = Object.create({a: 1, b: 2, c: 3});
obj.x = "a";
obj.y = "b";
obj.z = "c";
console.log(keys(obj));     // ["x", "y", "z"]

// getter/setter 메서드
var o = {
    // 데이터 프로퍼티
    data_prop: "dataProperty",
    // 한 쌍의 함수로 정의된 접근자 프로퍼티
    get accessor_prop() { /* 함수 몸체 */ },
    set accessor_prop(value) { /* 함수 몸체 */ }
};

var p = {
    // 읽기/쓰기 속성을 가진 일밙거인 데이터 프로퍼티 x, y
    x: 1.0,
    y: 1.0,
    // r은 getter/setter를 통한 읽기/쓰기가 가능한 접근자 프로퍼티이다.
    // 이러한 접근자 메서드 다음에 쉼표를 반드시 추가해야 한다.
    get r() { return Math.sqrt(this.x*this.x + this.y*this.y); },
    set r(newValue) {
        var oldValue = Math.sqrt(this.x*this.x + this.y*this.y);
        var ratio = newValue/oldValue;
        this.x *= ratio;
        this.y *= ratio;
    },
    // theta는 읽기 전용 접근자 프로퍼티고, getter 함수만 갖는다.
    get theta() { return Math.atan2(this.y, this.x); }
}
console.log(p.r);           // 1.4142135623730951(루트 2)
p.r = 2;
console.log(p.r);           // 1.9999999999999998(2)
// Math.atan2(y, x) ==> y: y좌표, x: x 좌표 이며 해당 좌표의 각도를 라디안 단위로 반환
console.log(p.theta);       // 0.7853981633974483

// 이 객체는 매번 다른 일련 번호를 생성한다.
var serialnum = {
    // 이 데이터 프로퍼티는 다음 일련번호르 갖는다.
    // 프로퍼티 이름에 붙은 $는 private property라는 힌트이다.
    $n: 0,

    // 현재 일련번호 값을 반환한 후, 값을 증가한다.
    get next() { return this.$n++; },
    // 새로운 일련번호 값을 설정하는데, 이때 기존의 값보다 반드시 커야 한다.
    set next(n) {
        if (n >= this.$n) this.$n = n;
        else throw "serial number can only be set to a larger value";
    }
}
console.log(serialnum.next);        // 0
console.log(serialnum.next);        // 1
console.log(serialnum.next);        // 2
serialnum.next = 13;
console.log(serialnum.next);        // 13


// 이 객체는 무작위 수를 반환하는 접근자 프로피티들을 가지고 있다.
// 예를 들어, random.octet는 매번 0부터 255 사이의 임의의 수를 반환한다.
var random = {
    get octet() { return Math.floor(Math.random() * 256); },
    get unint16() { return Math.floor(Math.random() * 65536); },
    get inin16() { return Math.floor(Math.random() * 65536) - 32768;}
}
console.log(random.octet);          // 234
console.log(random.unint16);        // 2388
console.log(random.inin16);         // -3843


// 프로퍼티 속성
// 데이터 프로퍼티는 4가지 속성을 가진다(value, writable, enumerable, configurable)
// 접근자 프로퍼티는 value, writable 속성을 가지지 않는다.(get, set, enumerable, configurable)
var descriptor = Object.getOwnPropertyDescriptor({x: 1}, "x");
console.log(descriptor);        // {value: 1, writable: true, enumerable: true, configurable: true}

// 위에서 정의한 random객체의 octet 프로퍼티의 속성을 살펴보자
var descriptor = Object.getOwnPropertyDescriptor(random, "octet");
console.log(descriptor);        // {set: undefined, enumerable: true, configurable: true, get: ƒ}

// 상속받은 프로퍼티나 존재하지 않는 프로퍼티의 경우 undefined 를 반환한다.
var des = Object.getOwnPropertyDescriptor({}, "x");
console.log(des);       // 프로퍼티가 없으므로 undefined 반환
var des = Object.getOwnPropertyDescriptor({}, "toString");
console.log(des);       // 상속받은 프로퍼티 이므로 undefined

// 프로퍼티 정의
var o = {};
// 열거할 수 없는 데이터 프로퍼티 x를 정의하고, 프로퍼티 값을 1로 설정한다.
Object.defineProperty(o, "x", {
    value: 1,
    writable: true,
    enumerable: false,
    configurable: true
});
// 정의한 프로터티를 열거할 수 있는지 검사한다.
console.log(o.x);               // 1
console.log(Object.keys(o));    // []

// 프로퍼티 값을 바꿔보자
Object.defineProperty(o, "x", {writable: false});       // 기존의 프로퍼티 속성은 그대로 유지된다.
o.x = 2;                // 값이 변경되지  않는다. 엄격 모드에서는 TypeError가 발생한다.
console.log(o.x);           // 1

// 여전히 configurable 프로퍼티는 true이므로 기존 값을 변경할 수 있다.
Object.defineProperty(o, "x", {value: 2});
console.log(o.x);           // 2

// 프로퍼티 x를 데이터 프로퍼티에서 접근자 프로퍼티로 바꿨다.
Object.defineProperty(o, "x",{get: function() { return 0; }});
console.log(o.x);           // 0
// Object.defineProperty 는 상속받은 프로퍼티의 속성은 변경하지 못한다.

// 여러개의 프로퍼티를 만들거나 수정할 경우
// 아래의 객체는 2개의 데이터 프로퍼티와 1개의 접근자 프로퍼티를 가지고 있다.
var p = Object.defineProperties({}, {
    x: { value: 1, writable: true, enumerable: true, configurable: true },
    y: { value: 2, writable: true, enumerable: true, configurable: true },
    r: {
        get: function() { return Math.sqrt(this.x*this.x + this.y*this.y); },
        enumerable: true,
        configurable: true
    }
});
console.log(p.x, p.y, p.r);         // 1   2   2.23606797749979
p.x = 4;
p.y = 4;
console.log(p.r);                   // 5.656854249492381

// 앞의 예제에서 extend 함수는 객체가 가진 프로퍼티를 복사는 하지만
// 객체의 속성은 무시되었다. 여기에서는 extend 를 확장해서 속성까지 복사하는 개선된 버전을 만든다.
/**
 * Object.prototype에 열거되지 않는 메서드 extend()를 추가한다.
 * 이 메서드는 호출 시에 인자로 전달된 객체에서 프로퍼티들을 복사함으로써 객체를 확장한다.
 * 단순 프로퍼티 값뿐 아니라 모든 프로퍼티 속성을 복사한다.
 * 인자로 넘긴 객체가 소유한 모든 고유 프로퍼티는 대상 객체에 같은 이름의
 * 프로퍼티가 존재하지 않는 한 대상 객체에 복사된다.
 */
Object.defineProperty(Object.prototype, "extend", {     // Object.prototype.extend를 정의한다.
    writable: true,
    enumerable: false,
    configurable: true,
    value: function(o) {
        // Object.prototype.extend 메서드의 값은 함수다.
        // 열거되지 않는 프로퍼티들을 포함한 모든 고유 프로퍼티데 대해
        var names = Object.getOwnPropertyNames(o);
        for (var i = 0; i < names.length; i++) {    // 루프에서 살펴본다.
            // this 객체에 이미 같은 이름의 프로퍼티가 존재하면 건너 뛴다.
            if (names[i] in this) continue;
            // 객체 o의 property descriptor를 가져온다.
            var desc = Object.getOwnPropertyDescriptor(o, names[i]);
            // this 객체에 프로퍼티를 생성할 때 앞에서 가져온 descriptor 객체를 사용한다.
            Object.defineProperty(this, names[i], desc);
        }

    }
});

// 대다수 브라우저에 내장된 자바스크립트 엔진에서는 ECMAScript5 가 나오기 전부터 객체 리터럴에 get/set 문법을 지원했다.
// 4개의 메서드(__lookupGetter__(), __lookupSetter__(), __defineGetter__(), __defineSetter__())는 모두
// 비표준 API이며 모든 객체에서 사용할 수 있다.(두 개의 언더바는 비표준임을 의미한다)
// lookupGetter(property)는 해당 프로퍼티의 getter/setter 메서드를 반환한다.
// defineGetter(property, func): 첫 번째 인자는 프로퍼티 이름, 두 번째 인자는 메서드이다.

// 모든 객체는 prototype, class, extensible 속성을 가진다.

// prototype은 [[prototype]], __proto__ 와 동일한 의미이다.
// Object.getPrototypeOf()
var p = { x: 1 };
var o = Object.create(p);
console.log(p.isPrototypeOf(o));            // true
console.log(Object.prototype.isPrototypeOf(p));     // true

// 객체의 class 속성:
// 오브젝트에 toString 메소드 사용시 나오는 문자열에서 뒷 부분을 의미  [object class]  ==> class 를 의미한다.
// 객체의 클래스 정보는 직접적으로 확인할 수 있는 정보가 아니다.
/**
 * 클래스 정보를 반환하는 함수
 */
function classof(o) {
    if (o === null) return "Null";
    if (o === undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8, -1);
}
console.log(classof(new Date));         // Date
console.log(classof(new Array));        // Array
console.log(classof(null));             // Null
console.log(classof(3));                // Numer
console.log(classof(""));               // String
console.log(classof(false));            // Boolean
console.log(classof({}));               // Object
console.log(classof([]));               // Array
console.log(classof(/./));              // RegExp
console.log(classof(window));           // Window(클라이언트 측 호스트 객체)
function f() {}
console.log(classof(f));                // Function

// extensible 속성: 객체에 새 프로퍼티를 추가할 수 있는지 여부
// Object.preventExtensions(): 객체가 확장 불가능 해짐
// Object.seal(): 위와 유사하나 '고유' 프로퍼티를 설정 불가능하게 만듦(프로퍼티 추가X, 변경X, 삭제X)
// Object.freeze(): 위의 내용에 + 고유 프로퍼티를 읽기 전용으로 만든다.(다만 setter 접근자 프로퍼티는 해당X)
// 위의 함수들은 인자로 넘긴 객체를 다시 반환한다.

/**
 * Object.freeze()로 프로토타입을 고정시키고,
 * 열거할 수 없는 프로퍼티 y를 가진 객체를 Object.seal()로 봉인한다.
 */
var o = Object.seal(
    Object.create(Object.freeze({x: 1}), {y: {value: 2, writable: true}})       // x: 프로토 타입에 존재하며 읽기전용이다.
);
console.log("y" in o);      // true
console.log(o.x);           //  1
Object.getPrototypeOf(o).x = 5;
console.log(o.x);           // 1
o.y = 4;
console.log(o.y);           // 4

// 객체 직렬화 하기
var o = {x: 1, y: {z: [false, null, ""]}};  // 테스트용 객체를 정의
var s = JSON.stringify(o);                  // 객체를 직렬화
var p = JSON.parse(s);                      // 객체를 복원
console.log(s);                             // {"x":1,"y":{"z":[false,null,""]}}
console.log(typeof s);                      // string
console.log(p);                             // {x: 1, y: {…}}
console.log(typeof p);                      // object

// toJson() 메서드
// JSON.stringify() 함수에서는 객체에 toJSON() 메서드가 있는지 찾는다.
var jsonDate = (new Date).toJSON();     // Date 객체를 toISOString()을 이용해 직렬화 한다.(항상 UTC 타임을 사용) suffix Z 가 UTC를 의미함.
var backtoDate = new Date(jsonDate);
console.log(jsonDate);
console.log(backtoDate);                // Date 객체로 복원










































