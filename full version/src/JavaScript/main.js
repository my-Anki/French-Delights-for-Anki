pairs = [ ['alt','alte'] , ['arian','aire'] ,  ['gen','gène'] , ['graph','graphe'] , ['ic','ique'] , ['isk','isque'] , ['ism','isme'],
['ist','iste'] , ['meter','mètre'] , ['mony','monie'] , ['oid' , 'oide'] , ['or' , 'eur'] , ['ot' , 'ote'] , ['sis' , 'se'] , ['ter' , 'tre'],
['ty','té'] , ['y','ie'] , ['acious' , 'ace'] , ['an','ain'] , ['ar' , 'aire'] , ['arious','aire'] , ['ary','aire'] , ['ferrous' , 'fère'] ,
['ical','ique'] , ['id' , 'ide'] , ['ine' , 'in'],
['ite','it'] , ['ive','if'] , ['nal','ne'] , ['ocious','oce'] , ['ous' , 'eux'] , ['und','ond'] , ['ure','ur'] ,
['ent','em'],['ect','ait'], ['act','aite'],['ate','ative'] ,['k','que'],['er','re'],['ous','e'],['ious','aire'],['ous','ique'],['ed','é']
]

advPairs = [['y','ement'], ['ally','ellement'],['ly','ement'],['ly','ément'],['ly','ment']  ]

femPairs = [ ['ère','er'] , ['se','s'] , ['ve','f'] , ['euse','eux'] , ['che','c'] , ['euse','eur'] ,
         ,['teuse','teur'] , ['eresse','eur'] , ['elle','eau'] , ['olle','ou'] , ['aîtresse','aître']]

plPairs = [['aux','al'],['oux','ou'],['aux','ail'],['aux','au'],['eaux','eau'],['s','s'],['x','x'],['z','z']]

verb_pairs=[ ['ate','er'] , ['fy','fier'] ,  ['ise','iser'] , ['e','er']
]

config = {
  'defaultHighlightingSelection' : "highlightNone",
  'defaultExtraSelection' : 'noteOnly',
  'interestInArabic' : true,
  'defaultIPA':false,
  'defaultPOS':false,
  'defaultExtraExamples':true,
  'defaultmaturityState':true
}

/******************************************/

String.prototype.removeAt=function(index) {
  return this.substr(0, index) + this.substr(index+1,);
}
String.prototype.replaceAt=function(index, replacement) {
  return this.substr(0, index) + replacement+ this.substr(index+1,);
}
String.prototype.replaceAll = function(strReplace, strWith) {
    // See http://stackoverflow.com/a/3561711/556609
    var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var reg = new RegExp(esc, 'ig');
    return this.replace(reg, strWith);
};
function strip(html){
 var doc = new DOMParser().parseFromString(html, 'text/html');
 return doc.body.textContent || "";
}

function HTMLId(id){  return document.getElementById(id).innerHTML.trim()}
function HTMLClass(className){  return document.getElementsByClassName(className)[0].innerHTML.trim()}
function textId(id){  return strip(document.getElementById(id).innerHTML.trim())}
function textClass(className){  return strip(document.getElementsByClassName(className)[0].innerHTML.trim())}

function disableMenuOption (id){
  document.getElementById(id).disabled = true;
  document.getElementById(id).parentElement.style.color = '#4f5154';
}

function getFields (){
  html_word =HTMLId('word')
  word = textId('word')
  html_translation =HTMLClass('translationText')
  translation =textClass('translationText')
  type =textClass('type')
  try { fem =textClass('feminin')   ;  if ( fem == "" ) fem = null; }        catch (error) { fem = null; }
  try { plural =textClass('plural') ;  if ( plural == "" ) plural = null; }  catch (error) { plural = null; }
  try { ivl =HTMLId('ivl')          ;  if  (ivl == "" ) ivl = null; }        catch (error) { ivl = null; }
  try {bank = textId('exBank') ;  bank = bank.split("'").join("\""); bank = JSON.parse(bank); bank_length = bank.length}  catch (error){bank = null;}

}

function markFrenchWordInTheExample (example , englishEx){
  document.getElementById('frenchExamble').innerHTML=example.replaceAll(word,"<span class='example__higlighted-word'>"+word+"</span>")
  document.getElementById('englishExample').innerHTML=englishEx

    parts = translation.split(",")
    parts.forEach((part, i) => {
      part = part.trim()
      if (!part.includes('(')){
        if(englishEx.toLowerCase().includes(part.toLowerCase())){
          document.getElementById('englishExample').innerHTML=englishEx.replaceAll(part,"<span class='example__higlighted-word'>"+part+"</span>")
        }
      }
    });
      if (type.includes('verb') && !type.includes('adverb')){
        parts.forEach((part, i) => {
          if(part.includes('to') || part.includes('for')){
            part = part.replace('to','').trim()
            part = part.replace('for','').trim()
            if (!part.includes('(')){
              if(englishEx.includes(part)){
                document.getElementById('englishExample').innerHTML=englishEx.replaceAll(part,"<span class='example__higlighted-word'>"+part+"</span>")
              }
            }

          }
        });

      }



}

