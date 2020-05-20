/*
function delay(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

var getMouseEvent = (mouseEventType, buttons) =>
    new MouseEvent(mouseEventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons
    });

var Mouse = {
  BASE_DELAY: 20,
  simulateClick(buttons, element, delayOverride) {
    var mouseClickEvents = ['mousedown', 'click', 'mouseup'];
    mouseClickEvents.forEach(mouseEventType => {
      element.dispatchEvent(getMouseEvent(mouseEventType, buttons));
    });
    return delay(delayOverride || this.BASE_DELAY);
  },
  leftClick(element, additionalDelay) {
    return this.simulateClick(1, element, additionalDelay);
  }
};
*/

function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}

var currentPage = document.title;

if(currentPage == 'All Pages')
{
    var allPages = document.getElementsByClassName("rm-pages-title-col");
    //console.log(allPages);
    var arrPages = [];

    var pageCtr = 0;
    for (var i = 0; i < allPages.length; i++)
    {
        var eachPageDiv = allPages.item(i);
        var eachPageLink = eachPageDiv.querySelector("a > strong")
        if(eachPageLink !== null)
        {
            var eachPageName = eachPageLink.textContent;
            if(eachPageName.length > 0){arrPages.push(eachPageName);}
            //console.log(eachPageName);
            pageCtr++;
        }
    }
    console.log(pageCtr);
    console.log(arrPages.length);
}
else if(currentPage !== 'Daily Notes')
{
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

    simulate(document.body, "mousedown");
    //simulate(document.body, "click");
    //simulate(document.body, "mouseup");
    //await Mouse.leftClick(document.body);
    //Loop through page with content you want to link
    //The roam-block class also matches linked references which we don't want to look through so we are filtering on ID with wildcard instead
    var allBlocks = document.querySelectorAll("[id*='body-outline']");
    //var allBlocks = document.getElementsByClassName("roam-block");

    //console.log(allBlocks);
    var arrPageContentBlocks = [];
    //Var total text on page
    var allTextContent = "";

    var blockCtr = 0;
    for (var i = 0; i < allBlocks.length; i++)
    {
        var eachBlockDiv = allBlocks.item(i);
        console.log(eachBlockDiv);
        var eachBlockSpan = eachBlockDiv.querySelector(":scope > span");
        console.log(eachBlockSpan);
        if(eachBlockSpan !== null)
        {
            //await Mouse.leftClick(eachBlockSpan);
            simulate(eachBlockSpan, "mousedown");
            //simulate(eachBlockSpan, "click");
            //simulate(eachBlockSpan, "mouseup");

            var eachBlock = getActiveEditElement();
            //console.log('Active element: ',eachBlock);
            //console.log('tag: ',eachBlock.tagName.toLocaleLowerCase());
            arrPageContentBlocks.push(eachBlockSpan);
            var eachBlockText = eachBlock.textContent;
            allTextContent += eachBlockText.toString().trim() + ' \n';
            //console.log('Current text: ',eachBlockText);
            /*
            var newText = `BEFORE ${eachBlockText} AFTER`;
            var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeInputValueSetter.call(eachBlock, newText);
            var ev2 = new Event('input', { bubbles: true});
            eachBlock.dispatchEvent(ev2);
            */
            blockCtr++;
        }
    }
    console.log(blockCtr);
    console.log(arrPageContentBlocks.length);
    console.log(allTextContent);
    //await Mouse.leftClick(document.body);
if(1==2){
    //Loop through each page to see if matching any of the content
    for(var i = 0; i < arrPages.length; i++)
    {
        //console.log('I: ', i);
        if(i > 20){break;}
        var indivPageName = arrPages[i];
        //console.log('Page: ', indivPageName);
        var bMatch = allTextContent.includes(indivPageName);
        if(bMatch)
        {
            //console.log('Found: ', indivPageName);
            if(2 == 2){
            //Loop through each block to find the matches and decide to tag or not
            for(var x = 0; x < arrPageContentBlocks.length; x++)
            {
                //console.log('X: ', x);
                if(x == 0)
                {
                    //console.log('Exited x loop');
                    //var newEachBlockSpan = arrPageContentBlocks[x];
                    //console.log(newEachBlockSpan);
                    break;
                    //await Mouse.leftClick(newEachBlockSpan);
                    var newEachBlock = getActiveEditElement();
                    //console.log(newEachBlock);
                    break;
                    if(newEachBlock)
                    {
                        var eachBlockText = newEachBlock.textContent;
                        var pLinkPage = Number(prompt(`Block: ${eachBlockText}\n\nTage with page: [[${indivPageName}]]\n\n0 = NO, 1 = YES`, 0));
                        if(pLinkPage == 1){console.log('Yes replace');}else{console.log('Do NOT replace');}
                        //console.log('Current text: ',eachBlockText);
                        /*var newText = `BEFORE ${eachBlockText} AFTER`;
                        var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                        nativeInputValueSetter.call(newEachBlock, newText);
                        var ev2 = new Event('input', { bubbles: true});
                        newEachBlock.dispatchEvent(ev2);*/
                    }
                }
            }
            }
        }
    }
}
    console.log('DONE');
}
else
{
    console.log('On Daily Notes page which is too risky to run script against right now!');
}

console.log('end of file');
