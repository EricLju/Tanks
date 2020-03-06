//tanks_main.js - Main script. Everything starts here.

console.log("=== Tanks! ===");
console.log("Author: Eric Ljungquist");
console.log("E-mail: protoable@gmail.com");
console.log("V1.0 Date: March 05, 2020");
console.log("Copyright: Tanks! and its source code is copyrighted under the CC0 license http://creativecommons.org/publicdomain/zero/1.0/");

var canvas = document.getElementById('canvasTanks');
var context = canvas.getContext('2d', {alpha: false});
context.strokeStyle  = '#000000';
context.fillStyle = '#FFFFFF';
var msg = document.getElementById('state-msg');
msg.setAttribute('style', 'white-space: pre;');

var userInput = new InputHandler();
var lastTime = Date.now();
var currentTime = 0;
var deltaTime = 0; //time in seconds since last frame
var initHasRun = false;
var currentScene = sceneMainMenu;
var playAreaSize = 200;
var listEnemyTanks = new LinkedList();
//var totalVerts = 0;
//var totalObjects = 0;

//notes:
// - matricies
//    -- matrix[rows][cols]
// - vertices
//    -- vertex[4] = [x, y, z, w]
// - window coord 0,0 is in the upper left hand corner

//=======   ENGINE VARIABLES   =======
var objectLL = new LinkedList();
//some transformation matricies, data presevation not garenteed
var matrixIdentity = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
var matrixViewDraw = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
var matrixTempDraw = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
var matrixTempScaleDraw = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
var matrixFrustum = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
//Camera rotation
var matrixViewRotation = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
//Camera translation
var camPos = [0, 0, 0,1];
var nearPlaneDistance = 1; //Distance to the near plane
var farPlaneDistance = 200; //Distance to the far plane
//======= END ENGINE VARIABLES =======

//Generate random float value from min to max. Includes min, excludes max.
//min - minimum value
//max - maximum value
//returns float value between min and max. Includes min, excludes max.
function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
};

//Given a X and Y percentage (0-100%) return a position vector for that position
//on screen in HUD coordinates. (0,0) is upper left of screen and (100,100) is
//lower right.
//positionXPercent - 0 to 100 percent position for X-axis.
//positionYPercent - 0 to 100 percent position for Y-axis.
//distanceToHUD - Z-axis distance from HUD model to camera.
//returns position 3-vector in HUD coordinates.
var utilHUDPositionByPercent = function(positionXPercent, positionYPercent, distanceToHUD){
  var tempPosition = [0,0,0];
  //HUD coordinates are [-distanceToHUD,distanceToHUD]. This converts
  //percent to 0-1, multiplies that on to [0, 2*distanceToHUD], then shifts it
  //to [-distanceToHUD,distanceToHUD].
  tempPosition[0] = ((positionXPercent / 100) * (distanceToHUD * 2)) - distanceToHUD;
  tempPosition[1] = ((positionYPercent / 100) * (distanceToHUD * 2)) - distanceToHUD;
  tempPosition[2] = -1 * distanceToHUD;
  return tempPosition;
};

//Create an object3D with the given string mesh, make it a HUD object and apply
//transformations. HUD text created is always 4 positions in front of the
//camera.
//stringText - string to convert to a object3D mesh.
//positionXPercent - 0 to 100 percent X-axis position on screen. 
//positionYPercent - 0 to 100 percent Y-axis position on screen.
//scaleX - X-axis scale factor 
//scaleY - Y-axis scale factor 
//centerXText - default = true - Center the origin of X-axis in the center of
//the mesh. If false then the origin is in the lower left of the first
//character of the string 
//returns an object3D model of the string.
var createStringHUDObject3D = function(stringText, positionXPercent, positionYPercent, scaleX, scaleY, centerXText = true){
  var tempVertsHUDString = new Array();
  var tempIndHUDString = new Array();
  
  //buildStringMesh creates a mesh model from the given text.
  buildStringMesh(tempVertsHUDString, tempIndHUDString, stringText, 1, centerXText);

  var tempObject3DString = new object3D(tempVertsHUDString, tempIndHUDString);
  
  tempObject3DString.position = utilHUDPositionByPercent(positionXPercent, positionYPercent, 4);

  //Font mesh is 2D, only need X and Y to scale
  tempObject3DString.scale = [scaleX,scaleY,1];
  //The font mesh is rotated the wrong way, flip it around to fix the issue.
  tempObject3DString.rotate(-Math.PI, [1,0,0]); //180 degrees

  tempObject3DString.hud = true;

  return tempObject3DString;
};

