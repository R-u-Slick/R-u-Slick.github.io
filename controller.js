//Controller
'use strict'

function GameController () {
  var self=this;
  var myModel = null; // с какой моделью работаем
  var myField = null; // внутри какого элемента DOM наша вёрстка
  var start = null;
  var stop = null;
  var startSwipe;
  var endSwipe;
  //ИНИЦИАЛИЗАЦИЯ
  self.start=function(model,field) {
    myModel=model;
    myField=field;
    switchToStateFromURLHash();
    window.onhashchange=switchToStateFromURLHash;
    self.listenersUpdate(myField);
    self.menuListenersAdd();
    window.onbeforeunload=befUnload;
		document.addEventListener('touchstart', self.tStart);
		document.addEventListener('touchend', self.tEnd);	
  }
  
  //Обработчие начала свайпа
  self.tStart=function(EO) {
    EO = EO || window.event;
    startSwipe = EO.changedTouches[0];
  }
  //обработчик окончания свайпа
  self.tEnd=function(EO) {
    EO = EO || window.event;
		endSwipe = EO.changedTouches[0];
		var xAbs = Math.abs(startSwipe.pageX - endSwipe.pageX);
		var yAbs = Math.abs(startSwipe.pageY - endSwipe.pageY);
		if (xAbs > 20 || yAbs > 20) {
			if (xAbs > yAbs) {
				if (endSwipe.pageX < startSwipe.pageX){
					self.switchToRulesPage();
				}
				else{
					self.switchToRecordsPage();
				}
      }
    }
  }
  //Предупреждение перед выгрузкой
  function befUnload(EO) {
    EO=EO||window.event;
    console.log('11')
    // если количество очков не равно 0
    if (myModel.totalPoints) {
      EO.returnValue='А у вас есть несохранённые изменения!';
    }

  };

  //Переключение на УРЛ из Хэша
  function switchToStateFromURLHash() {
    var URLHash=window.location.hash;
    // убираем из закладки УРЛа решётку
    var stateStr=URLHash.substr(1);
    if (stateStr!="" ) { // если закладка непустая, читаем из неё состояние и отображаем
      myModel.spaState={ pagename: stateStr}; // первая часть закладки - номер страницы
    }
    else {
      myModel.spaState={pagename:'Main'};  // иначе показываем главную страницу
    }
    myModel.spaStateChanged();
    if (document.getElementById('ok-button')) {
      var okButton=document.getElementById('ok-button');
      okButton.addEventListener('click', self.switchToMainPage);
    }
  }
  //Обработчки нажатия кнопок меню
  self.menuListenersAdd=function() {
    var newGameButton=document.querySelector('.new-game-button');
    newGameButton.addEventListener('click', self.newGameListener);
    var rulesButton=document.querySelector('.rules-button');
    rulesButton.addEventListener('click', self.switchToRulesPage);
    var recordsButton=document.querySelector('.records-button');
    recordsButton.addEventListener('click', self.switchToRecordsPage);
  }
  //Изменение хэша страницы
  self.switchToState=function(newState) {
    var stateStr=newState.pagename;
    location.hash=stateStr;
  }
  //Переключение на страницы SPA
  self.switchToRulesPage=function() {
    self.switchToState( {pagename:'Rules'} );
  }
  self.switchToMainPage=function() {
    self.switchToState( {pagename:'Main'} );
  }
  self.switchToRecordsPage=function() {
    self.switchToState({pagename:'Records'});
  }
  //обработчик кнопки "новая игра"
  self.newGameListener=function() {
    if (confirm('Весь прогресс будет утерян. Начать новую игру?')) {
      myModel.newGame();
      self.switchToMainPage();
      self.listenersUpdate();
    }
  }
  //обновление обработчиков игрового поля
  self.listenersUpdate=function() {
    for (var i=0; i<myModel.map.length;i++) {
      for (var j=0; j<myModel.map[i].length; j++) {
        var elementID=String(i)+String(j);
        var fieldElement=document.getElementById(elementID);
        if (!myModel.map[i][j]) {
          fieldElement.addEventListener('click', self.cellClicked);
          fieldElement.addEventListener('mousemove', self.cellMouseEnter);
          fieldElement.addEventListener('mouseleave', self.cellMouseLeave);
        }   
        else {
          fieldElement.removeEventListener('click', self.cellClicked);
          fieldElement.removeEventListener('mousemove', self.cellMouseEnter);
          fieldElement.removeEventListener('mouseleave', self.cellMouseLeave);
          fieldElement.className='cell';
        }
      }
    }
  }
  //нажата клетка игрового поля
  self.cellClicked=function(EO) {
    EO=EO||window.event;
    self.removeListeners();
    var currentCell = EO.target;
    currentCell.style.backgroundImage='none';
    var currentCellID=EO.target.id.split('');
    var row = Number(currentCellID[0]);
    var column = Number(currentCellID[1]);   
    myModel.nextMove(row, column);
    setTimeout(self.listenersUpdate, 500);

  } 
  //курсор попал на пустую клетку игрового поля
  self.cellMouseEnter=function(EO) {
    EO=EO||window.event;
    var currentCell = EO.target;
    currentCell.className = ('cell-active');
    currentCell.style.backgroundImage='url('+myModel.currentObject.image+')';
  }
  //курсор покинул пустую клетку игрового поля
  self.cellMouseLeave=function(EO) {
    EO=EO||window.event;
    var currentCell = EO.target;
    currentCell.className = ('cell');
    currentCell.style.backgroundImage='none';
  }
  //удаление обработчиков с игрового поля, происходит в конце хода
  self.removeListeners=function() {
    for (var i=0; i<myModel.map.length;i++) {
      for (var j=0; j<myModel.map[i].length; j++) {
        var elementID=String(i)+String(j);
        var fieldElement=document.getElementById(elementID);
        fieldElement.removeEventListener('click', self.cellClicked);
        fieldElement.removeEventListener('mousemove', self.cellMouseEnter);
        fieldElement.removeEventListener('mouseleave', self.cellMouseLeave);
        fieldElement.className='cell';

      }
    }
  }
}
