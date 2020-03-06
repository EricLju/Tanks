//tanks_ai.js - Very basic enemy AI. Just move towards the player in small
//movements, avoid objects in the way, and attack the player when the AI has
//line of sight, is in range, and ammo loaded.

window.pauseAI = false;

//Make an object3D an enemy tank AI.
//object - object3D to give AI functions to.
//enemy - object3D target of this AI. The player in the case of Tanks!.
var addEnemyAI = function(object, enemy){
  object.currentGoal = 0; 
  object.speed = 3; //traveling speed of AI.
  object.reloadSpeed = 2; //Seconds, how fast AI reloads.
  object.reload = object.reloadSpeed;
  object.smokeDelay = 0.7; //Damaged, smoke emitter.
  object.smokeTime = 0; //Damaged, smoke emitter.
  object.fire = false; //Does AI have firing solution on enemy.
  object.health = 1; //health for AI tank is a float 0-1.0, 1.0 - full health
  object.stopTime = 2; //AI pause time. Not a constant value. Is changed by AI code.
  object.ai = enemyAI;
  object.goalPosition = [0,0,0];
  object.goalRotation = [0,0,0];
  object.velocity = [0,0,0];
  object.onHit = onHitTank;
  object.hitSize = 2.7; //hit sphere is a fair bit bigger for the AI.
  object.enemy = enemy;
  object.turnPreference = "left"; //If avoiding obstacles try to move this direction.
  object.keepAwayDistance = 10; //Stay this distance away from your enemy.
  object.engageDistance = 45; //Don't fire unless you are within this distance.
};


//Figure out what the next goal for the AI is.
//object - object3D AI
var nextGoal = function(object){
  
  //Individual Pause AI by counter
  if(object.stopTime > 0){
  	return;
  }
  //Rotate
  //The calculated dot product will most likely never be exactly 1. Anything
  //over 0.999 is good enough.
	if(calcDotProductVector3(object.goalRotation, object.getObjectForwardVector()) < 0.999){
  	object.currentGoal = 5; //ROTATE
    return;
  }
  //Movement 
  //If we are within 1 unit we are close enough.
	if(calcDistanceVector3(object.position, object.goalPosition) > 1){
  	object.currentGoal = 1; //MOVE
    return;
  }
  //Engage
  //Enemy is too far away. Continue moving.
  if(calcDistanceVector3(object.position, object.enemy.position) >= object.engageDistance){
    object.currentGoal = 0; //SET MOVE
    return;
  }
  //Enemy is within range, ammo is loaded, but we don't have aim at the enemy.
  if(object.reload < 0 && object.fire == false){
  	object.currentGoal = 4; //AIM
    return;
  }
  //Enemy is within range, ammo is loaded, and we are aimed at the enemy.
  if(object.fire == true){
  	object.currentGoal = 3; //FIRE
    return;
  }
  //No other conditions are met. Continue moving.
  object.currentGoal = 0; //SET MOVE
};

//Try and find a new goal position for movement. The new goal position will 
//try to avoid collision with another collision object. If the function finds a 
//solution position then vec3SolutionPosition is set to that point and the
//function returns true. If no unblocked position is found the function returns
//false.
//vec3SolutionPosition - vector3 returned goal position
//object - object3D AI.
//range - scaler lenght of movement.
//direction - defualt = "right" - "left" or "right". Prefered direction 
//of movement if most direct path is blocked.
//Returns true if an unblocked position is found and vec3SolutionPosition is
//set. False if an unblocked position is not found.
var calcPositionAlongDirectionToEnemy = function(vec3SolutionPosition, object, range, direction="right"){
  var tempDir = [0,0,0];
  var tempDirVec4 = [0,0,0,1];
  var tempPossibleLocation = [0,0,0];
  var tempSol = [0,0,0,0];
  //Calculate direction from AI tank to the enemy position.
  calcDirectionVector3(tempDir, object.enemy.position, object.position);
  normalizeVector3(tempDir, tempDir);
  //Store the vector3 direction as a vector4 as we will be rotating 
  //with multMatrixVector and that only takes vector4s.
  tempDirVec4[0] = tempDir[0];
  tempDirVec4[1] = tempDir[1];
  tempDirVec4[2] = tempDir[2];

  //Keep trying in ~17 degree increments up until ~150 degrees. Don't go
  //the full 180 as we don't want the AI backtracking.
  for(var i = 0.0; i <= 2.5708; i += 0.3){
    //Initilize an identity matrix. Will convert it into a rotation matrix.
    var matrixNewRotAmount = new Array();
    copyVertexArray(matrixNewRotAmount, matrixIdentity);
    //Rotate in the preferred direction
    if(direction == "left"){
      updateRotationYMatrix(matrixNewRotAmount, i);
    } else {
      updateRotationYMatrix(matrixNewRotAmount, -i);
    }
    //Rotate the direction vector
    multMatrixVector(tempSol, matrixNewRotAmount, tempDirVec4);

    //Ray test on the keep away distance so that the AI doesn't get too close
    //to the enemy.
    var testPlayerKeepOut = raytraceHitTest(object.enemy.position, object.keepAwayDistance, object.position, [tempSol[0],tempSol[1],tempSol[2]], range);
    //Ray test on all other collision objects.
    var testAllObjectCollision = doesLineCollideWithExistingObject([object], object.position, [tempSol[0],tempSol[1],tempSol[2]], range);
    //If the intended movement doesn't collide with any collision objects.
    if(testAllObjectCollision == false && testPlayerKeepOut == false){
      //Calculate goal position from start position, direction, and range
      tempPossibleLocation = calcLineEndPosition(object.position, [tempSol[0],tempSol[1],tempSol[2]], range);
      //If the AI has a direct route to the player and doesn't have to avoid any 
      //obsticles flip the AI's turn direction preference. This is to add a little
      //variability to movement.
      if(i == 0.0){
        if(object.turnPreference == "left"){
          object.turnPreference = "right";
        } else {
          object.turnPreference = "left";
        }
      }
      //Return found position.
      //BUG: If you try to return the value directly from calcLineEndPosition it
      //returns bad values. I haven't looked into it yet.
      vec3SolutionPosition[0] = tempPossibleLocation[0];
      vec3SolutionPosition[1] = tempPossibleLocation[1];
      vec3SolutionPosition[2] = tempPossibleLocation[2];
      return true;
    }
  }
  //All attempts are blocked. Return false and let downstream functions find
  //a solution.
  return false;
};

