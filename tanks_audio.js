//tanks_audio.js - Audio generation code
//Sound created with simple synths using Web Audio API
//Audio effects were created by just messing around with values untill
//I got something I liked.
//NOTE: gain in Web Audio API can't ever be 0. It will cause errors.

//https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Web_Audio_API_cross_browser

//New Web Audio API context. Reduce the sample rate to 16000, going lower
//negatively effects the sound of generated audio.
var audioContext = new window.AudioContext({sampleRate:16000});
//Gain values are scaled by audioGlobalGain to act as a global volume control.
var audioGlobalGain = 1;
//With Web Audio API you can't stop an audio generating object later without
//having a reference to it. So store them in an array. 
var voices = new Array();

//create a 0.1 second audio buffer of noise
//https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer
var buffer = audioContext.createBuffer(1, 0.1 * audioContext.sampleRate, audioContext.sampleRate);
//audiobuffers can have multiple channels. We only need one.
var bufferdata = buffer.getChannelData(0);
//for each sample in the buffer
for (var i = 0; i < buffer.length; i++) {
  //Audio data is represented by values from -1 to 1. Generate a random number
  //in that range
  bufferdata[i] = randomFloat(-1, 1);
}

//Generate a simple sound effect. Audio source frequency and gain both have a 
//single exponential ramp from a start value to an end value. If 'noise' is 
//selected as an audio source then oscFreqStart, oscFreqEnd, rampTimeFreq
//sets the operating conditions of a low pass filter that is applied to the
//noise source. All gain values are scaled by audioGlobalGain.
//length - Effect length in seconds.
//oscType - sine, square, triangle, sawtooth, noise - audio source.
//oscFreqStart - Oscillator frequency at the start of the effect. 
//oscFreqEnd - Oscillator frequency at the end of the effect. 
//rampTimeFreq - Time in seconds after the start of the effect to
//target oscFreqEnd.
//gainStart - Gain at the start of the effect.
//gainEnd - Gain at the end of the effect.
//rampTimeGain - Time in seconds after the start of the effect to
//target gainEnd.
//timeOffset - default value: 0 - Time in seconds to wait before playing the
//effect.
//dontStop - default value: false - If true then don't stop the audio source
//after the specified length and let it run untill it is manually stopped.
//note: firefox doesn't play short low frequency oscillators well. Try to make
//effects longer than 0.5 seconds.
var audioGenericRampToEffect = function(length, oscType, oscFreqStart, oscFreqEnd, rampTimeFreq, gainStart, gainEnd, rampTimeGain, timeOffset = 0, dontStop = false){
  //Web Audio API is very finicky and you should be explicit on all data passed
  //into it.
  var now = audioContext.currentTime; //current Web Audio API time
  var audioDataNode = null; //Audio source
  var gainNode = audioContext.createGain();

  //pain in the ass
  if(audioGlobalGain <= 0.0){
    audioGlobalGain = 0.001;
  }
  if(gainStart <= 0.0){
    gainStart = 0.001;
  }
  if(gainEnd <= 0.0){
    gainEnd = 0.001;
  }

  //Noise audio is generated through an audio buffer and all others through
  //an oscillator.
  if(oscType == "noise"){
    //Every audio instance with Web Audio API needs its own/new audio source.
    //You can't stop and restart or replay a source.
    var noiseSource = audioContext.createBufferSource();
    //Unfiltered noise seems harsh to me, use a low pass filter to cut out the
    //high frequency component.
    var biquadFilter = audioContext.createBiquadFilter();
    noiseSource.buffer = buffer;
    //Noise buffer is very short, keep looping through the data.
    noiseSource.loop = true;
    //Low pass filter
    biquadFilter.type = "lowpass";
    biquadFilter.frequency.setValueAtTime(oscFreqStart, now + timeOffset);
    biquadFilter.frequency.exponentialRampToValueAtTime(oscFreqEnd, now + timeOffset + rampTimeFreq);
    //Web audio components are connected together like a (very linear) graph.
    noiseSource.connect(biquadFilter);
    biquadFilter.connect(gainNode);
    audioDataNode = noiseSource;
  } else {
    var oscillatorNode = audioContext.createOscillator();
    oscillatorNode.type = oscType;
    //note: As of writing this, firefox doesn't set with .value as it seems it should. Using setValueAtTime works
    oscillatorNode.frequency.setValueAtTime(oscFreqStart, now);
    oscillatorNode.frequency.exponentialRampToValueAtTime(oscFreqEnd, now + timeOffset + rampTimeFreq);
    oscillatorNode.connect(gainNode);
    audioDataNode = oscillatorNode;
  }
  
  //Effect volume
  gainNode.gain.setValueAtTime((gainStart * audioGlobalGain), now + timeOffset);
  gainNode.gain.exponentialRampToValueAtTime(gainEnd * audioGlobalGain, now + timeOffset + rampTimeGain);
  
  //note: minimizing zero crossing pop of short samples doesn't work in firefox at the current time.
  //it will pop no mater what settings you use.
  //gainNode.gain.setValueAtTime(0.001, now + timeOffset);
  //gainNode.gain.exponentialRampToValueAtTime(gainStart, now + timeOffset + 0.001);
  //gainNode.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + length);
  
  gainNode.connect(audioContext.destination);
  //start the effect
  audioDataNode.start(now + timeOffset);
  //If the effect has a predetermined stop time then set the stop time or else
  //add the effect to the list of running effects.
  if(dontStop === false){
    audioDataNode.stop(now + timeOffset + length);
  } else {
    voices.push(audioDataNode);
  }
};

