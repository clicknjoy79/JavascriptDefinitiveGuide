/**
 * e 의 n 번째 조상 객체를 반환한다. 조상 객체가 없는 경우에는 null 반환.
 * 조상 객체는 Element 객체가 아닐 수 있다. 예를 들면 Document 객체 또는 DocumentFragments 객체.
 * n 이 0 이면 e 자신이다. n 이 1 이면 (혹은 생략) 부모 객체를 반환한다.
 * n 이 2 이면 부모의 부모 객체를 의미한다.
 */
function parent(e, n) {
    if (n === undefined) n = 1;
    while (n-- && e) e = e.parentNode;
    if (e && e.nodeType !== 1) return null;
    return e;
}
var p = document.getElementsByTagName("p")[0];
console.log(parent(p, 1).nodeName);     // BODY
console.log(parent(p, 2).nodeName);     // HTML
console.log(parent(p, 3));              // null : 디버거로 확인해 볼 것.

/**
 * Element 객체의 e 의 n 번째 형제 요소를 반환한다.
 * n 이 0 이면 자신을 반환. 양수이면 n 번째 형제를 반환. 음수이면 뒤에서 부터 반환. 가장 뒤가 -1 이다.
 */
function sibling(e, n) {            // n 은 반드시 넘어와야 한다고 가정하자.
    while (e && n !== 0) {
        if (n > 0) {                // 다음 형제 요소를 찾는다.
            if (e.nextElementSibling) e = e.nextElementSibling;
            else {
                for (e = e.nextSibling; e && e.nodeType !== 1; e = e.nextSibling)
                    /* 텅 빈 반복문 */ ;     // 결국에 e 는 null 이 된다.
            }
            n--;
        } else {                    // 이전 형제 요소를 찾는다.
            if (e.previousElementSibling) e = e.previousElementSibling;
            else {
                for (e = e.previousSibling; e && e.nodeType !== 1; e = e.previousSibling)
                    /* 텅 빈 반복문 */ ;    // 결국 e 는 null 이 된다.
            }
            n++;
        }
    }

    return e;
}
var h1 = document.getElementsByTagName("h1")[1];
console.log(sibling(h1, 1).innerText);              // Good Afternoon
console.log(sibling(h1, -1).innerText);             // Good morning
console.log(sibling(h1, 0).innerText);              // Good afternoon

/**
 * e 의 n 번째 자식 요소를 반환한다. n 번 째가 존재하지 않으면 null 을 반환한다.
 * n 이 음수면 끝에서 부터 센다. 0은 첫번째 자식 객체를 의미한다.
 * -1은 마지막 자식 객체를 의미한다.
 */
function child(e, n) {
    if (e.children) {               // children이 정의 되어 있는 경우.
        if (n < 0) n += e.children.length;      // 끝 부터 세는 경우에 인덱스를 맞춰준다.
        if (n < 0) return null;                 // 여전히 음수면 자식객체가 없다.
        return e.children[n];                   // 특정 자손 객체를 반환.
    }

    // e에 children 배열이 없는 경우(구현X). 첫번째 자식 객체를 찾아서 세든가 마지막 자식 객체를 찾아서 센다.
    if (n >= 0) {               // 첫 자식 객체로 부터 순서대로 센다.
        if (e.firstElementChild) e = e.firstElementChild;       // 첫 번째 자식 객체가 있는 경우.
        else {
            for (e = e.firstChild; e && e.nodeType !== 1; e = e.nextSibling)
                /* 빈 반복문 */ ;       // 결국 e 는 null 이 된다.
        }
        return sibling(e, n);
    } else {                    // 마지막 자식 객체로 부터 거꾸로 센다.
        if (e.lastElementChild) e = e.lastElementChild;
        else {
            for (e = e.lastChild; e && e.nodeType !== 1; e = e.previousSibling)
                /* 빈 반복문 */ ;       // 결국 e 는 null이 된다.
        }
        return sibling(e, n + 1);
    }
}
var li = document.getElementsByTagName("ul")[0];
console.log(child(li, 0).textContent);          // AAA
console.log(child(li, 1).textContent);          // BBB
console.log(child(li, -1).textContent);         // CCC


/**
 * 요소의 자손 객체 중에서 모든 Text 노드 객체를 찾기.
 * 모든 자손을 돌면서 텍스트의 내용을 연결한다.
 */
function textContent(e) {
    var child, type, s = "";
    for (child = e.firstChild; child !== null; child = child.nextSibling) {
        type = child.nodeType;
        if (type === Node.TEXT_NODE || type === Node.CDATA_SECTION_NODE) {
            s += child.nodeValue;
        } else if (type === Node.ELEMENT_NODE) {
            s += textContent(child);
        }
    }
    return s;
}
console.log(textContent(document.body));


/**
 * 모든 자손 노드의 텍스트를 대문자로 바꾼다.
 */
function upcase(n) {
    if (n.nodeType === Node.TEXT_NODE || n.nodeType === Node.CDATA_SECTION_NODE)
      n.data = n.data.toUpperCase();
    else
        for (var i = 0; i < n.childNodes.length; i++)
            upcase(n.childNodes[i]);
}
// upcase(document.body);       // 주석 풀고 테스트

/**
 * parent 노드에 n 번째 자식 노드로 child 노드를 삽입한다.
 */
function insertAt(parent, child, n) {
    if (n < 0 || n > parent.childNodes.length) throw new Error("invalid index");
    else if (n === parent.childNodes.length) parent.appendChild(child);
    else parent.insertBefore(child, parent.childNodes[n]);      // 두 번째 인자의 바로 앞에 삽입한다.
}






















































