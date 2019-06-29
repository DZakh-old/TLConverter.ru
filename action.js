'use strict';

function processHtmlCode() {
  let textareaData = CKEDITOR.instances.editor1.getData();
  
  replaceEssentialStuff();
  if (document.getElementById("r1").checked) replaceMostFrequentSize();
  if (document.getElementById("r2").checked) replaceMostFrequentFont();

  changeView();
  if (document.getElementById("r3").checked) copyStringToClipboard( textareaData );

  function replaceEssentialStuff() {
      textareaData = textareaData.replace(/&quot;Courier New&quot;/gim, 'Courier');
      textareaData = textareaData.replace(/ style="color:black"/gim, '');
      textareaData = textareaData.replace(/ style="background:white"/gim, '');
      textareaData = textareaData.replace(/margin\S+px; /gim, '');
      textareaData = textareaData.replace(/ margin\S+px/gim, '');

      textareaData = textareaData.replace(/ lang="RU"/gim, '');
    }
  function replaceMostFrequentSize() {
    let regexForSerching = /(?<= style="font-size:).+(?=pt")/gim;
    let arrayOfSizes = textareaData.match(regexForSerching);
    let regexForReplacing = RegExp(' style="font-size:' + mode(arrayOfSizes) + 'pt"', 'gim');
  	textareaData = textareaData.replace(regexForReplacing, '');
  }
  function replaceMostFrequentFont() {
    let regexForSerching = /(?<= style="font-family:)\S+(?=")/gim;
    let arrayOfSizes = textareaData.match(regexForSerching);
    let regexForReplacing = RegExp(' style="font-family:' + mode(arrayOfSizes) + '"', 'gim');
  	textareaData = textareaData.replace(regexForReplacing, '');
  }
  function changeView() {
    CKEDITOR.instances.editor1.setData(textareaData);
    CKEDITOR.instances.editor1.setMode('source');
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
*/

/*
To DO List:
* Immidiat changing after pasting
* Appearing a button in the middle of the screan that suggest to copy/copyAgain or input a new text
* Add info
* Add reusebillity
* Add footer
* Add Flexability
* Add cookies
* Changing result with chackbox after pasting
* Make it pretty
*   borders for main
*   make footer before main
*   correct height of CKEditor
*   scrollbar
*/