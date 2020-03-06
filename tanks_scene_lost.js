//tanks_scene_lost - Player Lost scene.

//InputHandler Enter keypress
var keyPressLostEnter = function(){
  //Don't accept user input for the first 0.5 seconds. This prevents accidently
  //skipping this scene when vigorously hitting space during gameplay.
  if(inputLag < 0.5){
    return;
  }
  //Return to main menu
  changeScene(sceneMainMenu);
    
  audioPlayMenuSelect();
};

//Initialize the scene. Runs once every time the scene is switched to.
var initSceneLost = function(){
  window.inputLag = 0; 
  window.object3dSelectMissileLost0 = null;
  window.object3dSelectMissileLost1 = null;
  window.object3DTankTop = null;
  window.object3DTankLower = null;
  window.timeSceneLostStartLength = 1.3; //A 2 second delay is 0.7 seconds too goddamn long
  window.timeSceneLostStart = timeSceneLostStartLength;
  window.hasBlowUpAnimationStarted = false;
  window.timeSceneLostSmokeLength = 0.5;
  window.timeSceneLostSmoke = timeSceneLostSmokeLength;
  window.object3dtestduty = null;

  //Clear the scene.
	objectLL = new LinkedList();

  //Set camera position and angle.
  viewLookAt([8, 11, 19], [8, 11, 18], [0, 1, 0]);

  //Add user input function for the scene
  userInput.clearAllPressFunctions();
  userInput.addPressFunction(userInput.ENTER, keyPressLostEnter);
  userInput.addPressFunction(userInput.SPACE, keyPressLostEnter);
  

  timeSceneLostStart = timeSceneLostStartLength;
  timeSceneLostSmoke = timeSceneLostSmokeLength;
  hasBlowUpAnimationStarted = false;
  
  //Title text. Double up for a drop shadow effect.
  var object3dTempLost = createStringHUDObject3D("YOU LOST", 50, 20, 0.18, 0.3);
	objectLL.push(object3dTempLost);
	var object3dTempLost = createStringHUDObject3D("YOU LOST", 50.8, 20.5, 0.18, 0.3);
	objectLL.push(object3dTempLost);
	
  //Show players score.
  var scoreString = "SCORE: " + window.playerScore.toString();
  var object3dTempLost = createStringHUDObject3D(scoreString, 50, 30, 0.08, 0.1);
	objectLL.push(object3dTempLost);

	//Back button
	var object3dTempLost = createStringHUDObject3D("MAIN MENU", 50, 94.5, 0.11, 0.11);
	objectLL.push(object3dTempLost);

  //Menu selection missiles on left and right side of MAIN MENU button.
  object3dSelectMissileLost0 = new object3D(vertMissile, indMissile);
  object3dSelectMissileLost0.scale = [0.35,0.35,0.35];
  object3dSelectMissileLost0.rotate((Math.PI / 2), [0,1,0]);
	object3dSelectMissileLost0.position = utilHUDPositionByPercent(23.5, 92.5, 4);
	object3dSelectMissileLost0.hud = true;
	objectLL.push(object3dSelectMissileLost0);
	
	object3dSelectMissileLost1 = new object3D(vertMissile, indMissile);
  object3dSelectMissileLost1.scale = [0.35,0.35,0.35];
  object3dSelectMissileLost1.rotate(-(Math.PI / 2), [0,1,0]);
	object3dSelectMissileLost1.position = utilHUDPositionByPercent(75, 92.5, 4);
	object3dSelectMissileLost1.hud = true;
	objectLL.push(object3dSelectMissileLost1);

  //Tank model split into the tank bottom and tank turret. Used for a tank
  //blowing up animation.
  var upperTankVerts = new Array();
  var upperTankInd = new Array();
  joinModels(upperTankVerts, upperTankInd, tankTurret, tankTurretInd);
  joinModels(upperTankVerts, upperTankInd, tankGun, tankGunInd);
  object3DTankTop = new object3D(upperTankVerts, upperTankInd);
  object3DTankTop.scale = [1.5,1.5,1.5];
  object3DTankTop.rotate((Math.PI / 2), [0,1,0]);
	object3DTankTop.position = [8,0.3,0];
	objectLL.push(object3DTankTop);
	
	object3DTankLower = new object3D(tankBody, tankBodyInd);
  object3DTankLower.scale = [1.5,1.5,1.5];
  object3DTankLower.rotate(1.0708, [0,1,0]);
	object3DTankLower.position = [8,0,0];
	objectLL.push(object3DTankLower);

  //Check the score against the stored high score if it exists. If the 
  //current score is higher then the previous high score then update it.
  var stringStorageHighScore = localStorage.getItem('TanksHighScore');
  if(stringStorageHighScore != null){
    //localStorage saves values as Strings, convert it to a number.
    var intStorageHighScore = Number.parseInt(stringStorageHighScore,10);
    if(window.playerScore > intStorageHighScore){
      localStorage.setItem('TanksHighScore',window.playerScore.toString());
    }
  } else {
    localStorage.setItem('TanksHighScore',window.playerScore.toString());
  }

	initHasRun = true;
};

//Scene frame update. Runs once every animation frame
var sceneLost = function(){
  //Run the init function if it has not been run yet.
	if(initHasRun == false){
  	initSceneLost();
  }

  //Counter to block user input at the start of the scene.
  inputLag += deltaTime;
  
  //Tank blowing up animation.
  //Start animation a few seconds after scene start. Doesn't look good if it
  //starts right as the scene starts.
  if(timeSceneLostStart <= 0.0){
    //If we are not already running the animation
    if(hasBlowUpAnimationStarted == false){
      //Generate a direction to blow the tank top of towards.
      var  tempDir = [0,0,0];
      tempDir[0] = Math.random() - 0.5;
      tempDir[1] = 1; //Skewed towards thowing up in the air
      tempDir[2] = Math.random() - 0.5;
      normalizeVector3(tempDir, tempDir);
    
      //physicsParticleDebris works for the effect we want.
      addPhysics(object3DTankTop, physicsParticleDebris);

      //Calculate velocity vector.
      calcMultScalerToVector3(object3DTankTop.velocity, tempDir, 12);
  
      createSplashEffect(object3DTankTop.position, 40, 20, 2);

      audioPlayExplosion();

      hasBlowUpAnimationStarted = true;
    } else {
      //Beginning of animation has already ran. Emit smoke.
      timeSceneLostSmoke -= deltaTime;
      if(timeSceneLostSmoke <= 0){
        var tempPos = [0,0,0];
        calcAddVector3Vector3(tempPos, object3DTankLower.position, [0,1,0]);
        createSmokeParticle(tempPos, [0,1,0], 2, 6);
        timeSceneLostSmoke = timeSceneLostSmokeLength;
      }
    }
  } else {
    //count down to animation start
    timeSceneLostStart -= deltaTime;
  }

  //rotate selector missiles
  object3dSelectMissileLost0.rotate(3 * deltaTime, [0,0,1]);
  object3dSelectMissileLost1.rotate(3 * deltaTime, [0,0,1]);
};