//Switch to a different scene
//scene - Scene frame update function.
var changeScene = function(scene){
  initHasRun = false;
  currentScene = scene;
}

//Position the camera at [eyeX,eyeY,eyeZ] and make it look at
//[centerX, centerY, centerZ]. Mimic gluLookAt();
//eyeX,eyeY,eyeZ - camera position.
//centerX, centerY, centerZ - position to point the camera at.
//upX, upY, upZ - UP vector for the camera, usuallposition0,1,0];
var viewLookAt = function(positionCamera, positionLookAt, directionUserUp){
    //http://www.opengl.org/sdk/docs/man2/xhtml/gluLookAt.xml
    //http://www.songho.ca/opengl/gl_anglestoaxes.html
    //To create a rotation matrix for the view to be pointing at a position
    //in space you first find the forward direction vector from the camera
    //position to the look at position. You then calculate new side and up 
    //direction vectors based on that forward direction.

    var directionSide = [0,0,0];
    var directionSideNormalized = [0,0,0];
    var directionNewUp = [0,0,0];
    var directionFront = [0,0,0];
    var directionUserUpNormalized = [0, 0, 0];

    calcDirectionVector3(directionFront, positionLookAt, positionCamera);
    normalizeVector3(directionFront, directionFront);
    
    normalizeVector3(directionUserUpNormalized, directionUserUp);
    
    crossVectorVector(directionSide, directionFront, directionUserUpNormalized);
    normalizeVector3(directionSideNormalized, directionSide);
    
    crossVectorVector(directionNewUp, directionFront, directionSideNormalized);
    
    //Construct the rotation portion of the view matrix
    //Set side vector
    matrixViewRotation[0][0] = directionSide[0];
    matrixViewRotation[0][1] = directionSide[1];
    matrixViewRotation[0][2] = directionSide[2];
    
    //Set up vector
    matrixViewRotation[1][0] = directionNewUp[0];
    matrixViewRotation[1][1] = directionNewUp[1];
    matrixViewRotation[1][2] = directionNewUp[2];

		//Set front vector. Front reversed for camera.
    matrixViewRotation[2][0] = -directionFront[0];
    matrixViewRotation[2][1] = -directionFront[1];
    matrixViewRotation[2][2] = -directionFront[2];
    
    //Instead of setting the transaltion portion of the view
    //we will just set the intended camera postion. view translation
    //will be handled later by the drawScene function.
    camPos[0] = positionCamera[0];
    camPos[1] = positionCamera[1];
    camPos[2] = positionCamera[2];
    
};

//Determine if a ray intersects a sphere.
//spherePosition - vector3 position of center of shpere to test agianst.
//sphereRadius - radius if sphere to test agianst.
//rayOrigin - vector3 position of the start point of the ray
//rayDirection - vector3 direction of the ray
//rayRange - length of the ray
//returns true if there is an intersection, false if no intersection.
var raytraceHitTest = function(spherePosition, sphereRadius, rayOrigin, rayDirection, rayRange){
  var directionRayToCircle = [0,0,0];
  var projectionCircleToRayLength = 0.0;
  var projectionCircleOntoRay = [0,0,0];
  var lengthSquaredRayToCircle = 0.0;
  var quadradicDiscriminent = 0.0;

  //Test for intersection by finding the distance between the center of the
  //sphere to the closest point on the ray to the sphere. If that distance is
  //smaller than or equal to the radius of the sphere then there is an
  //intersection. We don't need to calculate the actual intersection point
  //for Tanks!.
  //https://www.lighthouse3d.com/tutorials/maths/ray-sphere-intersection/

  //Calculate the direction vector from the ray origin to the sphere origin.
  calcDirectionVector3(directionRayToCircle, spherePosition, rayOrigin);
  
  //Length of the line from rayOrigin to closest point to the shpere on the ray.
  projectionCircleToRayLength = calcDotProductVector3(directionRayToCircle, rayDirection);
  
  //Check to make sure your direction vector to the object and ray direction are
  //going in the same direction. This cuts off testing behind the ray origin.
  if(projectionCircleToRayLength < 0.0){
    return false;
  }

  var closestPointToShpere = calcLineEndPosition(rayOrigin, rayDirection, projectionCircleToRayLength);

  var distanceSphereToRay = calcDistanceVector3(spherePosition, closestPointToShpere);

  //var testendpos = calcLineEndPosition(rayOrigin, rayDirection, rayRange);
  if(distanceSphereToRay <= sphereRadius){
    //The above ray is infinitely long. Limit the test to the given range. 
    var testDistance = calcDistanceVector3(rayOrigin, spherePosition);

    if(testDistance < (rayRange + sphereRadius)){
      //draw3dline(rayOrigin, testendpos, color="#0F0"); 
      return true;
    } else {
      //draw3dline(rayOrigin, testendpos, color="#00F"); 
      return false;
    }
  } else {
    //draw3dline(rayOrigin, testendpos, color="#F00"); 
    return false;
  }
};

