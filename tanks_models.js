//tanks_models.js - Model storage and model related helper functions.
//Tank, Missile Launcher, and Missile 3D models created in wings3d, exported in 
//obj to get vertices, and manually transcribed indices. The 2D models of the
//Wrench, fonts, smoke were drawn on graph paper.

//Missile Launcher platform model
var vertLauncher =[
[-1.50152863, 0.0000000, -1.34581400, 1],
[-1.50152863, 0.0000000, 2.65529014, 1],
[-1.50152863, 0.42630372, -2.25512600, 1],
[-1.50152863, 0.42630372, 3.63833469, 1],
[1.50152863, 0.0000000, -1.34581400, 1],
[1.50152863, 0.0000000, 2.65529014, 1],
[1.50152863, 0.42630372, -2.25512600, 1],
[1.50152863, 0.42630372, 3.63833469, 1],
[-1.50152863, 1.01326355, -2.25512600, 1],
[-1.50152863, 1.01326355, 3.63833469, 1],
[1.50152863, 1.01326355, 3.63833469, 1],
[1.50152863, 1.01326355, -2.25512600, 1],
[-1.50020424, 1.01258136, 1.97116529, 1],
[-1.50020424, 1.01258136, 3.64560790, 1],
[-1.36135545, 2.07786143, 1.94330246, 1],
[-1.36135545, 2.07786143, 2.77441122, 1],
[1.49979576, 1.01258136, 1.97116529, 1],
[1.49979576, 1.01258136, 3.64560790, 1],
[1.36339782, 2.07786143, 1.94330246, 1],
[1.36339782, 2.07786143, 2.77441122, 1]];
var indLauncher = [0,1,1,5,5,4,4,0,2,3,3,7,7,6,6,2,8,9,9,10,10,11,11,8,0,2,2,8,1,3,3,9,5,7,7,10,4,6,6,11,14,15,15,19,19,18,18,14,14,12,18,16,19,10,15,9,12,16];

//Missile model
var vertMissile = [
[0, 0.17342637, -0.42114593,1],
[0, 0.17370287, -0.95314593,1],
[0, 0.41349969, -0.95314593,1],
[-0.17400000, -0.17400000, -0.95423618,1],
[0.17400000, -0.17400000, -0.95423618,1],
[-0.17400000, 0.17400000, -0.95423618,1],
[0.17400000, 0.17400000, -0.95423618,1],
[-0.17400000, -0.17400000, 0.77020905,1],
[0.17400000, -0.17400000, 0.77020905,1],
[-0.17400000, 0.17400000, 0.77020905,1],
[0.17400000, 0.17400000, 0.77020905,1],
[0, 0, 1.29787127,1],
[0, -0.17107350, -0.42114593,1],
[0, -0.17135000, -0.95314593,1],
[0, -0.41114682, -0.95314593,1],
[-0.17029183, 0, -0.42114593,1],
[-0.17056833, 0, -0.95314593,1],
[-0.41036515, 0, -0.95314593,1],
[0.17536236, 0, -0.42114593,1],
[0.17563886, 0, -0.95314593,1],
[0.41543568, 0, -0.95314593,1]];
var indMissile = [0,2,2,1,1,0,18,20,20,19,19,18,12,14,14,13,13,12,15,16,16,17,17,15,5,6,6,4,4,3,3,5,5,9,9,11,6,10,10,11,4,8,8,11,3,7,7,11];

//Tank model
//Tank was split up in parts to make it easier to transcribe vertex data from
//the models. It also makes it possible to do the top blown off in the Game
//Lost scene.
var tankBody = [
[-1.0,  0.0, -1.0,1],
[-1.0,  0.0,         1.0,1],
[-1.0,  0.42630372, -1.90931200,1],
[-1.0,  0.42630372,  1.98304455,1],
[1.0,   0.0,        -1.0,1],
[1.0,   0.0,         1.0,1],
[1.0,   0.42630372,  -1.90931200,1],
[1.0,   0.42630372,  1.98304455,1],
[-1.0,  0.69172452,  -1.90931200,1],
[-1.0,  0.69172452,  1.98304455,1],
[1.0,   0.69172452,  1.98304455,1],
[1.0,   0.69172452,  -1.90931200,1],
[-1.0,  1.00482276,  -1.64564369,1],
[-1.0,  1.00482276,  1.59757382,1],
[1.0,   1.00482276,  1.59757382,1],
[1.0,   1.00482276,  -1.64564369,1]];
var tankBodyInd = [0,1,1,3,3,2,2,0,2,8,8,12,12,13,13,9,9,3,13,14,9,10,3,7,1,5,12,15,8,11,2,6,0,4,7,5,5,4,4,6,6,7,7,10,10,14,14,15,15,11,11,6];