//Calculate a position perpendicular to the current direction of travel that is
//range distance away. Ignore collisions when calculating position. This is the
//fall back if the AI has gotten itself stuck.
//vec3SolutionPosition - vector3 returned goal position
//object - object3D AI.
//range - scaler lenght of movement.
var calcSidePositionIgnoreCollision = function(vec3SolutionPosition, object, range){
  var tempSideDir = [0,0,0];
  var tempPossibleLocation = [0,0,0];
  
  //Side direction vector from objects rotation matrix. Points 90 degrees left
  //of forward direction.
  tempSideDir[0] = object.matrixObjectRotation[0][0];
	tempSideDir[1] = object.matrixObjectRotation[1][0];
	tempSideDir[2] = object.matrixObjectRotation[2][0];
	normalizeVector3(tempSideDir, tempSideDir);
  
  //Have origin point, direction, range. Calculate end point of line.
  tempPossibleLocation = calcLineEndPosition(object.position, tempSideDir, range);

	vec3SolutionPosition[0] = tempPossibleLocation[0];
  vec3SolutionPosition[1] = tempPossibleLocation[1];
  vec3SolutionPosition[2] = tempPossibleLocation[2];
  
  //Side vector from object rotation matrix points left. Continue trying
  //to go left if we got to this function.
  object.turnPreference = "left";
};

//Set an AIs goal Position and goal Rotation to try to move to.
//object - object3D AI.
//position - goal position
var setGoalPosition = function(object, position){
	var tempDir = [0,0,0];
	object.goalPosition[0] = position[0];
  object.goalPosition[1] = position[1];
  object.goalPosition[2] = position[2];
  //We want the AI to rotate towards the goal position first.
  calcDirectionVector3(tempDir, object.goalPosition, object.position);
  normalizeVector3(tempDir, tempDir);
  object.goalRotation = tempDir;
};

//Figure out where the AI should move next. AI will try to move in the most
//direct path to its enemy. If a path is blocked by a collision object then
//it will fan out its movement left or right until it is not blocked. If an
//unblocked path can't be found then it ignores collision and moves anyway.
//object - object3D AI.
var findNextMovement = function(object){
	var newPos = [0,0,0];
  var foundSolution = false;
  //TODO: Implement a better pathfinding algorithm. Not really needed but
  //would be nice.
  
  //Try to find a path in the preferred direction.
  foundSolution = calcPositionAlongDirectionToEnemy(newPos, object, 5 , object.turnPreference);
  //If no solution found then flip the preferred direction and try again.
  if(foundSolution == false){
    if(object.turnPreference == "left"){
      object.turnPreference = "right";
    } else {
      object.turnPreference = "left";
    }
    foundSolution = calcPositionAlongDirectionToEnemy(newPos, object, 5, object.turnPreference);
  }
  //Trying to move while avoiding collision failed. To avoid being stuck, move
  //perpedicular to the current direction
  if(foundSolution==false){
    calcSidePositionIgnoreCollision(newPos, object, 5);
  }

  setGoalPosition(object, newPos);

  object.currentGoal = 2; //THINK
};

//AI forward movement. Moves AI one frame towards the goal position.
//object - object3D AI.
var goalMove = function(object){
  //If the goal position is more than 1 unit away.
  if(calcDistanceVector3(object.position, object.goalPosition) > 1){	
		//var tempDir = [0,0,0];
		//calcDirectionVector3(tempDir, object.goalPosition, object.position);
  	//normalizeVector3(tempDir, tempDir);
    //Integrate motion
  	var temp = [0,0,0];
  	temp[0] = object.goalRotation[0] * deltaTime * object.speed;
  	temp[1] = object.goalRotation[1] * deltaTime * object.speed;
  	temp[2] = object.goalRotation[2] * deltaTime * object.speed;
    object.translate(temp);
  } else {
    //Goal position is close enough.
  	object.currentGoal = 2; //THINK
  }
};

