//tanks_input.js - User input handling.
//InputHandler object adds keyboard event listeners. Only one InputHandler 
//is created for the game. The different scenes modify the InputHandler as 
//needed.

function InputHandler(){  
  //Name aliases.
  this.LEFT= "ArrowLeft";
  this.UP= "ArrowUp";
  this.RIGHT= "ArrowRight";
  this.DOWN= "ArrowDown";
  this.ENTER= "Enter";
  this.SPACE=' ';
  //map of keys currently being pressed.
  this.mapCurrentKeys = new Map();
  //map of function to run for a given key.
  this.mapKeyPressFunctions = new Map();
  //keyboard event listeners.
  window.addEventListener('keyup', this.onRelease.bind(this), false);
  window.addEventListener('keydown', this.onPress.bind(this), false);
}

//Is the passed key currently being pressed.
//key - DOMString designation or name alias of the key
//returns boolean - true if the key is currently down, false if it is not.
InputHandler.prototype.isDown = function(key){
  
  //If the key is found in the mapCurrentKeys map then it is being pressed.
  return this.mapCurrentKeys.has(key);
}

//Add a function to run if the given key is pressed. If a function already exists
//for that key then it is overwritten.
//key - DOMString designation or name alias of the key
//passedFunction - function reference
InputHandler.prototype.addPressFunction = function(key, passedFunction){
  
  this.mapKeyPressFunctions.set(key, passedFunction);
}

//Clear all key press functions for the InputHandler.
InputHandler.prototype.clearAllPressFunctions = function(){
  
  this.mapKeyPressFunctions.clear();
}

//Function passed to the EventListener. Handles keyboard keydown events.
//event - KeyboardEvent
InputHandler.prototype.onPress = function(event){
  //Prevent the default web browser actions of the keys. This stops the broswer
  //from scrolling if the arrow keys or space is pressed.
  event.preventDefault();
  //Check to see if this is the first press event for this key. keydown events
  //continusly fire if the key is held down.
  if(this.mapCurrentKeys.has(event.key) === false){
    //If the key has an associated function to run then run it.
    if(this.mapKeyPressFunctions.has(event.key) === true){
      var tempFunction = this.mapKeyPressFunctions.get(event.key);
      tempFunction();
    }
  }
  //Add the key to the mapCurrentKeys map. If it's already in the map it will be
  //updated, if it's not then it will be added. If the key is in the
  //mapCurrentKeys map then it is being pressed. event.timeStamp is stored as
  //the value but I don't have any plans to use that value.
  this.mapCurrentKeys.set(event.key, event.timeStamp);
}

//Function passed to the EventListener. Handles keyboard keyup events.
//event - KeyboardEvent
InputHandler.prototype.onRelease = function(event){
  
  //keyup is only triggered once on release. Just have to deleted the value from
  //the mapCurrentKeys map to recognize that it is no longer being pressed.
  this.mapCurrentKeys.delete(event.key);
}