var tankTurret = [
 [-1.0, 1.01258136, -1.35741403,1],
 [-1.0, 1.01258136, 1.22338377,1],
 [-0.53597448, 1.59569004, -1.19729254,1],
 [-0.53597448, 1.59569004, 0.64258597,1],
 [1.0, 1.01258136, -1.35741403,1],
 [1.0, 1.01258136, 1.22338377,1],
 [0.53760837, 1.59569004, -1.19729254,1],
 [0.53760837, 1.59569004, 0.64258597,1]
];
var tankTurretInd = [0,1,1,3,3,2,2,0,3,7,1,5,2,6,0,4,4,6,6,7,7,5,5,4];

var tankGun = [
 [-0.076, 1.15049486, 1.10125659,1],
 [-7.6092000e-2, 1.31464659, 3.15940167,1],
 [-7.6092000e-2, 1.29817212, 0.95162136,1],
 [-7.6092000e-2, 1.46638613, 3.14777923,1],
 [7.6092000e-2, 1.15049486, 1.10125659,1],
 [7.6092000e-2, 1.31464659, 3.15940167,1],
 [7.6092000e-2, 1.29817212, 0.95162136,1],
 [7.6092000e-2, 1.46638613, 3.14777923,1]
];
var tankGunInd = [1,5,5,7,7,3,3,1,1,0,3,2,7,6,5,4,4,6,6,2,2,0,0,4];

//Tanks! logo.
//When I started I originaly didn't plan to make a font and string mesh
//function. I was going to keep the length of text small and just create
//individual models for text by hand.
var graphicTanksVerts = [
[8.5,0.5,0,1],[0,0,0,1],[0,3,0,1],[2,4,0,1],[4,5,0,1],
[1,0,0,1],[1.5,1,0,1],[2,2,0,1],[2.5,1,0,1],[3,0,0,1],
[3,2,0,1],[4,0,0,1],[4,2,0,1],[5,0,0,1],[5,1,0,1],
[5,3,0,1],[6,0,0,1],[6,3,0,1],[7,1,0,1],[6,2,0,1],
[7,4,0,1],[8,5,0,1],[8,2,0,1],[8,1,0,1],[7.5,0.5,0,1],[8,0,0,1]
];
var graphicTanksInd = [1,3,2,4,5,7,7,9,6,8,9,10,10,11,11,12,13,15,14,17,14,16,16,18,18,19,19,20,21,22,23,25,24,0];

//Credits header text
//Another pre-font text model
var graphicCreditsVerts = [
[3,5,0,1],[1,5,0,1],[0,4,0,1],[0,1,0,1],[1,0,0,1],
[3,0,0,1],[3,1,0,1],[3,2,0,1],[4,2,0,1],[5,2,0,1],
[5,1,0,1],[5,0,0,1],[7,0,0,1],[7,1,0,1],[7,2,0,1],
[6,2,0,1],[8,0,0,1],[8,1,0,1],[9,2,0,1],[10,2,0,1],
[10,0,0,1],[10,5,0,1],[11,5,0,1],[11,4,0,1],[11,3,0,1],
[11,0,0,1],[13,5,0,1],[13,0,0,1],[12,3,0,1],[14,3,0,1],
[16,3,0,1],[14,2,0,1],[16,1,0,1],[14,0,0,1]
];
var graphicCreditsInd = [0,1,1,2,2,3,3,4,4,5,5,7,6,8,8,9,12,11,11,10,10,13,13,14,14,15,15,10,21,20,19,18,18,17,17,16,16,20,22,23,24,25,26,27,28,29,30,31,31,32,32,33];

