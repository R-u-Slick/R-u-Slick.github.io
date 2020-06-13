"use strict"

function GameView() {
  var self=this;
  var myModel = null; // с какой моделью работаем
  var placeBearSound=new Audio('sound/bear.mp3');
  var placeObjectSound=new Audio('sound/objectPlace.mp3');
  var matchSound=new Audio('sound/match.mp3');

  function playSound(sound) {
    sound.currentTime=0; // в секундах
    sound.play();
  }

  self.start=function(model) {
    myModel=model;
    self.update();
  }

  self.update=function() {
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



}
