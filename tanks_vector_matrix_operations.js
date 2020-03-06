//tanks_vector_matrix_operations.js - vector and matrix related functions.

//Make a copy of an array of indices instead of a reference
//listSrc - source array
//returns an array copied from listSrc.
var copyIndiceArray = function(listSrc){
    return listSrc.slice();
};

//Make a copy of an array of vertices instead of a reference. If arrayDest
//is not empty then arraySrc is added to the end of arrayDest.
//arrayDest - Destination array
//arraySrc - Source array to make copies from.
var copyVertexArray = function(arrayDest, arraySrc){
  //For each element of the source array
  for(var i = 0; i < arraySrc.length; i++){
  	var temp = new Array();
    //Copy the inner array values.
    for(var j = 0; j < arraySrc[i].length; j++){
    	temp.push(arraySrc[i][j]);
    }
    arrayDest.push(temp);
  }
};

//Make the values of matrixDestination the same as matrixSource. Both matrices
//should be 4x4 arrays.
//matrixDestination - Destination matrix
//matrixSource - Source array to make copies from.
var copyMatrix = function(matrixDestination, matrixSource){
	matrixDestination[0][0] = matrixSource[0][0]; matrixDestination[0][1] = matrixSource[0][1]; matrixDestination[0][2] = matrixSource[0][2]; matrixDestination[0][3] = matrixSource[0][3];
	matrixDestination[1][0] = matrixSource[1][0]; matrixDestination[1][1] = matrixSource[1][1]; matrixDestination[1][2] = matrixSource[1][2]; matrixDestination[1][3] = matrixSource[1][3];
  matrixDestination[2][0] = matrixSource[2][0]; matrixDestination[2][1] = matrixSource[2][1]; matrixDestination[2][2] = matrixSource[2][2]; matrixDestination[2][3] = matrixSource[2][3];
  matrixDestination[3][0] = matrixSource[3][0]; matrixDestination[3][1] = matrixSource[3][1]; matrixDestination[3][2] = matrixSource[3][2]; matrixDestination[3][3] = matrixSource[3][3];
};

//multiply two 4x4 matricies together and put the solution in matrixSol
//matrixSol[4][4] = matrixA[4][4] * matrixB[4][4]
//vectorSol - Destination vector4 of solution.
//matrixA - matrix4 to multiply by.
//matrixB - matrix4 to multiply by. 
//NOTE: Breaking down the matrix references into local variables speeds up
//matrix multiplication a fair bit. I followed the recomendations here:
//http://blog.tojicode.com/2010/06/stupidly-fast-webgl-matricies.html
//Tested below:
//https://embed.plnkr.co/plunk/NBD22KBAnP9Q5YfY
var multMatrixMatrix = function(matrixSol, matrixA, matrixB){
  var tempB00 = matrixB[0][0]; var tempB01 = matrixB[0][1]; var tempB02 = matrixB[0][2]; var tempB03 = matrixB[0][3];
	var tempB10 = matrixB[1][0]; var tempB11 = matrixB[1][1]; var tempB12 = matrixB[1][2]; var tempB13 = matrixB[1][3];
  var tempB20 = matrixB[2][0]; var tempB21 = matrixB[2][1]; var tempB22 = matrixB[2][2]; var tempB23 = matrixB[2][3];
  var tempB30 = matrixB[3][0]; var tempB31 = matrixB[3][1]; var tempB32 = matrixB[3][2]; var tempB33 = matrixB[3][3];
  //0
  var tempA00 = matrixA[0][0]; var tempA01 = matrixA[0][1]; var tempA02 = matrixA[0][2]; var tempA03 = matrixA[0][3]; 
  matrixSol[0][0] = (tempA00 * tempB00) + (tempA01 * tempB10) + (tempA02 * tempB20) + (tempA03 * tempB30);
  matrixSol[0][1] = (tempA00 * tempB01) + (tempA01 * tempB11) + (tempA02 * tempB21) + (tempA03 * tempB31);
  matrixSol[0][2] = (tempA00 * tempB02) + (tempA01 * tempB12) + (tempA02 * tempB22) + (tempA03 * tempB32);
  matrixSol[0][3] = (tempA00 * tempB03) + (tempA01 * tempB13) + (tempA02 * tempB23) + (tempA03 * tempB33);
  //1
  var tempA10 = matrixA[1][0]; var tempA11 = matrixA[1][1]; var tempA12 = matrixA[1][2]; var tempA13 = matrixA[1][3]; 
  matrixSol[1][0] = (tempA10 * tempB00) + (tempA11 * tempB10) + (tempA12 * tempB20) + (tempA13 * tempB30);
  matrixSol[1][1] = (tempA10 * tempB01) + (tempA11 * tempB11) + (tempA12 * tempB21) + (tempA13 * tempB31);
  matrixSol[1][2] = (tempA10 * tempB02) + (tempA11 * tempB12) + (tempA12 * tempB22) + (tempA13 * tempB32);
  matrixSol[1][3] = (tempA10 * tempB03) + (tempA11 * tempB13) + (tempA12 * tempB23) + (tempA13 * tempB33);
  //2
  var tempA20 = matrixA[2][0]; var tempA21 = matrixA[2][1]; var tempA22 = matrixA[2][2]; var tempA23 = matrixA[2][3]; 
  matrixSol[2][0] = (tempA20 * tempB00) + (tempA21 * tempB10) + (tempA22 * tempB20) + (tempA23 * tempB30);
  matrixSol[2][1] = (tempA20 * tempB01) + (tempA21 * tempB11) + (tempA22 * tempB21) + (tempA23 * tempB31);
  matrixSol[2][2] = (tempA20 * tempB02) + (tempA21 * tempB12) + (tempA22 * tempB22) + (tempA23 * tempB32);
  matrixSol[2][3] = (tempA20 * tempB03) + (tempA21 * tempB13) + (tempA22 * tempB23) + (tempA23 * tempB33);
  //3
  var tempA30 = matrixA[3][0]; var tempA31 = matrixA[3][1]; var tempA32 = matrixA[3][2]; var tempA33 = matrixA[3][3]; 
  matrixSol[3][0] = (tempA30 * tempB00) + (tempA31 * tempB10) + (tempA32 * tempB20) + (tempA33 * tempB30);
  matrixSol[3][1] = (tempA30 * tempB01) + (tempA31 * tempB11) + (tempA32 * tempB21) + (tempA33 * tempB31);
  matrixSol[3][2] = (tempA30 * tempB02) + (tempA31 * tempB12) + (tempA32 * tempB22) + (tempA33 * tempB32);
  matrixSol[3][3] = (tempA30 * tempB03) + (tempA31 * tempB13) + (tempA32 * tempB23) + (tempA33 * tempB33);
};