function prepOptionsMenu(){
current_index = -1
  if (fem == null)      { disableMenuOption("highlightGender") }
  if (plural == null)   { disableMenuOption("highlightPlural") }
  if (html_word == word){ disableMenuOption("highlightCustom") }
  if(mark()==false)     { disableMenuOption("highlightRoots") }
  if (bank == null || bank_length == 1){/* disableMenuOption("oEX") ;  document.getElementById("previousIcon").style.display = "none";document.getElementById("nxtIcon").style.display = "none"; */}
  else{
    indexOnScreen = 1
    document.getElementById('noOfEx').innerHTML = "<br> example "+indexOnScreen+ " of "+ bank_length
    current_example = textId('frenchExamble')
    for (var i = 0 ; i < bank_length ; i++){
      if (current_example.toLowerCase() == bank[i]['fr'].toLowerCase()){
         current_index = i
         break;
      }
    }

  }

  return current_index
}

function removeHTMLfromWordAndTranslationFields(){
  document.getElementsByClassName('translationText')[0].innerHTML = translation
  document.getElementById('word').innerHTML = word
}



/**
 *  Remove the extra new line tag that Anki adds at the end of the audio fields
*/
soundFieldsIds = ['wordSound','exampleSound','femeSound','pSound']

soundFieldsIds.forEach(removeExtraNewLineTagInSoundFields);
function removeExtraNewLineTagInSoundFields(item)
{
  if(document.getElementById(item)){
    if(document.getElementById(item).innerHTML.endsWith('<br>'))
    document.getElementById(item).innerHTML=document.getElementById(item).innerHTML.slice(0,-4)
  }
}

function prebBackGround(){
  /*Change the card's background color according to its type*/

  function changeBackGroundColor (containerClassName , imgClassName){
    document.getElementById("container").className = containerClassName;
    document.getElementById("imgcontainer").className = imgClassName;
  }


  if (type.includes('feminine') && type.includes('masculine')){
    changeBackGroundColor("both__background","both__image")
  }
  else if (type.trim().includes('feminine')) {
    changeBackGroundColor("feminine__background","feminine__image")
  }
  else if (type.trim().includes('masculine')){
    changeBackGroundColor("masculine__background","masculine__image")
  }
  else if (type.trim().includes('adjective')) {
    changeBackGroundColor("adjective__background", "adjective__image")
  }
  else if (type.trim().includes('adverb')) {
    changeBackGroundColor("adverb__background" ,"adverb__image" )
  }
  else if (type.trim().includes('verb')) {
    changeBackGroundColor("verb__background","verb__image")
  }
  else if (type.trim().includes('verb')) {
    changeBackGroundColor("verb__background","verb__image")
  }
  else if (type.trim().includes('phrase')) {
    changeBackGroundColor("phrase__background","phrase__image")
  }else {
    changeBackGroundColor("other__background","other__image")
  }

}


function prepMaturityStatus(){
  stars = ['star1','star2','star3','nostar1','nostar2','nostar3']
  if (ivl == null){
    stars.forEach(star => document.getElementById(star).style.display='none');
    //TO DO disable THE MATURITY  check box
  }
  else if (ivl==0 ){
    [stars[1] , stars[2] , stars[3]].forEach(star => document.getElementById(star).style.display='none');
  }
  else if (ivl < 21){
    [stars[2] , stars[3] , stars[4]].forEach(star => document.getElementById(star).style.display='none');
  }
  else {
    [stars[3] , stars[4] , stars[5]].forEach(star => document.getElementById(star).style.display='none');
  }
}


/********************************/



/***************************************************************************************************************/
/* -------------------------------------------Siblings detctors--- --------------------------------------------*/
/***************************************************************************************************************/


function isSibling (word , translation , testingPairs){
  var result = -1
  testingPairs.forEach(function(element){
    wordIndex = -element[1].length
    translationIndex = -element[0].length
    if(word.endsWith(element[1]) && translation.endsWith(element[0])){

      if(translation.slice(0,translationIndex) == word.slice(0,wordIndex)){
          result =  element;
      }
    }
  }
);
if (result != -1)return [result[1],result[0]]
}


function isDoupleSibling (word , translation){

  var result = -1
  advPairs.forEach(function(element){
    index = -element[0].length
    if( word.endsWith(element[1]) &&  translation.endsWith(element[0]) )
    {
      wordIndex = -element[1].length
      translationIndex = -element[0].length
      adjSibilings = isSibling(word.slice(0,wordIndex),translation.slice(0,translationIndex),pairs)

      if (adjSibilings) {

          result = [element[1] , element[0] ,adjSibilings[0] , adjSibilings [1]  ]
      }
  }
}
);
if (result != -1){
  return result
}
}


function isChapeau (word,translation){
  var result = -1
  var couples =[['ê','es'],['û','us'],['î','is'],['ô','os'],['â','as']]

  couples.forEach(function(element){
    if(word.includes(element[0]) && translation.includes(element[1])  ){
      new_word = word.replace(element[0],'')
      new_trans = translation.replace(element[1],'')
      if(new_word == new_trans){
        result =  element
      }
    }
  });
  if (result != -1){
    return result
  }
}


/****************************************************************************************************/
/* ---------------------------------------slight change detctors------------------------------------*/
/****************************************************************************************************/


