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
  this.pinkMaterial.primary_color.set(1.0,.4,.5);
  this.pinkMaterial.modelViewProjMatrix.set(new Mat4());
  this.pinkMaterial.flagsVector.set(0.0, 0.0, 0.0);

  this.greenMaterial = new Material(gl, this.solidProgram);
  this.greenMaterial.primary_color.set(.5,1.0,.5);
  this.greenMaterial.secondary_color.set(.4, .9, .4);
  this.greenMaterial.modelViewProjMatrix.set(new Mat4());
  this.greenMaterial.flagsVector.set(0.0, 0.0, 0.0);

  this.heartbeatMaterial = new Material(gl, this.solidProgram);
  this.heartbeatMaterial.primary_color.set(1.0, 1.0, 1.0);
  this.heartbeatMaterial.modelViewProjMatrix.set(new Mat4());
  this.heartbeatMaterial.flagsVector.set(0.0, 1.0, 0.0);

  this.checkeredMaterial = new Material(gl, this.solidProgram);
  this.checkeredMaterial.primary_color.set(1.0, 1.0, 1.0);
  this.checkeredMaterial.secondary_color.set(.6, .9, .4);
  this.checkeredMaterial.modelViewProjMatrix.set(new Mat4());
  this.checkeredMaterial.flagsVector.set(1.0, 0.0, 0.0);

  //make meshes
  this.heartbeatChair = new Mesh(this.chairGeometry, this.heartbeatMaterial);
  this.greenLamp = new Mesh(this.lampGeometry, this.greenMaterial);
  this.checkeredLamp = new Mesh(this.lampGeometry, this.checkeredMaterial);

  //make gameObjs
  this.heartChairObj = new GameObject(this.heartbeatChair);
  this.heartChairObj.isSelected = false;

  this.greenLampObj = new GameObject(this.greenLamp);
  this.greenLampObj.isSelected = false;

  this.gameObjList = [];
  this.gameObjList.push(this.heartChairObj);  
  this.gameObjList.push(this.greenLampObj);

  this.selectedObjIndex = 0;
  this.stillPressed = false;
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

  this.gameObjList[this.selectedObjIndex].position = this.position1;

  //this.gameObjList[1].position = this.position2;

  this.camera.position = this.cameraPosition;
  this.camera.updateViewProjMatrix();

  for(var i = 0; i < this.gameObjList.length; i++){
    this.gameObjList[i].draw(this.camera, elapsedTime, (i == this.selectedObjIndex));
  }

};


Scene.prototype.updateKeysPressed = function(keysPressed) {
  this.updateObjectMovt(keysPressed);
  this.updateCameraMovt(keysPressed);
  this.updateSelectKey(keysPressed);
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


Scene.prototype.updateSelectKey = function(keysPressed) {
  if (!this.stillPressed) {
    if (keysPressed.Q) {
      this.stillPressed = true;
      this.selectNewObj();
    }
  }
  this.stillPressed = keysPressed.Q;
};

Scene.prototype.selectNewObj = function() {
  this.selectedObjIndex ++;
  this.selectedObjIndex = this.selectedObjIndex % this.gameObjList.length;
  this.position1 = this.gameObjList[this.selectedObjIndex].position;
}


Scene.prototype.clearSceneColor = function(gl) {
  gl.clearColor(0.2, .2, 1.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};