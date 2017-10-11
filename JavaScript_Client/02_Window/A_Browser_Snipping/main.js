// URL 파싱
/**
 * var args = urlArgs();        // URL 에서 파라미터를 해석한다.
 * var q = args.q || "";
 * var n = args.n ? parseInt(args.n) || 10;
 */
function urlArgs() {
    var args = {};
    var query = location.search.substring(1);       // 쿼리스트링을 얻어온 후 '?' 를 제거한다.
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf("=");
        if (pos === -1) continue;
        var name = pairs[i].substring(0, pos);      // 파라미터 이름
        var value = pairs[i].substring(pos + 1);    // 파라미터 값
        value = decodeURIComponent(value);
        args[name] = value;                         // 객체에 담아서
    }
    return args;                                    // 리턴한다.
}

/**
 * navigator.userAgent 를 사용한 브라우저 스니핑
 * "webkit": 사파리 혹은 크롬.
 * "opr": 오페라 브라우저. 사실상 크롬과 거의 동일하다.
 * "mozilla": 파이어 폭스.
 * "msie": 인터넷 익스 플로러(10 이하 버전). 엣지의 경우에는 trident로 검색해야 하며 버전은 rv로 검사해야 한다.
 * 각 브라우저 개발자 도구를 띄운뒤 browser.name, browser.version을 찍어본다.
 */
var browser = (function(){
    var s = navigator.userAgent.toLowerCase();
    var match = /(opr)[\/]([\w.]+)/.exec(s) ||            // 오페라 검사
        /(webkit)[\/]([\w.]+)/.exec(s) ||                 // 크롬, 사파리 검사
        /(msie) ([\w.]+)/.exec(s)   ||                    // 익스플로러 검사
        !/compatible/.test(s) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(s);
    return { name: match[1], version: match[2] };
})();












































