function hasAFlippedLetter (word , translation){

  if(word.length == translation.length )
  {
    var loc ,  c = -1
    for(var i=0 ; i < word.length ; i++ ){
      if(word[i]  != translation[i] ){
        c++;
        if (c == 0) loc = i
      }
      if(c>0)  break;
    }
    if (c == 0)  return loc
  }
}

function hasALongertTranslation(word,translation){
  if((translation.length  ==  word.length+1) )
  {
    for (var i=0; i<translation.length ; i++){
      var newTrans  = translation.removeAt(i);
      if (newTrans == word) return i
    }
  }
}

function hasAShorterTranslation(word,translation){
  if((word.length  ==  translation.length+1) )
  {
    for (var i=0; i<word.length ; i++){
      var newWord  = word.removeAt(i);
      if (newWord == translation) return i
    }
  }
}

/***********************************************************************************************/
/* ---------------------------------------complicated change detctors--------------------------*/
/***********************************************************************************************/

function isSiblingWithExtraLetter(word,translation,testingPairs){

  for (var i=0; i<translation.length ; i++){
    var newTrans  = translation.removeAt(i);
    if (isSibling (word,newTrans,testingPairs) ){
      // console.log("has A different Letter in translation And A Sibling");
      return [i , isSibling (word,newTrans,testingPairs)[0] ,isSibling (word,newTrans,testingPairs)[1] , 2 ]

    }
  }

  for (var j=0; j<word.length ; j++){
    var newWord  = word.removeAt(j);
    if (isSibling (newWord,translation,testingPairs) ){
      // console.log("has A different Letter in word And A Sibling");
      return [j , isSibling (newWord,translation,testingPairs)[0] , isSibling  (newWord,translation,testingPairs)[1] , 1 ]

    }
  }
}



function isSiblingWithFlippedLetter (word ,translation,testingPairs){
  var result = -1

  testingPairs.forEach(function(element){
    index = -element[0].length
    if( translation.endsWith(element[0]) &&  word.endsWith(element[1]) )
    {
      newA=  word.slice(0,-element[1].length)
      newB = translation.slice(0,-element[0].length)

      if(hasAFlippedLetter (newA , newB)){
        result2 = hasAFlippedLetter (newA , newB)
        result =  element
        // console.log("is Sibling With Flipped Letter");
      }
    }
  }

);
if (result != -1){
  return [result[1] , result[0] , result2]
}
}


function hasDoubleSiblingExtraLetter (word,translation){

  for (var i=0; i<translation.length ; i++){
    var newTrans  = translation.removeAt(i);
    if (isDoupleSibling (word,newTrans) ){
      // console.log("Adverb Douple Sibling With Diff Letter in translation");
      return [i , isDoupleSibling(word,newTrans)[0] , isDoupleSibling (word,newTrans)[1],isDoupleSibling (word,newTrans)[2],isDoupleSibling (word,newTrans)[3] , 2 ]
    }
  }

  for (var j=0; j<word.length ; j++){
    var newWord  = word.removeAt(j);
    if (isDoupleSibling (newWord,translation) ){
      // console.log("Adverb Douple Sibling With DiffLetter in word");
      return [j , isDoupleSibling (newWord,translation)[0] , isDoupleSibling (newWord,translation)[1],isDoupleSibling (newWord,translation)[2],isDoupleSibling (newWord,translation)[3] , 1 ]
    }
  }

}


function hasDoubleSiblingflippedLetter (word ,translation){
//TODO
}

/*****************************************************************************/

//part1: the translation ending
//part2: the french word ending
//i the different letter index
//x undifines : filpped letter change both words
//x1 the extra letter in the word
//x2 the extra letter in the translation

function markSiplingsEnding (theWord , theTranslation ,  part1 , part2 , color1){

  var styleStart1 = '<span style="color:'+color1+'"><u>'
  var styleEnd = '</u></span>'

  theWordP1= theWord.slice(0,-part1.length)
  highlitedWord = theWordP1 + styleStart1 +part1 +styleEnd


  theTransP1= theTranslation.slice(0,-part2.length)
  highlitedTrans = theTransP1 + styleStart1 +part2 +styleEnd


  return [highlitedWord ,highlitedTrans ]
}

