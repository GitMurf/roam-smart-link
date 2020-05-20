function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {};
}

function custClickEvent(elemToClick, eventType, waitMS) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    elemToClick.dispatchEvent (clickEvent);
    sleep(waitMS);
}

function clickAllThree(elemToClick) {
    var milliEachEvent = 200;
    custClickEvent(elemToClick, "mousedown", milliEachEvent);
    custClickEvent(elemToClick, "mouseup", milliEachEvent);
    custClickEvent(elemToClick, "click", milliEachEvent);
}

function getAllRoamBlockSpan() {
    var allSpanBlocks = document.querySelectorAll("[id*='body-outline'] > span");
    console.log('text area: ', eachBlockTextArea);
    console.log('text area value: ', eachBlockTextArea.value);
}

function findTextArea() {
    var eachBlockTextArea = document.querySelectorAll(".rm-block-input").item(0);
    console.log('text area: ', eachBlockTextArea);
    console.log('text area value: ', eachBlockTextArea.value);
}

var currentPage = document.title;

clickAllThree(document.body);


console.log('end of file');
