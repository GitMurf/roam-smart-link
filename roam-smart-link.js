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

async function setNewValue(curBlock, newValue) {
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    nativeInputValueSetter.call(curBlock, newValue);
    var ev2 = new Event('input', { bubbles: true });
    curBlock.dispatchEvent(ev2);
    return delay(100);
}

function compareMatch(lookForVal, insideOfVal) {
    var origLookForVal = lookForVal;
    var origInsideOfVal = insideOfVal;
    var foundMatchString = '';
    //Don't want to re-link a page name that is already linked so need to try and match with " " spaces around it OR beginning or end of the block since wouldn't have spaces around both sides.
    //Exact match: middle, full block, beginningn of block, or end of block
    if (insideOfVal.includes(' ' + lookForVal + ' ') || insideOfVal == lookForVal || insideOfVal.substring(0, lookForVal.length + 1) == (lookForVal + ' ') || insideOfVal.substring(insideOfVal.length - lookForVal.length - 1) == (' ' + lookForVal)) {
        foundMatchString = lookForVal;
        return ['Exact', foundMatchString];
    }
    //Case match: put both to lower case to see if match
    insideOfVal = insideOfVal.toLowerCase();
    lookForVal = lookForVal.toLowerCase();
    if (insideOfVal.includes(' ' + lookForVal + ' ') || insideOfVal == lookForVal || insideOfVal.substring(0, lookForVal.length + 1) == (lookForVal + ' ') || insideOfVal.substring(insideOfVal.length - lookForVal.length - 1) == (' ' + lookForVal)) {
        foundMatchString = origInsideOfVal.substr(insideOfVal.toLowerCase().indexOf(lookForVal.toLowerCase()), lookForVal.length);
        return ['Case', foundMatchString];
    }
    //Plural match: all combos of add/subract "s"
    insideOfVal = origInsideOfVal;
    lookForVal = origLookForVal + 's';
    if (insideOfVal.includes(' ' + lookForVal + ' ') || insideOfVal == lookForVal || insideOfVal.substring(0, lookForVal.length + 1) == (lookForVal + ' ') || insideOfVal.substring(insideOfVal.length - lookForVal.length - 1) == (' ' + lookForVal)) {
        foundMatchString = lookForVal;
        return ['Plural', foundMatchString];
    }
    //Plural if page title has 's' on end so want to remove it to match a block with a word without an 's'
    if (origLookForVal.substr(-1) == 's') {
        insideOfVal = origInsideOfVal;
        lookForVal = origLookForVal.substring(0, origLookForVal.length - 1);
        if (insideOfVal.includes(' ' + lookForVal + ' ') || insideOfVal == lookForVal || insideOfVal.substring(0, lookForVal.length + 1) == (lookForVal + ' ') || insideOfVal.substring(insideOfVal.length - lookForVal.length - 1) == (' ' + lookForVal)) {
            foundMatchString = lookForVal;
            return ['Plural', foundMatchString];
        }
    }
    //Plural AND case match: all combos of add/subract "s" and also make it all lower case
    insideOfVal = origInsideOfVal.toLowerCase();
    lookForVal = (origLookForVal + 's').toLowerCase();
    if (insideOfVal.includes(' ' + lookForVal + ' ') || insideOfVal == lookForVal || insideOfVal.substring(0, lookForVal.length + 1) == (lookForVal + ' ') || insideOfVal.substring(insideOfVal.length - lookForVal.length - 1) == (' ' + lookForVal)) {
        foundMatchString = origInsideOfVal.substr(insideOfVal.indexOf(lookForVal), lookForVal.length);
        return ['Plural+Case', foundMatchString];
    }
    //Plural if page title has 's' on end so want to remove it to match a block with a word without an 's'
    if (origLookForVal.substr(-1) == 's') {
        insideOfVal = origInsideOfVal.toLowerCase();
        lookForVal = origLookForVal.substring(0, origLookForVal.length - 1).toLowerCase();
        if (insideOfVal.includes(' ' + lookForVal + ' ') || insideOfVal == lookForVal || insideOfVal.substring(0, lookForVal.length + 1) == (lookForVal + ' ') || insideOfVal.substring(insideOfVal.length - lookForVal.length - 1) == (' ' + lookForVal)) {
            foundMatchString = origInsideOfVal.substr(insideOfVal.indexOf(lookForVal), lookForVal.length);
            return ['Plural+Case', foundMatchString];
        }
    }

    //Need to add other things similar to plural logic with suffixes like "ed" etc. at end.

    return ['', ''];
}

// ****************************************************************************************
// ****************************************************************************************
// ****************************************************************************************
// ****************************************************************************************
if (!arrPages) {
    var arrPages = [];
    var pageCtr = 0;
    var allPages = window.roamAlphaAPI.q('[:find ?e :where [?e :node/title] ]');
    for (var i = 0; i < allPages.length; i++) {
        var eachPageDiv = allPages[i][0];
        var pageTitle = window.roamAlphaAPI.pull('[:node/title]', eachPageDiv)[":node/title"]
        if (pageTitle !== null) {
            if (pageTitle.length > 0) { arrPages.push(pageTitle); }
            //console.log(pageTitle);
            pageCtr++;
        }
        //if (i > 20) { break; }
    }
    console.log(pageCtr);
    console.log(arrPages.length);
}

