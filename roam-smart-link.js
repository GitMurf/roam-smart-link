//v0.2

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

function setNewValue(curBlock, newValue)
{
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    nativeInputValueSetter.call(curBlock, newValue);
    var ev2 = new Event('input', { bubbles: true});
    curBlock.dispatchEvent(ev2);
}

// ****************************************************************************************
// ****************************************************************************************
// ****************************************************************************************
// ****************************************************************************************
var arrPages = [];
async function startFunction()
{
    var currentPage = document.title;

    if(currentPage == 'All Pages')
    {
        //var allPages = document.getElementsByClassName("rm-pages-title-col");
        //console.log(allPages);


        var pageCtr = 0;
        var allPages = window.roamAlphaAPI.q('[:find ?e :where [?e :node/title] ]');
        for (var i = 0; i < allPages.length; i++)
        {
                    var eachPageDiv = allPages[i][0];
                    var pageTitle = window.roamAlphaAPI.pull('[:node/title]',eachPageDiv)[":node/title"]
                    if(pageTitle !== null)
            {
                        if(pageTitle.length > 0){arrPages.push(pageTitle);}
                        console.log(pageTitle);
                pageCtr++;
            }

                    if(i > 20){break;}
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
        var arrPageContentBlocksId = [];
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
                arrPageContentBlocksId.push(eachBlockDiv.id);
                allTextContent += curValue + ' \n';
                blockCtr++;
            }
        }
        await simulateClick(1, document.body, 0);
        console.log('blocks: ', blockCtr);
        console.log('array: ', arrPageContentBlocks.length);
        console.log('allText: ', allTextContent);
        //await Mouse.leftClick(document.body);
        var bMatch = false;
        var indivPageName = "";
        var neweachBlockDiv = "";
        var neweachBlockDivId = "";

        //Loop through each page to see if matching any of the content
        for(var j = 0; j < arrPages.length; j++)
        {
            //console.log('J: ', j);
            //if(j > 20){break;}
            indivPageName = arrPages[j];
            //indivPageName = "test";
            //console.log('Page: ', indivPageName);
            bMatch = allTextContent.includes(indivPageName);
            //var bMatch = true;
            if(bMatch)
            {
                console.log('Page: ', indivPageName);
                //console.log('Found: ', indivPageName);
                if(2 == 2)
                {
                    //var allBlocks = document.querySelectorAll("[id*='body-outline']");
                    //Loop through each block to find the matches and decide to tag or not
                    for(var k = 0; k < arrPageContentBlocks.length; k++)
                    {
                        console.log('K: ', k);
                        //console.log('X: ', x);
                        //console.log('Exited x loop');
                        neweachBlockDiv = arrPageContentBlocks[k];
                        neweachBlockDivId = arrPageContentBlocksId[k];
                        eachBlockDiv = document.getElementById(neweachBlockDivId);
                        neweachBlockDiv = eachBlockDiv.innerText; //Actually need to see what the current value is because other links may change this and may have linked to Genesis already so Genesis 43 would not be a match anymore because of [[ ]] around genesis
                        //Don't want to re-link a page name that is already linked so need to try and match with " " spaces around it OR beginning or end of the block since wouldn't have spaces around both sides.
                        if(neweachBlockDiv.includes(' ' + indivPageName + ' ') || neweachBlockDiv.substring(0,indivPageName.length) == indivPageName || neweachBlockDiv.substring(neweachBlockDiv.length - indivPageName.length) == indivPageName)
                        {
                            console.log(neweachBlockDiv);
                            //eachBlockDiv = document.getElementById(neweachBlockDivId);
                            console.log(eachBlockDiv);
                            //console.log(eachBlockDiv.id);
                            //await simulateClick(1, eachBlockDiv, 0);

                            //var eachBlockDiv = document.getElementById("block-input-R1S40rNV4ANUNdGed7VaElqiO783-body-outline-mJKfFvcl3-NXbG0i6oU");
                            //var eachBlockDiv = allBlocks.item(k);
                            await simulateClick(1, eachBlockDiv, 0);

                            eachBlockTextArea = document.querySelectorAll(".rm-block-input").item(0);
                        console.log(eachBlockTextArea);
                            curValue = eachBlockTextArea.value.toString().trim();

                                //var eachBlockText = newEachBlock.textContent;
                                var pLinkPage = Number(window.prompt(`Block: ${neweachBlockDiv}\n\nTag with page: [[${indivPageName}]]\n\n0 = NO, 1 = YES`, 0));
                                if(pLinkPage == 1)
                                {
                                    console.log('Yes replace');

        console.log(eachBlockDiv);
        console.log(eachBlockTextArea);
            console.log(curValue);
                                    var newStuff = neweachBlockDiv.replace(indivPageName,'[[' + indivPageName + ']]');
                                    console.log(newStuff);
                                    setNewValue(eachBlockTextArea, newStuff);
                                }
                                else
                                {
                                    console.log('Do NOT replace');
                                }
                            //}
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

    await simulateClick(1, document.body, 0);
    console.log('end of file');
}

startFunction();

/*

element = allDivBlocks[1];
await simulateClick(1, element, 0);
var eachBlockTextArea = document.querySelectorAll(".rm-block-input").item(0);
var newStuff = eachBlockTextArea.value + " ADDED ON END";
setNewValue(eachBlockTextArea, newStuff);

*/
