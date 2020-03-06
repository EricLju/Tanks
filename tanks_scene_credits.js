//tanks_scene_credits.js - Credits scene

//InputHandler Enter keypress
var keyPressCreditsEnter = function(){
  //Return to main menu.
  changeScene(sceneMainMenu);
    
  audioPlayMenuSelect();
}

//Initialize the scene. Runs once every time the scene is switched to.
var initSceneCredits = function(){
  window.object3dSelectMissileCredits0 = null;
  window.object3dSelectMissileCredits1 = null;

  //Clear the scene.
	objectLL = new LinkedList();
  
  //Add user input function for the scene
  userInput.clearAllPressFunctions();
  userInput.addPressFunction(userInput.ENTER, keyPressCreditsEnter);
  userInput.addPressFunction(userInput.SPACE, keyPressCreditsEnter);
  
  //Title. Double it up like a drop shadow so that it stands out more then the
  //following text.
  var object3dTempCredits = createStringHUDObject3D("CREDITS", 50, 20, 0.18, 0.3);
	objectLL.push(object3dTempCredits);
	var object3dTempCredits = createStringHUDObject3D("CREDITS", 50.8, 20.5, 0.18, 0.3);
	objectLL.push(object3dTempCredits);
	
	//Draw a bunch of text. Nothing interesting.
	var object3dTempCredits = createStringHUDObject3D("Tanks was created as a learning experience", 50, 30, 0.06, 0.06);
	objectLL.push(object3dTempCredits);
	var object3dTempCredits = createStringHUDObject3D("in writing a 3D graphics engine.", 50, 34, 0.06, 0.06);
	objectLL.push(object3dTempCredits);
	var object3dTempCredits = createStringHUDObject3D("Thanks to opengl for acting as a reference.", 50, 38, 0.06, 0.06);
	objectLL.push(object3dTempCredits);

  var object3dTempCredits = createStringHUDObject3D("Author: Eric Ljungquist", 50, 46, 0.1, 0.1);
	objectLL.push(object3dTempCredits);
  var object3dTempCredits = createStringHUDObject3D("protoable@gmail.com", 50, 53, 0.1, 0.1);
	objectLL.push(object3dTempCredits);
  
  var object3dTempCredits = createStringHUDObject3D("Copyright: CC0 1.0 Public Domain", 50, 63, 0.08, 0.1);
	objectLL.push(object3dTempCredits);
  var object3dTempCredits = createStringHUDObject3D("creativecommons.org/publicdomain/zero/1.0/", 50, 70, 0.06, 0.1);
	objectLL.push(object3dTempCredits);
  
	//Back button
	var object3dTempCredits = createStringHUDObject3D("BACK", 50, 94.5, 0.11, 0.11);
	objectLL.push(object3dTempCredits);

  //Menu selection missiles on left and right side of BACK button.
  object3dSelectMissileCredits0 = new object3D(vertMissile, indMissile);
  object3dSelectMissileCredits0.scale = [0.35,0.35,0.35];
  object3dSelectMissileCredits0.rotate(-(Math.PI / 2), [0,1,0]);
	object3dSelectMissileCredits0.position = utilHUDPositionByPercent(65, 92.5, 4);
	object3dSelectMissileCredits0.hud = true;
	objectLL.push(object3dSelectMissileCredits0);
	
	object3dSelectMissileCredits1 = new object3D(vertMissile, indMissile);
  object3dSelectMissileCredits1.scale = [0.35,0.35,0.35];
  object3dSelectMissileCredits1.rotate((Math.PI / 2), [0,1,0]);
	object3dSelectMissileCredits1.position = utilHUDPositionByPercent(33, 92.5, 4);
	object3dSelectMissileCredits1.hud = true;
	objectLL.push(object3dSelectMissileCredits1);

	initHasRun = true;
}

//Scene frame update. Runs once every animation frame
var sceneCredits = function(){
  //Run the init function if it has not been run yet.
	if(initHasRun == false){
  	initSceneCredits();
  }
   
  //rotate selector missiles
  object3dSelectMissileCredits0.rotate(3 * deltaTime, [0,0,1]);
  object3dSelectMissileCredits1.rotate(3 * deltaTime, [0,0,1]);
  
  
}