"use strict"

function GameObject(points, rate, imageSource) {
  this.points=points;
  this.rate=rate;
  this.nextLevel=null;
  this.image=imageSource;
  this.availbleOnStart=true;
  this.arrayAppend=function(array) {
    array.push(this);
  }
}

function BearObject (points, rate, imageSource) {
  GameObject.call(this);
  this.rate=rate;
  this.points=points;
  this.image='images/Bear.png';
  this.move=function(row, column) {

  }
}

var objectArray=[];

var grass=new GameObject(5, 0.6, 'images/Grass.png');
grass.arrayAppend(objectArray);
var bush=new GameObject(20, 0.25, 'images/Bush.png');
bush.arrayAppend(objectArray);
var tree=new GameObject(100, 0.2, 'images/Tree.png');
tree.arrayAppend(objectArray);
var hut=new GameObject(500, 0.01, 'images/Hut.png');
hut.arrayAppend(objectArray);
var house=new GameObject(1500, 0, 'images/House.png');
house.arrayAppend(objectArray);
var mansion=new GameObject(5000, 0, 'images/Mansion.png');
mansion.arrayAppend(objectArray);
var castle=new GameObject(20000, 0, 'images/Castle.png');
castle.arrayAppend(objectArray);
var floatingCastle=new GameObject(100000, 0, 'images/Floating_castle.png');
floatingCastle.arrayAppend(objectArray);
var tripleCastle=new GameObject(500000, 0, 'images/Triple_castle.png');
tripleCastle.arrayAppend(objectArray);
var bear=new BearObject(0, 0.05, 'images/Bear.png');
bear.arrayAppend(objectArray);
var tombstone=new GameObject(0, 0, 'images/Tombstone.png');
tombstone.arrayAppend(objectArray);
var church=new GameObject(1000, 0, 'images/Church.png');
church.arrayAppend(objectArray);
var cathedral=new GameObject(1000, 0, 'images/Cathedral.png');
cathedral.arrayAppend(objectArray);
var treasure=new GameObject(10000, 0, 'images/Treasure.png');
treasure.arrayAppend(objectArray);
var largeTreasure=new GameObject(50000, 0, 'images/Large_treasure.png');
largeTreasure.arrayAppend(objectArray);

//создадим связи между уровнями объектов
grass.nextLevel=bush;
bush.nextLevel=tree;
tree.nextLevel=hut;
hut.nextLevel=house;
house.nextLevel=mansion;
mansion.nextLevel=castle;
castle.nextLevel=floatingCastle;
floatingCastle.nextLevel=tripleCastle;
bear.nextLevel=tombstone;
tombstone.nextLevel=church;
church.nextLevel=cathedral;
cathedral.nextLevel=treasure;
treasure.nextLevel=largeTreasure;

function GameModel() {
  var self=this;
  self.map = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ]
  self.currentObject=null;

  var myView = null;

  self.totalPoints = 0;

  self.spaState ={};

  self.spaStateChanged=function(){
    switch (self.spaState.pagename) {
      case 'Rules':
        myView.showInfo('Rules');
        break;
      case 'Main':
        myView.hideInfo();
        break;
      case 'Records':
        myView.showInfo('Records');
        break;
    }
  }

  self.start=function(view) {
      myView=view;
      self.mapGenerate();
      self.currentObject=self.generateRandom(objectArray);
  }

  self.newGame=function() {
    self.mapGenerate();
    self.currentObject=self.generateRandom(objectArray);
    self.totalPoints=0;
    myView.update();
  }

  self.updateView=function() {
    if ( myView )
      myView.update();
  };