//Do a ray intersection test against all objects in the scene.
//excludeObjects - Array of object3Ds to exclude from testing.
//lineOrigin - vector3 position of origin of ray/line.
//lineDirection - vector3 direction of ray/line.
//lineRange - scaler length or ray/line.
//returns true if there is an intersection, false if no intersection.
var doesLineCollideWithExistingObject = function(excludeObjects, lineOrigin, lineDirection, lineRange){
  var currentNode = objectLL.head;
  //For each object in the scene.
  while(currentNode !== null){
    var currentObject = currentNode.value;
    //Check if the current object is in the exclude list. If it is, skip to
    //the next object.
    if(excludeObjects.includes(currentObject)){
      currentNode = currentNode.next;
      continue;
    }

    //If an object has a hitSize then it has a physical presence in the scene.
    if(currentObject.hitSize > 0.0){
      //Drop the test down to 0 on the Y-axis and check for a ray intercept
      //against the current object.
      //Add a fudge factor of 2 to the sphereRadius. So AI don't move so close
      //to buildings.
      var currentRayTest = raytraceHitTest([currentObject.position[0],0,currentObject.position[2]], currentObject.hitSize * 1.41, [lineOrigin[0],0,lineOrigin[2]], lineDirection, lineRange);
      if(currentRayTest === true){
        return true;
      }
    }
    
    currentNode = currentNode.next;
  }
  //No intersection with any objects
  return false;
};

//Check if a position is close to an collision object in the current scene.
//position - vector3 position to check.
//range - scaler minimum clearance distance to any objects hit sphere.
//returns true if the position is too close to an object. False if no
//obstruction.
var isPositionNearAnExistingObject = function(position, range){
  var currentNode = objectLL.head;
  //For each object in the scene
  while(currentNode !== null){
    var currentObject = currentNode.value;

    //If an object has a hitSize then it has a physical presence int the scene.
    if(currentObject.hitSize > 0.0){
      //Distance from position to center of current object
      var currentDistance = calcDistanceVector3(position,currentObject.position);
      //Add hitSize to check distance from postion to edge of current object
      //hit shpere.
      if(currentDistance <= (range + currentObject.hitSize)){
        return true;
      }
    }
    currentNode = currentNode.next;
  }
  //Just throwing this in here as a hack. Keep objects away from [0,0,0] as
  //it is where the player spawns.
  if(calcDistanceVector3(position, [0,0,0]) <= (6 * range)){
      return true;
  }

  return false;
};


