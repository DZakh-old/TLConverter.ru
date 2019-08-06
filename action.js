'use strict';

let originData;

window.onload = function() {
  if (localStorage.getItem('state-of-sw-size') == 'true')
    document.getElementById('sw-size').checked = true;
  if (localStorage.getItem('state-of-sw-font') == 'true')
    document.getElementById('sw-font').checked = true;
  if (localStorage.getItem('state-of-sw-auto') == 'true')
    document.getElementById('sw-auto').checked = true;
}

function pressedSwitch(theSwitch) {
  let state = document.getElementById(theSwitch).checked;
  localStorage.setItem('state-of-' + theSwitch, state);
  if (theSwitch !== 'sw-auto' && CKEDITOR.instances.editor.mode === 'source')
    processHtml(originData);
}

/* Work with the result panel above the CKEditor */
resultScreen.addEventListener('click', function() {
  if (isHover(copyButton) === true) {
    copyStringToClipboard(CKEDITOR.instances.editor.getData());
  } else {
    originData = '';
    CKEDITOR.instances.editor.setData('');
    /* It is this strange because of a strange bug with focus */
    CKEDITOR.instances.editor.setMode('wysiwyg', function() {
      CKEDITOR.instances.editor.focus(); 
    } );
    resultScreen.style.display = "none";
  }
} );

function isHover(element) {
  return (element.parentElement.querySelector(':hover') === element);
}

function copyStringToClipboard(str) {
  /* Create new element */
  let el = document.createElement('textarea');
  /* Set value (string to be copied) */
  el.value = str;
  /* Set non-editable to avoid focus and move outside of view */
  el.setAttribute('readonly', '');
  el.style = {position: 'absolute', left: '-9999px'};
  document.body.appendChild(el);
  /* Select text inside element */
  el.select();
  /* Copy text to clipboard */
  document.execCommand('copy');
  /* Remove temporary element */
  document.body.removeChild(el);
}

function performPasting(evtData) {
  originData = getFixedData(evtData);
  evtData = '';
  CKEDITOR.instances.editor.setMode('source');
  resultScreen.style.display = "block";
  processHtml(originData);
}

function pressedInfo() {
  infoAlertMessage.classList.remove("hidden");
  alertScreen.classList.remove("hidden");
}

/* Work with alert screen */
let arrayOfAlertMessages = document.getElementsByClassName("alert__message");

alertScreen.addEventListener('click', function() {
  if (isHover(alertContent) == false) {
    alertScreen.classList.add("hidden");
    hideArrayItems(arrayOfAlertMessages);
  }
} );

alertCloseBtn.addEventListener('click', function() {
  alertScreen.classList.add("hidden");
  hideArrayItems(arrayOfAlertMessages);
} );

function hideArrayItems(classElements) {
  for (let element of classElements)
    element.classList.add("hidden");
}

if (/mobile/i.test(navigator.userAgent)) {
  mobileAlertMessage.classList.remove("hidden");
  alertScreen.classList.remove("hidden");
}
