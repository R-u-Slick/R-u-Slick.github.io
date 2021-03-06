"use strict"
//ОПИСАНИЕ ОБЪЕКТОВ
//функция-конструктор класса игрового объекта
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

var objectArray=[]; //массив со всеми игровыми объектами, нужен для рандома

//создадим игровые объекты и добавим их в массив
var grass=new GameObject(5, 1, 'images/Grass.png');
grass.arrayAppend(objectArray);
var bush=new GameObject(20, 0.6, 'images/Bush.png');
bush.arrayAppend(objectArray);
var tree=new GameObject(100, 0.3, 'images/Tree.png');
tree.arrayAppend(objectArray);
var hut=new GameObject(500, 0.15, 'images/Hut.png');
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
var bear=new GameObject(0, 0.03, 'images/Bear.png');
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


//МОДЕЛЬ ИГРЫ
function GameModel() {
  var self=this;
  //игровая карта
  self.map = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ]
  self.currentObject=null;  //текущий объект

  var myView = null; 

  self.totalPoints = 0;

  self.spaState ={};

  //изменение состояния в зависимости от хэша
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
  //инициализация
  self.start=function(view) {
      myView=view;
      self.mapGenerate();
      self.currentObject=self.generateRandom(objectArray);
  }
  //новая игра. Срабатывает при нажатии кнопки новая игра или геймовере
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
//перемещение медведей
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
    return moveDirections;//массив с возможными направлениями для движения медведя
  }
  //функции перемещения медведя
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
  //функция перемещения медведя
  self.bearMove=function() {
    //перебираем всю карту и ищем медведей
    for (var i=0; i<self.map.length; i++) {
      for (var j=0; j<self.map[i].length; j++) {
        var currentObject=self.map[i][j];
        //если объект медведь, проверяем двигался ли он уже за этот ход
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
          //если медведь не двигался - ищем возможные направления его движения
          var moveDirections=self.bearCanMove(i, j);
          //если медведь может двигаться хоть куда-нибудь - выбираем рандомом выбираем куда идти
          if (moveDirections.length>0) {
            var randomMove=randomDiap(0, moveDirections.length-1);
            moveDirections[randomMove](i, j);
          }
          //далее ищем медведей по соседству и определяем могут ли они двигаться. Если не могут - превращаем медведя в могилку
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
    self.bearAlreadyMoved=[];//обнуляем список медведей которые уже ходили
  }

//ПРОВЕРКА СОВПАДЕНИЙ
  self.matchCheck=function(row, column, object) {
    var matchCount = 0;//счетчик совпадений
    var matchRowArray = [];//координаты совпавших элементов по Y
    var matchColumnArray = [];//координаты совпавших элементов по Х
    //если объект медведь, то совпадения не ищем, тк он ни с чем не объеденяется
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
    //если совпадений более 2-х - помещаем объект след уровня, старые объекты стираем
    if (matchCount>=2) {
      for (var i=0; i<matchRowArray.length; i++) {
        self.map[matchRowArray[i]][matchColumnArray[i]]=0;
      }
      var nextObject=object.nextLevel;
      self.map[row][column]=nextObject;
      myView.objectsCombine(row, column, matchRowArray, matchColumnArray);//анимация объединения объектов
      myView.pointsGained(row, column, nextObject);//анимация добавления очков
      self.matchCheck(row, column, nextObject);//заново запустим поиск совпадений
      //в зависимости от кол-ва совпавших элементов  разное кол-во очков
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
      self.map[row][column]=object; // если совпадений не было - ставим в клетку просто объект
      
    }
  }
  //создание случайного объекта
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
  //Рандом
  function randomDiap(n,m) {
    return Math.floor(
      Math.random()*(m-n+1)
      )+n;
  }
  
  //Функция генерации новой карты
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
  //функция определения геймовера
  self.isGameOver=function() {
    for (var i=0; i<self.map.length; i++) {
      for (var j=0; j<self.map.length; j++) {
        if (self.map[i][j]===0) {
          return false;
        }
      }
    }
    return true;
  }
  //функция записи в AJAX
  function AJAXNewRecord() {
    var ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
    var updatePassword;
    var stringName='Sadykov_TripleTownProject';
    updatePassword=Math.random();
    $.ajax( {
            url: ajaxHandlerScript, type: 'POST', cache: false, dataType:'json',
            data: { f: 'LOCKGET', n: stringName, p: updatePassword },
            success: lockGetReady, error: errorHandler
        }
    );     
    function lockGetReady(callresult) {
      if ( callresult.error!=undefined ) {
          alert(callresult.error);
      }
      else {
        debugger;
        var recordsTable=JSON.parse(callresult.result);
        recordsTable.sort(function(a, b) {
          return b[1] - a[1];
        })
        if (recordsTable.length>=20) {
          for (var i=0; i<recordsTable.length; i++) {
            if (recordsTable[i][1]<self.totalPoints) {
              var name=prompt('Поздравляем! Вы попали в таблицу рекордов! Введите ваше имя');
              recordsTable.push([name, self.totalPoints]);
              recordsTable.sort(function(a, b) {
                return b[1] - a[1];
              })
              recordsTable=recordsTable.slice(0,20);
              break;
            }
            if (i===recordsTable.length-1) {
              alert('Игра окончена! К сожалению вы не попали в таблицу рекордов');
            }     
          }
        }
        else {
          var name=prompt('Поздравляем! Вы попали в таблицу рекордов! Введите ваше имя');
          recordsTable.push([name, self.totalPoints]);
          recordsTable.sort(function(a, b) {
            return b[1] - a[1];
          })
        }
        $.ajax( {
          url : ajaxHandlerScript, type: 'POST', cache: false, dataType:'json',
          data : { f: 'UPDATE', n: stringName, v: JSON.stringify(recordsTable), p: updatePassword },
          success : updateReady, error : errorHandler
        }
        );
      }
      self.newGame(); //новая игра
    }

    function updateReady(callresult) {
      if ( callresult.error!=undefined )
          alert(callresult.error);
    }

    function errorHandler(jqXHR,statusStr,errorStr) {
      alert(statusStr+' '+errorStr);
    }
  
  }
  
  //новый ход
  self.nextMove=function(row, column) {
    self.map[row][column]=self.currentObject; //ставим в клетку текущий объект
    self.totalPoints+=self.currentObject.points;//добавляем очки за него
    myView.placeObject(row, column, self.currentObject);//отображаем объект
    self.bearMove();//двигаем медведей
    self.matchCheck(row, column, self.currentObject);//проверяем совпадения
    setTimeout(self.updateView, 500);//обновляем отображение
    //если гамовер-записываем рекорд
    if (self.isGameOver()) {
      AJAXNewRecord();
    }
    self.currentObject=self.generateRandom(objectArray);//генерируем случайный объект для след хода
  }

};





