//tanks_scene_play.js - Gameplay scene. This is the actual game portion.

//Add a missile launcher platform to the map. Only once platform can be active
//at a time.
//startPosition - vector3 initial position.
//returns object3D for the missile launcher platform
var createMissleLauncher = function(startPosition){
  //Add platform model.
  var object3dLauncher = new object3D(vertLauncher, indLauncher);
  object3dLauncher.scale = [1.5,1,1.5];
	object3dLauncher.position = startPosition;
	object3dLauncher.onHit = onHitMissleLauncher;
  object3dLauncher.hitSize = 4.47;
	objectLL.push(object3dLauncher);

  //Set the time to the next launch to a random value. Unless it is 120 then 
  //leave it as is. 120 is the first launch time set on first play of the game.
  if(timeToNextLaunch.toFixed(0) != 120){
    timeToNextLaunch = randomFloat(50,120);
  }

  //Platform and missile model are separate. Add the missile.
	var object3dMissile = new object3D(vertMissile, indMissile);
  object3dMissile.scale = [3,3,3];
  //Missile position is set in reference to the platform.
  object3dMissile.missileOffset = [0,3.5,0];
  calcAddVector3Vector3(object3dMissile.position, startPosition, object3dMissile.missileOffset);
  //Rotate the missile to face +Y
  object3dMissile.rotate(-(Math.PI / 2), [1,0,0]);
  //Counter for missile exhaust.
  object3dMissile.timeSmoke = 0.3;
  object3dMissile.timeNextSmoke = object3dMissile.timeSmoke;
  addPhysics(object3dMissile, phyicsSimple);
  objectLL.push(object3dMissile);
  //Store the missile as a child of the platform
  object3dLauncher.missile = object3dMissile;
  
	return object3dLauncher;
};

//Remove tank from scene with an explosion. Run on all enemy tanks on missile
//platform destruction.
var destroyEnemyTanks = function(tank){
  tank.destroy = true;
  createDebrisEffect(tank.position, 4, 10, 0.1, 5);
  listEnemyTanks.remove(tank);
};

//Cutscene for the target missile launching.
var subsceneLaunch = function(){
  //If we havent started the launch animation yet then initilize it.
  if(isLaunching == false){
      //Stop AI
      window.pauseAI = true;
      object3dHUDReloading.visible = false;
      //Stop the player from moving.
      playerCurVelocity = 0.0;
      object3dPlayerTank.velocity = [0,0,0];
      //Stop collisions on the player
      object3dPlayerTank.onHit = null;
      //Player loses a life for failing the objective.
      object3dPlayerTank.health--;
      //Show the objective failed text
      object3dHUDObjectiveFailed0.visible = true;
      object3dHUDObjectiveFailed1.visible = true;
      object3dHUDObjectiveFailed2.visible = true;
      
      stopAudioEffects();
      audioPlayRocket();
      
      isLaunching = true;
    }    
    //Missile exhaust counter.
    currentMissile.missile.timeNextSmoke -= deltaTime;
    //Stop collisions on the platform
    currentMissile.onHit = null;
    //Missile rotates slowly as it rises.
    currentMissile.missile.rotate(0.5 * deltaTime, [0,0,1]);
    //Speed up the missile slowly every frame. Acts like acceleration.
    currentMissile.missile.velocity[1] += 0.02;
    //Have the camera follow the missile as it launches.
    viewLookAt([currentMissile.missile.position[0] + 20, 20, currentMissile.missile.position[2] + 20], currentMissile.missile.position, [0, 1, 0]);
    //Handle missile exhaust. Smoke particles that get shot straight down.
    if(currentMissile.missile.timeNextSmoke <= 0.0){
      var tempSmokePos = [0,0,0];
      calcMultScalerToVector3(tempSmokePos, currentMissile.missile.missileOffset, -0.9);
      calcAddVector3Vector3(tempSmokePos, currentMissile.missile.position, tempSmokePos);
      createSmokeParticle(tempSmokePos , [0,-1,0], 5, 3);
      currentMissile.missile.timeNextSmoke = currentMissile.missile.timeSmoke;
    }
    //End the cutscene when the missile gets above 40 units. Destory the 
    //current missile luancher platorm and reset variables back to normal
    //game play.
    if(currentMissile.missile.position[1] > 45){
      window.pauseAI = false;
      isLaunching = false;
      timeToNextLaunch = randomFloat(50,120);
      currentMissile.missile.destroy = true;
      currentMissile.destroy = true;
      currentMissile = null;
      object3dPlayerTank.onHit = onHitPlayerTank;
      object3dHUDObjectiveFailed0.visible = false;
      object3dHUDObjectiveFailed1.visible = false;
      object3dHUDObjectiveFailed2.visible = false;
      isEngineRunning = false;
      lastengine = false;
      currentScene = scenePlay;
    }
};

