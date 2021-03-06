//v0.1

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
  return delay(200);
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

//testing();

// ****************************************************************************************
// ****************************************************************************************
// ****************************************************************************************
// ****************************************************************************************

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
    await simulateClick(1, document.body, 0);
    //Loop through page with content you want to link
    //The roam-block class also matches linked references which we don't want to look through so we are filtering on ID with wildcard instead
    //Each DIV holds each bullet and then the textarea html element is visible only when DIV is clicked
    //var allBlocks = document.getElementsByClassName("roam-block");
    var allBlocks = document.querySelectorAll("[id*='body-outline']");
    var arrPageContentBlocks = [];
    //Var total text on page
    var allTextContent = "";

    var blockCtr = 0;
    for (var i = 0; i < allBlocks.length; i++)
    {
        var eachBlockDiv = allBlocks.item(i);
        //console.log(eachBlockDiv);
        if(eachBlockDiv !== null)
        {
            await simulateClick(1, eachBlockDiv, 0);
            var eachBlockTextArea = document.querySelectorAll(".rm-block-input").item(0);
            var curValue = eachBlockTextArea.value.toString().trim();
            //var newStuff = curValue + " ADDED ON END";
            //var eachBlockText = eachBlockTextArea.value;

            arrPageContentBlocks.push(curValue);
            allTextContent += curValue + ' \n';
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
                        //var neweachBlockDiv = arrPageContentBlocks[x];
                        //console.log(neweachBlockDiv);
                        break;
                        //await Mouse.leftClick(neweachBlockDiv);
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
