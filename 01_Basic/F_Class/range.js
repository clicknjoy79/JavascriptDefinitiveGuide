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
Complex._format = /^{([^,]+),([^}]+)}$/;

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
    for (var name in namesToValues) {
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


// 다음은 열거형 분야의 Hello World 예제라고 한다.
// 트럼프 카드, 덱을 구현하고 카드를 섞어서 나눠주는 메서드를 구현해보자.

// 트럼트 카드를 나타내는 클래스를 정의한다.
function Card(suit, rank) {
    this.suit = suit;
    this.rank = rank;
}

// 하트, 클럽, 다이아몬드, 스페이드에 대한 각 세트와 순위를 정의한다.
Card.Suit = enumeration({Clubs: 1, Diamonds: 2, Hearts: 3, Spades: 4});
Card.Rank = enumeration({Two: 2, Three: 3, Four: 4, Five: 5, Six: 6, Seven: 7, Eight: 8, Nine: 9, Ten: 10,
                         Jack: 11, Queen: 12, King: 13, Ace: 14});

// 카드에 대한 텍스트 표현을 정의한다.
Card.prototype.toString = function() {
    return this.rank.toString() + " of " + this.suit.toString();    // ex> Two of Diamonds
};

// 포커 룰로 두 카드의 순위를 비교한다.
Card.prototype.comparedTo = function(that) {
    return this.rank - that.rank;
};

// 포커에서 처럼 카드를 정렬하는 함수
Card.orderByRank = function(a, b) {
    return a.comparedTo(b);
};

// 브릿지 룰로 두 카드를 정렬하는 함수
Card.orderBySuit = function(a, b) {
    if (a.suit < b.suit) return -1;       // 카드의 suit 이 크면 뒤로 간다.
    if (a.suit > b.suit) return 1;        // 카드의 suit 이 작으면 앞으로 간다.
    if (a.rank < b.rank) return -1;       // 카드의 suit 이 동일하면 rank로 비교한다.
    if (a.rank > b.rank) return 1;
    return 0;       // 교재에 있지만 실제로 실행되는 구문인지 의문이다.
};

// 일반적인 트럼프 한 벌을 나타내는 클래스를 정의한다.
function Deck() {
    var cards = this.cards = [];        // 카드 한벌을 담을 배열을 선언한다.
    Card.Suit.foreach(function(s) {         // 카드 suit 열거형 객체들에 대해 함수를 호출한다.
        Card.Rank.foreach(function(r) {     // 카드 rank 열거형 객체들에 대해 함수를 호출한다. 중첩 반복문이다. 내부 함수를 선언했기 때문에 외부의 지역변수인 s를 클로저로서 기억한다.
            cards.push(new Card(s, r));     // 모든 카드 한 벌을 세팅한다. cards 변수는 함수 체이닝에 의해 접근 가능하다.
        });
    });
}

// 섞기(shuffle) 메서드: 해당 트럼프 한 벌 내의 카드를 무작위로 섞는다.
Deck.prototype.shuffle = function() {
    // 배열의 각 요소에 대해, 해당 요소의 인덱스를 포함한 앞의 요소 중 아무 요소나 선택하여 바꾼다.
    var deck = this.cards, len = deck.length;
    for (var i = len - 1; i > 0; i--) {
        var r = Math.floor(Math.random() * (i + 1)), temp;      // r: 랜덤 인덱스
        temp = deck[i], deck[i] = deck[r], deck[r] = temp;      // 바꾼다.
    }
    return this;        // 섞은 덱을 반환.
};

// 카드를 분배(Deal)하는 메서드: 카드 배열을 반환한다.
Deck.prototype.deal = function(n) {     // n: 분배할 카드 수
    if (this.cards.length < n) throw "Out of cards";
    return this.cards.splice(this.cards.length - n, n);     // 실제로 분배되는 카드 배열을 리턴. 원본 카드 배열도 감소한다.
};

// 테스트 해보자. 트럼프 한 벌을 만들고 섞은 다음, 카드를 분배한다.
var deck = (new Deck()).shuffle();      // 만들고 한번 섞음.
console.log(deck);                      // Deck {cards: Array(52)}: 52 장의 카드가 만들어 졌다.
var hand = deck.deal(13).sort(Card.orderBySuit);        // 13장을 분배한 다음 정렬한다.
console.log(hand.toString());           // 분배, 정렬된 카드가 나온다  ex> Five of Clubs,Nine of Clubs,Ten of Clubs,Queen of Clubs,Four of Diamonds,Seven of Diamonds,Queen of Diamonds,Seven of Hearts,King of Hearts,Ace of Hearts,Seven of Spades,Nine of Spades,Ten of Spades
console.log(deck);                      // Deck {cards: Array(39)}


// 객체에 대해 산술연산(+) 제외, 비교 연산 시 valueOf 를 호출한다.
// 객체에 대해 JSON.stringify()를 호출한 경우 객체에 toJSON 메서드가 정의되어 있으면 호출한다.

// 위에서 정의한 Set 클래스에 몇 가지 기본 메서드를 추가해보자.
extend(Set.prototype, {
    // 세트의 문자열을 반환한다.
    toString: function() {
        var s = "{", i = 0;
        this.foreach(function(v) {s += ((i++ > 0) ? ", " : "") + v; });
        return s + "}";
    },
    // toString() 과 비슷하지만 모든 값에 대해 toLocaleString()을 호출한다.
    toLocaleString: function() {
        var s = "{", i = 0;
        this.foreach(function(v) {
            if (i++ > 0) s += ", ";
            if (v == null) s += v;          // null 과 undefined
            else s += v.toLocaleString();   // 다른 모든 경우
        });
        return s + "}";
    },
    // 세트를 배열로 변환한다.
    toArray: function() {
        var a = [];
        this.foreach(function (v) { a.push(v); });
        return a;
    }
});
// JSON 문자열 변환을 위해 세트를 배열처럼 취급한다.
Set.prototype.toJSON = Set.prototype.toArray;
// s는 위에서 미리 정의한 세트
console.log(s.toString());          // {10, Cat, function () {}, [object Object]}
console.log(s.toLocaleString());    // {10, Cat, function () {}, [object Object]}
console.log(s.toArray());           // Array [ 10, "Cat", f_1(), Object ]
console.log(s.toJSON());            // Array [ 10, "Cat", f_1(), Object ]


// 객체 사이의 동치 연산자.(==)
// Range 클래스는 prototype을 재정의 하면서 constructor 프로퍼티를
// 정의하지 않았기 때문에, 여기서 constructor프로퍼티를 추가하자.
Range.prototype.constructor = Range;

// Range는 from, to 가 같다면 같은 객체이다.
Range.prototype.equals = function(that) {
    if (that == null) return false;     // null == null, null == undefined  ===> 모두 true를 반환한다.
    if (that.constructor !== Range) return false;       // Range 타입이 아니면 제외
    // 시작점과 끝점이 같은 때만 같은 객체로 취급한다.
    return this.from === that.from && this.to === that.to;
};

// Set클래스에 equals() 메서드를 정의하는 것은 약간의 요령이 필요하다.
// 좀 더 깊은 단계의 비교까지 해야 한다.
Set.prototype.equals = function(that) {
    // 단순한 경우
    if (this === that) return true;
    // 만약 주어진 객체가 Set이 아니라면 이 객체와 같지 않다.
    if (!(that instanceof Set)) return false;

    // 두 Set의 크기가 다르면 같지 않다.
    if (this.size() !== that.size()) return false;

    // 두 객체의 모든 요소가 다른 객체에도 있는 지 검사한다.
    // 두 Set이 다르면 foreach()를 벗어나도록 예외를 사용한다.
    try {
        this.foreach(function(v) { if (!that.contains(Set._v2s(v))) throw false; });  // 이 객체의 요소가 다른 객체에는 없음.
        return true;
    } catch (e) {
        if (e === false) return false;
        throw e;
    }
};

/**
 * 시작값에 따라 range 인스턴스를 정렬하고, 만약 시작값이 같으면 끝 값에 따라 정렬한다.
 * 만약 Range 가 아닌 값이 전달되면 예외를 발생시킨다.
 * 오직 this.equals(that)일 때만 0을 반환한다.
 */
Range.prototype.compareTo = function(that) {
    if (!(that instanceof Range))
        throw new Error("Can't compare a Range with " + that);
    var diff = this.from - that.from;       // 시작 값을 비교한다.
    if (diff === 0) diff = this.to - that.to;       // 시작값이 같으면 끝 값을 비교한다.
    return diff;
};

// 다른 객체가 빌려 쓸 수 있도록 일반화된 메서드
var generic = {
    // 상속받은 프로퍼티와 함수를 제외한 모든 프로퍼티의 이름과 값을 포함한 문자열을 반환한다.
    // 가능하다면 생성자 함수의 이름도 포함한다.
    toString: function() {
        var s = "[";
        // 만약 객체가 생성자를 가지고 있고, 생성자에 이름이 지정되어 있다면,
        // 생성자 이름(클래스 이름)을 반환될 문자열에 추가한다.
        // 함수의 name 프로퍼티는 비표준이고, 따라서 모든 인터프리터가
        // name 프로퍼티를 지원하지는 않음을 유념하라.
        if (this.constructor && this.constructor.name)
            s += this.constructor.name + ": ";

        // 상속되지 않은 프로퍼티와 함수가 아닌 프로퍼티 모두를 열거한다.
        var n = 0;
        for (var name in this) {
            if (!this.hasOwnProperty(name)) continue;       // 상속된 값은 건너뛴다.
            var value = this[name];
            if (typeof value === "function") continue;      // 메서드도 건너뛴다.
            if (n++) s += ", ";
            s += name + "=" + value;
        }
        return s + "]";
    },
    // this와 that의 constructor 프로퍼티와 instance 프롤퍼티를 비교함으로써
    // this와 that이 같은지를 검사한다. 인스턴스의 프로퍼티가 === 연산자를 통해 비교될 수
    // 있는 경우에만 작동한다.
    // === 연산자로 비교하려면 해당 객체가 원시 값을 반환해야 한다. (valueOf 메서드가 존재해야)
    // 특수한 경우로 Set 클래스가 추가한 프로퍼티는 무시한다.
    equals: function(that) {
        if (that == null) return false;
        if (this.constructor !== that.constructor) return false;
        for (var name in this) {
            if (name === "|**objectid**|") continue;        // 특정 프로퍼티는 건너뛴다.
            if (!this.hasOwnProperty(name)) continue;       // 상속받은 프로퍼티는 건너뛴다.
            if (this[name] !== that[name]) return false;    // 값들을 비교한다.
        }
        return true;        // 모든 프로퍼티의 값이 같으면, 두 객체는 같다.
    }
};

// private 상태
function Range2(from, to) {
    // this 객체의 프로퍼티로 from, to를 지정하지 말 것.
    // 대신에 시작점과 끝점을 반환하는 접근자 함수를 지정한다.
    // 인자로 넘어온 from, to 값은 클로저에 저장된다.
    this.from = function() { return from; };
    this.to = function() { return to; };
}

// 프로토 타입의 메서드들은 생성자에 인자로 전달된 from, to를 직접 볼 수 없다.
Range2.prototype = {
    constructor: Range2,
    include: function(x) { return this.from() <= x && this.to() >= x; },
    foreach: function(f) {
        for (var x = Math.ceil(this.from()); x <= this.to(); x++) f(x);
    },
    toString: function() { return "(" + this.from() + "..." + this.to() + ")"; }
};

var r = new Range2(1, 5);
r.from = function() { return 0; };      // 메서드 교체
r.foreach(console.log);     // 0  1  2  3  4  5




// 서브클래스 정의 유틸리티(서브 클래스를 정의하는 팩토리 메서드)
function defineSubclass(superclass,     // 슈퍼클래스 생성자
                        constructor,    // 서브 클래스 생성자
                        methods,        // 인스턴스 메서드
                        statics) {       // 클래스 프로퍼티
    // 서브 클래스의 프로토타입 객체를 설정한다. 이미 공부한 내용임.
    constructor.prototype = inherit(superclass.prototype);
    constructor.prototype.constructor = constructor;
    // 메서드와 정적 값들을 복사한다.
    if (methods) extend(constructor.prototype, methods);
    if (statics) extend(constructor, statics);
    // 서브 클래스를 반환.
    return constructor;
}

// 또한, 수퍼클래스 생성자 메서드로 서브클래스를 생성할 수 있다.
Function.prototype.extend = function(constructor, methods, statics) {
    return defineSubclass(this, constructor, methods, statics);
};


// defineSubclass() 함수를 사용하지 않고 직접 서브 클래스 작성
function SingletonSet(member) {
    this.member = member;
}

SingletonSet.prototype = inherit(Set.prototype);

// 프로토 타입에 프로퍼티를 추가한다.
// 이 프로퍼티들은 Set.prototype에 있는 프로퍼티들을 재정의 한다.
extend(SingletonSet.prototype, {
    // constructor 재설정
    constructor: SingletonSet,
    // 이 세트는 읽기 전용이다. add() 와 remove()는 에러를 발생시킨다.
    add: function() { throw "read-only set"; },
    remove: function() { throw "read-only set"; },
    // SingletonSet의 크기는 언제나 1이다.
    size: function() { return 1; },
    // 멤버가 하나만 있기 때문에 함수를 한 번만 호출하면 된다.
    foreach: function(f, context) { f.call(context, this.member); },
    // contains 메서드는 한 가지 값에 대해서만 참이다.
    contains: function(x) { return x === this.member; }
});

SingletonSet.prototype.equals = function(that) {
    return that instanceof Set && that.size() === 1 && that.contains(this.member);
};

var ss = new Set("Cat");
var sts = new SingletonSet("Cat");
console.log(sts.equals(ss));        // true
// sts.add("Dog");                     // read-only set

// 수퍼클래스로의 생성자 체이닝과 메서드 체이닝
/**
 * NonNullSet은 null과 undefined를 멤버로 허용하지 않는 Set의 서브클래스다.
 */
function NonNullSet() {
    // NonNullSet을 위한 별도의 동작없이, 단지 슈퍼클래스의 생성자를 체이닝 한다.
    Set.apply(this, arguments);
}

// Set의 서브클래스인 NonNullSet을 만든다.
NonNullSet.prototype = inherit(Set.prototype);
NonNullSet.prototype.constructor = NonNullSet;

// null과 undefined를 제외하려면 add() 메서드만 재정의하면 된다.
NonNullSet.prototype.add = function() {
    // 인자가 null 또는 undefined 인지 여부를 검사한다.
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] == null)
            throw new Error("null 또는 undefined는 NonNullSet에 추가할 수 없습니다.");
        // 실제 멤버 삽입은 슈퍼클래스의 메서드를 체이닝하여 수행한다.
        return Set.prototype.add.apply(this, arguments);
    }
};
// new NonNullSet(null);           // null 또는 undefined 는 NonNullSet에 추가할 수 없습니다.