//2D wrench model
var vertsWrench =[[-0.5, 0, 0, 1],
[0.5, 0, 0, 1],
[2.5, 2, 0, 1],
[2.5, 22, 0, 1],
[4.5, 24, 0, 1],
[4.5, 28, 0, 1],
[2.5, 30, 0, 1],
[2.5, 26, 0, 1],
[0, 25, 0, 1],
[-2.5, 26, 0, 1],
[-2.5, 30, 0, 1],
[-4.5, 28, 0, 1],
[-4.5, 24, 0, 1],
[-2.5, 22, 0, 1],
[-2.5, 2, 0, 1],
[-0.5, 3, 0, 1],
[-0.5, 22, 0, 1],
[0.5, 3, 0, 1],
[0.5, 22, 0, 1]];
var indWrench =[0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,0,15,16,17,18];

//Font model for just numbers.
//Numbers and letters are split because I first felt I needed to add a mesh 
//builder to display numbers. I later added alphabet characters and some symbols.
var vertNumbers = [
[[1,0,0,1],[0,1,0,1],[0,2,0,1],[1,3,0,1],[2,2,0,1],[2,1,0,1]],//0
[[1,0,0,1],[1,3,0,1]],//1
[[2,0,0,1],[0,0,0,1],[0,1,0,1],[2,1,0,1],[2,2,0,1],[1,3,0,1],[0,3,0,1]],//2
[[0,0,0,1],[2,0,0,1],[2,1,0,1],[1,1,0,1],[0,1,0,1],[2,2,0,1],[2,3,0,1],[0,3,0,1]],//3
[[0,3,0,1],[0,2,0,1],[1,1,0,1],[2,1,0,1],[2,3,0,1],[2,0,0,1]],//4
[[0,0,0,1],[2,0,0,1],[2,1,0,1],[1,2,0,1],[0,2,0,1],[0,3,0,1],[2,3,0,1]],//5
[[0,0,0,1],[2,0,0,1],[2,1,0,1],[1,2,0,1],[0,2,0,1],[0,3,0,1],[2,3,0,1]],//6
[[0,0,0,1],[2,3,0,1],[0,3,0,1]],//7
[[0,0,0,1],[2,0,0,1],[0,1.5,0,1],[2,1.5,0,1],[0,3,0,1],[2,3,0,1]],//8
[[2,0,0,1],[2,1,0,1],[2,3,0,1],[0,3,0,1],[0,2,0,1],[1,1,0,1]]//9
];
var indNumbers = [
[0,1,1,2,2,3,3,4,4,5,5,0,1,4],
[0,1],
[0,1,1,2,2,3,3,4,4,5,5,6],
[0,1,1,2,2,4,3,5,5,6,6,7],
[0,1,1,2,2,3,4,5],
[0,1,1,2,2,3,3,4,4,5,5,6],
[0,1,1,2,2,4,0,4,4,5,5,6],
[0,1,1,2],
[0,1,1,5,5,4,4,0,2,3],
[0,2,2,3,3,4,4,5,5,1]
];