async function startFunction() {
    var currentPage = document.title;

    if (currentPage == 'All Pages') {
        //var allPages = document.getElementsByClassName("rm-pages-title-col");
        //console.log(allPages);



    }
    else if (currentPage !== 'Daily Notes') {
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
        for (var i = 0; i < allBlocks.length; i++) {
            var eachBlockDiv = allBlocks.item(i);
            //console.log(eachBlockDiv);
            if (eachBlockDiv !== null) {
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
        var bMatchCase = false;
        var bMatchPlural = false;
        var bMatchPluralCase = false;
        var indivPageName = "";
        var neweachBlockDiv = "";
        var neweachBlockDivId = "";

        //Loop through each page to see if matching any of the content
        for (var j = 0; j < arrPages.length; j++) {
            //console.log('J: ', j);
            //if(j > 20){break;}
            indivPageName = arrPages[j];
            //indivPageName = "test";
            //console.log('Page: ', indivPageName);
            //These matches are for the entire page (all blocks) just to weed out a good number of the pages from the loop
            bMatch = allTextContent.includes(indivPageName);
            bMatchCase = allTextContent.toLowerCase().includes(indivPageName.toLowerCase());
            bMatchPlural = allTextContent.includes(indivPageName + 's');
            bMatchPluralCase = allTextContent.toLowerCase().includes(indivPageName.toLowerCase() + 's');
            if(!bMatchPluralCase && indivPageName.substr(-1) == 's'){bMatchPluralCase = allTextContent.toLowerCase().includes(indivPageName.substring(0, indivPageName.length - 1).toLowerCase());}
            //Need to add a fuzzy one that looks for the individual word(s) to see if matches a larger page name. Like Power Automate matched Microsoft power automate
            //bMatchFuzzy = allTextContent.includes(indivPageName);
            //var bMatch = true;
            if (bMatch || bMatchCase || bMatchPlural || bMatchPluralCase) {
                if (bMatch) { console.log('bMatch') }
                if (bMatchCase) { console.log('bMatchCase') }
                if (bMatchPlural) { console.log('bMatchPlural') }
                if (bMatchPluralCase) { console.log('bMatchPluralCase') }
                console.log('Page: ' + indivPageName);
                //console.log('Found: ', indivPageName);
                if (2 == 2) {
                    //var allBlocks = document.querySelectorAll("[id*='body-outline']");
                    //Loop through everything multiple times as first time checks exact matches... then case... then plural... then fuzzy
                    for (let y = 0; y < 4; y++) {
                        if (y == 0) {
                            if (!bMatch) { continue; }
                            console.log('Replacing exact match...')
                        }
                        if (y > 0 && bMatch) { continue; }
                        if (y == 1) {
                            if (!bMatchCase) { continue; }
                            console.log('Replacing case match...')
                        }
                        if (y > 1 && bMatchCase) { continue; }
                        if (y == 2) {
                            if (!bMatchPlural) { continue; }
                            console.log('Replacing plural match...')
                        }
                        if (y > 2 && bMatchPlural) { continue; }
                        if (y == 3) {
                            if (!bMatchPluralCase) { continue; }
                            console.log('Replacing case and plural match...')
                        }
                        //Loop through each block to find the matches and decide to tag or not
                        for (var k = 0; k < arrPageContentBlocks.length; k++) {
                            console.log('K: ', k);
                            //console.log('X: ', x);
                            //console.log('Exited x loop');
                            neweachBlockDiv = arrPageContentBlocks[k];
                            neweachBlockDivId = arrPageContentBlocksId[k];
                            eachBlockDiv = document.getElementById(neweachBlockDivId);
                            neweachBlockDiv = eachBlockDiv.innerText; //Actually need to see what the current value is because other links may change this and may have linked to Genesis already so Genesis 43 would not be a match anymore because of [[ ]] around genesis
                            console.log('**************************************************')
                            console.log(neweachBlockDiv);
                            console.log('**************************************************')
                            console.log(eachBlockDiv);
                            console.log(neweachBlockDivId);
                            var matchResult = compareMatch(indivPageName, neweachBlockDiv);
                            var matchType = matchResult[0];
                            var matchString = matchResult[1];
                            if (matchType != '') {
                                console.log(matchType);
                                console.log(matchString);
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
                                console.log('curValue: ' + curValue);
                                if(curValue.toLowerCase().indexOf('[[' + indivPageName.toLowerCase() + ']]') > -1 || curValue.toLowerCase().indexOf('[[' + matchString.toLowerCase() + ']]') > -1){continue;}
                                //var eachBlockText = newEachBlock.textContent;
                                var bpLinkPage = window.confirm(`Block: ${neweachBlockDiv}\n\nMatch Type: ${matchType}\n\nTag with page: [[${indivPageName}]]\n\nOK = YES | Cancel = NO`, 0);
                                if (bpLinkPage) {
                                    console.log('Yes replace');
                                    console.log(eachBlockDiv);
                                    console.log(eachBlockTextArea);
                                    console.log(curValue);

                                    if (matchType == 'Exact' || matchType == 'Case') {
                                        var newStuff = curValue.replace(matchString, '[[' + indivPageName + ']]');
                                    } else { //Alias match
                                        var newStuff = curValue.replace(matchString, '[' + matchString + ']([[' + indivPageName + ']])');
                                    }
                                    console.log(newStuff);
                                    await setNewValue(eachBlockTextArea, newStuff);
                                }
                                else {
                                    console.log('Do NOT replace');
                                    var bpSkipRest = window.confirm(`Do you want to skip linking of [[${indivPageName}]] for the remaining blocks as well?\n\nOK = SKIP | Cancel = Continue`, 0);
                                    if (bpSkipRest) { break; }
                                }
                                //}
                            }
                        }
                    }
                }
            }
        }
        console.log('DONE');
    }
    else {
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
