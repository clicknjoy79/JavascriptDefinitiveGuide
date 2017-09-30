function inherit(o) {
    return Object.create(o);
}

/**
 * range 객체를 반환하는 팩토리 함수를 정의한다.
 * range 객체는 from 과 to를 프로퍼티로 가지고 있으며 관련 메서드들을 가지고 있다
 */
function range(from, to) {
    var r = inherit(range.methods);
    r.from = from;
    r.to = to;
    return r;
}

range.methods = {
    include: function(x) {
        return (x >= this.from && x <= this.to);
    },
    foreach: function(f) {
        for (var i = Math.ceil(this.from); i <= this.to; i++) f(i);
    },
    toString: function() {
        return "(" + this.from + "..." + this.to + ")";
    }
};

var r1 = range(2.5, 6);
console.log(r1.toString());     // (2.5...6)
console.log(r1.include(44));    // false
console.log(r1.include(4));     // true
r1.foreach(function(x) { console.log(x); });       // 3  4  5  6

/**
 * 생성자를 사용하는 range 클래스
 * 위와 동일한 구조이다.
 */
function Range(from, to) {
    this.from = from;
    this.to = to;
}

Range.prototype = {
    include: function(x) {
        return (x >= this.from && x <= this.to);
    },
    foreach: function(f) {
        for (var i = Math.ceil(this.from); i <= this.to; i++) f(i);
    },
    toString: function() {
        return "(" + this.from + "..." + this.to + ")";
    }
};

var r = new Range(1, 3);
console.log(r.include(2));      // true
r.foreach(console.log);         // 1  2  3
console.log(r.toString());                 // (1...3)
// r의 프로토 타입 체인 중에 Range.prototype이 존재하는가??? ==> r이 Range.prototype을 상속하는가??? ==> r이 Range 타입인가?
// 위는 모두 같은 의미이다.
console.log(r instanceof Range);            // true

/**
 * 클래스를 정의하기 위한 함수
 */
function extend(o, s) {
    for (var prop in s) o[prop] = s[prop];
    return o;
}

/**
 *
 * @param constructor   생성자 함수
 * @param methods       생성자 함수에 추가하려는 메서드
 * @param statics       생성자 함수의 static 메서드
 * @returns {*}         메서드들이 정의된 생성자 함수
 */
function defineClass(constructor, methods, statics) {
    extend(extend(constructor, statics).prototype, methods);
    return constructor;
}

var SimpleRange = defineClass(
    function(from, to) { this.from = from; this.to = to; },
    {
        include: function(x) { return this.from <= x && this.to >= x; },
        foreach: function(f) {
            for (var x = Math.ceil(this.from); x <= this.to; x++) f(x);
        },
        toString: function() { return "(" + this.from + "..." + this.to + ")"; }
    },
    {
        upto: function(to) { return new SimpleRange(0, to); }
    }
    );
var r2 = new SimpleRange(2, 5);
console.log(r2.include(3));        // true
r2.foreach(console.log);            // 2  3  4  5
console.log(r2.toString());         // (2...5)

var r3 = SimpleRange.upto(3);
r3.foreach(console.log);            // 0  1  2  3


/**
 * 복소수를 정의하는 클래스를 생성해보자.
 * r: 실수부, i: 허수부
 */
function Complex(real, imaginary) {
    if(isNaN(real) || isNaN(imaginary))     // 전달된 인자가 숫자인지 확인한다.
        throw TypeError();
    this.r = real;
    this.i = imaginary;
}

// 복소수의 합
Complex.prototype.add = function (that) {
    return new Complex(this.r + that.r, this.i + that.i);
};
// 복소수의 곱
Complex.prototype.mul = function (that) {
    return new Complex(this.r * that.r - this.i * that.i, this.r * that.i + this.i * that.r);
};

// 복수의 실제 크기
Complex.prototype.mag = function (that) {
    return Math.sqrt(this.r * this.r + this.i * this.i);
};

// 복소수의 부정값
Complex.prototype.neg = function() {
    return new Complex(-this.r, -this.i);
};

Complex.prototype.toString = function() {
    return "{" + this.r + "," + this.i + "}";
};

// 다른 객체와 비교하는 메서드
Complex.prototype.equals = function(that) {
    return (that !== null && that instanceof Complex && this.r === that.r && this.i === that.i);
};

// 몇가지 중요한 복소수를 클래스 필드로 미리 정의한다.
Complex.ZERO = new Complex(0, 0);
Complex.ONE = new Complex(1, 0);
Complex.I = new Complex(0, 1);
Complex._format = /^\{([^,]+),([^}]+)\}$/;

// 문자열을 복소수 객체로 파싱하는 static 메서드를 정의한다.
Complex.parse = function(s) {
    try {
        var match = Complex._format.exec(s);
        return new Complex(parseFloat(match[1]), parseFloat(match[2]));
    } catch (e) {
        throw new TypeError("Can't parse '" + s + "' as a complex number.");
    }
};

