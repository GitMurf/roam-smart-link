async function delay(millis) {
    //console.log("slept");
    return new Promise(resolve => setTimeout(resolve, millis));
}

const getMouseEvent = (mouseEventType, buttons) =>
    new MouseEvent(mouseEventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons
    });

async function simulateClick(buttons, element, delayOverride) {
    const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
    mouseClickEvents.forEach(mouseEventType => {
        //console.log(mouseEventType);
        element.dispatchEvent(getMouseEvent(mouseEventType, buttons));
    });
    return delay(100);
    //await delay(2000);
}

async function setNewValue(curBlock, newValue) {
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    nativeInputValueSetter.call(curBlock, newValue);
    var ev2 = new Event('input', { bubbles: true });
    curBlock.dispatchEvent(ev2);
    return delay(100);
}

var neweachBlockDivId = 'block div element ID' //Find each block you want to update however you want. Loop etc.
var eachBlockDiv = document.getElementById(neweachBlockDivId);
await simulateClick(1, eachBlockDiv, 0);
eachBlockTextArea = document.querySelectorAll(".rm-block-input").item(0);
curValue = eachBlockTextArea.value;
var newStuff = curValue.replace('OLD STUFF', 'NEW STUFF');
await setNewValue(eachBlockTextArea, newStuff);