//Initialize the scene. Runs once every time the scene is switched to except in
//the case of the missile launch cutscene.
var initScenePlay = function(){
  //Declare global variables here so that they get reinitialized every time the
  //scene is restarted.
  window.object3dPlayerTank = null;
  window.object3dWrenchExtraLife = null;
  window.object3dHUDReloading = null;
  window.object3dHUDScoreText = null;
  window.object3dHUDScoreNumber = null;
  window.object3dHUDLivesText = null;
  window.object3dHUDLivesNumber = null;
  window.object3dHUDLaunchText = null;
  window.object3dHUDLaunchNumber = null;
  window.object3dHUDObjectiveFailed0 = null;
  window.object3dHUDObjectiveFailed1 = null;
  window.object3dHUDObjectiveFailed2 = null;
  window.object3dRadar = null;
  window.smokeTime = 0.0;
  window.timeToNextLaunch = 120;
  window.lastTimeToNextLaunch = timeToNextLaunch;
  window.playerMaxVelocity = 8.0;
  window.playerCurVelocity = 0.0;
  window.playerReloadTime = 1.0;
  window.playerCurrentReloadTime = 1;
  window.playerCameraPosition = [0,10,-10,0];
  window.playerScore = 0;
  window.playerOldScore = 0;
  window.playerOldLives = Number.MAX_VALUE;
  window.soundTimeLength = 0.1;
  window.soundTime = soundTimeLength;
  window.isEngineRunning = false;
  window.lastengine = false;
  window.maxNumberOfEnemies = 2; 
  window.timeEnemyRespawn = 0;
  window.currentMissile = null;
  window.isLaunching = false;
  
  //Clear the scene.
  objectLL = new LinkedList();
  
  //Clear old user input functions.
  userInput.clearAllPressFunctions();
  
  //Add scenery to the map
  generateRandomBuildings(30);
  generateRandomTrees(30);
  
  //New empty enemy list.
  listEnemyTanks = new LinkedList();
  
  //Making a custom mesh that says ENEMIES with an arrow above it. Used to point
  //towards enemies that might not be visible to the player camera.
  var vertsAuthorString = new Array();
  var indsAuthorString = new Array();
  buildStringMesh(vertsAuthorString, indsAuthorString, "ENEMIES");
  offsetVerts(vertsAuthorString, -10.5, 0, 0); //center the mesh horizontally
  vertstemparrow = new Array(); //vertexList;
  copyVertexArray(vertstemparrow, arrowVerts);
  indtemparrow = new Array(); //indiceList;
  indtemparrow = copyIndiceArray(arrowInd);
  offsetVerts(vertsAuthorString, 0, -4, 0);
  joinModels(vertsAuthorString, indsAuthorString, vertstemparrow, indtemparrow);
  object3dRadar = new object3D(vertsAuthorString, indsAuthorString);
  object3dRadar.position = [0,0,0];
  object3dRadar.scale = [0.5,0.5,0.5];
  objectLL.push(object3dRadar);
  object3dRadar.visible = false;
  
  //Reloading HUD icon
  object3dHUDReloading = createStringHUDObject3D("RELOADING", 50, 62.5, 0.06, 0.06);
	object3dHUDReloading.visible = false;
	objectLL.push(object3dHUDReloading);
	
  //Lower screen HUD objects. Score, Lives, Time left.
	object3dHUDScoreText = createStringHUDObject3D("SCORE:", 2.5, 97.5, 0.06, 0.06,false);
	objectLL.push(object3dHUDScoreText);
	object3dHUDScoreNumber = createStringHUDObject3D("0", 16.25, 97.5, 0.06, 0.06,false);
	objectLL.push(object3dHUDScoreNumber);
	  
	object3dHUDLivesText = createStringHUDObject3D("LIVES:", 43.124, 97.5, 0.06, 0.06,false);
	objectLL.push(object3dHUDLivesText);  
  object3dHUDLivesNumber = createStringHUDObject3D("3", 56.875, 97.5, 0.06, 0.06,false);
	objectLL.push(object3dHUDLivesNumber);  
	 
	object3dHUDLaunchText = createStringHUDObject3D("T-:", 80, 97.5, 0.06, 0.06,false);
	objectLL.push(object3dHUDLaunchText);  
  object3dHUDLaunchNumber = createStringHUDObject3D("120", 87.5, 97.5, 0.06, 0.06,false);
	objectLL.push(object3dHUDLaunchNumber);  

  //Missile Launch cutscenes objects.
	object3dHUDObjectiveFailed0 = createStringHUDObject3D("SEARCH AND DESTORY", 50, 12.5, 0.1, 0.1);
  object3dHUDObjectiveFailed0.visible = false;
	objectLL.push(object3dHUDObjectiveFailed0);
	object3dHUDObjectiveFailed1 = createStringHUDObject3D("OBJECTIVE FAILED", 50, 18.75, 0.1, 0.1);
  object3dHUDObjectiveFailed1.visible = false;
	objectLL.push(object3dHUDObjectiveFailed1);
	object3dHUDObjectiveFailed2 = createStringHUDObject3D("YOU LOSE A LIFE", 50, 30, 0.1, 0.1);
  object3dHUDObjectiveFailed2.visible = false;
	objectLL.push(object3dHUDObjectiveFailed2);

  //Players tank
  object3dPlayerTank = new object3D(tankVerts, tankInd);
  object3dPlayerTank.type = "player";
  object3dPlayerTank.collision = true;
  object3dPlayerTank.onHit = onHitPlayerTank;
  object3dPlayerTank.hitSize = 1.73;
  object3dPlayerTank.score = 0;
  object3dPlayerTank.health = 3;
	object3dPlayerTank.position = [8,0,0];
	addPhysics(object3dPlayerTank, phyicsSimple);
	objectLL.push(object3dPlayerTank);
  
	initHasRun = true;  
};

