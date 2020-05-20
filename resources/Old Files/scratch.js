function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {};
}

var actElement = document.activeElement;
var newElement = document.querySelectorAll("[id*='body-outline'] > span")[0];
var clickEvent = document.createEvent ('MouseEvents');
//Mousedown
eventType = "mousedown";
clickEvent.initEvent (eventType, true, true);
newElement.dispatchEvent (clickEvent);
sleep(500);
//Mouseup
eventType = "mouseup";
clickEvent.initEvent (eventType, true, true);
newElement.dispatchEvent (clickEvent);
sleep(500);
//Click
eventType = "click";
clickEvent.initEvent (eventType, true, true);
newElement.dispatchEvent (clickEvent);
sleep(500);

var actElement = document.activeElement;
console.log(actElement);

















//ABOVE HERE TESTING INDIVIDUALLY TODAY

function getActiveEditElement() {
    // stolen from Surfingkeys. Needs work.

    let element = document.activeElement;
    // on some pages like chrome://history/, input is in shadowRoot of several other recursive shadowRoots.
    while (element?.shadowRoot) {
        if (element.shadowRoot.activeElement) {
            element = element.shadowRoot.activeElement;
        } else {
            const subElement = element.shadowRoot.querySelector('input, textarea, select');
            if (subElement) {
                element = subElement;
            }
            break;
        }
    }
    return element;
}



var eachBlock = getActiveEditElement();
console.log('Active element: ',eachBlock);
console.log('tag: ',eachBlock.tagName.toLocaleLowerCase());
var eachBlockText = eachBlock.textContent;
console.log('Current text: ',eachBlockText);
var newText = `BEFORE ${eachBlockText} AFTER`;

var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
nativeInputValueSetter.call(eachBlock, newText);

var ev2 = new Event('input', { bubbles: true});
eachBlock.dispatchEvent(ev2);


/*
eachBlock.value = newText;
eachBlock.selectionStart = 0;
eachBlock.selectionEnd = newText.length;
eachBlock.dispatchEvent(getInputEvent());
*/
