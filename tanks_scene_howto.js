//tanks_scene_howto.js - How To Play scene

//InputHandler Enter keypress
var keyPressHowToEnter = function(){
  //Return to main menu
  changeScene(sceneMainMenu);
    
  audioPlayMenuSelect();
};

//Initialize the scene. Runs once every time the scene is switched to.
var initSceneHowTo = function(){
  window.object3dSelectMissileHowTo0 = null;
  window.object3dSelectMissileHowTo1 = null;
  window.object3dHowToLauncher = null;
  window.object3dHowToMissile = null;
  window.object3dHowToFakeTimer = null;
  window.object3dHowToTank = null;
  window.object3dHowToWrench = null;
  window.timeFakeTimer = 120;
  window.timeLastFakeTimer = timeFakeTimer;

  //Clear the scene.
	objectLL = new LinkedList();
	
	//Add user input function for the scene
  userInput.clearAllPressFunctions();
  userInput.addPressFunction(userInput.ENTER, keyPressHowToEnter);
  userInput.addPressFunction(userInput.SPACE, keyPressHowToEnter);
	
  //Initialize countdown timer
	timeFakeTimer = 120;
  timeLastFakeTimer = timeFakeTimer;
	
  //Bunch of text
	var object3dTempHowTo = createStringHUDObject3D("HOW TO PLAY", 50, 20, 0.18, 0.3);
	objectLL.push(object3dTempHowTo);
	var object3dTempHowTo = createStringHUDObject3D("HOW TO PLAY", 50.8, 20.5, 0.18, 0.3);
	objectLL.push(object3dTempHowTo);

  var object3dTempHowTo = createStringHUDObject3D("Seek out and destroy ", 30, 31, 0.06, 0.06);
	objectLL.push(object3dTempHowTo);
	var object3dTempHowTo = createStringHUDObject3D("the mobile launch ", 30, 36, 0.06, 0.06);
	objectLL.push(object3dTempHowTo);
	var object3dTempHowTo = createStringHUDObject3D("platforms before they", 30, 41, 0.06, 0.06);
	objectLL.push(object3dTempHowTo);
	var object3dTempHowTo = createStringHUDObject3D("launch their missile.", 30, 46, 0.06, 0.06);
	objectLL.push(object3dTempHowTo);
	
	var object3dTempHowTo = createStringHUDObject3D("Destory enemy tanks", 65, 55, 0.06, 0.06);
	objectLL.push(object3dTempHowTo);
	var object3dTempHowTo = createStringHUDObject3D("along the way.", 65, 60, 0.06, 0.06);
	objectLL.push(object3dTempHowTo);

  var object3dTempHowTo = createStringHUDObject3D("Pick up wrenches to get", 35, 70, 0.06, 0.06);
	objectLL.push(object3dTempHowTo);
	var object3dTempHowTo = createStringHUDObject3D("extra lives.", 35, 75, 0.06, 0.06);
	objectLL.push(object3dTempHowTo);

	var object3dTempHowTo = createStringHUDObject3D("Arrow keys to move. Space to Fire.", 50, 86, 0.06, 0.06);
	objectLL.push(object3dTempHowTo);
	
	var object3dTempHowTo = createStringHUDObject3D("T-:", 80, 35, 0.06, 0.06, false);
	objectLL.push(object3dTempHowTo);
	object3dHowToFakeTimer = createStringHUDObject3D(timeFakeTimer.toFixed(0).toString(), 87, 35, 0.06, 0.06, false);
	objectLL.push(object3dHowToFakeTimer);
	
	//Add a mobile luancher example model
	object3dHowToLauncher = new object3D(vertLauncher, indLauncher);
  object3dHowToLauncher.hud = true;
  object3dHowToLauncher.scale = [1.6, 1.4, 1.6];
	object3dHowToLauncher.position = utilHUDPositionByPercent(70, 49, 20);
	object3dHowToLauncher.rotate(Math.PI, [1,0,0]);
  objectLL.push(object3dHowToLauncher);

	object3dHowToMissile = new object3D(vertMissile, indMissile);
  object3dHowToMissile.hud = true;
  object3dHowToMissile.scale = [0.7,0.7,0.7];
  object3dHowToMissile.position = utilHUDPositionByPercent(70, 38, 4);
  object3dHowToMissile.rotate(Math.PI/2, [1,0,0]);
  objectLL.push(object3dHowToMissile);
  
  //Add enemy tank example model
  object3dHowToTank = new object3D(tankVerts, tankInd);
  object3dHowToTank.scale = [0.3,0.3,0.3];
	object3dHowToTank.position = utilHUDPositionByPercent(23, 59, 4);
  object3dHowToTank.rotate(Math.PI, [1,0,0]);
	object3dHowToTank.hud = true;
	objectLL.push(object3dHowToTank);
	
  //Add wrench example model
  object3dHowToWrench = new object3D(vertsWrench, indWrench);
  object3dHowToWrench.scale = [0.04,0.04,0.04];
  object3dHowToWrench.rotate(Math.PI, [1,0,0]); //It's upside down, flip it.
	object3dHowToWrench.position = utilHUDPositionByPercent(75, 79, 4);
  object3dHowToWrench.hud = true;
	objectLL.push(object3dHowToWrench);

	//Back button
	var object3dTempHowTo = createStringHUDObject3D("BACK", 50, 94.5, 0.11, 0.11);
	objectLL.push(object3dTempHowTo);

  //Menu selection missiles on left and right side of BACK button.
  object3dSelectMissileHowTo0 = new object3D(vertMissile, indMissile);
  object3dSelectMissileHowTo0.scale = [0.35,0.35,0.35];
  object3dSelectMissileHowTo0.rotate(-(Math.PI / 2), [0,1,0]);
	object3dSelectMissileHowTo0.position = utilHUDPositionByPercent(65, 92.5, 4);
	object3dSelectMissileHowTo0.hud = true;
	objectLL.push(object3dSelectMissileHowTo0);
	
	object3dSelectMissileHowTo1 = new object3D(vertMissile, indMissile);
  object3dSelectMissileHowTo1.scale = [0.35,0.35,0.35];
  object3dSelectMissileHowTo1.rotate((Math.PI / 2), [0,1,0]);
	object3dSelectMissileHowTo1.position = utilHUDPositionByPercent(33, 92.5, 4);
	object3dSelectMissileHowTo1.hud = true;
	objectLL.push(object3dSelectMissileHowTo1);

	initHasRun = true;
};

