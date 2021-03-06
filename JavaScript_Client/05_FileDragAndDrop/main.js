/**
 * 드랍존에 파일 여러개를 드랍하면 파일 이름들이 콘솔에 찍힌다.
 */

function drop_handler(ev) {
    console.log("Drop");
    ev.preventDefault();
    // If drop items aren't files, reject them
    var dt = ev.dataTransfer;
    if (dt.items) {
        // Use DataTransferItemList interface to access file(s)
        for (var i = 0; i < dt.items.length; i++) {
            if (dt.items[i].kind === "file") {
                var f = dt.items[i].getAsFile();
                console.log("...file[" + i + "].name = " + f.name);
            }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < dt.files.length; i++) {
            console.log("...file[" + i + "].name = " + dt.files[i].name);
        }
    }
}

function dragover_handler(ev) {
    console.log("dragOver");
    // Prevent default select and drag behavior
    ev.preventDefault();
}

function dragend_handler(ev) {
    console.log("dragEnd");
    // Remove all of the drag data
    var dt = ev.dataTransfer;
    if (dt.items) {
        // Use DataTransferItemList interface to remove the drag data
        for (var i = 0; i < dt.items.length; i++) {
            dt.items.remove(i);
        }
    } else {
        // Use DataTransfer interface to remove the drag data
        ev.dataTransfer.clearData();
    }
}

















