function highlightSpelling (nOfChanges , theWord , theTranslation ,  part1 , part2 ,  color1 , color2 , index , changePlace , otherTranslations,p3,p4){
  var styleStart1 = '<span style="color:'+color1+'"><u>'
  var styleStart2 = '<span style="color:'+color2+'"><u>'
  var styleEnd = '</u></span>'
  if(part1)   var p1Index = -part1.length
  if(part2) var p2Index = -part2.length

  if (nOfChanges == 1 && index == null){
    // if thye're siblings or chapeau

    highletedWord = markSiplingsEnding(theWord , theTranslation ,  part1 , part2,color1) [0]
    highlightedTranslation = markSiplingsEnding(theWord , theTranslation ,  part1 , part2,color1) [1]
    if (color1 =='deeppink'){
          document.getElementById("ribbon").className="ribbon ribbon--pink";
    }
    else{
          document.getElementById("ribbon").className="ribbon ribbon--blue";
    }

  }
  else if (nOfChanges == 1  && index != null){
    // if slight change (é instead of e or extra letter etc..)
      document.getElementById("ribbon").className="ribbon ribbon--pink";
    if(changePlace == 0){
      //if the change in both word and translation
      highletedWord = theWord.replaceAt(index,styleStart1+theWord[index]+styleEnd)
      highlightedTranslation = theTranslation.replace(theTranslation[index],styleStart1+theTranslation[index]+styleEnd)
    }
    else if (changePlace == 1){
      highletedWord = theWord.replaceAt(index,styleStart1+theWord[index]+styleEnd)
      highlightedTranslation = theTranslation

    }
    else if(changePlace ==2){
      highletedWord = theWord
      highlightedTranslation = theTranslation.replaceAt(index,styleStart1+theTranslation[index]+styleEnd)
    }
  }
  else if (nOfChanges == 2  && index != null && p3== null) {
    document.getElementById("ribbon").className="ribbon ribbon--blue";
    //if the letter is changed from the word to the translation (flipped letter)
    if (changePlace == 0){
      highletedWord = theWord.replaceAt(index,styleStart2+theWord[index]+styleEnd)
      highlightedTranslation = theTranslation.replaceAt(index,styleStart2+theTranslation[index]+styleEnd)

      highletedWord = markSiplingsEnding(highletedWord , highlightedTranslation ,  part1 , part2,color1) [0]
      highlightedTranslation = markSiplingsEnding(highletedWord , highlightedTranslation ,  part1 , part2,color1) [1]

    }
    else if (changePlace == 1){
       if (index == (theWord.length)-1 ){
         highletedWord = markSiplingsEnding(theWord.slice(0,-1) , theTranslation ,  part1 , part2,color1) [0] + styleStart2 + theWord[index] + styleEnd
         highlightedTranslation = markSiplingsEnding(theWord.slice(0,-1) , theTranslation ,  part1 , part2,color1) [1]

       }
       else{
         highletedWord = theWord.replaceAt(index,styleStart2+theWord[index]+styleEnd)
         highlightedTranslation = markSiplingsEnding(highletedWord , theTranslation ,  part1 , part2,color1) [1]
         highletedWord = markSiplingsEnding(highletedWord , highlightedTranslation ,  part1 , part2,color1) [0]
       }

    }
    else {

      if (index == (theTranslation.length)-1 ){
        highletedWord = markSiplingsEnding(theWord, theTranslation.slice(0,-1),  part1 , part2,color1) [0]
        highlightedTranslation = markSiplingsEnding(theWord, theTranslation.slice(0,-1)  ,  part1 , part2,color1) [1] + styleStart2 + theTranslation[index] + styleEnd

      }
      else{
        highlightedTranslation =theTranslation.replaceAt(index,styleStart2+theTranslation[index]+styleEnd)
        highletedWord = markSiplingsEnding(theWord , highlightedTranslation ,  part1 , part2,color1) [0]
        highlightedTranslation = markSiplingsEnding(highletedWord , highlightedTranslation ,  part1 , part2,color1) [1]

      }

    }

  }
  else if (nOfChanges == 2  && index == null && p3 != null ){
    // if double sibling

      highletedWord =  markSiplingsEnding (theWord , theTranslation ,  part1 , part2 , '#07607d')[0]
      w1 = theWord.slice(0,-part1.length)
      w2 = w1.slice(0,-p3.length)
      highletedWord =  w2 + "<span style='color:#07607d'><u>"+p3+"</u></span>"+styleEnd + styleStart1 + part1 +styleEnd


      highlightedTranslation =  markSiplingsEnding (theWord , theTranslation ,  part1 , part2 , '#07607d')[1]
      t1=theTranslation.slice(0,-part2.length)
      t2=t1.slice(0,-p4.length)
      highlightedTranslation = t2 + "<span style='color:#07607d'><u>"+p4+"</u></span>"+styleEnd + styleStart1 + part2 +styleEnd


  }
  else if (nOfChanges == 2  && index != null && p3 != null) {
    if (changePlace == 0){
      highletedWord = theWord.replaceAt(index,styleStart2+theWord[index]+styleEnd)
      highletedWord = highletedWord.replace(p3,"<span style='color:#07607d'><u>"+p3+"</u></span>"+styleEnd)
      highletedWord = highletedWord.replace(part1,styleStart1+part1+styleEnd)
      highlightedTranslation = theTranslation.replaceAt(index,styleStart2+theTranslation[index]+styleEnd)
      highlightedTranslation = highlightedTranslation.replace(part2,styleStart1+part2+styleEnd)
      highlightedTranslation = highlightedTranslation.replace(p4,"<span style='color:#07607d'><u>"+p4+"</u></span>"+styleEnd)

    }
    else if (changePlace == 1){
      //if the change is in the word
      highletedWord = theWord.replaceAt(index,styleStart2+theWord[index]+styleEnd)
      highletedWord = highletedWord.replace(p3,"<span style='color:#07607d'><u>"+p3+"</u></span>"+styleEnd)
      highletedWord = highletedWord.replace(part1,styleStart1+part1+styleEnd)
      highlightedTranslation = theTranslation.replace(part2,styleStart1+part2+styleEnd)
      highlightedTranslation = highlightedTranslation.replace(p4,"<span style='color:#07607d'><u>"+p4+"</u></span>"+styleEnd)


    }
    else {
      highletedWord = theWord.replace(p3,"<span style='color:#07607d'><u>"+p3+"</u></span>"+styleEnd)
      highletedWord = highletedWord.replace(part1,styleStart1+part1+styleEnd)

      highlightedTranslation = theTranslation.replaceAt(index,styleStart2+theTranslation[index]+styleEnd)
      highlightedTranslation = highlightedTranslation.replace(part2,styleStart1+part2+styleEnd)
      highlightedTranslation = highlightedTranslation.replace(p4,"<span style='color:#07607d'><u>"+p4+"</u></span>"+styleEnd)
    }
  }

  if(document.getElementById('word')){
    document.getElementById('word').innerHTML =highletedWord
  }
  else if( document.getElementsByClassName('masculine')[0]){
      document.getElementsByClassName('masculine')[0].innerHTML =highletedWord
  }
  else if( document.getElementsByClassName('word')[0]){
    // document.getElementsByClassName('word')[0].innerHTML =highletedWord
  }

  document.getElementsByClassName('translationText')[0].innerHTML=highlightedTranslation

  if(highlightedTranslation==translation && highletedWord == word){
    return false
  }
}