// 특별한 원소만을 추가할 수 있는 서브 클래스를 만들어 보자.
// 문자열만 저장하는 Set의 서브 클래스
var StringSet = filteredSetSubclass(Set, function(x) { return typeof x === "string"; });
// null, undefined 그리고 함수를 허용하지 않는 Set의 클래스를 정의.
var MySet = filteredSetSubclass(NonNullSet, function(x) { return typeof x !== "function"; });

/**
 * 생성자 체이닝과 메서드 체이닝을 사용하는 클래스 팩토리 함수를 정의한다.
 * 이 함수는 Set의 서브클래스의 add() 메서드에 지정된 필터를 적용하여
 * 재정의된 클래스를 반환한다.
 */
function filteredSetSubclass(superclass, filter) {
    var constructor = function() {              // 서브클래스 생성자
        superclass.apply(this, arguments);      // 슈퍼클래스 생성자를 체이닝 한다.
    };

    var proto = constructor.prototype = inherit(superclass.prototype);
    proto.constructor = constructor;
    proto.add = function() {
        // 값을 추가하기 전에 모든 인자에 대해 필터를 적용한다.
        for (var i = 0; i < arguments.length; i++) {
            var v = arguments[i];
            if (!filter(v)) throw ("value " + v + " rejected by filter");
        }
        superclass.prototype.add.apply(this, arguments);
    }
    return constructor;
}
// new StringSet(1);            // value 1 rejected by filter
// new MySet(function() {});       // value function () {} rejected by filter

