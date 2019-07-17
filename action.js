'use strict';

let originData;
let firstBoard = document.getElementById('first-board');
let secondBoard = document.getElementById('second-board');
let copyBtn = document.getElementById('copy-btn');

function performPasting(evtData) {
  originData = getFixedData(evtData);
  evtData = '';
  CKEDITOR.instances.editor1.setMode('source');
  firstBoard.style.display = "none";
  secondBoard.style.display = "block";
  processHtml(originData);
}

function pressedSwitch() {
  if (CKEDITOR.instances.editor1.mode === 'source')
    processHtml(originData);
}

function pressedInfo() {
  alert(manualContent);
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
    originData = '';
    CKEDITOR.instances.editor1.setData('');
    /* It is this strange because of a bug with focus */
    CKEDITOR.instances.editor1.setMode('wysiwyg', function() {
      CKEDITOR.instances.editor1.focus(); 
    } );
    secondBoard.style.display = "none";
    firstBoard.style.display = "block";
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

/*
function setCookie(name,value,days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i =  0;i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') 
        c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) 
        return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}
*/
/*
Sources:
https://notare-hw.de/_scripts/3rdparty/ckeditor/samples/old/datafiltering.html
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
https://regex101.com/
https://webdesign.tutsplus.com/tutorials/how-to-build-a-full-screen-responsive-page-with-flexbox--cms-32086
https://ckeditor.com/docs/ckeditor4/latest/
https://stackoverflow.com/questions/9456289/how-to-make-a-div-visible-and-invisible-with-javascript
https://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
https://techoverflow.net/2018/03/30/copying-strings-to-the-clipboard-using-pure-javascript/
Possible function:
https://www.w3schools.com/js/js_htmldom_eventlistener.how-to-build-a-full-screen-responsive-page-with-flexbox--cms-32086
https://stackoverflow.com/questions/2010335/ckeditor-onpaste-event

https://jscompress.com/
*/


let manualContent = "Приветствую вас в конверторе текста «TLConvetor», это приложение создано для того, чтобы из вордовского текста получить HTML код, который можно вставить в редактор сайта «tl.rulate.ru» с минимумом искажений.\n\
Пошаговое руководство:\n\
1.  Чтобы получить результат, нужно с помощью комбинации клавиш ctrl+V вставить скопированный из ворда текст в зону редактора, что ограничен пунктирными линиями.\n\
2.  Далее вы можете скопировать обработанный текст, нажав на кнопку «Скопируйте», или же, кликнув в иное место редактора, отчистить его. После чего можно вставить следующий текст.\n\
Справка по панели управления:\n\
1.  Переключатель «Size» нужен для корректной работы выбора размера на рулете. При этом он сохраняет особые размеры (заголовка, уменьшенного примечания и тд). Если у вас удаляется что-то лишнее, попробуйте отключить данную функцию.\n\
2.  Переключатель «Font» аналогичен «Size». Он управляет стилями шрифтов.\n\
3.  Переключатель «Auto» в активированном состоянии автоматически добавляет полученный результат в буфер обмена. Вам не придется лишний раз нажимать на кнопку.\n\
4.  Кнопка «Info» выводит на экран руководство пользователя, которое вы сейчас читаете.\n\
При нахождении какого-либо бага просьба сообщить о нем 'dmirdDZ' на рулет.";