var c = new Complex(2, 3);
var d = new Complex(c.i, c.r);
console.log(c.add(d).toString());       // {5,5}
console.log(Complex.parse(c.toString()).add(c.neg()).equals(Complex.ZERO));     // true

// ECMAScript5 에 있는 String.trim() 메서드를 정의해보자.
String.prototype.trim = /*String.prototype.trim || */ function() {
    if (!this) return this;         // 빈 문자열인 경우 그대로 반환
    return this.replace(/^\s+|\s+$/g, "");      // 앞 뒤 공백을 제거한 문자열을 반환.
};

console.log("  white space removed  ".trim());

// 함수 이름을 반환하는 메서드
Function.prototype.getName = function() {
    return this.name || this.toString().match(/^function\s*([^(]+)\(/)[1];
};
function testFunc() {}
console.log(testFunc.getName());           // testFunc


// 클라이언트 측 자바스크립트에서 여러 개의 창이나 프레임이 있는 경우에 각각은 서로 다른 컨텍스트(실행환경) 이다.
// 따라서 한 쪽의 객체는 다른 프레임의 Object 타입이 아니다. 즉 프레임 사이에 이름이 같은 생성자가 있다고 해도(ex> Object, Array, String)
// 이는 서로 다른 객체이고 서로 다른 타입이다. 한쪽의 Array 타입 객체는 다른 쪽의 Array 타입이 아니다.

// 자바스크립트에서는 어떤 객체의 클래스를 판별할 수 있는 깔끔한 방법이 없다. 객체의 클래스 타입을 정확히 알 수 없음....
// 따라서 객체의 클래스에 집중하기 보다는 객체(클래스)의 기능에 집중하는 게 낫다......(Duck-Typing) 덕 타이핑


// 첫 번째 인자가 지정된 메서드(나머지 인자 내부에 있는 메서드)를 구현하고 있는 지 검사한다.
function quacks(o /*...*/) {
    for (var i = 1; i < arguments.length; i++) {
        var arg = arguments[i];
        switch (typeof arg) {       // 파라미터 타입 체크
            case "string":          // 문자열인 경우
                if (typeof o[arg] !== "function") return false;     // 객체에 해당 메서드가 없는 경우
                break;      // 해당 메서드가 있는 경우
            case "function":            // 함수인 경우
                arg = arg.prototype;    // 프로토 타입 객체로 바꾸고 다음 case 실행.
            case "object":              // 일반 객체인 경우
                for (var prop in arg) {     // 객체의 프로퍼티가
                    if (typeof arg[prop] !== "function") continue;  // 메서드가 아니면 건너뛴다.
                    if (typeof o[prop] !== "function") return false; // 메서드이면 같은 이름의 메서드가 있는지 검사: 없으면 종료: 있으면 계속 검사
                }
        }
    }
    return true;        // 여기 까지 도달했다면 모든 메서드들이 존재한다는 의미....
}

// 테스트 객체, 함수 들을 세팅
var o = {
    a: function() {},
    b: function() {},
    c: function() {}
};

function fa() {}
fa.prototype = { b: function() {} };

function fb() {}
fb.prototype = { d: function() {} };

console.log(quacks(o, "a", fa, {k: "hello", c: function() {} }));       // true
console.log(quacks(o, "d", fa, {k: "hello", c: function() {} }));       // false
console.log(quacks(o, "a", fb, {k: "hello", c: function() {} }));       // false
console.log(quacks(o, "a", fa, {k: "hello", d: function() {} }));       // false


// Set 클래스를 구현해보자
function Set() {
    this.values = {};                       // 값을 보관하는 프로퍼티
    this.n = 0;                             // 보관된 값을 갯수
    this.add.apply(this, arguments);        // 모든 인자를 values에 추가한다.
}
// Set에 값을 추가하는 메서드
Set.prototype.add = function() {
    for (var i = 0; i < arguments.length; i++) {
        var val = arguments[i];         // 추가하려는 값.
        var str = Set._v2s(val);        // 값으로 프로퍼티 문자열을 생성

        if (!this.values.hasOwnProperty(str)) {  // Set 객체의 values가 해당 프로퍼티를 가지고 있는 않은 경우
            this.values[str] = val;            // 프로퍼티와 값을 세팅해 준다.
            this.n++;
        }
    }
    return this;            // 메서드 체이닝을 위해 객체를 반환
};

// Set에서 값을 제거하는 메서드
Set.prototype.remove = function() {
    for (var i = 0; i < arguments.length; i++) {
        var val = arguments[i];     // 제거하려는 값
        var str = Set._v2s(val);    // 값과 매핑되는 프로퍼티
        if (this.values.hasOwnProperty(str)) {    // 해당 프로퍼티 존재하면
            delete this.values[str];
            this.n--;
        }
    }
    return this;
};

// 값이 존재하는지 확인하는 메서드
Set.prototype.contains = function(value) {
    return this.values.hasOwnProperty(Set._v2s(value));
};

// 세트의 크기 반환
Set.prototype.size = function() {
    return this.n;
};

// 세트의 각 요소에 대해 함수를 실행한다.
Set.prototype.foreach = function(f, context) {
    for (var prop in this.values) {
        if (this.values.hasOwnProperty(prop))
            f.call(context, this.values[prop]);
    }
}

// 이 static 함수는 자바스크립트의 값을 고유한 키로 매핑해준다.
Set._v2s = function(value) {
    switch (value) {
        case undefined: return "u";     // 특별한 타입들은 하나의 문자 코드로 변경한다.
        case null: return "n";
        case true: return "t";
        case false: return "f";

        default: switch(typeof value) {     // 특별 타입이 아닌 경우 다시 세분화 한다.
            case "number":
                return "#" + value;
            case "string":
                return '"' + value;     // 문자열 앞에 " 를 붙여준다
            default:                    // 함수이거나 일반 객체인 경우에 골뱅이를 붙인다.
                return "@" + getObjectId(value);
        }
    }

    function getObjectId(value) {
        var str = "|**objectid**|";     // 객체에 세팅할 특별한 프로퍼티(마커 역할을 한다)
        if (!value.hasOwnProperty(str))
            value[str] = Set._v2s.next++;
        return value[str];
    }
};

Set._v2s.next = 100;    // 객체 id 시작 값으로 100을 할당.

// 테스트
var f_1 = function() {};
var o_1 = {}, o_2 = {}, o_3 = {};
var s = new Set(10, "Cat", f_1, o_1);
s.add(o_2);

console.log(s.contains(10));        // true
console.log(s.contains("Cat"));     // true
console.log(s.contains(f_1));       // true
console.log(s.contains(o_1));       // true
console.log(s.contains(o_2));       // true
console.log(s.size());              // 5

s.remove(o_2);
console.log(s.contains(o_2));       // false
console.log(s.size());              // 4
s.foreach(console.log);             // 10  Cat  f_1  o_1


/**
 * 자바 스크립트에서 열거형을 구현해보자...
 * 이 함수를 새 열거형을 반환한다.
 * 함수를 반환하는 데 함수의 프로퍼티로 열거형이 정의되어 있다.
 */
function enumeration(namesToValues) {   // 전달된 객체를 가지고 열거형을 정의한다.
    // 더미 함수를 정의한다. 이 함수는 실행될 수 없다. 이 함수에 여러 세팅을 한 후 반환한다.
    var enumeration = function() {
        throw "열거형을 실행할 수 없습니다.";
    };

    // 열거형 객체는 이 프로토 타입을 상속한다. 즉 해당 메소드들을 보유하게 된다.
    // instanceof 연산자를 적용시키기 위해서 ==> 그래야 해당 함수(class) 타입이 된다.
    var proto = enumeration.prototype = {
        constructor: enumeration,                       // 형식 구별 위해 지정?
        toString: function() { return this.name; },
        valueOf: function() { return this.value; },
        toJSON: function() { return this.name; }        // 직렬화를 위한 기능
    };

    enumeration.values = [];        // 열거형 객체를 저장하기 위한 배열.

    // 이제 구체적인 열거형 객체를 만든다.
    for (name in namesToValues) {
        var e = inherit(proto);     // 새로운 열거형 객체.
        e.name = name;              // toString: 메소드와 toJSON 메소드에서 사용될 프로퍼티 정의
        e.value = namesToValues[name];  // valueOf 메소드에서 사용할 프로퍼티 세팅.
        enumeration[name] = e;          // 함수의 프로퍼티로 설정한다.
        enumeration.values.push(e);
    }

    // 열거형 객체들을 순회하는 메서드(대상은 함수)를 만든다.
    enumeration.foreach = function(f, c) {
        for (var i = 0; i < enumeration.values.length; i++) {
            f.call(c, this.values[i]);      // this는 메소드 호출 대상 함수를 의미한다.
        }
    }

    return enumeration;     // 세팅이 완료된 함수를 반환.
}

var Coin = enumeration({Penny: 1, Nickel: 5, Dime: 10, Quarter: 25});
var c = Coin.Penny;
console.log(c instanceof Coin);     //true
console.log(c.constructor);         // 익명 함수 코드가 출력된다.
console.log(Coin.Quarter + 3 * Coin.Nickel);        // 40
console.log(Coin.Dime == 10);              // true
console.log(Coin.Dime > Coin.Nickel);       // true
console.log(String(Coin.Dime) + ":" + Coin.Dime);       // Dime:10










































