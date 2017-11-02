/**
 * 요소 e의 classList 프로퍼티가 존재하면 classList를 반환하고,
 * 없다면 DOMTokenList를 모방한 객체를 반환한다.
 * 반환된 객체에는 contains()와 add(), remove(), toggle(), toString()이 존재하고,
 * 이 메서드를 통해 요소 e의 클래스 집합을 평가하고 조작한다.
 * classList 프로퍼티가 지원되면, 반환된 객체는 유사 배열 형태이며 length와
 * 배열 index 프로퍼티가 존재한다. DOMTokenList를 모방한 객체는 유사 배열이 아니지만,
 * 요소 클래스 명들의 단편을 배열로 반환하는 toArray() 메서드가 존재한다.
 */
function classList(e) {
    if (e.classList) return e.classList;        // e.classList가 존재한다면 해당 객체를 반환.
    else return new CSSClassList(e);            // 없다면 모방 객체를 생성해서 반환한다.
}

// CSSClassList는 DOMTokenList를 모방하는 자바스크립트 클래스다.
function CSSClassList(e) { this.e = e; }

// e.className에 전달인자 c가 클래스로 포함되어 있다면 true를 반환하고,
// 그렇지 않다면 false를 반환한다.
CSSClassList.prototype.contains = function(c) {
    // c가 유효한 클래스 명인지 확인한다.
    if (c.length === 0 || c.indexOf(" ") !== -1)
        throw new Error("Invalid class name: '" + c + "'");

    // 일반적인 케이스를 먼저 확인한다.
    var classes = this.e.className;
    if (!classes) return false;     // 요소 e에 클래스가 전혀 존재하지 않는 경우.
    if (classes === c) return true;     // 요소 e에 단 하나의 클래스가 존재하고 해당 클래스가 c인 경우.

    // 이 경우가 모두 아니라면, c를 단어로 찾아주는 정규표현식을 사용한다.
    // \b는 단어의 경계와 일치하는 정규 표현식이다.
    return classes.search("\\b" + c + "\\b") !== -1;
};

// e.className에 c가 존재하지 않는다면, 추가한다.
CSSClassList.prototype.add = function(c) {
    if (this.contains(c)) return;           // 이미 존재한다면 아무것도 하지 않는다.
    var classes = this.e.className;
    if (classes && classes[classes.length - 1] !== " ")     // classes 가 존재하고 마지막 문자가 공백문자가 아닌 경우.
        c = " " + c;            // 필요한 경우 공백 문자를 추가한다.
    this.e.className += c;
};

// e.className의 클래스 c를 제거한다.
CSSClassList.prototype.remove = function(c) {
    // c가 클래스 명으로 적합한지 검사한다.
    if (c.length === 0 || c.indexOf(" ") !== -1)
        throw new Error("Invalid class name: '" + c + "'");
    // 흔적을 남기지 않고 클래스 c에 해당되는 모든 단어를 제거한다.
    var pattern = new RegExp("\\b" + c + "\\b\\s*", "g");
    this.e.className = this.e.className.replace(pattern, "");
};

// e.className에 c가 포함되어 있지 않다면 추가한 다음 true를 반환한다.
// 그렇지 않다면, e.className에 포함된 클래스 명 c를 모두 제거한 다음 false를 반환한다.
CSSClassList.prototype.toggle = function(c) {
    if (this.contains(c)) {
        this.remove(c);
        return false;
    } else {
        this.add(c);
        return true;
    }
};

// e.className 자체를 반환한다.
CSSClassList.prototype.toString =  function() { return this.e.className; };

// e.className의 모든 클래스 명을 배열로 반환한다.
CSSClassList.prototype.toArray = function() {
    return this.e.className.match(/\b\w+\b/g) || [];
};

var container = document.getElementById("container");
var classNames = classList(container);
console.log(classNames.toString());
classNames.add("second"); classNames.add("third");
console.log(classNames.toString());
classNames.remove("third");
console.log(classNames.toString());

































