//Try to find a position that is clear of collision objects near the given
//position. If an open position can't be found within timeoutTries then it will
//return a blocked position.
//position - vector3 position center of test.
//rangeMin - scaler minimum range from the center position.
//rangeMax - scaler maximum range from the center position.
//timeoutTries - number of times to try to find a position free of any objects.
//returns a vector3 position
var findEmptyPositionNearPosition = function(position, rangeMin, rangeMax, timeoutTries){
  var tempDirection = [0,0,0];

  //Only try for the specified number of tries. This works well enough to avoid
  //writing an algorithm to walk a point into a clear spot.
  for(var i = 0; i < timeoutTries; i++){
    //Generate a random direction on the ground plane.
    tempDirection[0] = Math.random() - 0.5;
    tempDirection[2] = Math.random() - 0.5;
    normalizeVector3(tempDirection, tempDirection);
    //Generate random range within the users min and max.
    var tempRange = randomFloat(rangeMin,rangeMax);
    //Calculate the new position from the direction and range.
    var tempEndPosition = calcLineEndPosition(position, tempDirection, tempRange);
    //Check if the new random position is near anything. The object needing to
    //be at least 20 units away from another object was just a guessed value
    //that worked well.
    if(isPositionNearAnExistingObject(tempEndPosition, 5) === false){
      return tempEndPosition;
    }
  }
  //All positions we tried were blocked. So uhh just return the last tried
  //blocked position.
  return tempEndPosition;
};

//Adds "Trees" to the play area. numberOfTrees is a max value, not guaranteed to
//create that number.
//numberOfTrees - Max number of trees to add to the play area. 
var generateRandomTrees = function(numberOfTrees){
	var x = 0;
  var z = 0;
  
	for(var i = 0; i < numberOfTrees; i++){
		var objTemp = new object3D(pyramidVerts, pyramidInd);
    //Generate random position
    x = randomFloat(-playAreaSize, playAreaSize);
    z = randomFloat(-playAreaSize, playAreaSize);
    //Check if the position is blocked, If it is then skip to the next tree.
    //Trees are only decoration and are not important engough to ensure they
    //are created. Range of 6 units away from other objects is a guessed number
    //that worked well.
    if(isPositionNearAnExistingObject([x,0,z], 3) == false){
      //Generate random size for the tree. Adds variability.
		  var sizeY = randomFloat(1,4);
      //Have to offset the Y position by the new scale so the base is on the
      //ground plane. The pyrimid models origin is at the center of the model
      //and not the base.
		  objTemp.position = [x, sizeY, z];
      //Make trees all the same width but random heights.
		  objTemp.scale = [1, sizeY, 1];
		  objTemp.onHit = onHitTree;
      objTemp.hitSize = 1.414;
      objTemp.type = "tree";
      //Player tank can ram trees. Using health as a dirty bit to store if
      //it is the players first collsion with the tree.
      objTemp.health = 1;
      //Add to scene
		  objectLL.push(objTemp);
    }
	}
};

//Adds "Buildings" to the play area. numberOfBuildings is a max value, not
//guaranteed to create that number.
//numberOfBuildings - Max number of Buildings to add to the play area. 
//maxBuildingSize - defualt = 4 - Maximum size of buildings
//minBuildingSize - defualt = 2 - Minimum size of buildings
var generateRandomBuildings = function(numberOfBuildings, maxBuildingSize = 4, minBuildingSize = 2){
	var x = 0;
  var z = 0;

	for(var i = 0; i < numberOfBuildings; i++){
		var objTemp = new object3D(buildingVerts, buildingInd);
    //Generate random position
    x = randomFloat(-playAreaSize, playAreaSize);
    z = randomFloat(-playAreaSize, playAreaSize);

		//Check if the new building position is too close to another object already
		//in the scene. If it's too close then just skip adding it. Not important 
		//enough to try again. 
		if(isPositionNearAnExistingObject([x,0,z], 3) == false){
      //Generate random size
		  var tempSize = randomFloat(maxBuildingSize, minBuildingSize);

		  objTemp.position = [x, 0,z];
      //Player tank can be blocked by the building
		  objTemp.collision = true;
		  objTemp.scale = [tempSize,tempSize,tempSize];
		  objTemp.onHit = onHitBuilding;
      //Make the hit radius of the building slightly larger than the circle
      //that fits in the square so that we include most of the corners of
      //the cube.
      objTemp.hitSize = tempSize * 1.3;
      objTemp.health = 5; //allow the player to blow up buildings
      objTemp.type = "building";
      //Add to scene
		  objectLL.push(objTemp);
		}
	}
};