//Stop all currently running continuous effects.
var stopAudioEffects = function(){
  var now = audioContext.currentTime;
  var len = voices.length;
  //Loop over all effects and stop them now
  for(var i = 0; i < len; i++){
    var currentVoice = voices.pop();
    currentVoice.stop(now);
  }
};

//Gun shot - harsh kunk
var audioPlayShoot = function(gain){
  var audioLength = 0.2; 

  audioGenericRampToEffect(audioLength, 'square', 400, 50, (audioLength*0.5), gain, 0.01, audioLength * 0.5);
  //overlay low frequency noise to make it sound punchier and less consistant
  audioGenericRampToEffect(audioLength, 'noise', 60, 100, (audioLength*0.4), gain, 0.3 * gain, audioLength * 0.5);
};

//Explosion - fast rumble sound
var audioPlayExplosion = function(){
  var audioLength = 0.3;

  audioGenericRampToEffect(audioLength, 'triangle', 2000, 600, (audioLength*0.9), 0.2, 0.001, audioLength);
  audioGenericRampToEffect(audioLength*3, 'noise', 3000, 100, (audioLength*1), 0.5, 0.01, audioLength*3);
};

//Bullet hit but did not destroy
var audioPlayShotDeflection = function(gain){
  var audioLength = 0.3;
  audioGenericRampToEffect(audioLength, 'triangle', 800, 200, audioLength*0.2, 0.5*gain, 0.0001, audioLength*0.9);
  audioGenericRampToEffect(audioLength, 'square', 400, 100, audioLength*0.1, 0.5*gain, 0.0001, audioLength);
};

//Tank engine - Continusly running low rubble
var audioPlayTankEngine = function(){
  var audioLength = 0.2;
  audioGenericRampToEffect(audioLength, 'noise',    100, 100, audioLength, 0.1, 0.1, audioLength,0,true);
  audioGenericRampToEffect(audioLength, 'sine', 60, 80, audioLength, 0.005, 0.05, audioLength,0,true);
};

//Menu move selection - medium pitch soft ting sound
var audioPlayMenuMove = function(){
  var audioLength = 0.08;
  audioGenericRampToEffect(audioLength, 'square', 500, 500, audioLength, 1, 0.0001, audioLength);
};

//Menu selection - high pitch snappy ting sound
var audioPlayMenuSelect = function(){
  var audioLength = 0.5;
  audioGenericRampToEffect(audioLength, 'sawtooth', 800, 800, audioLength, 1, 0.0001, audioLength);
};

//Pickup extra life - bwoooop
var audioPlayWrenchPickUp = function(){
  var audioLength = 0.5;
  audioGenericRampToEffect(audioLength, 'triangle', 300, 800, audioLength, 1, 0.0001, audioLength);
};

//Player hit a tree - buzzy short kunk
var audioPlayTreeHit = function(){
  audioGenericRampToEffect(1.0, 'sine', 1000.430, 60.025, 0.053, 0.3, 0.0001, 0.3);
  audioGenericRampToEffect(1.0, 'sawtooth', 90.430, 90.025, 0.053, 0.3, 0.0001, 0.5);
};

//Best rocket sound I could come up with. Not very good.
var audioPlayRocket = function(){
  var audioLength = 3.5;
  var audioLengthFadeOut = 4.5;
  audioGenericRampToEffect(audioLength*0.5, 'square', 60, 200, (audioLength * 0.8), 0.1, 0.001, audioLength*2,0.5);
  audioGenericRampToEffect(audioLength, 'noise', 2000, 300, (audioLength*1), 0.1, 0.4, audioLength*1,0.5);
  audioGenericRampToEffect(audioLengthFadeOut, 'noise', 300, 300, 2.5, 0.4, 0.001, 2.5, audioLength + 0.5);
};

//Player collided with building.
var audioPlayDroveIntoBuilding = function(){
  var audioLength = 0.5;
  audioGenericRampToEffect(audioLength, 'sawtooth', 80, 190, audioLength, 0.4, 0.0001, audioLength*0.4);
};

//Bullet hit ground or tree.
var audioPlayBulletMiss = function(){
  var audioLength = 0.3;
  audioGenericRampToEffect(audioLength, 'square', 100, 300, audioLength, 0.3, 0.0001, audioLength*0.3);
};


/*
//Debugging function to find interesting sound effects
//plays a sound effect with randomly generated values and dumps
//those values to console.
var debugRandomEffect = function(){
  var length = randomFloat(0.5, 1.5);
  var oscTypeNum = Math.floor(randomFloat(0, 4));
  var oscFreqStart = randomFloat(60,300);
  var oscFreqEnd = randomFloat(60,300);
  var rampTimeFreq = length * Math.random();
  var gainStart = Math.random() + 0.0001;
  var gainEnd = Math.random() + 0.0001;
  var rampTimeGain = length * Math.random()
  var oscType = "sine";
  switch(oscTypeNum){
    case 0: 
      oscType = 'sine';
      break;
    case 1: 
      oscType = 'square';
      break;
    case 2: 
      oscType = 'sawtooth';
      break;
    case 3: 
      oscType = 'triangle';
      break;
  }
  audioGenericRampToEffect(length, oscType, oscFreqStart, oscFreqEnd, rampTimeFreq, gainStart, gainEnd, rampTimeGain);
  console.log("DEBUG: Sound Effect: " + length + ", " + oscType + ", " + oscFreqStart + ", " + oscFreqEnd + ", " + rampTimeFreq + ", " + gainStart + ", " + gainEnd + ", " + rampTimeGain);
}
*/