/***************************************************************************************/
function mark(){

if(translation.split(" ").length > 0 ){
  firstTranslation =strip( translation.split(" ")[0])
  otherTranslations = translation.replace(firstTranslation,"")
}
else{
  firstTranslation = translation
  otherTranslations = ""
}

if(firstTranslation == word){
  document.getElementById("ribbon").className="ribbon ribbon--green";
}
else{

  siblings = isSibling (word , firstTranslation , pairs)
  adverbSibling = isSibling(word , firstTranslation , advPairs)
  doupleSibling = isDoupleSibling (word , firstTranslation)
  chapeau = isChapeau(word , firstTranslation)

  flipped = hasAFlippedLetter (word , firstTranslation)
  longertTranslation = hasALongertTranslation (word , firstTranslation)
  shorterTranslation = hasAShorterTranslation (word , firstTranslation)

  siblingWithExtraLetter = isSiblingWithExtraLetter(word , firstTranslation, pairs )
  siblingWithFlippedLetter   = isSiblingWithFlippedLetter (word , firstTranslation , pairs)


  advSiblingWithExtraLetter = isSiblingWithExtraLetter(word , firstTranslation , advPairs)
  advsiblingWithFlippedLetter = isSiblingWithFlippedLetter(word , firstTranslation , advPairs)

  doubleSiblingExtraLetter = hasDoubleSiblingExtraLetter (word , firstTranslation)
  //doubleSiblingflippedLetter = hasDoubleSiblingflippedLetter (word , firstTranslation)


  if (siblings)
    return highlightSpelling(1,word ,firstTranslation,siblings[0],siblings[1],'#0099cc',null,null,null,otherTranslations)
  else if(adverbSibling)
    return highlightSpelling(1,word ,firstTranslation,adverbSibling[0],adverbSibling[1],'#0099cc',null,null,null,otherTranslations)
  else if(doupleSibling)
    return highlightSpelling(2,word ,firstTranslation,doupleSibling[0],doupleSibling[1],'#0099cc','#07607d',null,null,otherTranslations,doupleSibling[2],doupleSibling[3])
  else if (chapeau)
    return highlightSpelling(1,word ,firstTranslation ,  chapeau[0],chapeau[1],'deeppink',null,null,null,otherTranslations)
 else if (flipped >=0)
      return highlightSpelling(1,word ,firstTranslation ,null,null,'deeppink',null,flipped,0,otherTranslations)
  else if(longertTranslation >=0)
      return highlightSpelling(1,word ,firstTranslation ,null,null,'deeppink',null,longertTranslation,2,otherTranslations)
  else if(shorterTranslation >=0)
      return highlightSpelling(1,word ,firstTranslation ,null,null,'deeppink',null,shorterTranslation,1,otherTranslations)
  else if(siblingWithExtraLetter)
    return highlightSpelling(2,word ,firstTranslation ,siblingWithExtraLetter[1],siblingWithExtraLetter[2],'#0099cc','deeppink',siblingWithExtraLetter[0],siblingWithExtraLetter[3],otherTranslations)
  else if(advSiblingWithExtraLetter)
    return highlightSpelling(2,word ,firstTranslation ,advSiblingWithExtraLetter[1],advSiblingWithExtraLetter[2],'#0099cc','deeppink',advSiblingWithExtraLetter[0],advSiblingWithExtraLetter[3],otherTranslations)
  else if(siblingWithFlippedLetter)
    return highlightSpelling(2,word ,firstTranslation ,siblingWithFlippedLetter[0],siblingWithFlippedLetter[1],'#0099cc','deeppink',siblingWithFlippedLetter[2],0,otherTranslations)
  else if(advsiblingWithFlippedLetter)
    return highlightSpelling(2,word ,firstTranslation ,advsiblingWithFlippedLetter[0],advsiblingWithFlippedLetter[1],'#0099cc','deeppink',advsiblingWithFlippedLetter[2],0,otherTranslations)
  else if (doubleSiblingExtraLetter)
    return highlightSpelling(2,word ,firstTranslation ,doubleSiblingExtraLetter[1],doubleSiblingExtraLetter[2],'#0099cc','deeppink',doubleSiblingExtraLetter[0],doubleSiblingExtraLetter[5],otherTranslations,doubleSiblingExtraLetter[3],doubleSiblingExtraLetter[4])
  else {
    return false
  }
  // else if (doubleSiblingflippedLetter)
  //   highlightSpelling(2,word ,firstTranslation ,doubleSiblingflippedLetter[1],doubleSiblingflippedLetter[2],'#0099cc','deeppink',doubleSiblingflippedLetter[0],0,otherTranslations,doubleSiblingflippedLetter[3],doubleSiblingflippedLetter[4])
}

}