//Font model for letters and symbols
//TODO: can just use a 3x4 grid of verts and use indices to draw letters
var vertAlphabet = [
  [[0,0,0,1],[1,3,0,1],[2,0,0,1],[0.33,1,0,1],[1.66,1,0,1]],//A
  [[0,3,0,1],[0,0,0,1],[2,0,0,1],[2,3,0,1],[1,1,0,1],[0,1,0,1],[2,1,0,1],[2,2,0,1]],//B
  [[2,0,0,1],[1,0,0,1],[0,1,0,1],[0,2,0,1],[1,3,0,1],[2,3,0,1]],//C
  [[0,3,0,1],[0,0,0,1],[1,0,0,1],[2,1,0,1],[2,2,0,1],[1,3,0,1]],//D
  [[2,3,0,1],[0,3,0,1],[0,1,0,1],[1,1,0,1],[0,0,0,1],[2,0,0,1]],//E
  [[2,3,0,1],[0,3,0,1],[0,0,0,1],[0,1,0,1],[1,1,0,1]],//F
  [[2,3,0,1],[0,3,0,1],[0,0,0,1],[2,0,0,1],[2,1,0,1],[1,1,0,1]],//G
  [[0,3,0,1],[0,0,0,1],[2,3,0,1],[2,0,0,1],[0,1,0,1],[2,1,0,1]],//H
  [[0,3,0,1],[2,3,0,1],[1,3,0,1],[1,0,0,1],[0,0,0,1],[2,0,0,1]],//I
  [[2,3,0,1],[2,0,0,1],[0,0,0,1],[0,1,0,1]],//J
  [[0,3,0,1],[0,0,0,1],[0,1,0,1],[2,0,0,1],[2,3,0,1]],//K
  [[0,3,0,1],[0,0,0,1],[2,0,0,1]],//L
  [[0,0,0,1],[0,3,0,1],[1,1,0,1],[2,3,0,1],[2,0,0,1]],//M
  [[0,0,0,1],[0,3,0,1],[2,0,0,1],[2,3,0,1]],//N
  [[1,3,0,1],[0,1,0,1],[1,0,0,1],[2,1,0,1]],//O
  [[0,0,0,1],[0,1,0,1],[0,3,0,1],[2,3,0,1],[2,1,0,1]],//P
  [[0,3,0,1],[2,3,0,1],[2,0,0,1],[0,0,0,1],[1,1,0,1]],//Q
  [[0,3,0,1],[0,0,0,1],[0,1,0,1],[2,0,0,1],[1,1,0,1],[2,2,0,1],[2,3,0,1]],//R
  [[0,0,0,1],[2,1,0,1],[0,2,0,1],[2,3,0,1]],//S
  [[0,3,0,1],[2,3,0,1],[1,3,0,1],[1,0,0,1]],//T
  [[0,3,0,1],[0,1,0,1],[1,0,0,1],[2,1,0,1],[2,3,0,1]],//U
  [[0,3,0,1],[1,0,0,1],[2,3,0,1]],//V
  [[0,3,0,1],[0,0,0,1],[1,2,0,1],[2,0,0,1],[2,3,0,1]],//W
  [[0,3,0,1],[2,0,0,1],[0,0,0,1],[2,3,0,1]],//X
  [[0,3,0,1],[1,2,0,1],[2,3,0,1],[1,0,0,1]],//Y
  [[0,3,0,1],[2,3,0,1],[0,0,0,1],[2,0,0,1]],//Z
  [[0,0,0,1],[2,0,0,1],[0,3,0,1],[2,3,0,1],[2,1,0,1],[1.5,1,0,1],[0.5,1,0,1],[0.5,2,0,1],[1.5,2,0,1]], //@ 26
  [[0.5,0,0,1],[0.5,1,0,1],[1.5,1,0,1],[1.5,0,0,1]],//. 27
  [[1,3,0,1],[1,2,0,1],[1,1,0,1],[1,0,0,1]], //: 28
  [[0,0,0,1],[2,3,0,1]], /// 29
  [[0.5,1.5,0,1],[1.5,1.5,0,1]] //- 30
];
var indAlphabet = [
  [0,1,1,2,3,4],//A 0
  [0,1,1,2,2,6,6,4,4,7,7,3,3,0,4,5],//B 1
  [0,1,1,2,2,3,3,4,4,5],//C 2
  [0,1,1,2,2,3,3,4,4,5,5,0],//D 3
  [0,1,1,4,4,5,2,3],//E 4
  [0,1,1,2,3,4],//F 5
  [0,1,1,2,2,3,3,4,4,5],//G 6
  [0,1,4,5,2,3],//H 7
  [0,1,2,3,4,5],//I 8
  [0,1,1,2,2,3],//J 9
  [0,1,2,4,2,3],//K 10
  [0,1,1,2],//L 11
  [0,1,1,2,2,3,3,4],//M 12
  [0,1,1,2,2,3],//N 13
  [0,1,1,2,2,3,3,0],//O 14
  [0,2,2,3,3,4,4,1],//P 15
  [0,1,1,2,2,3,3,0,2,4],//Q 16
  [1,0,0,6,6,5,5,4,4,3,4,2],//R 17
  [0,1,1,2,2,3],//S 18
  [0,1,2,3],//T 19
  [0,1,1,2,2,3,3,4],//U 20
  [0,1,1,2],//V 21
  [0,1,1,2,2,3,3,4],//W 22
  [0,1,2,3],//X 23
  [0,1,1,2,1,3],//Y 24
  [0,1,1,2,2,3],//Z 25
  [1,0,0,2,2,3,3,4,4,6,6,7,7,8,8,5],//@ 26
  [0,2,1,3],//. 27
  [0,1,2,3],//: 28
  [0,1],/// 29
  [0,1]//- 30
];