//Scene frame update. Runs once every animation frame
var scenePlay = function(){
  //initialize the scene if it hasn't been done yet.
	if(initHasRun == false){
  	initScenePlay();
  }

  //Counters
  //TODO: switch to all count down or cound up of action variables
  playerCurrentReloadTime += deltaTime;
  timeToNextLaunch -= deltaTime;
  
  //Update wrench/extra life rotation. Wrench spins to attract player attention.
  if(object3dWrenchExtraLife != null){
    object3dWrenchExtraLife.rotate(3 * deltaTime, [0,1,0]);
  }
  
  //If the player has run out of time for the search and destroy objective
  //then run the missile launch cutscene.
  if(timeToNextLaunch <= 0.0){
   currentScene = subsceneLaunch;
  }

  //Cause the player to slow down to zero velocity unless they are adding
  //there own velocity by hitting movement keys. 
  if(playerCurVelocity < -0.05){
    playerCurVelocity += 0.05;
  } else if(playerCurVelocity > 0.05){
    playerCurVelocity -= 0.05;
  } else {
    playerCurVelocity = 0.0;
  }
  
  //Clamp the players max speed
  if((playerCurVelocity > playerMaxVelocity)){
    playerCurVelocity = playerMaxVelocity;
  }
  if((playerCurVelocity < -playerMaxVelocity)){
    playerCurVelocity = -playerMaxVelocity;
  }
  
  //If there is no missile launcher platform currently then spawn one.
  if(currentMissile == null){
    var randomPos = [0,0,0];
    randomPos[0] = randomFloat(-playAreaSize, playAreaSize);
    randomPos[2] = randomFloat(-playAreaSize, playAreaSize);
    currentMissile = createMissleLauncher(randomPos);
  }
  
  //If there are not maxNumberOfEnemies on the map then spawn one once the 
  //respawn timer reaches zero.
  if(listEnemyTanks.length < maxNumberOfEnemies){
    timeEnemyRespawn -= deltaTime;
    if(timeEnemyRespawn <= 0.0){
      var randomPos = [0,0,0];
      //Generate a random position near the missile launcher platform.
      randomPos = findEmptyPositionNearPosition(currentMissile.position, 10, 32, 10);
      createAITank(randomPos, object3dPlayerTank);
      //reset respawn time. Set a random value to add variability.
      timeEnemyRespawn = randomFloat(3,10);
    }
  }
  
  //start out the current frame with isEngineRunning set to false. If the player
  //makes any input to move the player it will be flipped to true.
  isEngineRunning = false;
  
  //Player input
  if ((userInput.isDown(userInput.UP) == true )){
    playerCurVelocity += 0.5;
    isEngineRunning = true;
  } 
  if ((userInput.isDown(userInput.DOWN) == true )){
    playerCurVelocity -= 0.2;
    isEngineRunning = true;
  }
  if ((userInput.isDown(userInput.LEFT) == true )){
    object3dPlayerTank.rotate(0.65 * deltaTime, [0,1,0]);
    isEngineRunning = true;
  }
  if ((userInput.isDown(userInput.RIGHT) == true )){
    object3dPlayerTank.rotate(-0.65 * deltaTime, [0,1,0]);
    isEngineRunning = true;
  }
  if ((userInput.isDown(userInput.SPACE) == true )){
    if(playerCurrentReloadTime > playerReloadTime){
      var tempShootPos = [0,1.4,2.4,0]; //position of end of gun without rotation.
      var tempShootPos1 = [0,0,0,0];
      //Fire a bullet from the front of the gun which is offset from the 
      //origin of the model. We have to find the rotated position of the muzzle.
      multMatrixVector(tempShootPos1, object3dPlayerTank.matrixObjectRotation, tempShootPos);
      tempShootPos[0] = object3dPlayerTank.position[0] + tempShootPos1[0];
      tempShootPos[1] = object3dPlayerTank.position[1] + tempShootPos1[1];
      tempShootPos[2] = object3dPlayerTank.position[2] + tempShootPos1[2];
      createBullet(tempShootPos,object3dPlayerTank.getObjectForwardVector(),80, object3dPlayerTank);
      playerCurrentReloadTime = 0.0;
      //Take a little of the score away for every shot taken.
      window.playerScore--;
      if(window.playerScore < 0){
        window.playerScore = 0;
      }
      audioPlayShoot(1);
    }
    
  }
  
  //Calculate and set the players velocity based on their direction and speed.
  calcMultScalerToVector3(object3dPlayerTank.velocity, object3dPlayerTank.getObjectForwardVector(), playerCurVelocity);

  //Check if player has run out of health/lives
  if(object3dPlayerTank.health <= 0){
    isEngineRunning = false;
    changeScene(sceneLost);
  }
  
  //Start the engine sound if the player has made a movement input and the 
  //engine audio is not currently running.
  if(isEngineRunning === true && lastengine === false){
    audioPlayTankEngine();
  }
  //Stop the engine sound if the user didn't make any movement inputs and the 
  //engine audio is already playing. 
  if(isEngineRunning === false && lastengine === true){
    stopAudioEffects();
  }
  
  lastengine = isEngineRunning;
  
  //Update enemy related scene effects.
  var currentNode = listEnemyTanks.head;
  var curmindistance = Number.MAX_VALUE;
  var object3dTempMinDistance = null;
  //For each enemy in the scene
  while(currentNode != null){
    var currentObject = currentNode.value;
    //enemy is damaged, handle smoke effect.
    if(currentObject.health < 1 ){
      currentObject.smokeTime -= deltaTime;
      if(currentObject.smokeTime <= 0.0){
        var tempPos = [0,0,0];
        calcAddVector3Vector3(tempPos, currentObject.position, [0,1,0]);
        createSmokeParticle(tempPos, [0,1.5,0], 2, 2);
        currentObject.smokeTime = currentObject.smokeDelay;
      }  
    }
    //Find the closest enemy to the player. This is used for the radar helper.
    var distanceCurrentEnemy = calcDistanceVector3(currentObject.position, object3dPlayerTank.position);
    if(distanceCurrentEnemy < curmindistance){
        object3dTempMinDistance = currentObject;
        curmindistance = distanceCurrentEnemy;
    }
    
    currentNode = currentNode.next;
  }
  
  //Check to make sure a enemy was found for the closest enemy search.
  if(object3dTempMinDistance != null){
    var tempPlayerForwardDirection = [0,0,0];
    var vec3DirectionEnemy = [0,0,0];
    var dotProductIsPlayerFacingEnemies = 0;
    
    //Calculate the dot product from the player forward direction to the
    //enemy.
    tempPlayerForwardDirection = object3dPlayerTank.getObjectForwardVector();
    normalizeVector3(tempPlayerForwardDirection, tempPlayerForwardDirection);
    calcDirectionVector3(vec3DirectionEnemy,object3dTempMinDistance.position,object3dPlayerTank.position);
    normalizeVector3(vec3DirectionEnemy, vec3DirectionEnemy);
    dotProductIsPlayerFacingEnemies = calcDotProductVector3(tempPlayerForwardDirection, vec3DirectionEnemy)

    //Check the dot product and distance to the closest enemy to see if it
    //might be out of view. If closest enemy is out of view then display the
    //radar helper that points in the direction of the closest enemy.
    if((dotProductIsPlayerFacingEnemies < 0.25 && curmindistance > 10) || (curmindistance > 120)){
      var tempOffset = [0,0,0];
      //Offset the radar forward of the tank so that the gun dosen't obscure
      //the text.
      calcAddVector3Vector3(tempOffset, object3dPlayerTank.position, tempPlayerForwardDirection);
      calcMultScalerToVector3(vec3DirectionEnemy, vec3DirectionEnemy, 8);
      calcAddVector3Vector3(object3dRadar.position, tempOffset, vec3DirectionEnemy);

      //Point radar helper at the enemy
      object3dRadar.lookAt(object3dTempMinDistance.position);
      
      //Model is facing wrong direction
      object3dRadar.rotate(-Math.PI, [0,1,0]);
      object3dRadar.rotate(-(Math.PI/2), [1,0,0]);

      object3dRadar.visible = true;
    } else {
       object3dRadar.visible = false;
    }
  } else {
    object3dRadar.visible = false;
  }

  //Update camera position to always follow the player from behind.
  var tempNewCameraPosition = [0,0,0,0];
  var tempCameraRotated = [0,0,0,0];
  multMatrixVector(tempCameraRotated, object3dPlayerTank.matrixObjectRotation, playerCameraPosition);
  tempNewCameraPosition[0] = object3dPlayerTank.position[0] + tempCameraRotated[0];
  tempNewCameraPosition[1] = object3dPlayerTank.position[1] + tempCameraRotated[1];
  tempNewCameraPosition[2] = object3dPlayerTank.position[2] + tempCameraRotated[2];
  viewLookAt(tempNewCameraPosition, object3dPlayerTank.position, [0, 1, 0]);
  
  //Show reloading HUD icon if the player is reloading
  if(playerCurrentReloadTime < playerReloadTime){
    object3dHUDReloading.visible = true;
  } else {
    object3dHUDReloading.visible = false;
  }
  
  //Update Bottom of screen HUD elements.
  //Update Score if it has changed.
  if(window.playerScore != playerOldScore){
    var vertsAuthorString = new Array();
    var indsAuthorString = new Array();
    buildStringMesh(vertsAuthorString, indsAuthorString, window.playerScore.toString());
    object3dHUDScoreNumber.changeModel(vertsAuthorString, indsAuthorString);
    playerOldScore = window.playerScore;
  }
  //Update Lives/Health if it has changed.
  if(object3dPlayerTank.health != playerOldLives){
    var vertsAuthorString = new Array();
    var indsAuthorString = new Array();
    buildStringMesh(vertsAuthorString, indsAuthorString, object3dPlayerTank.health.toString());
    object3dHUDLivesNumber.changeModel(vertsAuthorString, indsAuthorString);
    playerOldLives = object3dPlayerTank.health;
  }
  //Update time if it has changed in second increments.
  if(timeToNextLaunch.toFixed(0) != lastTimeToNextLaunch.toFixed(0)){
    var vertsAuthorString = new Array();
    var indsAuthorString = new Array();
    buildStringMesh(vertsAuthorString, indsAuthorString, timeToNextLaunch.toFixed(0).toString());
    object3dHUDLaunchNumber.changeModel(vertsAuthorString, indsAuthorString);
    lastTimeToNextLaunch = timeToNextLaunch;
  }
};