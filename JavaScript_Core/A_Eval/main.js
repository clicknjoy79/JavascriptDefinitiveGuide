/**
 * eval을 다른 변수에 저장하면 전역범위에서 실행된다.
 */
var geval = eval;
var x = "Global", y = "Global";
function f() {
    var x = "Local";
    eval("x += 'changed';");
    return x;
}

function g() {
    var y = "Local";
    geval("y += 'changed';");       // 전역 범위에서 실행
    return y;
}

console.log(f(), x);        // Localchanged Global
console.log(g(), y);        // Local Globalchanged