function markGender (){

  siblings = isSibling (word , fem , femPairs)
  if (siblings ){

      document.getElementById("ribbon").className="";
      document.getElementsByClassName('masculine')[0].innerHTML = markSiplingsEnding(word ,fem,siblings[0],siblings[1],'#0099cc')[0]
      document.getElementsByClassName('feminin')[0].innerHTML = markSiplingsEnding(word ,fem,siblings[0],siblings[1],'#0099cc')[1]
  }
  else if (word+'e' == fem){
    document.getElementById("ribbon").className="";
    document.getElementsByClassName('feminin')[0].innerHTML = fem.slice(0,-1)+"<span style='color:#0099cc'><u>e</u></span>"
  }
  else if (word+word[word.length-1]+'e' == fem){
    document.getElementById("ribbon").className="";
    document.getElementsByClassName('feminin')[0].innerHTML = fem.slice(0,-2)+"<span style='color:#0099cc'><u>"+word[word.length-1]+"e</u></span>"
  }
  else if (word.endsWith('e') && word == fem){
    document.getElementById("ribbon").className="";
    document.getElementsByClassName('masculine')[0].innerHTML = word.slice(0,-1)+"<span style='color:#0099cc'><u>e</u></span>"
    document.getElementsByClassName('feminin')[0].innerHTML = fem.slice(0,-1)+"<span style='color:#0099cc'><u>e</u></span>"
  }

}

function markCustome(){
  document.getElementsByClassName('translationText')[0].innerHTML = html_translation
  if(  document.getElementById('word')){
    document.getElementById('word').innerHTML = html_word
  }

  //document.getElementsByClassName('word').innerHTML = html_word

  else if(document.getElementsByClassName('masculine')[0]){
    document.getElementsByClassName('masculine')[0].innerHTML = html_word
  }
  splitTranslation()
}

function markVerbEnding(){

  org_html = strip(document.getElementById("word").innerHTML)
  group = document.getElementById("group").innerHTML;
  var lastChar = org_html[org_html.length -1];
  var start = org_html.slice(0,-2);
  var lastChar = org_html.slice(-2);
  if (group.trim() == "one") {

  new_html = start+ "<span class='verb-first-group-ending'>" + lastChar + "</span>";
  document.getElementById("word").innerHTML = new_html;
  }
  else if (group.trim() == "two") {
  new_html = start+ "<span class='verb-second-group-ending'>" + lastChar + "</span>";
  document.getElementById("word").innerHTML = new_html;
  }
  else if (group.trim() == "three") {
  new_html = start+ "<span class='verb-third-group-ending'>" + lastChar + "</span>";
  document.getElementById("word").innerHTML = new_html;
  }
}


function unMark(){
  document.getElementById("ribbon").className="";
  document.getElementsByClassName('translationText')[0].innerHTML = translation

  if(  document.getElementsByClassName('word')[0] &&   (type.includes('noun') && !(type.includes('fem') && type.includes('mas') )  ) ){
    document.getElementsByClassName('word')[0].innerHTML = word
  }
  if(document.getElementById('word'))
  document.getElementById('word').innerHTML = word

  if(document.getElementsByClassName('masculine')[0]){
    document.getElementsByClassName('masculine')[0].innerHTML = word
  }

  if(fem){
    document.getElementsByClassName('feminin')[0].innerHTML = strip(fem)
  }

  if (document.getElementsByClassName('plural')[0]){
    document.getElementsByClassName('plural')[0].style.display='none'
  }
  document.getElementById('ribbon').className="";
  splitTranslation()
}

function displaypPlural(){
  siblings = isSibling (word , plural , plPairs)
  if (siblings ){
      pluralText = markSiplingsEnding(word ,plural,siblings[0],siblings[1],'#0099cc')[1]
      word2 = markSiplingsEnding(word ,plural,siblings[0],siblings[1],'#0099cc')[0]
  }
  else if (word+'s' == plural){

    pluralText = plural.slice(0,-1)+"<span style='color:#0099cc'><u>s</u></span>"
    word2 = word
  }
  else{
    pluralText = plural
    word2 = word
  }

  if (type.includes('noun') && !(type.includes('fem') && type.includes('mas') )  ){

    var pluralText = word2 +"&nbsp <img class='plural-arrow-icon' src='arrow1.png'/>&nbsp"+ pluralText;
    document.getElementsByClassName("word")[0].innerHTML = pluralText
  }
  else{
         document.getElementById('plural').innerHTML = pluralText
          document.getElementById('plural').style.display=('block')
         document.getElementsByClassName("masculine")[0].innerHTML = word2
  }

}
/***************************************************************************************/

