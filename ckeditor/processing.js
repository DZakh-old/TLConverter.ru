'use strict';

function getFixedData(data) {
  if (data.match(/<img/gim)) {
    alert("Изображения не поддерживаются в текущей версии. Они автоматически удалены.");
    return data.replace(/<img src="\S*" \S* \S* \/>/gim, '');
  }
  return data;
}

function processHtml(workingData) {
  let numOfParagraphs = getNumOfParagraphs(workingData);

  replaceEssentialStuff(); 
  replaceMostFrequentSize();
  replaceMostFrequentFont();
  replaceEmptyParagraphs();
  replaceTrashSpans();

  if (document.getElementById("sw-auto").checked) 
    copyStringToClipboard(workingData);

  CKEDITOR.instances.editor.setData(workingData);


  function replaceEssentialStuff() {
    workingData = workingData.replace(/&quot;Courier New&quot;/gim, 'Courier');
    workingData = workingData.replace(/ style="font-family:&quot;Tahoma&quot;,sans-serif"/gim, '');
    workingData = workingData.replace(/ style="font-family:&quot;MS Gothic&quot;"/gim, '');
    workingData = workingData.replace(/ style="color:black"/gim, '');
    workingData = workingData.replace(/ style="color:#000000"/gim, '');
    workingData = workingData.replace(/ style="background:white"/gim, '');
    workingData = workingData.replace(/ style="background:#ffffff"/gim, '');
    workingData = workingData.replace(/margin\S+px; /gim, '');
    workingData = workingData.replace(/ margin\S+px/gim, '');
    workingData = workingData.replace(/ lang="\w*"/gim, '');
    workingData = workingData.replace(/<i><\/i>/gim, '<p>&nbsp;<\/p>');
    while (workingData.match(/<span[^>]+><span><\/span><\/span>/gim) != null)
      workingData = workingData.replace(/<span[^>]+><span><\/span><\/span>/gim, '<span></span>');
  }

  function replaceMostFrequentSize() {
    let regexForMatching = RegExp('(?<=font-size:)[0-9\.]*', 'gim');
    let arrayOfSizes = workingData.match(regexForMatching);

    if (arrayOfSizes != null) {
      const {mode, numOfMode, numOf2ndMode} = getModeValues(arrayOfSizes);
      const switchChecked = document.getElementById("sw-size").checked;
      let regexForReplacing = RegExp(' style="font-size:' + mode + '([\.][0-9])*pt"', 'gim');

      if (switchChecked || numOfMode == numOfParagraphs && !switchChecked)
        workingData = workingData.replace(regexForReplacing, '');
      if (numOfMode == numOfParagraphs || numOfMode == numOf2ndMode)
        replaceMostFrequentSize();
    }
  }

  function replaceMostFrequentFont() {
    let regexForMatching = RegExp('(?<= style="font-family:)[^<">]+(?=")', 'gim');
    let arrayOfSizes = workingData.match(regexForMatching);

    if (arrayOfSizes != null) {
      const {mode, numOfMode, numOf2ndMode} = getModeValues(arrayOfSizes);
      const switchChecked = document.getElementById("sw-font").checked;
      let regexForReplacing = RegExp(' style="font-family:' + mode + '"', 'gim');

      if (switchChecked || numOfMode == numOfParagraphs && !switchChecked)
        workingData = workingData.replace(regexForReplacing, '');
      if (numOfMode == numOfParagraphs || numOfMode == numOf2ndMode)
        replaceMostFrequentFont();
    }
  } 

  function replaceEmptyParagraphs() {
    workingData = workingData.replace(/<span[^>]*><\/span>/gim, '&nbsp;');
    workingData = workingData.replace(/<p[^>]*><\/p>/gim, '<p>&nbsp;</p>');
  }

  function replaceTrashSpans() {
    /* The position of current "<span>" */
    let currentPosition = -1;
    /* The position that describes moving from the first position of "</span>" which's bigger than currentPosition
       to possition of closing tag for currentPosition tag "<span>" */
    let closingPosition;
    /* The interim position for checking "<span " after the currentPosition and before the edgePosition */
    let interimPosition;
    const lenghtOfClosingSpan = 7;
    
    while ((currentPosition = workingData.indexOf("<span>", ++currentPosition)) != -1) {
      closingPosition = workingData.indexOf("</span>", currentPosition);
      interimPosition = currentPosition;
      while ((interimPosition = workingData.indexOf("<span", ++interimPosition)) != -1 && interimPosition < closingPosition) {
        closingPosition = workingData.indexOf("</span>", ++closingPosition);
      }
      workingData = workingData.slice(0, closingPosition) + workingData.slice(closingPosition + lenghtOfClosingSpan);
    }
    workingData = workingData.replace(/<span>/gim, '');
  }
}

function getNumOfParagraphs(str) {
  if (str.match(/<[ph][\d\s>]/gim) != null)
    return str.match(/<[ph][\d\s>]/gim).length;
  return null;
}

function getModeValues(array) {
  let modeMap = {};
  let maxEl = array[0], maxCount = 0;
  let sndEl = -1, sndCount = 0;
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
    } else if (modeMap[el] > sndCount) {
      sndEl = el;
      sndCount = modeMap[el];
    }
  }
  return {
    mode: maxEl,
    numOfMode: maxCount,
    numOf2ndMode: sndCount,
  };
}