'use strict';

let originData;
let resultScreen = document.getElementById('resultScreen');
let copycopyButton = document.getElementById('copyButton');

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

function pressedInfo() {
  alert(manualContent);
}

/* Work with the result panel above the CKEditor */
resultScreen.addEventListener('click', function() {
  if (isHover(copyButton) === true) {
    copyStringToClipboard(CKEDITOR.instances.editor.getData());
  } else {
    originData = '';
    CKEDITOR.instances.editor.setData('');
    /* It is this strange because of a bug with focus */
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

if (/mobile/i.test(navigator.userAgent)) {
  alert("Буфер обмена на телефоне не сохраняет форматирование.\nДля корректной работы воспользуйтесь компьютером.");
}

let manualContent = "Приветствую вас в конверторе текста «TLConvetor», это приложение создано для того, чтобы из вордовского текста получить HTML код, который можно вставить в редактор сайта «tl.rulate.ru» с минимумом искажений.\n\
Пошаговое руководство:\n\
1.  Чтобы получить результат, нужно с помощью комбинации клавиш ctrl+V вставить текст, скопированный из ворда, в зону редактора, что ограничена пунктирными линиями.\n\
2.  Далее вы можете скопировать обработанный текст, нажав на кнопку «Скопируйте», или же, кликнув в иное место редактора, отчистить его. После чего можно вставить следующий текст.\n\
Справка по панели управления:\n\
1.  Переключатель «Size» нужен для корректной работы персонализации размера на рулете. При этом он сохраняет особые размеры (заголовка, уменьшенного примечания и тд). Если у вас удаляется что-то лишнее, попробуйте отключить данную функцию.\n\
2.  Переключатель «Font» аналогичен «Size». Он управляет стилями шрифтов.\n\
3.  Переключатель «Auto» в активированном состоянии автоматически добавляет полученный результат в буфер обмена. Вам не придётся лишний раз нажимать на кнопку.\n\
4.  Кнопка «Info» выводит на экран руководство пользователя, которое вы сейчас читаете.\n\
При нахождении какого-либо бага просьба сообщить о нём 'dmirdDZ' на рулет.";