"use strict";
const Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);

  //geometries
  this.triangleGeometry = new TriangleGeometry(gl);
  this.circleGeometry = new CircleGeometry(gl, 90);
  this.chairGeometry = new ChairGeometry(gl);
  this.lampGeometry = new LampGeometry(gl, 90);

  this.timeAtLastFrame = new Date().getTime();

  this.position1 = {x:-.4, y:0, z:0};
  this.position2 = {x:.4, y: 0, z: 0};

  this.camera = new OrthoCamera();
  this.cameraPosition = {x : 0, y : 0, z : 0};

  this.timeAtFirstFrame = new Date().getTime();

  
  //make materials
  this.pinkMaterial = new Material(gl, this.solidProgram);
  this.greenMaterial = new Material(gl, this.solidProgram);
  this.pinkMaterial.primary_color.set(1.0,.4,.5);
  this.pinkMaterial.modelViewProjMatrix.set(new Mat4());
  this.greenMaterial.primary_color.set(.5,1.0,.5);
  this.greenMaterial.modelViewProjMatrix.set(new Mat4());

  this.stripedMaterial = new Material(gl, this.solidProgram);
  this.stripedMaterial.primary_color.set(1.0, 1.0, 1.0);
  this.stripedMaterial.secondary_color.set(.6, .9, .4);
  this.stripedMaterial.modelViewProjMatrix.set(new Mat4());
  this.stripedMaterial.flagsVector.set(1.0, 0.0, 0.0, 0.0);

  this.heartbeatMaterial = new Material(gl, this.solidProgram);
  this.heartbeatMaterial.primary_color.set(1.0, 1.0, 1.0);
  this.heartbeatMaterial.modelViewProjMatrix.set(new Mat4());
  this.heartbeatMaterial.flagsVector.set(0.0, 0.0, 1.0, 0.0);

  this.checkeredMaterial = new Material(gl, this.solidProgram);
  this.checkeredMaterial.primary_color.set(1.0, 1.0, 1.0);
  this.checkeredMaterial.secondary_color.set(.6, .9, .4);
  this.checkeredMaterial.modelViewProjMatrix.set(new Mat4());
  this.checkeredMaterial.flagsVector.set(0.0, 1.0, 0.0, 0.0);  

  //make meshes
  this.heartbeatChair = new Mesh(this.chairGeometry, this.heartbeatMaterial);
  this.greenLamp = new Mesh(this.lampGeometry, this.greenMaterial);
  this.stripedChair = new Mesh(this.chairGeometry, this.stripedMaterial);
  this.checkeredLamp = new Mesh(this.lampGeometry, this.checkeredMaterial);

  this.gameObjList = [];
  this.gameObjList.push(new GameObject(this.heartbeatChair));  
  this.gameObjList.push(new GameObject(this.checkeredLamp));
};


Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  const timeAtThisFrame = new Date().getTime();
  const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
  const elapsedTime = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0;

  this.updateKeysPressed(keysPressed);
  this.clearSceneColor(gl);

  this.gameObjList[0].position = this.position1;

  //this.gameObjList[1].position = this.position2;

  this.camera.position = this.cameraPosition;
  this.camera.updateViewProjMatrix();

  for(var i = 0; i < this.gameObjList.length; i++){
    this.gameObjList[i].draw(this.camera, elapsedTime);
  }

};


Scene.prototype.updateKeysPressed = function(keysPressed) {
  this.updateObjectMovt(keysPressed);
  this.updateCameraMovt(keysPressed);
};

Scene.prototype.updateObjectMovt = function(keysPressed) {
  if(keysPressed.A){
    this.position1.x -= .02;
  }

  if(keysPressed.W){
    this.position1.y += .02;
  } 

  if(keysPressed.S){
    this.position1.y -= .02;
  } 

  if(keysPressed.D){
    this.position1.x += .02;
  } 
};

Scene.prototype.updateCameraMovt = function(keysPressed){
  if(keysPressed.J){
    this.cameraPosition.x -= .02;
  }

  if(keysPressed.I){
    this.cameraPosition.y += .02;
  } 

  if(keysPressed.K){
    this.cameraPosition.y -= .02;
  } 

  if(keysPressed.L){
    this.cameraPosition.x += .02;
  } 

  if(keysPressed.Z){
    this.camera.zoom(0.05);
  }

  if(keysPressed.X){
    this.camera.zoom((-0.05));
  }
};

Scene.prototype.clearSceneColor = function(gl) {
  gl.clearColor(0.2, .2, 1.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};