//Multiply a matrix4 by a vector4 and put the solution in vectorSol
//vectorSol[4] = matrixA[4][4] * VectorB[4]
//vectorSol - Destination vector4 of solution.
//matrixA - matrix4 to multiply by.
//VectorB - vector4 to multiply by. 
//NOTE: Local var speed up tested below:
//https://embed.plnkr.co/plunk/6pomf3OlUu8woQxg
//The performance increase isn't as good as multMatrixMatrix but this
//function is called a lot more.
var multMatrixVector = function(vectorSol, matrixA, VectorB){
  var tempB0 = VectorB[0]; var tempB1 = VectorB[1]; var tempB2 = VectorB[2]; var tempB3 = VectorB[3]; 
  vectorSol[0] = (matrixA[0][0]*tempB0) + (matrixA[0][1]*tempB1) + (matrixA[0][2]*tempB2) + (matrixA[0][3]*tempB3);
  vectorSol[1] = (matrixA[1][0]*tempB0) + (matrixA[1][1]*tempB1) + (matrixA[1][2]*tempB2) + (matrixA[1][3]*tempB3);
  vectorSol[2] = (matrixA[2][0]*tempB0) + (matrixA[2][1]*tempB1) + (matrixA[2][2]*tempB2) + (matrixA[2][3]*tempB3);
  vectorSol[3] = (matrixA[3][0]*tempB0) + (matrixA[3][1]*tempB1) + (matrixA[3][2]*tempB2) + (matrixA[3][3]*tempB3);
};
 
//compute the cross product of two vector3s
//vectorSol[3] = vectorA[3] x vectorB[3]
//vectorSol - Destination vector3 of solution.
//VectorA - vector3 operand 1. 
//VectorB - vector3 operand 2. 
var crossVectorVector = function(vectorSol, vectorA, vectorB){
  vectorSol[0] = (vectorA[1]*vectorB[2])-(vectorA[2]*vectorB[1]);
  vectorSol[1] = (vectorA[2]*vectorB[0])-(vectorA[0]*vectorB[2]);
  vectorSol[2] = (vectorA[0]*vectorB[1])-(vectorA[1]*vectorB[0]);
};

