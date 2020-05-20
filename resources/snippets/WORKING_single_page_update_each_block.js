//v0.1

async function delay(millis) {
    console.log("slept");
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
      console.log(mouseEventType);
    element.dispatchEvent(getMouseEvent(mouseEventType, buttons));
  });
  return delay(2000);
  //await delay(2000);
}

function setNewValue(curBlock, newValue)
{
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    nativeInputValueSetter.call(curBlock, newValue);
    var ev2 = new Event('input', { bubbles: true});
    curBlock.dispatchEvent(ev2);
}

async function testing(){
    console.log("start");
    await simulateClick(1, document.body, 0);
    var allDivBlocks = document.querySelectorAll("[id*='body-outline']");
    var element = allDivBlocks[0];

    console.log("1");
    await simulateClick(1, element, 0);
    var eachBlockTextArea = document.querySelectorAll(".rm-block-input").item(0);
    var newStuff = eachBlockTextArea.value + " ADDED ON END";
    setNewValue(eachBlockTextArea, newStuff);

    console.log("2");
    element = allDivBlocks[1];
    await simulateClick(1, element, 0);
    var eachBlockTextArea = document.querySelectorAll(".rm-block-input").item(0);
    var newStuff = eachBlockTextArea.value + " ADDED ON END";
    setNewValue(eachBlockTextArea, newStuff);

    console.log("3");
    element = allDivBlocks[2];
    await simulateClick(1, element, 0);
    var eachBlockTextArea = document.querySelectorAll(".rm-block-input").item(0);
    var newStuff = eachBlockTextArea.value + " ADDED ON END";
    setNewValue(eachBlockTextArea, newStuff);

    console.log("4");
    element = allDivBlocks[3];
    await simulateClick(1, element, 0);
    var eachBlockTextArea = document.querySelectorAll(".rm-block-input").item(0);
    var newStuff = eachBlockTextArea.value + " ADDED ON END";
    setNewValue(eachBlockTextArea, newStuff);

    console.log("5");
    console.log("END");
}

testing();
