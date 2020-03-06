//tanks_physics.js - Movement calculation for physics objects.

//Initialize physics variables and assign a physics frame function.
var addPhysics = function(object, physicsFunction){
  object.velocity = [0,0,0];
  object.physics = physicsFunction;
}

//Very simple motion integration.
var phyicsSimple = function(){
  var temp = [0,0,0];

  temp[0] = this.velocity[0] * deltaTime;
  temp[1] = this.velocity[1] * deltaTime;
  temp[2] = this.velocity[2] * deltaTime;
  this.translate(temp);
};

//Update physics frame for simple particle effect.
var physicsParticle = function(){
	var tempDisplacement = [0,0,0];
  //particle falls towards the ground
  this.velocity[1] += -9.8 * deltaTime;
  //update displacement
  tempDisplacement[0] = this.velocity[0] * deltaTime;
  tempDisplacement[1] = this.velocity[1] * deltaTime;
  tempDisplacement[2] = this.velocity[2] * deltaTime;
  this.translate(tempDisplacement);
  //Hit the ground plane. Remove the particle from the scene.
  if(this.position[1] < 0.0){
    this.destroy = true;
  }
  //Set the second vertex to the normal of the current velocity.
  //This will point the line particle in the direction it is
  //moving.
  var normVel = [0,0,0];
  normalizeVector3(normVel, this.velocity);
  this.verticies[1][0] = normVel[0];
  this.verticies[1][1] = normVel[1];
  this.verticies[1][2] = normVel[2];
};

//Update physics frame for debris effect.
var physicsParticleDebris = function(){
	var tempDisplacement = [0,0,0];
	//Particle falls towards the ground due to gravity
  this.velocity[1] += -9.8 * deltaTime;
  //update displacement, standard physics
  tempDisplacement[0] = this.velocity[0] * deltaTime;
  tempDisplacement[1] = this.velocity[1] * deltaTime;
  tempDisplacement[2] = this.velocity[2] * deltaTime;
  this.translate(tempDisplacement);
  //Hit the ground plane. Remove the physics function to stop movement.
  if(this.position[1] < 0.0){
    this.physics = null;
  }
  //Rotate the fragment wildly to simulate rotational movement.
  this.rotate((deltaTime * 4), [Math.random(), Math.random(), Math.random()]);
};

//Update physics frame for debris effect.
var physicsParticleSmoke = function(){
	var tempDisplacement = [0,0,0];
  //Update displacement
  tempDisplacement[0] = this.velocity[0] * deltaTime;
  tempDisplacement[1] = this.velocity[1] * deltaTime;
  tempDisplacement[2] = this.velocity[2] * deltaTime;
  this.translate(tempDisplacement);
  //If the smoke particle hits the ground plane then convert its verticle
  //velocity to horizontal velocity and push it in a random direction.
  if(this.position[1] < 0.0){
    var randDirection1 = randomFloat(-1,1);
    var randDirection2 = randomFloat(-1,1);
    this.position[1] = 0.0;
    this.velocity[0] = this.velocity[0] + (this.velocity[1] * randDirection1);
    this.velocity[2] = this.velocity[2] + (this.velocity[1] * randDirection2);
    this.velocity[1] = 0;
  }
  //Rotate towards camera for a billboard effect
  this.lookAt(camPos);
  //Rotate smoke around center, makes it look more dynamic.
  this.rotate((this.currentLifetime * 0.5), [0,0,1]);
  //have the smoke get larger over time so it looks like it's diffusing 
  this.scale[0] = (this.currentLifetime / this.lifetime);
  this.scale[1] = (this.currentLifetime / this.lifetime);
};

var physicsBullet = function(){
	var tempDisplacement = [0,0,0];
	//Wanted the bullets to fly through the air slower while still going a good distance.
	//Using a lower gravity setting
  this.velocity[1] += -4.8 * deltaTime;
  tempDisplacement[0] = this.velocity[0] * deltaTime;
  tempDisplacement[1] = this.velocity[1] * deltaTime;
  tempDisplacement[2] = this.velocity[2] * deltaTime;
  this.translate(tempDisplacement);
};