// 괄호는 여는 괄호가 나오는 순서대로 참조를 생성한다.
var reg = /([Jj]ava([Ss]cript)?)\sis\s(fun\w*)/;
var match = reg.exec("Javascript is fun?");
console.log(match[1], match[2], match[3]);      // Javascript  script  fun

// (?:~~~)를 사용하면 그룹핑은 하지만 참조를 생성하지는 않는다.
var reg = /([Jj]ava(?:[Ss]cript)?)\sis\s(fun\w*)/;
var match = reg.exec("Javascript is fun?");
console.log(match[1], match[2], match[3]);      // Javascript  fun  undefined

// 매치 위치 지정
// \b는 단어의 경계를 나타낸다(\w와 \W 문자사이,  \w와 문자열의 시작이나 끝을 의미한다.)
// AlphaNumeric_(ASCII)와 비문자 사이의 경계를 의미.
// (?=p)  ==> 뒤이서서 p가 등장하나 매칭결과에는 포함되지 않는다.
// (?!p)  ==> 뒤어어서 p가 등장하지 않아야 한다.
var reg= /\bJava\b/;
var match = reg.exec("Java");
console.log(match[0], match[1]);        // Java  undefined

var reg = /[Jj]ava([Ss]cript)?(?=:)/;
var match = reg.exec("JavaScript: Definitive Guide");
console.log(match[0], match[1]);        // JavaScript Script

var reg = /[Jj]ava(?!Script)([A-Z]\w*)/;
var match = reg.exec("JavaBeans");
console.log(match[0], match[1]);        // JavaBeans  Beans

// 플래그 설정
// m: 은 여러 줄 모드를 의미한다. ^은 줄의 시작이나 문자열의 시작과 일치하고 $는 줄의 끝이나 문자열의 끝과 일치한다.
var text = "javascript javascript javascript";
var str = text.replace(/javascript/gi, "JavaScript");       // 원본 문자열을 변경하지 않는다.
console.log(str);                   // JavaScript  JavaScript  JavaScript
// 첫 번째 매칭되는 부분만 변경된다.
var str1 = text.replace("javascript", "JavaScript");
console.log(str1);                  // JavaScript  javascript  javascript

var quote = /"([^"]*)"/g;
var result = 'He is a "nice" person'.replace(quote, "'$1'");
console.log(result);                // He is a 'nice' person

// 매칭 결과가 여러 개가 나오는 경우(g 옵션을 준 경우) parentheses는 동작하지 않는다.
var match = "1 plus 2 equals 3".match(/(\d+)/g);
console.log(match[0], match[1], match[2], match[3], match[4]);      // 1  2  3  undefined  undefined

// URL 분석하는 정규식
var url = /(\w+):\/\/([\w.]+)\/(\S*)/;
var text = "Visit my blog at http://www.example.com/~david";
var result = text.match(url);       // match는 배열을 반환.
if (result != null) {
    var fullurl = result[0];
    var protocol = result[1];
    var host = result[2];
    var path = result[3];
}
console.log(fullurl);           //  http://www.example.com/~david
console.log(protocol);          //  http
console.log(host);              //  www.example.com
console.log(path);              //  ~david
// lastIndex는 g 옵션이 있어야 동작한다.
console.log(url.lastIndex, url.source);     // 0   "(\w+):\/\/([\w.]+)\/(\S*)"

// 비교해 볼 문제....
// exec는 반복해서 실행가능하나 match는 한 번만 가능하다.
// 정규 표현식 객체의 exec 메서드는 무조건 일치하는 문자열 한 개를 찾으면 배열을 만들어 반환한다.
// 정규 표현식에 g 옵션이 붙은 경우에는 exec를 반복해서 사용할 수 있다.
// exec() 메서드를 실행시 인자로 넘긴 문자열을 대상으로 lastIndex 위치부터 검사를 한다.(초기값은 0)
// exec() 메서드를 실행할 때마다 표현식 객체의 lastIndex 프로퍼티 값이 변경된다.
var re = /a(b+)c/g;
console.log(re.lastIndex);              // 0  : 이 인덱스부터 검사를 시작한다.

var match = re.exec("abcabbcabbbc");
console.log(match, re.lastIndex);                 // ["abc", "b", index: 0, input: "abcabbcabbbc"]   3

match = re.exec("abcabbcabbbc");
console.log(match, re.lastIndex);                 // ["abbc", "bb", index: 3, input: "abcabbcabbbc"]   7

match = re.exec("abc");
console.log(match, re.lastIndex);                 // null   0 : 매칭되는 것을 찾지 못하면 lastIndex는 0으로 설정된다.

match = re.exec("abcabbcabbbc");
console.log(match);                               // ["abc", "b", index: 0, input: "abcabbcabbbc"]

match = re.exec("abcabbcabbbc");
console.log(match);                               // ["abbc", "bb", index: 3, input: "abcabbcabbbc"]

match = re.exec("abcabbcabbbc");
console.log(match, re.lastIndex);                 // ["abbbc", "bbb", index: 7, input: "abcabbcabbbc"]  12

match = re.exec("abcabbcabbbc");
console.log(match, re.lastIndex);                 // null  0

match = "abcabbcabbbc".match(/a(b+)c//*g*/);
console.log(match);                     // ["abc", "b", index: 0, input: "abcabbcabbbc"]


// split() 메서드
var result = "1,2, 3  ,  4 ,  5, 6   ,7".split(/\s*,\s*/);
console.log(result);            //  ["1", "2", "3", "4", "5", "6", "7"]




















































































