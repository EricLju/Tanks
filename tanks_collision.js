//tanks_collision.js - Handles object3D-object3D collisions. Actual collision
//detection code is in tanks_main.js and these are functions run when a hit
//is detected. 

//AI tank collision
//other - other object3D colliding with this one.
var onHitTank = function(other){
  //Any bullet.
  if(other.type == "bullet"){
    //Player bullet.
    if(other.owner.type == "player"){
      //Health for AI is from 0 to 1.0. Randomly reduce the health each hit
      //to add variability to number of hits to kill. Range of 0 to 2 was
      //selected by just what felt like a good number for gameplay.
      this.health -= randomFloat(0, 2);
      //Health fell below 0, destroy AI tank.
      if(this.health <= 0.0){
        //10 points for each tank kill.
        window.playerScore += 10;
        listEnemyTanks.remove(this);
        this.destroy = true;
        createDebrisEffect(other.position, 5, 10, 0.1, 5);
        audioPlayExplosion();
      } else {
        //Hit but didn't kill.
        audioPlayShotDeflection(1);
      }
    }
    //Hit by another AI tanks bullet. No friendly fire.
    createSplashEffect(other.position, 10, 10, .3);
  }
  
};

//Player tank collision.
//other - other object3D colliding with this one.
var onHitPlayerTank = function(other){
  //Buildings and trees block the players movement
  if((other.type == "building") || (other.type == "tree")){
    this.copyPosition(this.lastPosition);
  }

  //Player hit by AI bullet
  if(other.type == "bullet"){
    if(other.owner.type == "aitank"){
      //Health for the player is in discrete integers.
      this.health--;
      if(this.health == 0){
        this.onHit = null;
        audioPlayExplosion();
      } else {
        createSplashEffect(other.position, 10, 10, .3);
        audioPlayShotDeflection(1);
      }
    }
  }
  //Wrenches give an extra life
  if(other.type == "wrench"){
    this.health++;
    audioPlayWrenchPickUp();
  }
};

//Missile platform hit.
//other - other object3D colliding with this one.
var onHitMissleLauncher = function(other){
  
  if(other.type == "bullet"){
    if(other.owner.type == "player"){
      //100 base points for killing the missile launcher. Reduced for each
      //AI tank that is still alive. This is to reduce the attempt to sprint to
      //the missile launcher while avoiding engaging AI tanks.
      window.playerScore += 100 - (listEnemyTanks.length * 10);
      //Change the max number of enemys for every missile launcher kill to
      //add variability to gameplay.
      maxNumberOfEnemies = Math.round(randomFloat(3,6));
      this.destroy = true;
      this.missile.destroy = true;
      //Only ever one missile launcher at a time in play.
      currentMissile = null;
      //Big chunks and splash at the same time for a big explosion
      createDebrisEffect(other.position, 7, 20, 0.2, 5);
      createSplashEffect(other.position, 20, 30, .8);
      //Destroy all enemy tanks. This way new tanks spawn at the new missile
      //launcher location.
      listEnemyTanks.runFunction(destroyEnemyTanks);
      //Drop a wrench/extra life.
      //Calculate probability of dropping a wrench based on the number of lives
      //the player currently has. The closer the player is to death the higher
      //the probability of dropping a wrench.
      var tempProbability = 0.66;
      if(other.owner.lives == 1){
        tempProbability = 0.50;
      } else if (other.owner.lives == 2) {
        tempProbability = 0.66;
      } else {
        tempProbability = 0.90;
      }
      //Only one wrench on the play area at a time. Player has to pick up the
      //old one for any new ones to be created.
      if((object3dWrenchExtraLife == null) && (Math.random() > tempProbability)){
        object3dWrenchExtraLife = new object3D(vertsWrench, indWrench);
        object3dWrenchExtraLife.position = this.position;
        object3dWrenchExtraLife.scale = [0.3,0.2,0.2];
        object3dWrenchExtraLife.type = "wrench";
        object3dWrenchExtraLife.onHit = onHitWrench;
        object3dWrenchExtraLife.hitSize = 3;
        objectLL.push(object3dWrenchExtraLife);
      }
      
      audioPlayExplosion();
    }
  }
};

//Buildings
//other - other object3D colliding with this one.
var onHitBuilding = function(other){
  if(other.type == "bullet"){
    if(other.owner.type == "player"){
      //small particle splash and small chuncks like bits are being knocked off.
      createSplashEffect(other.position, 10, 10, .3);
      createDebrisEffect(other.position, 5, 10, 0.1, 5);
      this.health -= 1;
      if(this.health <= 0){
        //blow up the buillding. Large boulders of debris.
        var tempPosition = [this.position[0], this.position[1] + this.scale[1], this.position[2]];
        createDebrisEffect(tempPosition, 5, 10, 0.5, 20);
        this.destroy = true;
        audioPlayExplosion();
      } else {
        audioPlayShotDeflection(0.5);
      }
    }
  }

  //Player drove into building
  if(other.type == "player"){
    //this.lastCollision isn't initialized anywhere, if it's undefined its the
    //first hit.
    if(this.lastCollision == undefined){
      audioPlayDroveIntoBuilding();
      this.lastCollision = currentTime;
    }
    //Calculate the time since last collision. If it's greater than one second
    //then we consider it a new individual hit.
    var deltaCollision = currentTime - this.lastCollision; //result in msec
    if(deltaCollision > (1*1000)){
      audioPlayDroveIntoBuilding();
    }
    this.lastCollision = currentTime;
  }

};

//Tree
//other - other object3D colliding with this one.
var onHitTree = function(other){
  
  //Only check if a player has hit the tree. Use the tree health value to
  //detect the first hit as the collision will be triggered each frame until
  //the tree is deleted. 
  if(other.type == "player" && this.health > 0){
    //Create a "leaf" debris for every whole interger on the y-axis. Makes it
    //look better if they are falling from the whole height of the tree rather
    //then a single point.
    for(var i =0; i <= (this.scale[1] * 2); i++){
      createDebrisEffect([this.position[0], i, this.position[2]], 1, 5, 0.05, 10);
    }
    
    this.health = 0;
    //Instead of destroying the tree right away, Keep it around for a short bit
    //to offer some push back to the player trying to run it over.
    this.lifetime = 0.1;

    //Add another tree so the map doesn't become bare.
    generateRandomTrees(1);

    audioPlayTreeHit();
  }

  //Tree just absorbs the bullet, drops leaves.
  if(other.type == "bullet"){
    //Drop leaves from 3/4 the way up the tree and from the bullet impact position.
    var tempPosition1 = [this.position[0], ((this.scale[1] * 2) * 0.75), this.position[2]];
    createDebrisEffect(tempPosition1, 1, 3, 0.05, 5);
    createDebrisEffect(other.position, 2, 3, 0.05, 5);
    audioPlayBulletMiss();
  }

};

//Wrench/Extra Life
//other - other object3D colliding with this one.
var onHitWrench = function(other){
  //Handle the extra life in the player collision function.
  if(other.type == "player"){
    object3dWrenchExtraLife = null;
    this.destroy = true;
  }
};

//Bullet, AI and Player
//other - other object3D colliding with this one.
var onHitBullet = function(other){
  this.destroy = true;
  
  //hit the ground, do a small whimpy splash effect like kick up of dirt
  if(other == "ground"){
  	createSplashEffect(this.position, 5, 7, 1);
    audioPlayBulletMiss();
  }
};