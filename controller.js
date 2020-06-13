//Controller
'use strict'

function GameController () {
  var self=this;
  var myModel = null; // с какой моделью работаем
  var myField = null; // внутри какого элемента DOM наша вёрстка
  var start = null;
  var stop = null;

  self.start=function(model,field) {
    myModel=model;
    myField=field;
    self.listenersUpdate(myField);
    
  }

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

  self.cellMouseEnter=function(EO) {
    EO=EO||window.event;
    var currentCell = EO.target;
    currentCell.className = ('cell-active');
    currentCell.style.backgroundImage='url('+myModel.currentObject.image+')';
  }

  self.cellMouseLeave=function(EO) {
    EO=EO||window.event;
    var currentCell = EO.target;
    currentCell.className = ('cell');
    currentCell.style.backgroundImage='none';
  }
  
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
