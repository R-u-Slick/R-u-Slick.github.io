"use strict"

function GameView() {
  var self=this;
  var myModel = null; // с какой моделью работаем
  var placeBearSound=new Audio('sound/bear.mp3');
  var placeObjectSound=new Audio('sound/objectPlace.mp3');
  var matchSound=new Audio('sound/match.mp3');
  var ambientSound=new Audio('sound/ambient.mp3');
  ambientSound.loop=true;

  function playSound(sound) {
    sound.currentTime=0; // в секундах
    sound.play();
  }

  self.start=function(model) {
    myModel=model;
    self.update();
    playSound(ambientSound);
  }

  self.showInfo=function(infoType) {
    if (!document.getElementById('info-container')) {  
      var gameMain=document.querySelector('.game-main');
      var infoContainer=document.createElement('div');
      infoContainer.setAttribute('id','info-container');
      infoContainer.style.position='absolute';
      infoContainer.style.top='-1100px';
      infoContainer.style.left='2px';
      infoContainer.style.width='900px';
      infoContainer.style.height='900px';
      infoContainer.style.backgroundColor='#daddca';
      infoContainer.style.zIndex=10;
      infoContainer.style.animationName='info-show';
      infoContainer.style.animationDuration='0.5s';
      infoContainer.style.animationTimingFunction='linear';
      infoContainer.style.animationFillMode='forwards';
      gameMain.appendChild(infoContainer);
      var infoHeader=document.createElement('h2');
      infoHeader.setAttribute('id','info-header');
      infoHeader.style.fontFamily='Arial, Helvetica, sans-serif';
      infoHeader.style.textAlign='center';
      infoHeader.style.color='#394f4b';
      infoHeader.style.padding='40px 20px 40px 20px';    
      infoContainer.appendChild(infoHeader);
      var infoContent=document.createElement('div');
      infoContent.setAttribute('id','info-content');
      infoContent.style.fontFamily='Arial, Helvetica, sans-serif';
      infoContent.style.textAlign='justify';
      infoContent.style.padding='0 50px';    
      infoContent.style.color='#394f4b';    
      infoContainer.appendChild(infoContent);
      var okButton=document.createElement('button');
      okButton.setAttribute('id','ok-button');
      okButton.textContent='OK';
      okButton.style.display='block';
      okButton.style.margin='10px auto 0 auto';
      okButton.style.textAlign='center';
      infoContainer.appendChild(okButton);   
    }

      switch (infoType) {
        case 'Rules':
          var infoHeader=document.getElementById('info-header');
          infoHeader.textContent='Правила';
          var infoContent=document.getElementById('info-content');
          infoContent.textContent='Triple Town - оригинальная игра-паззл, в которой вам нужно построить большой город. Чем больше ваш город, тем больше очков вы получите. Вы строите город посредством соединения трех элементов: из трех трав получите куст, из трех кустов - дерево, и так далее, пока вы не заполните город домами, храмами и замками. Вам будут постоянно мешать медведи, которые, судя по всему, против постройки города. Насколько большой будет город вашей мечты, когда экран заполнится и игра закончится?';
          infoContent.style.paddingBottom='200px';
          infoContent.style.fontSize='20px';
          break;

        case 'Records':
          var ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
          var stringName='Sadykov_TripleTownProject';
          var recordsTable;
      
          $.ajax( {
                  url: ajaxHandlerScript, type: 'POST', cache: false, dataType:'json',
                  data: { f: 'READ', n: stringName },
                  success: readReady, error: errorHandler
              }
          );  
          
          function readReady(callresult) {
            if ( callresult.error!=undefined ) {             
              alert(callresult.error);
          }
            else {
              var recordsTable=JSON.parse(callresult.result);
              var contentHTML='';
              var infoHeader=document.getElementById('info-header');
              infoHeader.textContent='Таблица рекордов'
              var infoContent=document.getElementById('info-content');
              infoContent.style.paddingBottom='10px';
              contentHTML+="<ol>";
              for (var i=0; i<recordsTable.length; i++) {
                var listItem='<li>'+recordsTable[i][0]+' - '+recordsTable[i][1]+'</li>';
                contentHTML+=listItem;
              }
              contentHTML+='</ol>';
              infoContent.innerHTML=contentHTML;  
            }
          }

          function errorHandler(jqXHR,statusStr,errorStr) {
            alert(statusStr+' '+errorStr);
          }

      }     
  }

  self.hideInfo=function() {
    if (document.getElementById('info-container')) {
      var infoContainer=document.getElementById('info-container');
      infoContainer.style.animationName='info-hide';
      infoContainer.style.animationDuration='0.5s';
      infoContainer.style.animationTimingFunction='linear';
      infoContainer.style.animationFillMode='forwards';
      setTimeout(removeInfo, 500);
    }
    function removeInfo() {    
      var infoContainer=document.getElementById('info-container');
      var gameMain=document.querySelector('.game-main');
      gameMain.removeChild(infoContainer);
    }
  }

  self.update=function() {
    var currentItemImage=document.querySelector('.current-item-image');
    currentItemImage.setAttribute('src', myModel.currentObject.image);
    var totalPoints=document.querySelector('.points-counter');
    totalPoints.textContent=myModel.totalPoints;
    for (var i=0; i<myModel.map.length;i++) {
      for (var j=0; j<myModel.map[i].length; j++) {
        var elementID=String(i)+String(j);
        var fieldElement=document.getElementById(elementID);
        //Если клетка в моделе пустая - удаляем элемент в DOM
        if (!myModel.map[i][j]) {
            if (fieldElement.querySelector('img'))  {
              var image=fieldElement.querySelector('img');
              fieldElement.removeChild(image);
          }
        }
        //Елси в клетке в моделе что-то есть добавляем элемент в DOM
        if (myModel.map[i][j]) {
          if (fieldElement.querySelector('img')) {
            fieldElement.querySelector('img').setAttribute('src',myModel.map[i][j].image); 
            fieldElement.querySelector('img').style.animationName=''; 
            if(fieldElement.querySelector('p')) {
              var points=fieldElement.querySelector('p');
              fieldElement.removeChild(points);
            }
          }
          else {
            var objectImage=document.createElement('img');
            objectImage.setAttribute('src',myModel.map[i][j].image);
            fieldElement.appendChild(objectImage);
          }  
        }
      }
    }
  }

  self.bearMoveRight=function(row, column) {
    var elementID=String(row)+String(column);
    var fieldElement=document.getElementById(elementID);
    var image=fieldElement.querySelector('img');
    image.style.animationName='bear-move-right';
    image.style.animationDuration='0.5s';
    image.style.animationTimingFunction='linear';
   image.style.animationFillMode='forwards';
  }

  self.bearMoveLeft=function(row, column) {
    var elementID=String(row)+String(column);
    var fieldElement=document.getElementById(elementID);
    var image=fieldElement.querySelector('img');
    image.style.animationName='bear-move-left';
    image.style.animationDuration='0.5s';
    image.style.animationTimingFunction='linear';
   image.style.animationFillMode='forwards';
  }

  self.bearMoveDown=function(row, column) {
    var elementID=String(row)+String(column);
    var fieldElement=document.getElementById(elementID);
    var image=fieldElement.querySelector('img');
    image.style.animationName='bear-move-down';
    image.style.animationDuration='0.5s';
    image.style.animationTimingFunction='linear';
   image.style.animationFillMode='forwards';
  }

  self.bearMoveUp=function(row, column) {
    var elementID=String(row)+String(column);
    var fieldElement=document.getElementById(elementID);
    var image=fieldElement.querySelector('img');
    image.style.animationName='bear-move-up';
    image.style.animationDuration='0.5s';
    image.style.animationTimingFunction='linear';
   image.style.animationFillMode='forwards';
  }
  


  self.placeObject=function(row, column, object) {
    if (object===bear) {
      playSound(placeBearSound);
    }
    else {
      playSound(placeObjectSound);
    }
    var elementID=String(row)+String(column);
    var fieldElement=document.getElementById(elementID);
    var objectImage=document.createElement('img');
    objectImage.setAttribute('src',object.image);
    fieldElement.appendChild(objectImage);
    self.pointsGained(row, column,object);
  }

  self.pointsGained=function(row, column, object) {
    if (object.points!==0) {
      var elementID=String(row)+String(column);
      var fieldElement=document.getElementById(elementID);
      if (fieldElement.querySelector('p')){
        var points=fieldElement.querySelector('p');
        fieldElement.removeChild(points);
      }
      var points=document.createElement('p');
      points.textContent='+ '+object.points;
      points.style.position='absolute';
      points.style.fontSize='25px';
      points.style.fontFamily='arial';
      points.style.fontWeight='bold';
      points.style.color='white';
      points.style.left='40px';
      points.style.top='10px';
      points.style.animationName='points-gained';
      points.style.animationDuration='0.5s';
      points.style.animationTimingFunction='linear';
      points.style.animationFillMode='forwards';
      fieldElement.appendChild(points);
    }
  }

  

  self.levelUp=function(row,column,object) {
    var elementID=String(row)+String(column);
    var fieldElement=document.getElementById(elementID);
    var image=fieldElement.querySelector('img');
    self.pointsGained(row, column, object);
        
  }

  self.objectsCombine=function(row, column, matchRowArray, matchColumnArray) {
    playSound(matchSound);
    window.navigator.vibrate(100);
    for (var i=0; i<matchRowArray.length; i++) {
      //объекты находятся в одном ряду
        var elementID=String(matchRowArray[i])+String(matchColumnArray[i]);
        var fieldElement=document.getElementById(elementID);
        var image=fieldElement.querySelector('img');
        //объект находится левее
        if (matchColumnArray[i]<column){
          image.style.animationName='object-move-right';
          image.style.animationDuration='0.25s';
          image.style.animationTimingFunction='linear';
          image.style.animationFillMode='forwards';
        }
        //объект находится правее
        if (matchColumnArray[i]>column){
          image.style.animationName='object-move-left';
          image.style.animationDuration='0.25s';
          image.style.animationTimingFunction='linear';
          image.style.animationFillMode='forwards';
        }
        //объект находится выше
        if (matchRowArray[i]<row){
          image.style.animationName='object-move-down';
          image.style.animationDuration='0.25s';
          image.style.animationTimingFunction='linear';
          image.style.animationFillMode='forwards';
        }
        //объект находится ниже
        if (matchRowArray[i]>row){
          image.style.animationName='object-move-up';
          image.style.animationDuration='0.25s';
          image.style.animationTimingFunction='linear';
          image.style.animationFillMode='forwards';
        }     
    }
    var elementID=String(row)+String(column);
    var fieldElement=document.getElementById(elementID);
    var image=fieldElement.querySelector('img');
    image.style.animationName='fade-out';
    image.style.animationDuration='0.25s';
    image.style.animationTimingFunction='linear';
    image.style.animationFillMode='forwards';
  }

  self.recordsUpdate=function(records) {

  }

}
