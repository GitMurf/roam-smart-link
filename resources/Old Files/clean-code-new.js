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

function findTextArea() {
    var eachBlockTextArea = document.querySelectorAll(".rm-block-input").item(0);
    console.log('text area: ', eachBlockTextArea);
}

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
    clickAllThree(document.body);
    //Loop through page with content you want to link
    //The roam-block class also matches linked references which we don't want to look through so we are filtering on ID with wildcard instead
    //Then get direct SPAN element which holds each bullet and then the textarea html element is visible only when SPAN is clicked
    //var allBlocks = document.getElementsByClassName("roam-block");
    var allBlocks = document.querySelectorAll("[id*='body-outline'] > span");
    //console.log(allBlocks);
    var arrPageContentBlocks = [];
    //Var total text on page
    var allTextContent = "";

    var blockCtr = 0;
    for (var i = 0; i < allBlocks.length; i++)
    {
        var eachBlockSpan = allBlocks.item(i);
        console.log(eachBlockSpan);
        if(eachBlockSpan !== null)
        {
            clickAllThree(eachBlockSpan);
            sleep(3000);
            findTextArea();
            //var eachBlockTextArea = document.activeElement;
            //console.log('before1: ', eachBlockTextArea);
            //eachBlockTextArea = getActiveEditElement();
            //console.log('before2: ', eachBlockTextArea);
            //var tempPrompt = Number(prompt('Continue', 0));
            //var eachBlockTextArea = document.querySelectorAll(".rm-block-input").item(0);
            //var tempPrompt = Number(prompt('Continue', 0));
            //console.log('before3: ', eachBlockTextArea);
            //console.log('before3: ', eachBlockTextArea[0]);
            //console.log('before3: ', eachBlockTextArea.item(1));
            sleep(3000);

            //eachBlockTextArea = document.querySelectorAll(".rm-block-input");
            //console.log('before4: ', eachBlockTextArea.item(1));
            //console.log('after: ', eachBlockTextArea);
            //console.log('Active element: ',eachBlockTextArea);
            //console.log('tag: ',eachBlockTextArea.tagName.toLocaleLowerCase());
            //var eachBlockText = eachBlockTextArea.value;
            //console.log('text value: ', eachBlockText);
            //arrPageContentBlocks.push(eachBlockText.toString());
            //allTextContent += eachBlockText.toString().trim() + ' \n';
            //console.log('Current text: ',eachBlockText);
            /*
            var newText = `BEFORE ${eachBlockText} AFTER`;
            var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeInputValueSetter.call(eachBlockTextArea, newText);
            var ev2 = new Event('input', { bubbles: true});
            eachBlockTextArea.dispatchEvent(ev2);
            */
            blockCtr++;
        }
    }
    console.log('blocks: ', blockCtr);
    console.log('array: ', arrPageContentBlocks.length);
    console.log('allText: ', allTextContent);
    //await Mouse.leftClick(document.body);
if(1==2)
{
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
            if(2 == 2)
            {
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
