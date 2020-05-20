var updateEvent = new Event('input', {
    bubbles: true,
    cancelable: true,
});

function getInputEvent() {
    return new Event('input', {
        bubbles: true,
        cancelable: true,
    });}

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

//var eachBlock = document.querySelector(".rm-block-input");
var eachBlock = getActiveEditElement();
console.log('eachBlock: ',eachBlock);
var eachBlockText = eachBlock.textContent;
//if(eachBlockText.length > 0){arrPageContentBlocks.push(eachBlockText);}
console.log('eachBlockText: ',eachBlockText);
var newText = `BEFORE ${eachBlockText} AFTER`;
console.log('newText: ',newText);

console.log('tag: ',eachBlock.tagName.toLocaleLowerCase());

//Update elevent and trigger roam to actually update/sync otherwise changes will just dissapear
//var roamElement = getRoamBlockInput(eachBlock);
//eachBlock.value = newText;
eachBlock.value = newText;
eachBlock.selectionStart = 0;
eachBlock.selectionEnd = newText.length;
//roamElement.selectionStart = eachBlock.selection.start;
//roamElement.selectionEnd = eachBlock.selection.end;

eachBlock.dispatchEvent(getInputEvent());

//eachBlock.innerText = `BEFORE ${eachBlockText} AFTER`;
//roamElement.dispatchEvent(getInputEvent());



export function delay(millis: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, millis));
}

export const Mouse = {
  BASE_DELAY: 20,
  simulateClick(buttons: number, element: HTMLElement, delayOverride: number = 0) {
    const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
    mouseClickEvents.forEach(mouseEventType => {
      element.dispatchEvent(getMouseEvent(mouseEventType, buttons));
    });
    return delay(delayOverride || this.BASE_DELAY);
  },
  leftClick(element: HTMLElement, additionalDelay:number = 0) {
    return this.simulateClick(1, element, additionalDelay);
  }
};

const getMouseEvent = (mouseEventType: string, buttons: number) =>
    new MouseEvent(mouseEventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons
    });

await Mouse.leftClick(element)
