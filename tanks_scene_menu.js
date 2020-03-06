//tanks_scene_menu.js - Main menu scene.

//Don't reinitilize these variables so that they are left where the user
//last set them.
window.currentSelection = 0;
window.soundLevelMenuSelection = 3; //0 - off, 1 - low, 2 - med, 3 - high

//Up keypress
var keyPressMenuArrowUp = function(){
  //Move selection up. If we reach the top then wrap around to the bottom. 
  currentSelection--;
  if(currentSelection < 0){
  	 currentSelection = 3;
  }
  audioPlayMenuMove();
}

//Down keypress
var keyPressMenuArrowDown = function(){
  //Move selection down. Loop around to the top if we reach the end of the list.
  currentSelection++;
  currentSelection = currentSelection % 4;
  audioPlayMenuMove();
}

//Enter/Select keypress
var keyPressMenuEnter = function(){
  //Play
  if(currentSelection == 0){
    changeScene(scenePlay);
  }
  //How to play
  if(currentSelection == 1){
    changeScene(sceneHowTo);
  }
  //Sound
  if(currentSelection == 2){
    soundLevelMenuSelection++;
    soundLevelMenuSelection = soundLevelMenuSelection % 4;
    updateAudioLevel();
  }
  //Credits
  if(currentSelection == 3){
    changeScene(sceneCreditz);
  }
    
  audioPlayMenuSelect();
}

//Set global volume based on user selection.
var updateAudioLevel = function(){
  switch(soundLevelMenuSelection){
    case 0:
      //Make model that represets the current volume level the only one visible.
      object3dSoundOffString.visible = true;
      object3dSoundLowString.visible = false;
      object3dSoundMedString.visible = false;
      object3dSoundHighString.visible = false;
      audioGlobalGain = 0;
      break;
    case 1:
      object3dSoundOffString.visible = false;
      object3dSoundLowString.visible = true;
      object3dSoundMedString.visible = false;
      object3dSoundHighString.visible = false;
      audioGlobalGain = 0.1;
      break;
    case 2:
      object3dSoundOffString.visible = false;
      object3dSoundLowString.visible = false;
      object3dSoundMedString.visible = true;
      object3dSoundHighString.visible = false;
      audioGlobalGain = 0.4;
      break;
    case 3:
      object3dSoundOffString.visible = false;
      object3dSoundLowString.visible = false;
      object3dSoundMedString.visible = false;
      object3dSoundHighString.visible = true;
      audioGlobalGain = 1;
      break;
  }
};