function prepHighlightingMenu(){
  window.selectedHighlightingId = window.selectedHighlightingId||config['defaultHighlightingSelection'] ;
  if(window.selectedHighlightingId){
    if(document.getElementById(window.selectedHighlightingId)){
      if(document.getElementById(window.selectedHighlightingId).disabled == false)
        var radio = document.getElementById(window.selectedHighlightingId);
      else{
        window.selectedHighlightingId = config['defaultHighlightingSelection'];
        var radio = document.getElementById(window.selectedHighlightingId);
        radio.checked = 'checked';
        highlightWord(window.selectedHighlightingId);
      }
    }
    else window.selectedHighlightingId = config['defaultHighlightingSelection']
    var radio = document.getElementById(window.selectedHighlightingId);
    radio.checked = 'checked';
    highlightWord(window.selectedHighlightingId);
  }


  var radios = document.getElementsByName('highilightingOptions');
  for(var i = 0, max = radios.length; i < max; i++) {

      radios[i].addEventListener('change', function() {
           window.selectedHighlightingId = this.id
           highlightWord(window.selectedHighlightingId);

    }, false);
  }


}


function highlightWord(id) {
    if (id == 'highlightNone'){
      unMark()
    }
    else if (id == 'highlightRoots') {
      unMark()
      if(type.includes('verb') && type!= 'adverb'){
        markVerbEnding();
      }
      else{
          mark();
      }
    }
    else if (id == 'highlightCustom') {
      unMark()
      markCustome();
    }
    else if(id == 'highlightGender'){
      unMark()
      markGender()
    }
    else if(id == 'highlightPlural'){
      unMark()
      displaypPlural()
    }
  }



/**************************/


function prepAttatchmentsMenu(){

     extraOptions = document.getElementsByName('extraOptions');


    if(document.getElementById("extra")){
      extra = document.getElementById("extra").innerHTML
      if(config['interestInArabic']==true  && extra.includes("rabic")){
        window.optionId = 'root';
      }
     else{
      window.optionId = config['defaultExtraSelection'];
    }
  }



    window.optionId = window.optionId || config['defaultExtraSelection'];
    if(window.optionId != 0){
       option = document.getElementById(window.optionId);
      option.style.backgroundColor='#60f0ad'
      dispalyOption(window.optionId);

    }

    for(var i = 0, max = options.length; i < max; i++) {

        options[i].onclick =function() {
             window.optionId = this.id
             dispalyOption(window.optionId);

      };
    }
}


function dispalyOption(id) {
    for(var i = 0, max = options.length; i < max; i++) {
        options[i].style.backgroundColor='#f3dcf500'
    }
    for(var i = 0, max = extraOptions.length; i < max; i++) {
        extraOptions[i].style.display='none'
    }

    document.getElementById(id).style.backgroundColor='#60f0ad'
    if(id == 'root'){
      document.getElementById("extraDiv").style.display="block"
    }
    else if (id == "brain"){
      document.getElementById("mnemonicDiv").style.display="block"
    }
    else if (id == "tagsico"){
      document.getElementById("tagsDiv").style.display="block"
    }

  }


function prepExtraOptionsMenu(){
  checkIPA = document.getElementById('oIPA');
  if (window.checkedIPA  === undefined){
    window.checkedIPA = config['defaultIPA'];
    checkIPA.checked = config['defaultIPA'];
  }
  checkIPABox(window.checkedIPA);
  checkIPA.checked = window.checkedIPA
  checkIPA.addEventListener('change', function() {
      window.checkedIPA = checkIPA.checked;
      checkIPABox(checkIPA.checked);
  });



  checkPOS = document.getElementById('oPOS');
  if (window.checkedPOS  === undefined){
    window.checkedPOS = config['defaultPOS'];
    checkPOS.checked = config['defaultPOS'];
  }
  checkPOSBox(window.checkedPOS);
  checkPOS.checked = window.checkedPOS
  checkPOS.addEventListener('change', function() {
      window.checkedPOS = checkPOS.checked;
      checkPOSBox(checkPOS.checked);
  });



if(window.checkedEX  === undefined){
  window.checkedEX =  config['defaultExtraExamples']
    checkExtraExamplesBox(window.checkedEX);

}
else{
  checkExtraExamplesBox(window.checkedEX);
}

  checkEX.addEventListener('change', function() {
      window.checkedEX = checkEX.checked;
      checkExtraExamplesBox(checkEX.checked);
  });




  checkMut = document.getElementById('oMut');
  if (window.checkedMut  === undefined){
    window.checkedMut = config['defaultmaturityState'];
    checkMut.checked =config['defaultmaturityState'];
  }
  checkMaturity(window.checkedMut);
  checkMut.checked = window.checkedMut

  checkMut.addEventListener('change', function() {
      window.checkedMut = checkMut.checked;
      checkMaturity(checkMut.checked);
  });

}


function checkIPABox(checker) {
    if(checker == true) {
        document.getElementsByClassName("ipa")[0].style.display = "block";
    } else if (checker == false) {
        document.getElementsByClassName("ipa")[0].style.display = "none";
    }
}