//Create a single simple line particle. The line particle points in the 
//direction of its movement. The particle physics follows a gravity influenced
//trajectory and is destroyed on collision with the ground plane.
//position - vector3 starting position.
//direction - vector3 starting direction.
//velocity - scaler starting velocity in the given direction.
//lifetime - life time in seconds until the particle is destoryed
var createParticle = function(position, direction, velocity, lifetime){
	var tempObject = new object3D(particleVerts, particleInd);
  //Set the second vertex to the direction of movement so that the particle
  //looks like it is following its direction of movement.
  tempObject.verticies[1][0] = direction[0];
  tempObject.verticies[1][1] = direction[1];
  tempObject.verticies[1][2] = direction[2];
  //Copy position
  tempObject.copyPosition(position);

  addPhysics(tempObject, physicsParticle);
  //Calculate velocity vector from direction and velocity scaler
  calcMultScalerToVector3(tempObject.velocity, direction, velocity);
  
  tempObject.lifetime = lifetime;

  //Add to scene
  objectLL.push(tempObject);
};

//Create a single smoke particle.
//position - vector3 starting position.
//direction - vector3 starting direction.
//velocity - scaler starting velocity in the given direction.
//lifetime - life time in seconds until the particle is destoryed
var createSmokeParticle = function(position, direction, velocity, lifetime){
	//select a random smoke mesh from the particleSmokeVerts list
	var smokeSelection = Math.floor(Math.random() * particleSmokeVerts.length);
  var tempObject = new object3D(particleSmokeVerts[smokeSelection], particleSmokeInd);
	//Copy position
  tempObject.copyPosition(position);

  addPhysics(tempObject, physicsParticleSmoke);
  //Calculate velocity vector from direction and velocity scaler
  calcMultScalerToVector3(tempObject.velocity, direction, velocity);

  tempObject.lifetime = lifetime;
  //Add to scene
  objectLL.push(tempObject);
};

//Use simple line particles to create a splashing/fountain particle effect.
//position - vector3 position of the center of the effect.
//numParticles - number of particles in the effect.
//velocity - scaler velocity of each particle.
//lifetime - lifetime of each particle.
var createSplashEffect = function(position, numParticles, velocity, lifetime){
	var tempDir = [0,0,0];
  
  for(var i = 0; i < numParticles; i++){
    //Generate a random direction for each particle.
  	tempDir[0] = Math.random() - 0.5;
    tempDir[1] = Math.random() - 0.5;
    tempDir[2] = Math.random() - 0.5;
    normalizeVector3(tempDir, tempDir);
    
    createParticle(position, tempDir, velocity, lifetime);
  }
};

//Draw a Canvas 2D line from (x0, y0) to (x1, y1)
//x0,y0 - canvas coordinate 1
//x1,y1 - canvas coordinate 2
//NOTE: You can speed up rendering by only passing integers to 
//drawCanvasLine as the canvas does extra anti-aliasing to sub pixel
//coordinates. It makes it look a whole lot worse without this anti-aliasing
//though.
var drawCanvasLine = function(x0, y0, x1, y1){
	context.beginPath();
	context.moveTo(x0, y0);
	context.lineTo(x1, y1);
	context.stroke();
};

//Clear the canvas.
var clearDisplay = function(){
  //Clear the canvas by drawing a filled rectangle over the whole thing
	context.fillRect(0, 0, canvas.width, canvas.height);
};