//Generic pyramid model.
//Origin at center of model, not the base.
var pyramidVerts = [[0,1,0,1], [1,-1,1,1], [-1,-1,1,1],[1,-1,-1,1], [-1,-1,-1,1]];
var pyramidInd = [0,1,0,2,0,3,0,4,1,2,2,4,4,3,3,1];

//Single line mesh for particle effects
var particleVerts = [[0,0,0,1], [0,0,1,1]];
var particleInd = [0,1];

//2D crumpled paper ball shaped meshes for smoke effect
var particleSmokeVerts = [
[[1.5,1.5,0,1], [2,0,0,1], [5,1,0,1], [5,3,0,1], [3,5,0,1], [1,4,0,1],[0,2,0,1]], //shape variant 1
[[0,3,0,1], [1,0,0,1], [3,0,0,1], [5,3,0,1], [4,5,0,1], [3,4,0,1],[2,4,0,1]], //shape variant 2
[[0,1,0,1], [1,0,0,1], [4,2,0,1], [3,3,0,1], [4,4,0,1], [0,5,0,1],[1,3,0,1]] //shape variant 3
];
//indices for smoke meshes, all of them are round and have the same ammount of verts.
//so all have the same indicies list
var particleSmokeInd = [0,1,1,2,2,3,3,4,4,5,5,6,6,0];

//Generic cube
//Origin at center of cube.
var cubeVerts = [[-1,1,1,1],[1,1,1,1],[1,1,-1,1],[-1,1,-1,1],[-1,-1,1,1],[1,-1,1,1],[1,-1,-1,1],[-1,-1,-1,1]];
//bulletVerts is just a cube but scaled down to look a bit better. use cubeInd as indecies
var bulletVerts = [[-0.1,0.1,0.1,1],[0.1,0.1,0.1,1],[0.1,0.1,-0.1,1],[-0.1,0.1,-0.1,1],[-0.1,-0.1,0.1,1],[0.1,-0.1,0.1,1],[0.1,-0.1,-0.1,1],[-0.1,-0.1,-0.1,1]];
var cubeInd = [1,0,0,4,4,5,5,1,2,3,3,7,7,6,6,2,1,2,0,3,4,7,5,6];

//Building model
//Cube with a pyramid top
var buildingVerts = [[-1,2,1,1],[1,2,1,1],[1,2,-1,1],[-1,2,-1,1],[-1,0,1,1],[1,0,1,1],[1,0,-1,1],[-1,0,-1,1],[0,3,0,1]];
var buildingInd = [1,0,0,4,4,5,5,1,2,3,3,7,7,6,6,2,1,2,0,3,4,7,5,6,0,8,1,8,2,8,3,8];

//Very simple arrow -> mesh for the enemey radar.
var arrowVerts = [[0,0,0,1],[0,5,0,1],[-1,2,0,1],[1,2,0,1],[0,2,0,1]];
var arrowInd = [0,4,2,3,3,1,1,2];

////////////////////////////////////////////////////////////////////////////////
// CODE
////////////////////////////////////////////////////////////////////////////////


//TODO: change cylinder generation code before release


/*
//DEBUG: unused in release
var circleVerts = new Array();
var circleInd = new Array();
var sides = 15;
var theta = 2 * Math.PI / sides;
for(var i = 0; i <= sides; i++) {
  circleVerts.push([Math.cos(theta*i), 0, Math.sin(theta*i), 1]);
  if(i != sides){
    circleInd.push(i);
    circleInd.push(i+1);
  }
}
*/

//Offset a vert list by the given ammounts.
//vertList - Array of verticies.
//offsetX, offsetY, offsetZ - offset each vertex by these ammounts.
var offsetVerts = function(vertList, offsetX, offsetY, offsetZ){
	for(var i = 0; i < vertList.length; i++){
  	vertList[i][0] += offsetX;
    vertList[i][1] += offsetY;
    vertList[i][2] += offsetZ;
  }
};

//FIXME: Drew the smoke particles on graph paper with 0,0 at the lower left
//corner. Then realized I wanted the index at the center of the model.
//Just offset all the verts by half.
offsetVerts(particleSmokeVerts[0], -2.5, -2.5, 0);
offsetVerts(particleSmokeVerts[1], -2.5, -2.5, 0);
offsetVerts(particleSmokeVerts[2], -2, -2.5, 0);

