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


/**
 * 테이블 열 정렬.
 * 각 행의 n 번째 열의 값을 기준으로 지정한 테이블의 첫 번째 <tbody>의 행들을 정렬한다.
 * 정렬 기준 함수가 있는 경우 사용하며 없으면 알파벳 순으로 정렬한다.
 */
function sortrows(table, n, comparator) {
    var tbody = table.tBodies[0];       // 첫 번째 tbody: 존재한다고 가정하자.
    var rows = tbody.getElementsByTagName("tr");
    rows = Array.prototype.slice.call(rows, 0);     // rows를 배열로 만든다.

    // n 번째 td 요소를 기준으로 행들을 정렬한다.
    rows.sort(function(row1, row2) {
        var cell1 = row1.getElementsByTagName("td")[n];         // n 번째 td 요소(정확히는 인덱스가 n)
        var cell2 = row2.getElementsByTagName("td")[n];
        var val1 = cell1.textContent || cell1.innerText;
        var val2 = cell2.textContent || cell2.innerText;

        if (comparator) return comparator(val1, val2);

        if (val1 < val2) return -1;
        else if (val1 > val2) return 1;
        else return 0;
    });

    // 정렬된 행들을 테이블에 삽입한다.
    // 이 때 행들이 이미 테이블에 존재하므로 새로 삽입되는 것이 아니라 위치만 이동된다.(중요)
    for (var i = 0; i < rows.length; i++)
        tbody.appendChild(rows[i]);
}

/**
 * 테이블에서 th 요소를 클릭하면 테이블이 정렬되도록 한다.
 */
function makeSortable(table) {
    var headers = table.getElementsByTagName("th");
    for (var i = 0; i < headers.length; i++) {
        (function(n){
            headers[i].onclick = function() { sortrows(table, n); };
        })(i);
    }
}
makeSortable(document.getElementsByTagName("table")[0]);

/**
 * n 노드를 <b> 태그로 바꾸고 <b> 태그의 자식노드로 n을 만든다.
 */
function embolden(n) {
    // 파라미터가 노드가 아닌 문자열이면 id로 취급한다.
    if (typeof n === "string") n = document.getElementById(n);
    var parent = n.parentNode;
    var b = document.createElement("b");
    parent.replaceChild(b, n);
    b.appendChild(n);
}
var span = document.createElement("span");
document.body.appendChild(span);
span.appendChild(document.createTextNode("Hello H3"));
embolden(span);

/**
 * innerHTML 을 이용한 outerHTML 구현
 */
(function () {
    delete Element.prototype.outerHTML;
    // outerHTML 이 있으면 아무것도 하지 않는다.
    if (document.createElement("div").outerHTML) return;
    // this가 참조하는 Element의 outerHTML을 반환한다.
    function outerHTMLGetter() {
        var container = document.createElement("div");  // 컨테이너 생성
        container.appenChild(this.cloneNode(true));     // Element를 복사해서(deep copy) 컨테이너에 추가.
        return container.innerHTML;
    }

    // 파라미터로 해당 Element의 outerHTML을 지정한다.
    function outerHTMLSetter(value) {
        // 컨테이너를 생성하고 파라미터로 html을 세팅한다.
        var container = document.createElement("div");
        container.innerHTML = value;
        // 컨테이너 내부 요소를 부모노드로 이동 시킨다.
        // insertBefore() 는 복사해서 이동시키는게 아니라 요소를 원래의 위치에서 삭제하고 이동시킨다.(중요)
        while (container.firstChild)
            this.parentNode.insertBefore(container.firstChild, this);   //
        // 교체된 노드는 제거한다.
        this.parentNode.removeChild(this);
    }

    // 모든 객체의 outerHTML 프로퍼티의 getter, setter 로 두 함수를 사용한다.
    if (Object.defineProperty) {        // ES5의 Object.defineProperty가 존재하는 경우.
        Object.defineProperty(Element.prototype, "outerHTML", {
            get: outerHTMLGetter,
            set: outerHTMLSetter,
            enumerable: false, configurable: true
        });
    } else {
        Element.prototype.__defineGetter__("outerHTML", outerHTMLGetter);   // 접근자 프로퍼티를 정의
        Element.prototype.__defineSetter__("outerHTML", outerHTMLSetter);
    }
})();
document.getElementById("para").outerHTML = "<p>하느님이 보우하사</p>";