//The big 3D scene to 2d Canvas render function. Take all the 3D objects in the
//scene and apply all model and camera transformations to their vertices to
//obtain their positions in 2D space. Use the 2D positions to draw lines on the
//canvas. 
//TODO: For later, Frustum culling.
var drawScene = function(){
  var x0, y0;
  var x1, y1;
  var curInd, nextInd;
  var currentNode = objectLL.head;
  
  //Start each frame with a blank background.
  clearDisplay();

  //DEBUG: keep track of total verticies and objects
  //totalVerts = 0;
	//totalObjects = 0;

  //For each 3d object in the list.
  while(currentNode != null){
    var currentObject = currentNode.value;

    //DEBUG: keep track of objects.
    //totalObjects++;
        
    //If the object isn't supposed to be visible then we don't have to do
    //any calculations for it. Skip to the next object
    if(currentObject.visible == false){
      currentNode = currentNode.next;
      continue;
    }
        
    //DEBUG: I decided to not include colors at the current time. Trying to
    //keep the style very simple. Leaving this here for some debugging 
    //functions.
    //if(currentObject.color == true){
    //  context.strokeStyle  = currentObject.color;
    ///} else {
    //  context.strokeStyle  = "#000";
    //}
        
    //DEBUG: keep track of total verticies.
    //totalVerts = totalVerts + currentObject.verticies.length;
        
    //Copy vertex list, don't want to dirty the values stored by the object.
    var tempVertList = new Array();
    copyVertexArray(tempVertList, currentObject.verticies);
    //http://gamedev.stackexchange.com/questions/6517/correct-order-of-rotation-and-translation
    //object and camera translation
    copyMatrix(matrixViewDraw, matrixIdentity);

    if(currentObject.hud == true){ //hack to do heads up display stuff. Don't apply camera transforms to the object so they look static to the camera.
      //only apply object translation
      updateTranslationMatrix(matrixViewDraw, currentObject.position[0], currentObject.position[1], currentObject.position[2]);
    } else {
      //Apply object and camera translation
      updateTranslationMatrix(matrixViewDraw, (currentObject.position[0] - camPos[0]), (currentObject.position[1] - camPos[1]), (currentObject.position[2] - camPos[2]));
    }
    //Camera view rotation
    if(currentObject.hud == false){ //hack to do heads up display stuff. Don't apply camera transforms to the object so they look static to the player.
      //Copy matrixViewDraw as multMatrixMatrix can't store results in a matrix
      //that it is currently using as an oprand.
      copyMatrix(matrixTempDraw, matrixViewDraw);
      //Apply camera rotation
      multMatrixMatrix(matrixViewDraw, matrixViewRotation, matrixTempDraw);
    }
		//Object rotation
    copyMatrix(matrixTempDraw, matrixViewDraw);
    multMatrixMatrix(matrixViewDraw, matrixTempDraw, currentObject.matrixObjectRotation);
    //Object scaling
    copyMatrix(matrixTempDraw, matrixViewDraw);
    //Scaling data for the object is stored in a vector3, build a scaling
    //transformation matrix.
    updateScalingMatrix(matrixTempScaleDraw, currentObject.scale[0], currentObject.scale[1], currentObject.scale[2]);
        
    multMatrixMatrix(matrixViewDraw, matrixTempDraw, matrixTempScaleDraw);
    //Projection tansformation
    copyMatrix(matrixTempDraw, matrixViewDraw);
    multMatrixMatrix(matrixViewDraw, matrixFrustum, matrixTempDraw);
    //matrixView now has all transforms applied to it. Multiply matrixView
    //by each vertex and then find the screen space coordinates for that
    //vertex.
    for(var j = 0; j < tempVertList.length; j++){
      //Apply viewing matrices to vertices.
      var tempSol = [0,0,0,0];
      multMatrixVector(tempSol, matrixViewDraw, tempVertList[j]);
      //Clip space to "Normalized Device Coordinates"
      //Convert Clip space values to values from -1 to 1.
      //i don't do any clipping in clip space tho
      convertCliptoNDC(tempSol); 
      //NDC to window coords
      //Vector is converted to window x and y coordinates that match what
      //is used by the canvas.
      convertNDCtoWindow(tempSol, canvas.width, canvas.height);

      tempVertList[j] = tempSol;
    }
    //Draw lines
    //Every pair of indicies represents a line.
    for(var k = 0; k < (currentObject.indices.length - 1); k+=2){
      curInd = currentObject.indices[k];
      nextInd = currentObject.indices[k+1];
      //Check w component of vector, if w is negative then it is outside of
      //the viewing area.
      if(tempVertList[curInd][3] >= 0.0 && tempVertList[nextInd][3] >= 0.0){
        //Check if z component of vector is within the near and far plane.
        if(tempVertList[curInd][2] > nearPlaneDistance && tempVertList[curInd][2] < farPlaneDistance){
          //NOTE: Line clipping is handled by canvas.
          //Draw the line
          //Line start
          x0 = tempVertList[curInd][0];
          y0 = tempVertList[curInd][1];
          //Line End
          x1 = tempVertList[nextInd][0];
          y1 = tempVertList[nextInd][1];

          drawCanvasLine(x0, y0, x1, y1);
        }
      }
    }
    currentNode = currentNode.next;
  }
};