//Add the vertices and indices from model B to the model A arrays
//NOTE: Helper function so that I don't have to manually recreate some of the
//models or create groups.
//vertA - Destination vertex array.
//indA - Destination index array.
//vertB - Source vertex array.
//indB - Source index array.
var joinModels = function(vertA, indA, vertB, indB){
  var startALen = vertA.length;
  
  copyVertexArray(vertA, vertB);
  
  for(var i = 0; i < indB.length; i++){
    //Offset the indicies from indB by the length of the destination vertex
    //array.
  	indA.push(indB[i] + startALen);
  }

};

//tank model was split up into 3 smaller models to make things a bit easier to
//follow when copying the vert data by hand.
var tankVerts = new Array();
var tankInd = new Array();
joinModels(tankVerts, tankInd, tankBody, tankBodyInd);
joinModels(tankVerts, tankInd, tankTurret, tankTurretInd);
joinModels(tankVerts, tankInd, tankGun, tankGunInd);


//Build a single string model by joining individual letter models. If a 
//character does not exist in the font it is treated as a space.
//resultVert - Destination array for vertices
//resultInd - Destination array for indices
//string - String to convert to a model
//padding - space between characters.
//centerX - center the model origin for the X-axis. If true then
//origin is bottom center of mesh. If false, the origin is in the lower left of
//the mesh.
var buildStringMesh = function(resultVert, resultInd, string, padding = 1.0, centerX = false){
  var tempVertArray;
  var tempReferenceVertArray;
  var tempReferenceIndArray;
  var tempIndArray;
  var curChar;

  //Convert the string to all upper case characters. There are no lower case
  //characters in the font.
  string = string.toLocaleUpperCase();
  //For each character in the string
  for(i = 0; i < string.length; i++){
    curChar = string.charCodeAt(i);
    if(curChar === 32){ //space
      //just need to skip the loop once, the space will be added by the 
      //incrementing index value.
      continue;
    } else if(curChar === 64) { //@ symbol
      curChar = 26;
      tempReferenceVertArray = vertAlphabet;
      tempReferenceIndArray = indAlphabet;
    } else if(curChar === 58) { //: symbol
      curChar = 28;
      tempReferenceVertArray = vertAlphabet;
      tempReferenceIndArray = indAlphabet;
    } else if(curChar === 47) { /// symbol
      curChar = 29;
      tempReferenceVertArray = vertAlphabet;
      tempReferenceIndArray = indAlphabet;
    } else if(curChar === 46) { //. symbol
      curChar = 27;
      tempReferenceVertArray = vertAlphabet;
      tempReferenceIndArray = indAlphabet;
    } else if(curChar === 45) { //. symbol
      curChar = 30;
      tempReferenceVertArray = vertAlphabet;
      tempReferenceIndArray = indAlphabet;
    } else if((curChar >= 48) && (curChar <= 57)) { //standard numbers 0-9
      //Subtracting by 48 gets us index in the number font array
      curChar = curChar - 48;
      tempReferenceVertArray = vertNumbers;
      tempReferenceIndArray = indNumbers;
    } else if((curChar >= 65) && (curChar <= 90)) { //standard letters 0-25
      //Subtracting by 48 gets us index in the alphabet font array
      curChar = curChar - 65;
      tempReferenceVertArray = vertAlphabet;
      tempReferenceIndArray = indAlphabet;
    } else {
      //increment loop, treat unkown characters as a space
      continue;
    }
      tempVertArray = new Array();
      //Offset the current character by its position in the string.
      copyVertexArray(tempVertArray, tempReferenceVertArray[curChar]);
      offsetVerts(tempVertArray, ((2 + padding) * i), 0, 0);
      tempIndArray = new Array();
      tempIndArray = copyIndiceArray(tempReferenceIndArray[curChar]);
      //Join current character with the results of all previous characters.
      joinModels(resultVert, resultInd, tempVertArray, tempIndArray);
  }
  
  if(centerX == true){
    //center the mesh on the x-axis by moving the verts to the left by
    //half the string length multiplied by the size of each character.
    var offsetAmmout = -1 * ((string.length / 2) * (2 + padding));
    offsetVerts(resultVert, offsetAmmout, 0, 0);
  }
  
};