/**
 * DocumentFragment는 다른 노드를 담는 임시 컨테이너이다.
 * 부모 노드는 존재하지 않으며(null) 자식노드는 가질 수 있다.
 * 노드 n의 자식 노드들을 역순 정렬한다.
 */
function reverse(n) {
    // 임시 컨테이너로 사용할 DocumentFragment 객체.
    var container = document.createDocumentFragment();
    // n의 자식 객체를 역순으로 컨테이너에 담는다.
    // 주의할 것은 컨테이너에 담으면 n에서는 비워진다.(중요)
    while (n.lastChild)
        container.appendChild(n.lastChild);     // appendChild():  노드를 이동 + 추가하는 의미이다.
    n.appendChild(container);       // 컨테이너의 자식 노드들을 이동시킨다.
}
reverse(document.getElementById("list"));

/**
 * innerHTML을 이용한 insertAdjacentHTML() 구현.
 * Insert.before(), Insert.after(), Insert.atStart(), Insert.atEnd()를 구현해서 이를 이용한다.
 */
var Insert = (function() {
    // 요소에 네이티브 insertAdjacentHTML() 메서드가 있다면
    // 네 가지 삽입 함수에 이 메서드를 이용한다.

    Element.prototype.insertAdjacentHTML = undefined;   // 구현되지 않도록 강제한다.

    if (document.createElement("div").insertAdjacentHTML)
        return {
            before: function(e, h) { e.insertAdjacentHTML("beforebegin", h); },
            after: function(e, h) { e.insertAdjacentHTML("afterend", h); },
            atStart: function(e, h) { e.insertAdjacentHTML("afterbegin", h); },
            atEnd: function(e, h) { e.insertAdjacentHTML("beforeend", h); }
        };

    // 네이티브 insertAdjacentHTML 메서드가 없다면
    // 네 가지 삽입 함수를 구현하고 이것을 이용해 메서드를 구현한다.

    // 먼저 HTML 을 파싱해서 DocumentFragment 객체를 만드는 유틸리티 메서드를 정의한다.
    function fragment(html) {
        var elt = document.createElement("div");        // 빈 요소 생성.
        var frag = document.createDocumentFragment();   // 임시 컨테이너 생성.
        elt.innerHTML = html;

        while (elt.firstChild)              // 자식 노드들을 DocumentFragment로 이동.
            frag.appendChild(elt.firstChild);
        return frag;                    // frag 반환.
    }

    var Insert = {
        before: function(elt, html) {
            elt.parentNode.insertBefore(fragment(html), elt);
        },
        after: function(elt, html) {
            elt.parentNode.insertBefore(fragment(html), elt.nextSibling);
        },
        atStart: function(elt, html) {
            elt.insertBefore(fragment(html), elt.firstChild);
        },
        atEnd: function(elt, html) {
            elt.appendChild(fragment(html));
        }
    };

    // 앞의 함수를 이용해서 insertAdjacentHTML 메서드를 구현한다.
    Element.prototype.insertAdjacentHTML = function(pos, html) {
        switch(pos) {
            case "beforebegin": return Insert.before(this, html);
            case "afterend":    return Insert.after(this, html);
            case "afterbegin":  return Insert.atStart(this, html);
            case "beforeend":   return Insert.atEnd(this, html);
        }
    };

    return Insert;          // 리턴하지 않고 끝내도 상관은 없을 듯....
})();

document.getElementById("para2").insertAdjacentHTML("beforebegin", "<h3>beforebegin</h3>");
document.getElementById("para2").insertAdjacentHTML("afterend", "<h3>afterend</h3>");
document.getElementById("para2").insertAdjacentHTML("afterbegin", "<h3>afterbegin</h3>");
document.getElementById("para2").insertAdjacentHTML("beforeend", "<h3>beforeend</h3>");




























































































































