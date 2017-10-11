(function() {
    function invoke(f, start, interval, end) {
        if (!start) start = 0;
        if (arguments.length <= 2)          // 인자가 2개 이하이면
            setTimeout(f, start);           // 한 번만 호출
        else
            setTimeout(repeat, start);
        function repeat() {
            var h = setInterval(f, interval);       // 인터벌 생성
            if (end) setTimeout(function() { clearInterval(h); }, end);     // 인터벌 종료
        }
    }

    window.onload = function() {
        var func = function() {
            console.log((new Date()).toLocaleTimeString());
        };

        invoke(func, 0, 1000, 10000);           // 10초 후에 인터벌 종료
    };
})();