//Compute the length of a vector3 and return the value
//vectorA - vector3
//returns scaler length of the given vector
var lengthVector3 = function(vectorA){
  return Math.sqrt((vectorA[0] * vectorA[0]) + (vectorA[1] * vectorA[1]) + (vectorA[2]*vectorA[2]));
};

//Compute the length of a vector4 and return the value
//vectorA - vector4
//returns scaler length of the given vector
var lengthVector4 = function(vectorA){
  return Math.sqrt((vectorA[0] * vectorA[0]) + (vectorA[1]*vectorA[1]) + (vectorA[2]*vectorA[2]) + (vectorA[3]*vectorA[3]));
};

//Compute the normalized value for a vector3
//vectorSol - destination vector3 of solution.
//vectorA - vector3 to normalize.
var normalizeVector3 = function(vectorSol, vectorA){
  var lengthA = lengthVector3(vectorA);
  vectorSol[0] = vectorA[0]/lengthA;
  vectorSol[1] = vectorA[1]/lengthA;
  vectorSol[2] = vectorA[2]/lengthA;
};

//Compute the normalized value for a vector4
//vectorSol - destination vector4 of solution.
//vectorA - vector4 to normalize.
var normalizeVector4 = function(vectorSol, vectorA){
  var lengthA = lengthVector4(vectorA);
  vectorSol[0] = vectorA[0]/lengthA;
  vectorSol[1] = vectorA[1]/lengthA;
  vectorSol[2] = vectorA[2]/lengthA;
  vectorSol[3] = vectorA[3]/lengthA;
};

//Add two vector3s
//vectorSol[3] = vectorA[3] + vectorB[3]
//vectorSol - destination vector3 of solution.
//VectorA - First operand vector3
//VectorB - Second operand vector3
var calcAddVector3Vector3 = function(vectorSol, VectorA, VectorB){
  vectorSol[0] = VectorA[0] + VectorB[0];
  vectorSol[1] = VectorA[1] + VectorB[1];
  vectorSol[2] = VectorA[2] + VectorB[2];
};

//Subtract two vector3s
//vectorSol[3] = vectorA[3] - vectorB[3]
//vectorSol - destination vector3 of solution.
//VectorA - First operand vector3
//VectorB - Second operand vector3
var calcSubtractVector3Vector3 = function(vectorSol, VectorA, VectorB){
  vectorSol[0] = VectorA[0] - VectorB[0];
  vectorSol[1] = VectorA[1] - VectorB[1];
  vectorSol[2] = VectorA[2] - VectorB[2];
};

//Calculate the direction vector from VectorB to VectorA.
//vectorSol[3] = vectorA[3] - vectorB[3]
//vectorSol - destination vector3 of solution.
//VectorA - First operand vector3
//VectorB - Second operand vector3
//NOTE: I was originally using this for vector subtraction but added 
//calcSubtractVector3Vector3 later.
var calcDirectionVector3 = function(vectorSol, VectorA, VectorB){
	calcSubtractVector3Vector3(vectorSol, VectorA, VectorB)
};

//Multiply a scaler value and a vector3
//vectorSol[3] = vectorA[3] * scaler
//vectorSol - destination vector3 of solution.
//VectorA - First operand vector3
//scaler - scaler value to multiply by.
var calcMultScalerToVector3 = function(vectorSol, vectorA, scaler){
	vectorSol[0] = vectorA[0] * scaler;
  vectorSol[1] = vectorA[1] * scaler;
  vectorSol[2] = vectorA[2] * scaler;
};

//Calculate to distance^2 between two vectors.
//VectorA - First operand vector3
//VectorB - Second operand vector3
//returns the distance^2 between vectors as a float.
//NOTE: Just use sqrt(). Using dist^2 isn't worth the hassle.
var calcDistanceSquaredVector3 = function(vectorA, vectorB){
	return ((vectorA[0]-vectorB[0])*(vectorA[0]-vectorB[0]))+((vectorA[1]-vectorB[1])*(vectorA[1]-vectorB[1]))+((vectorA[2]-vectorB[2])*(vectorA[2]-vectorB[2]));
};

//Calculate to distance between two vectors.
//VectorA - First operand vector3
//VectorB - Second operand vector3
//returns the distance between vectors as a float.
var calcDistanceVector3 = function(vectorA, vectorB){
	return Math.sqrt(((vectorA[0]-vectorB[0])*(vectorA[0]-vectorB[0]))+((vectorA[1]-vectorB[1])*(vectorA[1]-vectorB[1]))+((vectorA[2]-vectorB[2])*(vectorA[2]-vectorB[2])));
};