//Deal with a bug. Explained below.
window.howtobug = 0;

//Scene frame update. Runs once every animation frame
var sceneHowTo = function(){
	//Run the init function if it has not been run yet.
  if(initHasRun == false){
  	initSceneHowTo();
  }
  //The countdown timer on the how to screen doesn't do anything. Just for display.
  timeFakeTimer -= deltaTime;
  if(timeFakeTimer < 0){
    timeFakeTimer = 120;
  }
  //timer variable counts down as a float. Display only a whole number.
  if(timeFakeTimer.toFixed(0) != timeLastFakeTimer.toFixed(0)){
    var vertsTemp = new Array();
    var indsTemp = new Array();
    buildStringMesh(vertsTemp, indsTemp, timeFakeTimer.toFixed(0).toString());
    object3dHowToFakeTimer.changeModel(vertsTemp, indsTemp);
    timeLastFakeTimer = timeFakeTimer;
  }
  //slowly spin the enemy examples

  //BUG: rotation matrix for the launcher develops some kind of cumulative error
  //very quickly and gives the launcher a strange projection. Resetting and
  //reapplying the rotation seems to mitigate the issue. I'm sure it happens
  //in other rotations but only shows up for the launcher example.
  window.howtobug += 0.3 * deltaTime;
  if(howtobug > (Math.PI * 2)){ //reset howtobug when over 360 degrees
    howtotest = 0;
  }
  copyMatrix(object3dHowToLauncher.matrixObjectRotation, matrixIdentity);
  object3dHowToLauncher.rotate(Math.PI, [1,0,0]);
  object3dHowToLauncher.rotate(howtobug, [0,1,0]);
  //DEBUG
  //var t = object3dHowToLauncher.matrixObjectRotation;
  //msg.textContent  = t[0][0].toFixed(2) + " | " +t[0][1].toFixed(2) + " | " +t[0][2].toFixed(2) + " | " +t[0][3].toFixed(2) + "\r\n";
  //msg.textContent += t[1][0].toFixed(2) + " | " +t[1][1].toFixed(2) + " | " +t[1][2].toFixed(2) + " | " +t[1][3].toFixed(2) + "\r\n";
  //msg.textContent += t[2][0].toFixed(2) + " | " +t[2][1].toFixed(2) + " | " +t[2][2].toFixed(2) + " | " +t[2][3].toFixed(2) + "\r\n";
  //msg.textContent += t[3][0].toFixed(2) + " | " +t[3][1].toFixed(2) + " | " +t[3][2].toFixed(2) + " | " +t[3][3].toFixed(2);
  object3dHowToMissile.rotate(0.3 * deltaTime, [0,0,1]);
  object3dHowToTank.rotate(-0.3 * deltaTime, [0,1,0]);
  object3dHowToWrench.rotate(0.7 * deltaTime, [0,1,0]);
  
  //rotate selector missiles
  object3dSelectMissileHowTo0.rotate(3 * deltaTime, [0,0,1]);
  object3dSelectMissileHowTo1.rotate(3 * deltaTime, [0,0,1]);
};