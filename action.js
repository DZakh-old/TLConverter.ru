'use strict';

let originData;

function processHtmlCode(evtData) {
  originData = evtData;
  replaceData(evtData);
  CKEDITOR.instances.editor1.setMode('source');
  secondBoard.style.display = "block";
}

function pressedSwitch() {
  if (CKEDITOR.instances.editor1.mode == 'source')
    replaceData(originData);
}

/* Work with the first panel above the CKEditor */
let firstBoard = document.getElementById('firstBoard');
firstBoard.addEventListener('click', function() {
  firstBoard.style.display = "none";
  CKEDITOR.instances.editor1.focus();
} );

/* Work with the second panel above the CKEditor */
let secondBoard = document.getElementById('secondBoard');
secondBoard.addEventListener('click', function() {
  let testBtn = document.getElementById('test');
  if (isHover(testBtn) == true) {
    copyStringToClipboard(CKEDITOR.instances.editor1.getData());
  } else {
    secondBoard.style.display = "none";
    CKEDITOR.instances.editor1.setData('');
    CKEDITOR.instances.editor1.setMode('wysiwyg');
    CKEDITOR.instances.editor1.focus(); //doesn't work
  }
} );

function isHover(element) {
    return (element.parentElement.querySelector(':hover') === element);
}

function replaceData(workingData) {
  replaceEssentialStuff();
  if (document.getElementById("switch1").checked) 
    replaceMostFrequentSize();
  if (document.getElementById("switch2").checked) 
    replaceMostFrequentFont();

  if (document.getElementById("switch3").checked) 
    copyStringToClipboard(workingData);

  CKEDITOR.instances.editor1.setData(workingData);

  function replaceEssentialStuff() {
    workingData = workingData.replace(/&quot;Courier New&quot;/gim, 'Courier');
    workingData = workingData.replace(/ style="color:black"/gim, '');
    workingData = workingData.replace(/ style="background:white"/gim, '');
    workingData = workingData.replace(/margin\S+px; /gim, '');
    workingData = workingData.replace(/ margin\S+px/gim, '');
    workingData = workingData.replace(/ lang="RU"/gim, '');
  }

  function replaceMostFrequentSize() {
    let regexForSerching = /(?<= style="font-size:)\S+(?=pt")/gim;
    let arrayOfSizes = workingData.match(regexForSerching);
    if (arrayOfSizes != null) {
      let regexForReplacing = RegExp(' style="font-size:' + getMode(arrayOfSizes) + 'pt"', 'gim');
      workingData = workingData.replace(regexForReplacing, '');
    }
  }

  function replaceMostFrequentFont() {
    let regexForSerching = /(?<= style="font-family:)\S+(?=")/gim;
    let arrayOfSizes = workingData.match(regexForSerching);
    if (arrayOfSizes != null) {
      let regexForReplacing = RegExp(' style="font-family:' + getMode(arrayOfSizes) + '"', 'gim');
      workingData = workingData.replace(regexForReplacing, '');
    }
  } 

  // Source: https://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
  function getMode(arr){
    return arr.sort((a, b) =>
        arr.filter(v => v===a).length
      - arr.filter(v => v===b).length
    ).pop();
  }
}

// Source: https://techoverflow.net/2018/03/30/copying-strings-to-the-clipboard-using-pure-javascript/
function copyStringToClipboard (str) {
  // Create new element
  var el = document.createElement('textarea');
  // Set value (string to be copied)
  el.value = str;
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute('readonly', '');
  el.style = {position: 'absolute', left: '-9999px'};
  document.body.appendChild(el);
  // Select text inside element
  el.select();
  // Copy text to clipboard
  document.execCommand('copy');
  // Remove temporary element
  document.body.removeChild(el);
}


/*
Sources:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
https://regex101.com/
https://webdesign.tutsplus.com/tutorials/how-to-build-a-full-screen-responsive-page-with-flexbox--cms-32086
https://ckeditor.com/docs/ckeditor4/latest/


https://stackoverflow.com/questions/9456289/how-to-make-a-div-visible-and-invisible-with-javascript
Possible function:
https://www.w3schools.com/js/js_htmldom_eventlistener.how-to-build-a-full-screen-responsive-page-with-flexbox--cms-32086
https://stackoverflow.com/questions/2010335/ckeditor-onpaste-event
*/