//Calculate the dot product between two vectors.
//VectorA - First operand vector3
//VectorB - Second operand vector3
//returns the dot product of the two vectors as a float
var calcDotProductVector3 = function(VectorA, VectorB){
	return ((VectorA[0]*VectorB[0])+(VectorA[1]*VectorB[1])+(VectorA[2]*VectorB[2]));
};

//Update translation matrix with the given dx, dy, dz values
//matrix - destination matrix4.
//dx - X-axis translation component.
//dy - Y-axis translation component.
//dy - Z-axis translation component.
var updateTranslationMatrix = function(matrix, dx, dy, dz){
  /*
  | 1 0 0 x |
  | 0 1 0 y |
  | 0 0 1 z |
  | 0 0 0 1 |
  */
  matrix[0][3] = dx;
  matrix[1][3] = dy;
  matrix[2][3] = dz;
};

//Update scaling matrix, matrix with the given dx, dy, dz values
//matrix - destination matrix4.
//dx - X-axis scale component.
//dy - Y-axis scale component.
//dy - Z-axis scale component.
var updateScalingMatrix = function(matrix, dx, dy, dz){
    /*
     | x 0 0 0 |
     | 0 y 0 0 |
     | 0 0 z 0 |
     | 0 0 0 1 |
     */
    matrix[0][0] = dx;
    matrix[1][1] = dy;
    matrix[2][2] = dz;
};

//Update x-axis rotation matrix with the given theta
//value. theta is in radians.
//matrix - destination matrix4.
//theta - rotation angle in radians.
var updateRotationXMatrix = function(matrix, theta){
    /*
     | 1   0    0   0 |
     | 0  cos -sin  0 |
     | 0  sin  cos  0 |
     | 0   0    0   1 |
     */
    matrix[1][1] = Math.cos(theta);
    matrix[1][2] = -(Math.sin(theta));
    matrix[2][1] = Math.sin(theta);
    matrix[2][2] = Math.cos(theta);
};

//Update y-axis rotation matrix with the given theta
//value. theta is in radians.
//matrix - destination matrix4.
//theta - rotation angle in radians.
var updateRotationYMatrix = function(matrix, theta){
    /*
     |  cos  0  sin  0 |
     |   0   1   0   0 |
     | -sin  0  cos  0 |
     |   0   0   0   1 |
     */
    matrix[0][0] = Math.cos(theta);
    matrix[0][2] = Math.sin(theta);
    matrix[2][0] = -(Math.sin(theta));
    matrix[2][2] = Math.cos(theta);
};

//Update z-axis rotation matrix with the given theta
//value. theta is in radians.
//matrix - destination matrix4.
//theta - rotation angle in radians.
var updateRotationZMatrix = function(matrix, theta){
    /*
     | cos -sin  0  0 |
     | sin  cos  0  0 |
     |  0    0   1  0 |
     |  0    0   0  1 |
     */
    matrix[0][0] = Math.cos(theta);
    matrix[0][1] = -(Math.sin(theta));
    matrix[1][0] = Math.sin(theta);
    matrix[1][1] = Math.cos(theta);
};

//Update rotation matrix with an arbitrary axis rotation
//matrix - destination matrix4
//theta - rotation amount in radians
//ux, uy, uz - axis of rotation.
//NOTE: I think I originally ripped this from some slides from a class I took.
//Googling "Arbitrary axis rotation" or "Rodrigues' rotation formula" brings
//up explanations.
var updateArbRotationMatrix = function(matrix, theta, ux, uy, uz){
    /*
     | [ux^2 + ct(1−ux^2)]   [ux*uy*(1−ct)−uz*st]  [uz*ux*(1−ct)+uy*st] 0 |
     | [ux*uy*(1−ct)+uz*st]  [uy^2+ct(1−uy^2)]     [uy*uz(1−ct)−ux*st]  0 |
     | [uz*ux*(1−ct)−uy*st]  [uy*uz*(1−ct)+ux*st]  [uz^2+ct*(1−uz^2)]   0 |
     | 0                      0                     0                   1 |
     */
    var ct = Math.cos(theta);
    var st = Math.sin(theta);
    var ctOffset = 1 - ct;
    
    matrix[0][0] = (ux * ux) + ct * (1 - (ux * ux));
    matrix[0][1] = ux * uy * ctOffset - uz * st; 
    matrix[0][2] = uz * ux * ctOffset + uy * st; 
    
    matrix[1][0] = ux * uy * ctOffset + uz * st; 
    matrix[1][1] = (uy * uy) + ct * (1 - (uy * uy)); 
    matrix[1][2] = uy * uz * ctOffset - ux * st; 
    
    matrix[2][0] = uz * ux * ctOffset - uy * st; 
    matrix[2][1] = uy * uz * ctOffset + ux * st; 
    matrix[2][2] = (uz * uz) + ct * (1 - (uz * uz));
};

