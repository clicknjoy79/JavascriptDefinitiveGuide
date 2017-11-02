/**
 * h1과 h2를 동일하게 하고 text-decoration이 있는 h3 스타일은 제거한다.
 */


var ss = document.styleSheets[0];
var rules = ss.cssRules ? ss.cssRules : ss.rules;

for (var i = 0; i < rules.length; i++) {
    var rule = rules[i];
    if (!rule.selectorText) continue;   // @import 처럼 실제 스타일 규칙이 아닌 요소들은 건너뛴다.

    var selector = rule.selectorText;       // CSS 선택자
    var ruleText = rule.style.cssText;      // 스타일 텍스트

    // h1 요소에 적용되는 규칙일 경우, h2에도 똑같이 적용시킨다.
    // CSS 선택자가 문자 그대로 "h1"일 때만 동작한다는 점에 주의하자.
    if (selector === "h1") {
        if (ss.insertRule) ss.insertRule("h2 {" + ruleText + "}", rules.length);
        else if (ss.addRule) ss.addRule("h2", ruleText, rules.length);
    }

    // CSS 규칙에 text-decoration 프로퍼티가 정의되어 있으면 제거한다.
    if (rule.style.textDecoration) {
        if (ss.deleteRule) ss.deleteRule(i);
        else if (ss.removeRule) ss.removeRule(i);
        i--;        // CSS 규칙을 제거한 후 현재 인덱스는 i + 1 이 되므로, 반복 인덱스를 조정해준다.
    }
}