function onLoad(f) { window.onload = f;}

onLoad(function() {
    // TOC 컨테이너 요소를 찾는다.
    // 없으면 문서 상단에 생성한다.
    var toc = document.getElementById("TOC");
    if (!toc) {
        toc = document.createElement("div");
        toc.id = "TOC";
        document.body.insertBefore(toc, document.body.firstChild);
    }

    // 모든 제목 요소(h1 ~ h6)를 찾는다.
    var headings;

    if (document.querySelectorAll)
        headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    else
        headings = findHeadings(document.body, []);

    // 제목 요소들을 찾기 위한 재귀 함수.
    function findHeadings(root, sects) {
        for (var child = root.firstChild; child != null; child = child.nextSibling) {
            if (child.nodeType !== Node.ELEMENT_NODE) continue;
            if (child.nodeName.length === 2 && child.nodeName.charAt(0) === 'H')
                sects.push(child);
            else
                findHeadings(child, sect);
        }
        return sects;
    }

    // 단락의 순번(예> 2.3.1)을 만들기 위한 배열 생성. h1 ~ h6 태그의 갯수가 들어간다.
    var sectionNumbers = [0, 0, 0, 0, 0, 0];

    for (var h = 0; h < headings.length; h++) {
        var heading = headings[h];

        // TOC 컨테이너 안쪽으 단락 제목은 무시한다.
        if (heading.parentNode === toc) continue;

        // 제목의 레벨을 계산한다.(h1 의 경우에는 1)
        var level = parseInt(heading.tagName.charAt(1));
        if (isNaN(level) || level < 1 || level > 6) continue;

        // 레벨에 해당하는 단락 순번을 증가시킨다.
        // 그리고 레벨 보다 낮은 제목 순번을 0으로 되돌린다.
        sectionNumbers[level - 1]++;
        for (var i = level; i < 6; i++) sectionNumbers[i] = 0;

        // 2.3.1 같이 단락 순번을 만들기 위해서 모든 제목 레벨의 단락 순번을 합친다.
        var sectionNumber = sectionNumbers.slice(0, level).join(".");

        // 단락 제목에 단락 순번을 추가한다.
        // 스타일 시트를 적용하기 위해 <span> 태그 안에 순번을 넣는다.
        var span = document.createElement("span");
        span.className = "TOCSectNum";
        span.innerHTML = sectionNumber;
        heading.insertBefore(span, heading.firstChild);

        // 링크로 이동할 수 있도록, 이름 있는 앵커 태그로 제목을 감싼다.
        var anchor = document.createElement("a");
        anchor.name = "TOC" + sectionNumber;
        heading.parentNode.insertBefore(anchor, heading);
        anchor.appendChild(heading);        // 헤딩을 이동시킴.

        // 이제, 이 단락에 링크를 만든다.
        var link = document.createElement("a");
        link.href = "#TOC" + sectionNumber;
        link.innerHTML = heading.innerHTML;

        // 제목 레벨에 맞는 스타일 지정이 가능한 <div> 안에 링크를 넣는다.
        var entry = document.createElement("div");
        entry.className = "TOPEntry TOCLevel" + level;
        entry.appendChild(link);

        // TOC 컨테이너에 <div>를 추가한다.
        toc.appendChild(entry);
    }
});






























































