//Given an origin, direction, and length calculate the end position
//for a line.
//vec3OriginPosition - Starting position vector of the line.
//vec3Direction - Direction vector of the line.
//scalerLength - Length of the line, Scaler value.
//Returns a position vector of the end point of the line
var calcLineEndPosition = function(vec3OriginPosition, vec3Direction, scalerLength){
  var vec3Solution = [0,0,0];
  var vec3NormalizedDirection = [0,0,0];
  var vec3ScaledDirection = [0,0,0];
  
  normalizeVector3(vec3NormalizedDirection, vec3Direction);
  
  calcMultScalerToVector3(vec3ScaledDirection, vec3NormalizedDirection, scalerLength);
  calcAddVector3Vector3(vec3Solution, vec3OriginPosition, vec3ScaledDirection);
  
  return vec3Solution;
};

////////////////////////////////////////////////////////////////////////////////
//         3D Engine Functions
////////////////////////////////////////////////////////////////////////////////


//Make a matrix a frustum transformation matrix. Frustum should be centered on
//the origin e.g. left = -right or -1 to 1.
//matrix - destination matrix4
//left, right - bounds of left and right side of frustum. 
//bottom, top - bounds of bottom and top side of frustum.
//zNear, zFar - near and far plane positions.
//NOTE: Frustum matrix is a combination of several transformations. See
//the site below for a good explination.
//http://learnwebgl.brown37.net/08_projections/projections_perspective.html
var projectionApplyFrustum = function(matrix, left, right, bottom, top, zNear, zFar){
  /*
  | 2n/r-l    0         r+l/r-l     0             |
  | 0         2*n/t-b   t+b/t-b     0             |
  | 0         0        -(f+n)/f-n   (2*f*n)/(n-f) |
  | 0         0        -1           0             |
  */
  matrix[0][0] = (2.0 * zNear) / (right - left);
  matrix[0][1] = 0;
  matrix[0][2] = (right + left)/(right - left);
  matrix[0][3] = 0;
    
  matrix[1][0] = 0;
  matrix[1][1] = (2 * zNear)/(top - bottom); 
  matrix[1][2] = (top+bottom) / (top - bottom); 
  matrix[1][3] = 0; 
    
  matrix[2][0] = 0;
  matrix[2][1] = 0;
  matrix[2][2] = (-(zFar + zNear)) / (zFar - zNear);
  matrix[2][3] = (2 * zFar * zNear)/(zNear - zFar);
    
  matrix[3][0] = 0;
  matrix[3][1] = 0;
  matrix[3][2] = -1; 
  matrix[3][3] = 0;
};

//Apply a pespective transformation matrix to the given matrix
//matrix - destination matrix4
//fovy - field of view for the y-axis
//aspect - aspect ratio of the view area. ex. canvas.width/canvas.height
//zNear, zFar - Near and far plane positions.
var projectionApplyPerspective = function(matrix, fovy, aspect, zNear, zFar){
    var bottom = zNear * Math.tan(fovy * (Math.PI / 180.0));
    var right = bottom * aspect;
    //symmetric about the origin.
    var top = -bottom;
    var left = -right;
    
    projectionApplyFrustum(matrix, left, right, top, bottom, zNear, zFar);
};

//Convert given vertex4 from clip space to normalized device coordinates (-1, 1).
//vertex - Source and destination vertex4 to convert. 2D solution stored in x
//and y component of vector.
var convertCliptoNDC = function(vertex){
  vertex[0] = vertex[0] / vertex[3];
  vertex[1] = vertex[1] / vertex[3];
};

//Convert given vertex4 from NDC coordinates to window cordinates (0, canvas.width)
//vertex - Source and destination vertex4 to convert. 2D solution stored in x
//and y component of vector.
//w - width of the view area.
//h - height of the view area.
var convertNDCtoWindow = function(vertex, w, h){
  vertex[0] = (((w / 2) * vertex[0]) + (w / 2));
  vertex[1] = (((h / 2) * vertex[1]) + (h / 2));
};


/* DEBUG: print vector array to console.
var DEBUGprintVectorArrayList = function(list){
    console.log('Vector List Start:');
    for(var i = 0; i < list.length; i++){
        console.log(list[i][0], list[i][1], list[i][2], list[i][3]);
    }
    console.log('Vector List End.');
};
*/