//AI rotation movement. Rotates AI one frame towards the goal rotation.
//object - object3D AI.
var goalRotate = function(object){
  //Find the dot product of the current object direction and the goal direction. both directions should be normalized
  var dot = calcDotProductVector3(object.goalRotation, object.getObjectForwardVector());
	//If both are pointing the same direction then the dot product is 1
  //check if we are not pointing approximately the correct direction
  if(dot < 0.999){
  	var newDirection = [0,0,0,0];
    var rotationAxis = [0,0,0];
    var matrixTempRot= [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
    var matrix2TempRot= [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
    var tempForward = object.getObjectForwardVector();
    
    crossVectorVector(rotationAxis, tempForward, object.goalRotation);
    normalizeVector3(rotationAxis, rotationAxis);

    //Don't think we can ever reach this but I feel like I had a problem
    //with this in early development. Handle the edge case of when
    //both direction vectors are parallel. rotationAxis would be [NaN,NaN,NaN];
    if(isNaN(rotationAxis[1])){
    	rotationAxis = [0,1,0];
    }
    
    object.rotate(1 * deltaTime, rotationAxis);
    
  }else{
  	//Snap the actual rotation to the goal rotation since it usually doesn't line
  	//up perfectly.
    object.lookAt([object.goalRotation[0] + object.position[0], 0,object.goalRotation[2] + object.position[2]]);
    
    //object.stopTime = 1.0;
  	object.currentGoal = 2; //THINK
  	if(object.fire == true){
  	  object.stopTime = 0.2;
  	}
  }

};

//Find out if we have line of sight on the enemy. If we do then rotate towards
//the enemy and set .fire to true to signal that AI is ready to shoot.
//object - object3D AI.
var goalCalcShoot = function(object){
	var tempDir = [0,0,0];
	//Calculate direction vector from AI to the enemy
	calcDirectionVector3(tempDir, object.enemy.position, object.position);
  normalizeVector3(tempDir, tempDir);
  var tempDistance = calcDistanceVector3(object.position, object.enemy.position);
  if(doesLineCollideWithExistingObject([object, object.enemy], object.position, tempDir, tempDistance)){
    //Don't have line of sight on the enemy. Set reload to 1 second to
    //allow the AI to go back to movement mode.
    object.reload = 1.0
    
    object.currentGoal = 2;//THINK
  } else {
    //Rotate to the enemy
    object.goalRotation = tempDir;
    //Set fire to true to indicate a firing solution
    object.fire = true;
  
    object.currentGoal = 2; //THINK
  }
  
  
};

//Shoot AI gun.
//object - object3D AI.
var goalShoot = function(object){
  var tempShootPos = [0,0,0];

  //Just offsetting bullet creation by +1 on the Y-axis for now.
  //TODO: Fire from end of gun instead of center of model.
  tempShootPos[0] = object.position[0];
  tempShootPos[1] = object.position[1] + 1;
  tempShootPos[2] = object.position[2];
  createBullet(tempShootPos, object.getObjectForwardVector(), 80, object);
  //Scale the gain of the audio by how far the AI is to the enemy. Also,
  //personal preference, cut the gain by 0.5 so that it isn't as loud.
  var distanceToEnemy = calcDistanceVector3(object.position, object.enemy.position);
  var scaledGain = ((object.engageDistance - distanceToEnemy)  / object.engageDistance) * 0.5;
  //Minimum gain value
  if(scaledGain < 0.02){
    scaledGain = 0.02;
  }
  console.log(scaledGain);
  audioPlayShoot(scaledGain);
  //Reset and go back to movement
  object.reload = object.reloadSpeed;
  object.fire = false;
  object.stopTime = 2;
  object.currentGoal = 2; //THINK
};


//Main AI frame update. Runs every animation frame to control AI.
var enemyAI = function(){

  //Global Pause AI
  if(pauseAI === true){
  	return;
  }

  //Update timers
  if(this.stopTime > 0){
  	this.stopTime = this.stopTime - deltaTime;
  } else {
  	this.reload = this.reload - deltaTime;
  }
  
  //Do whatever the current goal for this frame is. Downstream functions will
  //change .currentGoal as needed.
  switch(this.currentGoal){
    case 0: //SET MOVE
      findNextMovement(this);
      break;
    case 1: //MOVE
      goalMove(this);
      break;
    case 2: //THINK
      nextGoal(this);
      break;
    case 3: //FIRE
      goalShoot(this);
      break;
    case 4: //AIM
      goalCalcShoot(this);
      break;
    case 5: //ROTATE
      goalRotate(this);
      break;
    default:
      //Probably should not get here.
      findNextMovement(this);
    }
    
};