//ПЕРЕМЕЩЕНИЕ МЕДВЕДЕЙ
  self.bearAlreadyMoved=[]//массив с коорд. медеведей, кторые уже перемещались за данный ход
  //функция, определяющия в каких направлениях может двиагться медведь
  self.bearCanMove=function(row, column) {
    var moveDirections=[];
    if (self.map[row][column+1]===0) {
      moveDirections.push(bearMoveRight);
    }
    
    if (self.map[row][column-1]===0) {
      moveDirections.push(bearMoveLeft);
    }
    if (self.map[row+1]&&(self.map[row+1][column]===0)) {
      moveDirections.push(bearMoveDown);
    }
    if (self.map[row-1]&&(self.map[row-1][column]===0)) {
      moveDirections.push(bearMoveUp);
    }
    return moveDirections;
    
  }

  function bearMoveRight(row, column) {
    self.map[row][column]=0;
    self.map[row][column+1]=bear;
    var bearNewCoord=[row, column+1];
    self.bearAlreadyMoved.push(bearNewCoord);
    myView.bearMoveRight(row, column);
  }  
  function bearMoveLeft(row, column) {
    self.map[row][column]=0;
    self.map[row][column-1]=bear;
    var bearNewCoord=[row, column-1];
    self.bearAlreadyMoved.push(bearNewCoord);
    myView.bearMoveLeft(row,column);
  }  
  function bearMoveDown(row, column) {
    self.map[row][column]=0;
    self.map[row+1][column]=bear;
    var bearNewCoord=[row+1, column];
    self.bearAlreadyMoved.push(bearNewCoord);
    myView.bearMoveDown(row, column);
  }  
  function bearMoveUp(row, column) {
    self.map[row][column]=0;
    self.map[row-1][column]=bear;
    var bearNewCoord=[row-1, column];
    self.bearAlreadyMoved.push(bearNewCoord);
    myView.bearMoveUp(row, column);
  }

  self.bearMove=function() {
    for (var i=0; i<self.map.length; i++) {
      for (var j=0; j<self.map[i].length; j++) {
        var currentObject=self.map[i][j];
        if (currentObject===bear) {
          var bearMoved=false;
          for (var g=0; g<self.bearAlreadyMoved.length;g++) {
            if ((self.bearAlreadyMoved[g][0]===i)&&(self.bearAlreadyMoved[g][1]===j)) {
              bearMoved=true;
            }
          }
          if (bearMoved){
            continue;
          }

          var moveDirections=self.bearCanMove(i, j);
          if (moveDirections.length>0) {
            var randomMove=randomDiap(0, moveDirections.length-1);
            moveDirections[randomMove](i, j);
          }
          else {  
            if (!horizontalCheck(i,j)&&!verticalCheck(i,j)) {
              self.map[i][j]=tombstone;
              self.matchCheck(i,j,tombstone);
            } 
            else {
              continue;
            }
          }
            //функция проверки совпадений по горизонтали
            function horizontalCheck(row, column) {
              for (var i=column-1; i>=0; i--) {
                if (self.map[row][i]===bear) {
                  moveDirections=self.bearCanMove(row,i);
                  if (moveDirections.length>0) {
                    return true;
                  }
                  else {
                    if (verticalCheck(row,i)) {
                      return true;
                    }
                  }           
                }
                else {
                  break;
                }
              }
              for (var i=column+1; i<self.map[row].length; i++){
                if (self.map[row][i]==bear){
                  moveDirections=self.bearCanMove(row,i);
                  if (moveDirections.length>0) {
                    return true;
                  }
                  else {
                    if (verticalCheck(row,i)) {
                      return true;
                    }
                  }             
                }
                else {
                  break;
                }
              }
              return false;
            }
            //функция проверки совпадений по вертикали
            function verticalCheck(row, column) {
              for (var i=row-1; i>=0; i--) {
                if (self.map[i][column]===bear) {
                  moveDirections=self.bearCanMove(i, column);
                  if (moveDirections.length>0) {
                    return true;
                  }
                  else {
                    if (horizontalCheck(i, column)){
                      return true;
                    }
                  }
                }
                else {
                  break;
                }
              }
              for (var i=row+1; i<self.map.length; i++) {
                if (self.map[i][column]===bear) {
                  moveDirections=self.bearCanMove(i, column);
                  if (moveDirections.length>0) {
                    return true;
                  }
                  else {
                    if(horizontalCheck(i, column)){
                      return true
                    }
                  }
                }
                else {
                  break;
                }
              }
              return false;
            } 
          }
      }
    }
    self.bearAlreadyMoved=[];
  }