//Add an enemy AI tank to the scene.
//position - vector3 starting position.
//enemy - object3D that the AI tank attacks.
//returns object3D of the created tank.
var createAITank = function(position, enemy){
	var tempTank = new object3D(tankVerts, tankInd);

  tempTank.copyPosition(position);
  //rotate the tank to a random starting direction.
  tempTank.rotate(randomFloat(0, (2 * Math.PI)), [0,1,0]);
  addEnemyAI(tempTank, enemy);
  tempTank.type = "aitank";
  objectLL.push(tempTank);
  listEnemyTanks.push(tempTank);
  return tempTank;
};

//Create a bullet object3D
//position - vector3 initial position.
//direction - vector3 initial direction.
//velocity - scaler velocity in the given direction.
//owner - object3D that created the bullet.
var createBullet = function(position, direction, velocity, owner){
	var tempVelocity = [0,0,0];
  var normDir = [0,0,0];
	var objectBullet = new object3D(bulletVerts, cubeInd);
  
  objectBullet.copyPosition(position);

  addPhysics(objectBullet, physicsBullet);
  //Set velocity vector from the initial direction and scaler velocity
  normalizeVector3(normDir, direction);
  calcMultScalerToVector3(objectBullet.velocity, normDir, velocity);

  objectBullet.collision = true;
  objectBullet.onHit = onHitBullet;
  //Keep track of who created the bullet.
  objectBullet.owner = owner;
  objectBullet.type = "bullet";
  //Add to scene
	objectLL.push(objectBullet);
};

//Throw out large 2D Boulders/Chunks
//position - vector3 origin position.
//numParticles - Total number of chunks to create.
//velocity - Scaler initial velocity of chunks
//scale - Size of chunks.
//lifetime - Time in seconds to keep particles alive.
var createDebrisEffect = function(position, numParticles, velocity, scale, lifetime){
	var tempDir = [0,0,0];
	for(var i = 0; i < numParticles; i++){
	  //select a random smoke mesh from the particleSmokeVerts list
	  var smokeSelection = Math.floor(Math.random() * particleSmokeVerts.length);
    var tempObject = new object3D(particleSmokeVerts[smokeSelection], particleSmokeInd);

    tempObject.copyPosition(position);

    //Mostly random direction
    tempDir[0] = Math.random() - 0.5;
    tempDir[1] = Math.random() - 0.3; //slighty skewed towards thowing up in the air
    tempDir[2] = Math.random() - 0.5;
    normalizeVector3(tempDir, tempDir);
    
    tempObject.scale = [scale,scale,scale];

    addPhysics(tempObject, physicsParticleDebris);

    //Set velocity vector from direction vector and scaler velocity
    calcMultScalerToVector3(tempObject.velocity, tempDir, velocity);
  
    tempObject.lifetime = lifetime;
    
    //Add to scene
    objectLL.push(tempObject);
	}
};

//Update object physics. If the object has a physics function then run it.
//object - object to update.
var doPhysics = function(object){
	if(object.physics != undefined){
	  object.lastPosition = [0,0,0];
	  object.lastPosition[0] = object.position[0];
	  object.lastPosition[1] = object.position[1];
	  object.lastPosition[2] = object.position[2];
		object.physics();
	}
};

//Test collision. Is the current object colliding with anything else? If so, 
//run there onHit functions.
//object - object to test collision.
var doCollision = function(object){
  //If the object is a collision object then test for collision. Else skip.
  if(object.collision == true){
    var currentNodeDeep = objectLL.head;
    //For each object in the scene.
    while(currentNodeDeep != null){
    	var currentObjectDeep = currentNodeDeep.value;
      //Check to make sure both objects have onHit functions
      if(currentObjectDeep.onHit != undefined && object.onHit != undefined){
        //Don't collide with yourself.
        if(!(object === currentObjectDeep)){
          //Note: sphere-sphere collision, should implement AABB collision
          //FIXME: As a hack to avoid dealing with differences in height, I just dropped the Y values of the collision check to ground level.
          //If the distance between the objects is smaller than the combined
          //radii of the objects hit shperes then the objects are in collision.
          if(calcDistanceVector3([currentObjectDeep.position[0],0,currentObjectDeep.position[2]], [object.position[0],0, object.position[2]]) < (currentObjectDeep.hitSize + object.hitSize)){
            //Don't collide with owner/creator
            if(currentObjectDeep.owner != object && object.owner != currentObjectDeep){
              //All conditions for a collision are met, run the objects onHit
              //functions
              currentObjectDeep.onHit(object);
              object.onHit(currentObjectDeep);
            }
          }
        }
      }
      currentNodeDeep = currentNodeDeep.next;
    }
    //check agianst the ground plane
    if(object.position[1] < 0){
      //object.destroy = 1;
      if(object.onHit != undefined){
        object.onHit("ground");
      }
          
    }
        
  }
};