function checkMaturity(checker) {
    if(checker == true) {
        document.getElementsByClassName("card-maturity")[0].style.display = "block";
    } else if (checker == false) {
        document.getElementsByClassName("card-maturity")[0].style.display = "none";
    }

}



function checkPOSBox(checker) {

    if(checker == true) {
         document.getElementsByClassName("type-corner")[0].style.display = "block";
    } else if (checker == false) {
         document.getElementsByClassName("type-corner")[0].style.display = "none";
    }
}


function checkExtraExamplesBox(checker) {
  checkEX = document.getElementById('oEX');
    if(checker == true) {
          if (bank == null || bank_length == 1){
            checkEX.checked  = false;
            disableMenuOption("oEX");
            document.getElementById("previousIcon").style.display = "none";
            document.getElementById("nxtIcon").style.display = "none";
            document.getElementById("noOfEx").style.display = "none";
            document.getElementById("frenchExamble").style.display = "block";
          }
          else{
            checkEX.checked  = true;
            document.getElementById("previousIcon").style.display = "inline-block";
            document.getElementById("nxtIcon").style.display = "inline-block";
            document.getElementById("noOfEx").style.display = "block";
            document.getElementById("frenchExamble").style.display = "inline-block";

          }

    } else if (checker == false) {
          checkEX.checked  = false;
          document.getElementById("previousIcon").style.display = "none";
          document.getElementById("nxtIcon").style.display = "none";
          document.getElementById("noOfEx").style.display = "none";
          document.getElementById("frenchExamble").style.display = "block";
    }

}

function prepMainMenu(){
  if(window.menuStatus == undefined){
    window.menuStatus =  'close';
    document.getElementsByClassName("menu__head__icon--open")[0].style.display="none"
  }
  else if (window.menuStatus == 'open'){
     dispalymenu ('close')
  }
  else{
    dispalymenu ('open')
  }


   document.getElementsByClassName("menu__head__icon")[0].addEventListener("click",function( ){
    dispalymenu(window.menuStatus);
  });

  document.getElementsByClassName("menu__head__icon--open")[0].addEventListener("click",function( ){
   dispalymenu(window.menuStatus);
  });

}



function dispalymenu (status){

    if (status == 'close'){

      document.getElementsByClassName('menus')[0].style.backgroundColor="#f3dcf500";
      document.getElementsByClassName('menu_hidable')[0].style.display="none";
      document.getElementsByClassName("menu__head__icon--open")[0].style.display="block";
      window.menuStatus = 'open'
    }
    else{

      document.getElementsByClassName('menus')[0].style.backgroundColor="#f3dcf5d4";
      document.getElementsByClassName('menu_hidable')[0].style.display="block";
      document.getElementsByClassName("menu__head__icon--open")[0].style.display="none";
      window.menuStatus = 'close'
    }

}




function splitTranslation(){

 parts = translation.split(",")
  document.getElementsByClassName('translation')[0].innerHTML =""
  parts.forEach((part, i) => {
    part = part.trim()
    if (part.includes('(')){
      part = "<span class=' translation__word translation__word--note'>"+part.replace('(','').replace(')','')+"<span/>"

    }
    else{
      part = "<span class=' translation__word'>"+part+"<span/>"

    }
    document.getElementsByClassName('translation')[0].innerHTML += part
    document.getElementsByClassName('translation')[0].classList.add('translationText')
  });


}

function prepPhrases(){
  if (type.includes('phrase')){
    document.getElementById('phrase').innerHTML= `
    <a id="yg-widget-0" class="youglish-widget" data-query="`+word.replaceAll(" ","%20")+`"data-lang="french" data-components="80"   data-rest-mode="1"  rel="nofollow" </a>
    `
    document.getElementsByClassName('typed')[0].style.display='none'


  }


}



/***************************************/


getFields ()
removeHTMLfromWordAndTranslationFields()
markFrenchWordInTheExample (HTMLId('frenchExamble'),HTMLId('englishExample'))
current_index = prepOptionsMenu()
prebBackGround()
prepMaturityStatus()
prepHighlightingMenu()
prepAttatchmentsMenu()
prepExtraOptionsMenu()
prepMainMenu()
splitTranslation()
prepPhrases()


/***************************************/

function anotherExample(next)
{
  current_index+=next;
  indexOnScreen+=next;
  if(indexOnScreen > bank_length){
    indexOnScreen = 1
  }
  else if(indexOnScreen <= 0){
       indexOnScreen = bank_length
 }
  document.getElementById('noOfEx').innerHTML = "<br> example "+indexOnScreen+ " of "+ bank_length
  if (current_index == bank_length ){
    current_index = 0
  }
  else if (current_index == (-1)){
    current_index = bank_length-1
  }

    markFrenchWordInTheExample(bank[current_index]['fr'] , bank[current_index]['en'])
    document.getElementById('exampleSound').innerHTML = "<span> <audio preload='none' style='margin-button:-20px;' controls ><source type='audio/mp3' src="+bank[current_index]['audio']+" /></span>"



    // document.getElementById('exampleSound').childNodes[1].innerHTML = '[sound:'+ bank[current_index]['audio']+']'

}