var NonNullSet = (function(){       // 함수를 정의하고 바로 호출한다.
    var superclass = Set;           // 슈퍼클래스 : 생성자 함수
    return superclass.extend(
        function() { superclass.apply(this, arguments); },       // 자식 클래스: 생성자 함수
        {                                                        // 메서드
            add: function() {
                // 인자의 null 또는 undefined 여부를 검사한다.
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] == null)
                        throw new Error("null 또는 undefined는 추가할 수 없습니다.");
                }
                return superclass.prototype.add.apply(this, arguments);
            }
        }
    );
})();

// new NonNullSet(undefined);          // null 또는 undefined는 추가할 수 없습니다.


// 사실 상속은 그리 좋은 방법이 아니다. 따라서 조합을 사용해보자.(DI와 유사한 방법)
// 서브 클래스 대신에 세트 조합을 사용(즉 세트 객체를 필드에 저장한다)
/**
 * FilteredSet은 지정된 세트 객체를 래핑하고, 지정된 필터를 add() 메서드의 인자에 적용한다.
 */
var FilteredSet = Set.extend(
    function FilteredSet(set, filter) {         // 세팅할 생성자 함수
        this.set = set;
        this.filter = filter;
    },
    {
        // 인스턴스 메서드
        add: function() {
            // 필터가 설정되었다면 적용한다.
            if (this.filter) {
                for (var i = 0; i < arguments.length; i++) {
                    var v = arguments[i];
                    if (!this.filter(v))
                        throw new Error("FilterSet: value " + v + " rejected by filter");
                }
            }
            this.set.add.apply(this.set, arguments);
            return this;
        },
        // 나머지 메서드들은 this.set으로 요청을 전달하기만 하고
        // 다른 행동은 하지 않는다.
        remove: function() {
            this.set.remove.apply(this.set, arguments);
        },
        contains: function(v) { return this.set.contains(v); },
        size: function() { return this.set.size(); },
        foreach: function(f, c) { this.set.foreach(f, c); }
    }
);

// 테스트
var f_set = new FilteredSet(new Set(), function(x) { return x != null ; });
f_set.add(1, "Dog", 2);
f_set.remove(2);
console.log(f_set);                 // FilteredSet {set: Set, filter: ƒ} : 객체 내부 확인
// f_set.add(undefined);           // value undefined rejected by filter

var f_set1 = new FilteredSet(f_set, function(x) { return !(x instanceof Set); });
f_set1.add(2, 3);
console.log(f_set1);                // FilteredSet {set: FilteredSet, filter: ƒ}
// f_set1.add(new Set());              // FilterSet: value {} rejected by filter





































































