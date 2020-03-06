//tanks_object3D.js - A 3D geometry object to be rendered by the 3D engine.
//object3D models are stored as a vertex4 array ([x,y,z,w],...) and an indices
//array of integer pairs that point to two vetices which form a line. 

//TODO: store rotation in components and then create rotation matrix later.
//matrixObjectRotation causes odd transformation issues.

//New object3D object. Stores its own copy of the supplied model.
//vertexList - model vertex4 array.
//indiceList - model indice array.
var object3D = function(vertexList, indiceList){
    this.verticies = new Array(); //Mesh vertex list;
    this.indices = new Array(); //Mesh indice list;

    this.position = [0,0,0,1]; //position in 3D space.
    this.scale = [1,1,1]; //size of object3D. [x-scale,y-scale,z-scale]
    this.matrixObjectRotation = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]; //Rotation of object3D. Stored as an XYZ rotation matrix

    this.hitSize = 0; //Collision sphere radius
    this.owner = undefined; //object3D "parent"
    this.hud = false; //false = apply camera transformations during rendering.
    this.visible = true; //true = render object, false = skip object3D during rendering.
    this.lifetime = 0; //Time in seconds until the object3D is automatically destroyed. .lifetime = 0 means never destroy.
    this.destroy = false; //Mark for deletion

    //DEBUG: color isn't used in Tanks! but did use it for debugging.
    //this.color = "#000";

    //Internal variables
    //Lifetime counter.
    this.currentLifetime = 0;
    //Make a copy of the passed mesh.
    copyVertexArray(this.verticies, vertexList);
    this.indices = copyIndiceArray(indiceList);
};

//Switch out the objects current model for a new one.
//vertexList - Model vertex array
//indiceList - Model indice array
object3D.prototype.changeModel = function(vertexList, indiceList){
    this.verticies = new Array(); //vertexList;
    copyVertexArray(this.verticies, vertexList);
    this.indices = new Array(); //indiceList;
    this.indices = copyIndiceArray(indiceList);
};

//Move an object by its change in position rather then the usual move to an
//absolute position.
//vectorDeltaPosition - vector3 offset in position.
object3D.prototype.translate = function(vectorDeltaPosition){
  this.position[0] = this.position[0] + vectorDeltaPosition[0];
  this.position[1] = this.position[1] + vectorDeltaPosition[1];
  this.position[2] = this.position[2] + vectorDeltaPosition[2];
};

//Set an objects position by making a copy of the supplied vector3 position.
//Arrays are assigned by reference so a deep copy is sometimes needed to 
//be made.
//vectorPos - vector3 position to set object
object3D.prototype.copyPosition = function(vectorPos){
  this.position[0] = vectorPos[0];
  this.position[1] = vectorPos[1];
  this.position[2] = vectorPos[2];
};

//Rotate the object
//theta - ammount of rotation - radians
//rotationAxis - axis of rotation - 3d vector [x,y,z]
object3D.prototype.rotate = function(theta, rotationAxis){
  var matrixOldRot = new Array();
  var matrixNewRotAmount = new Array();
  //Build a new Arbirtrary axis rotation matrix for the new rotation and then
  //multiply it by the old rotation matrix to integrate the new rotation.
  copyVertexArray(matrixNewRotAmount, matrixIdentity);
  copyVertexArray(matrixOldRot, this.matrixObjectRotation);
  updateArbRotationMatrix(matrixNewRotAmount, theta, rotationAxis[0], rotationAxis[1], rotationAxis[2]);
  multMatrixMatrix(this.matrixObjectRotation, matrixOldRot, matrixNewRotAmount);
};

//Return the objects forward vector from its rotation matrix.
//object - object to get forward vector.
//returns vector3 direction
object3D.prototype.getObjectForwardVector = function(){
	var tempForward = [0,0,0];
  //http://www.songho.ca/opengl/gl_anglestoaxes.html
  tempForward[0] = this.matrixObjectRotation[0][2];
  tempForward[1] = this.matrixObjectRotation[1][2];
  tempForward[2] = this.matrixObjectRotation[2][2];
  return tempForward;
};

//Make the objects forward direction point at the given point.
//positionLookAt - vector 3 position to rotate object towards
object3D.prototype.lookAt = function(positionLookAt){
	var directionSide = [0,0,0];
  var directionSideNormalized = [0,0,0];
  var objectUp = [0, 1, 0]; //Up vector always +Y? Didn't test any odd rotations.
  var directionNewUp = [0,0,0];
  var directionFront = [0,0,0];
  //Same as viewLookAt just with the objects rotation matrix and without
  //translation.
  calcDirectionVector3(directionFront, positionLookAt, this.position);
  normalizeVector3(directionFront, directionFront);

  crossVectorVector(directionSide, objectUp, directionFront);
  normalizeVector3(directionSideNormalized, directionSide);
    
  crossVectorVector(directionNewUp, directionFront, directionSideNormalized);
	//side
	this.matrixObjectRotation[0][0] = directionSide[0];
	this.matrixObjectRotation[1][0] = directionSide[1];
	this.matrixObjectRotation[2][0] = directionSide[2];
	//up
	this.matrixObjectRotation[0][1] = directionNewUp[0];
	this.matrixObjectRotation[1][1] = directionNewUp[1];
	this.matrixObjectRotation[2][1] = directionNewUp[2];
  //forward
	this.matrixObjectRotation[0][2] = directionFront[0];
	this.matrixObjectRotation[1][2] = directionFront[1];
	this.matrixObjectRotation[2][2] = directionFront[2];
};
