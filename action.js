'use strict';

let originData;

function processHtmlCode(evtData) {
  originData = evtData;
  replacement(evtData);
  CKEDITOR.instances.editor1.setMode('source');
}

function pressedButton() {
  if (CKEDITOR.instances.editor1.mode == 'source')
    replacement(originData);
}

let navBoard = document.getElementById('navBoard');
navBoard.addEventListener('click', function (event) {
  navBoard.style.display = "none";
  CKEDITOR.instances.editor1.focus();
} );

function replacement(workingData) {
  replaceEssentialStuff();
  if (document.getElementById("button1").checked) 
    replaceMostFrequentSize();
  if (document.getElementById("button2").checked) 
    replaceMostFrequentFont();

  if (document.getElementById("button3").checked) 
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
    let regexForReplacing = RegExp(' style="font-size:' + mode(arrayOfSizes) + 'pt"', 'gim');
    workingData = workingData.replace(regexForReplacing, '');
  }

  function replaceMostFrequentFont() {
    let regexForSerching = /(?<= style="font-family:)\S+(?=")/gim;
    let arrayOfSizes = workingData.match(regexForSerching);
    let regexForReplacing = RegExp(' style="font-family:' + mode(arrayOfSizes) + '"', 'gim');
    workingData = workingData.replace(regexForReplacing, '');
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

  // Source: https://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
  function mode(arr){
    return arr.sort((a, b) =>
        arr.filter(v => v===a).length
      - arr.filter(v => v===b).length
    ).pop();
  }
}

/*
Sources:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
https://regex101.com/
https://webdesign.tutsplus.com/tutorials/how-to-build-a-full-screen-responsive-page-with-flexbox--cms-32086
https://ckeditor.com/docs/ckeditor4/latest/



Possible function:
https://www.w3schools.com/js/js_htmldom_eventlistener.how-to-build-a-full-screen-responsive-page-with-flexbox--cms-32086
https://stackoverflow.com/questions/2010335/ckeditor-onpaste-event
*/