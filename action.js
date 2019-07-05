'use strict';

let originData;
let firstBoard = document.getElementById('first-board');
let secondBoard = document.getElementById('second-board');
let copyBtn = document.getElementById('copy-btn');
let numberOfParagraphs;

function processHtmlCode(evtData) {
  firstBoard.style.display = "none";
  originData = evtData;
  if (evtData.match(/<[ph][\d\s>]/gim) != null) {
    numberOfParagraphs = evtData.match(/<[ph][\d\s>]/gim).length;
  } else {
    numberOfParagraphs = null;
  }
  replaceData(evtData);
  CKEDITOR.instances.editor1.setMode('source');
  secondBoard.style.display = "block";
}

function pressedSwitch() {
  if (CKEDITOR.instances.editor1.mode === 'source')
    replaceData(originData);
}

function pressedInfo() {
  alert('Данная функция в разработке.');
}

/* Work with the first panel above the CKEditor */
firstBoard.addEventListener('click', function() {
  CKEDITOR.instances.editor1.focus();
  CKEDITOR.instances.editor1.setData('');
} );

/* Work with the second panel above the CKEditor */
secondBoard.addEventListener('click', function() {
  if (isHover(copyBtn) === true) {
    copyStringToClipboard(CKEDITOR.instances.editor1.getData());
  } else {
    secondBoard.style.display = "none";
    CKEDITOR.instances.editor1.setData('');
    /* It is this strange because of a bug with focus */
    CKEDITOR.instances.editor1.setMode('wysiwyg', function() {
      CKEDITOR.instances.editor1.focus(); 
    } );
    firstBoard.style.display = "block";
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
  replaceTrashSpans();

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
    workingData = workingData.replace(/(?<=\W)><\/span>(?=<\/span>)/gim, '>&nbsp;</span>');
  }

  function replaceMostFrequentSize() {
    let regexForMatching = /(?<= style="font-size:)\S+(?=pt")/gim;
    let arrayOfSizes = workingData.match(regexForMatching);
    if (arrayOfSizes != null) {
      let mode = getMode(arrayOfSizes);
      let regexForReplacing = RegExp(' style="font-size:' + mode + 'pt"', 'gim');
      workingData = workingData.replace(regexForReplacing, '');
      if (numberOfParagraphs == getNumOfMode(arrayOfSizes, mode))
        replaceMostFrequentSize();
    }
  }

  function replaceMostFrequentFont() {
    let regexForMatching = /(?<= style="font-family:)\S+(?=")/gim;
    let arrayOfSizes = workingData.match(regexForMatching);
    if (arrayOfSizes != null) {
      let mode = getMode(arrayOfSizes);
      let regexForReplacing = RegExp(' style="font-family:' + getMode(arrayOfSizes) + '"', 'gim');
      workingData = workingData.replace(regexForReplacing, '');
      if (numberOfParagraphs == getNumOfMode(arrayOfSizes, mode))
        replaceMostFrequentFont();
    }
  } 

  function replaceTrashSpans() {
    let currentPosition = -1;
    let interimPosition;
    let closingPosition;
    let edgePosition;
    const lenghtOfClosingSpan = 7;
    
    while ((currentPosition = workingData.indexOf("<span>", ++currentPosition)) != -1) {
      edgePosition = closingPosition = workingData.indexOf("</span>", currentPosition);
      interimPosition = currentPosition;
      while ((interimPosition = workingData.indexOf("<span>", ++interimPosition)) != -1 && interimPosition < edgePosition) {
        closingPosition = workingData.indexOf("</span>", ++closingPosition);
      }
      workingData = workingData.slice(0, closingPosition) + workingData.slice(closingPosition + lenghtOfClosingSpan);
    }
    workingData = workingData.replace(/<span>/gim, '');
  }
}

// Source: https://techoverflow.net/2018/03/30/copying-strings-to-the-clipboard-using-pure-javascript/
function copyStringToClipboard (str) {
  // Create new element
  let el = document.createElement('textarea');
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

// Source: https://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
function getMode(array) {
  if (array.length == 0)
    return null;
  let modeMap = {};
  let maxEl = array[0], maxCount = 1;
  for (let i = 0; i < array.length; i++) {
    let el = array[i];
    if(modeMap[el] == null) {
      modeMap[el] = 1;
    } else {
      modeMap[el]++;
    }
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}

function getNumOfMode(array, mode) {
  let count = 0;
  for (let i = 0; i < array.length + 1; i++) {
    if (array[i] == mode) {
      count++;
    }
  }
  return count;
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