//Update AI
//object - object to update.
var doAI = function(object){
	if(object.ai != undefined){
		object.ai();
	}
};


/*
//DEBUG: draw a 2D line in 3D space from pos1 to pos2. Unused in TANKS!
var draw3dline = function(pos1, pos2, color="#000"){
  var tempVec = [[0,0,0,1],[0,0,0,1]];
  tempVec[0][0] = pos1[0];
  tempVec[0][1] = pos1[1];
  tempVec[0][2] = pos1[2];
  tempVec[1][0] = pos2[0];
  tempVec[1][1] = pos2[1];
  tempVec[1][2] = pos2[2];
  var tempObject = new object3D(tempVec, [0,1]);
  tempObject.color = color;
  objectLL.push(tempObject);
}

//DEBUG: draw a 2D circle in 3d space. Unused in TANKS!
var draw3dcircle = function(position, radius, color="#000"){
  var tempObject23 = new object3D(circleVerts, circleInd);
  tempObject23.position[0] = position[0];
  tempObject23.position[1] = position[1];
  tempObject23.position[2] = position[2];
  tempObject23.scale = [radius, 1, radius]
  tempObject23.color = color;
  objectLL.push(tempObject23);
};
*/

//Immediately remove objects that have been marked for destruction.
//object - object to test for destruction.
var doDestroy = function(object){
	if(object.destroy == true){
		objectLL.remove(object);
	}
};

//Update and check objects lifetime.
//object - object to update.
var doLifetime = function(object){
  //If lifetime variable is set.
	if(object.lifetime > 0){
  	if(object.currentLifetime <= object.lifetime ){
      //object is still has time left.
  		object.currentLifetime = object.currentLifetime + deltaTime;
  	} else {
      //lifetime has been reached, mark for destruction.
  		object.destroy = true;
  	}
	}
};

//As the name implies, the main controlling function. Called once at startup and
//then once on every animation frame.
var mainLoop = function(){
  //Date.now() returns number of milliseconds since UNIX epoch
  currentTime = Date.now();
  //Number of milliseconds since last frame. Divide by 1000 to convert deltaTime
  //to seconds.
  deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  //debug
 	//msg.textContent = 'dt:' + (deltaTime * 1000) + " fps: " + (1/deltaTime).toFixed(0) + " to: " + totalObjects + " tv: " + totalVerts + " ct: " + currentTime;

  //Long deltaTimes mess up some stuff with AI and physics. Just skip the frame 
  //if the dT is too large.
  if(deltaTime < 0.2){ 
    var currentNode = objectLL.head;
    //For each 3D object in the scene.
    while(currentNode != null){
    	var currentObject = currentNode.value;
        
      doAI(currentObject);
      doPhysics(currentObject);
      doCollision(currentObject);
      doLifetime(currentObject);
      doDestroy(currentObject);
      
      currentNode = currentNode.next;
    } 
    
	  drawScene();
    //BUG: Updating scene before rendering causes issues with smoke. Probably
    //some deeper issue.
    currentScene();

  }
  //Rerun this function on the next animation frame.
  requestAnimationFrame(mainLoop);
};

//Need to set matrixFrustum for the draw function.
//projectionApplyPerspective(45, (canvas.width/canvas.height), nearPlaneDistance, farPlaneDistance);
//Use a aspect ratio of 1 so that the screen streches. Style choice.
projectionApplyPerspective(matrixFrustum, 45, 1, nearPlaneDistance, farPlaneDistance);

//need to start the loop.
mainLoop();