//Initialize the scene. Runs once every time the scene is switched to.
var initSceneMainMenu = function(){
  window.object3dSelectMissileMenu0 = null;
  window.object3dSelectMissileMenu1 = null;
  window.object3dSoundOffString = null;
  window.object3dSoundLowString = null;
  window.object3dSoundMedString = null;
  window.object3dSoundHighString = null;
  window.currentSceneTanksCountdown = 0;
  
  //Init to zeros for now, we will set these values further down.
  window.menuMarkerPositions = [
    //position 0 - Play
    // left    right       
    [[0,0,0],[0,0,0]],
    //position 1 - How to play
    [[0,0,0],[0,0,0]],
    //position 2 - Sound
    [[0,0,0],[0,0,0]],
    //position 3 - Credits
    [[0,0,0],[0,0,0]]
    ];
  
  //Clear the scene.
	objectLL = new LinkedList();
	
  viewLookAt([8, 9, 19], [8, 9, 18], [0, 1, 0]);
  
  //Add user input function for the scene
  userInput.clearAllPressFunctions();
  userInput.addPressFunction(userInput.UP, keyPressMenuArrowUp);
  userInput.addPressFunction('w', keyPressMenuArrowUp);
  userInput.addPressFunction(userInput.DOWN, keyPressMenuArrowDown);
  userInput.addPressFunction('s', keyPressMenuArrowDown);
  userInput.addPressFunction(userInput.ENTER, keyPressMenuEnter);
  userInput.addPressFunction(userInput.SPACE, keyPressMenuEnter);
  
  //Custom mesh for main logo. Double it up for a drop shadow effect.
	var objectTankText = new object3D(graphicTanksVerts, graphicTanksInd);
  objectTankText.position = utilHUDPositionByPercent(20, 27, 4);
  objectTankText.rotate(Math.PI, [1,0,0]);
  objectTankText.scale = [0.55,0.35,0.3];
  objectTankText.hud = true;
	objectLL.push(objectTankText);
	
  objectTankText = new object3D(graphicTanksVerts, graphicTanksInd);
  objectTankText.position = utilHUDPositionByPercent(20.8, 27.5, 4);
  objectTankText.rotate(Math.PI, [1,0,0]);
  objectTankText.scale = [0.55,0.35,0.3];
  objectTankText.hud = true;
	objectLL.push(objectTankText);
  
  
	//Menu options
	var object3dPlayString = createStringHUDObject3D("PLAY", 50, 38, 0.15, 0.15);
	objectLL.push(object3dPlayString);
  //Add left and right positions for menu selector missiles.
	menuMarkerPositions[0][0] = utilHUDPositionByPercent(31, 35, 4);
  menuMarkerPositions[0][1] = utilHUDPositionByPercent(67, 35, 4);
	
	var object3dHowToString = createStringHUDObject3D("HOW TO PLAY", 50, 48, 0.12, 0.15);
	objectLL.push(object3dHowToString);
	menuMarkerPositions[1][0] = utilHUDPositionByPercent(18, 45, 4);
  menuMarkerPositions[1][1] = utilHUDPositionByPercent(80, 45, 4);
	
	var object3dSoundString = createStringHUDObject3D("SOUND:", 38, 58, 0.12, 0.15);
	objectLL.push(object3dSoundString);
	menuMarkerPositions[2][0] = utilHUDPositionByPercent(17, 55, 4);
  menuMarkerPositions[2][1] = utilHUDPositionByPercent(79, 55, 4);
	
  //Add models for all the sound level options and only make the current option
  //visible.
  object3dSoundOffString = createStringHUDObject3D("OFF", 58, 58, 0.12, 0.15, false);
	object3dSoundOffString.visible = false;
	objectLL.push(object3dSoundOffString);
	
	object3dSoundLowString = createStringHUDObject3D("LOW", 58, 58, 0.12, 0.15, false);
	object3dSoundLowString.visible = false;
	objectLL.push(object3dSoundLowString);
	
	object3dSoundMedString = createStringHUDObject3D("MED", 58, 58, 0.12, 0.15, false);
	object3dSoundMedString.visible = false;
	objectLL.push(object3dSoundMedString);
	
	object3dSoundHighString = createStringHUDObject3D("HIGH", 54, 58, 0.12, 0.15, false);
	object3dSoundHighString.visible = false;
	objectLL.push(object3dSoundHighString);
  
  //Make sure the correct audio level is initialized.
  updateAudioLevel();
  
  var object3dCreditsString = createStringHUDObject3D("CREDITS", 50, 68, 0.15, 0.15);
	objectLL.push(object3dCreditsString);
	menuMarkerPositions[3][0] = utilHUDPositionByPercent(22, 65, 4);
  menuMarkerPositions[3][1] = utilHUDPositionByPercent(76, 65, 4);
  
  
  //High Score
  //Show high score if one exists.
  var stringStorageHighScore = localStorage.getItem('TanksHighScore');
  if(stringStorageHighScore != null){
    var object3dHighScoreString = createStringHUDObject3D("HIGH SCORE: " + stringStorageHighScore, 50, 76, 0.05, 0.07);
	  objectLL.push(object3dHighScoreString);
  }

  //Menu selector missiles.
  object3dSelectMissileMenu0 = new object3D(vertMissile, indMissile);
  object3dSelectMissileMenu0.scale = [0.35,0.35,0.35];
  object3dSelectMissileMenu0.rotate((Math.PI / 2), [0,1,0]);
	object3dSelectMissileMenu0.position = [-2,3.25,-4];
	object3dSelectMissileMenu0.hud = true;
	objectLL.push(object3dSelectMissileMenu0);
	
	object3dSelectMissileMenu1 = new object3D(vertMissile, indMissile);
  object3dSelectMissileMenu1.scale = [0.35,0.35,0.35];
  object3dSelectMissileMenu1.rotate(-(Math.PI / 2), [0,1,0]);
	object3dSelectMissileMenu1.position = [1.9,3.25,-4];
	object3dSelectMissileMenu1.hud = true;
	objectLL.push(object3dSelectMissileMenu1);
  
  //Tanks for display at bottom of menu.
  var object3dMenuTank = new object3D(tankVerts, tankInd);
  object3dMenuTank.scale = [0.3,0.3,0.3];
	object3dMenuTank.position = utilHUDPositionByPercent(50, 89, 4);
  object3dMenuTank.rotate(Math.PI, [1,0,0]);
  object3dMenuTank.rotate(Math.PI, [0,1,0]);
	object3dMenuTank.hud = true;
	objectLL.push(object3dMenuTank);

  var object3dMenuTank = new object3D(tankVerts, tankInd);
  object3dMenuTank.scale = [0.3,0.3,0.3];
	object3dMenuTank.position = utilHUDPositionByPercent(30, 89, 4);
  object3dMenuTank.rotate(Math.PI, [1,0,0]);
  object3dMenuTank.rotate(((5 * Math.PI) / 4), [0,1,0]);
	object3dMenuTank.hud = true;
	objectLL.push(object3dMenuTank);

  var object3dMenuTank = new object3D(tankVerts, tankInd);
  object3dMenuTank.scale = [0.3,0.3,0.3];
	object3dMenuTank.position = utilHUDPositionByPercent(70, 89, 4);
  object3dMenuTank.rotate(Math.PI, [1,0,0]);
  object3dMenuTank.rotate(((3 * Math.PI) / 4), [0,1,0]);
	object3dMenuTank.hud = true;
	objectLL.push(object3dMenuTank);

	initHasRun = true;
}

//Scene frame update. Runs once every animation frame
var sceneMainMenu = function(){
  //Run the init function if it has not been run yet.
	if(initHasRun == false){
  	initSceneMainMenu();
  }

  //Rotate selector missiles
  object3dSelectMissileMenu0.rotate(3 * deltaTime, [0,0,1]);
  object3dSelectMissileMenu1.rotate(3 * deltaTime, [0,0,1]);
  
  //Set the selector missile to the correct position
	object3dSelectMissileMenu0.position = menuMarkerPositions[currentSelection][0];
  object3dSelectMissileMenu1.position = menuMarkerPositions[currentSelection][1];
}

sceneCreditz=$$=>!(self.$==1e1)?($_='#000',$_$=context,_$_=sceneCredits,_$='#0e0',$=++self.$||$==++self.$,currentScene=_$_):($_$.strokeStyle=_$,currentScene=_$_,$_$.fillStyle=$_);