//ПРОВЕРКА СОВПАДЕНИЙ
  self.matchCheck=function(row, column, object) {
    var matchCount = 0;
    var matchRowArray = [];
    var matchColumnArray = [];
    if (object===bear) {
      return;      
    }
    horizontalCheck(row, column);
    verticalCheck(row, column);
    //функция проверки совпадений по горизонтали
    function horizontalCheck(row, column) {
      for (var i=column-1; i>=0; i--) {
        if (self.map[row][i]===object) {
          matchRowArray.push(row);
          matchColumnArray.push(i);
          matchCount++;
          verticalCheck(row, i)               
        }
        else {
          break;
        }
      }
      for (var i=column+1; i<self.map[row].length; i++){
        if (self.map[row][i]==object){
          matchRowArray.push(row);
          matchColumnArray.push(i);
          matchCount++;
          verticalCheck(row, i)               
        }
        else {
          break;
        }
      }
    }
    //функция проверки совпадений по вертикали
    function verticalCheck(row, column) {
      for (var i=row-1; i>=0; i--) {
        if (self.map[i][column]===object) {
          matchRowArray.push(i);
          matchColumnArray.push(column);
          matchCount++;
          horizontalCheck(i, column);
      }
      else {
        break;
      }
    }
    for (var i=row+1; i<self.map.length; i++) {
        if (self.map[i][column]===object) {
        matchRowArray.push(i);
        matchColumnArray.push(column);
        matchCount++;
        horizontalCheck(i, column);
      }
      else {
        break;
      }
    }
  } 
    if (matchCount>=2) {
      for (var i=0; i<matchRowArray.length; i++) {
        self.map[matchRowArray[i]][matchColumnArray[i]]=0;
      }
      var nextObject=object.nextLevel;
      self.map[row][column]=nextObject;
      myView.objectsCombine(row, column, matchRowArray, matchColumnArray);
      myView.pointsGained(row, column, nextObject);
      self.matchCheck(row, column, nextObject);
      switch (matchCount) {
        case 2:
          self.totalPoints+=nextObject.points;
          break;
        case 3:
          self.totalPoints+=Math.round(nextObject.points*1.2);
          break;
        case 4:
          self.totalPoints+=Math.round(nextObject.points*1.5);
          break;
        case 5:
          self.totalPoints+=Math.round(nextObject.points*1.6);
          break;
        case 6:
          self.totalPoints+=Math.round(nextObject.points*1.7);
          break;
        case 7:
          self.totalPoints+=Math.round(nextObject.points*1.8);
          break;
        case 8:
          self.totalPoints+=Math.round(nextObject.points*2);
          break;                   
      }
    }
    else {
      self.map[row][column]=object;
      
    }
  }

  //СОЗДАНИЕ СЛУЧАЙНОГО ОБЪЕКТА
  self.generateRandom=function(array) {  
    var chosenItems=[];
    var randomNumber = Math.random();
    for (var i=0; i<array.length; i++) {
      if (array[i].rate===0) {
        continue;
      }
      if (randomNumber<=array[i].rate){
        chosenItems.push(array[i]);
      }
    }
    if (chosenItems.length===0){
      return self.generateRandom(array);
    }
    else {
      var minIndex = chosenItems.length-1;
      var minValue =chosenItems[minIndex].rate;
      var el;
      for(var i=chosenItems.length-2; i>=0; i--) {
        el = chosenItems[i].rate;
        if(el<minValue){
          minValue = el;
          minIndex = i;
        } 
      }
    return chosenItems[minIndex];
    }
  }

  function randomDiap(n,m) {
    return Math.floor(
      Math.random()*(m-n+1)
      )+n;
  }
  
  //функция генерации новой карты
  self.mapGenerate=function() {
    self.map = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ] 
    var objectQuantity = 10;
    var count = 0;
    while (count<objectQuantity) {
      do {
      var randomObject = self.generateRandom(objectArray);}
      while (!randomObject.availbleOnStart);
      //если объект попал на клетку на которой уже есть другой объект

      do {
        do {
          var row=randomDiap(0,5);
          var column=randomDiap(0,5);
          }
          while (self.map[row][column]);
        
        var matchCount=0;
        if ((row-1>=0)&&(self.map[row-1][column]===randomObject)) {
          matchCount+=1;
        }  
        if ((row+1<self.map.length)&&(self.map[row+1][column]===randomObject)) {
          matchCount+=1;
        }
        if (self.map[row][column-1]===randomObject) {
          matchCount+=1;
        }
        if (self.map[row][column+1]===randomObject) {
          matchCount+=1;
        }
      }
      while (matchCount>=1) 

      self.map[row][column]=randomObject;
      count++;
    }
    return self.map;
  }

  
  self.nextMove=function(row, column) {
    self.map[row][column]=self.currentObject;
    self.totalPoints+=self.currentObject.points;
    myView.placeObject(row, column, self.currentObject);
    self.bearMove();
    self.matchCheck(row, column, self.currentObject);
    setTimeout(self.updateView, 500);
    self.currentObject=self.generateRandom(objectArray);
  }
  
};









