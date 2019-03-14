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

  //this.selectedPos = {x:0, y:0, z:0};

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

  this.selectedObjIndexList = [0, 1];
  this.tabStillPressed = false;
  this.mStillPressed = false;
  this.multiSelectMode = false;
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

  if(this.gameObjList.length != 0) {

    this.camera.position = this.cameraPosition;
    this.camera.updateViewProjMatrix();

    for(var i = 0; i < this.gameObjList.length; i++){
      this.gameObjList[i].draw(this.camera, elapsedTime, (this.selectedObjIndexList.includes(i)));
    }
  }

};


Scene.prototype.updateKeysPressed = function(keysPressed) {
  if(this.gameObjList.length != 0) {
    this.updateObjectMovt(keysPressed);
    this.updateCameraMovt(keysPressed);
    this.updateTabKey(keysPressed);
    this.updateShiftKey(keysPressed);
    this.updateDelKey(keysPressed);
  }
};

Scene.prototype.updateObjectMovt = function(keysPressed) {
  this.selectedPos = new Vec3(0, 0, 0);
  if(keysPressed.A){
    this.selectedPos.x -= .02;
  }

  if(keysPressed.W){
    this.selectedPos.y += .02;
  } 

  if(keysPressed.S){
    this.selectedPos.y -= .02;
  } 

  if(keysPressed.D){
    this.selectedPos.x += .02;
  } 

  for (var i = 0; i < this.selectedObjIndexList.length; i++){
      this.gameObjList[this.selectedObjIndexList[i]].position.add(this.selectedPos);
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


Scene.prototype.updateTabKey = function(keysPressed) {
  if (!this.tabStillPressed) {
    if (keysPressed.TAB) {
      this.tabStillPressed = true;
      var nextObj = this.selectedObjIndexList[0] + 1;
      nextObj = nextObj % this.gameObjList.length;
      if (!this.multiSelectMode){
        this.selectedObjIndexList = [];
      }
      this.selectNewObj(nextObj);
    }
  }
  this.tabStillPressed = keysPressed.TAB;
};

Scene.prototype.selectNewObj = function(index) {
   this.selectedObjIndexList.push(index);
};

Scene.prototype.updateShiftKey = function(keysPressed) {
   this.multiSelectMode = keysPressed.SHIFT;
};


Scene.prototype.updateDelKey = function(keysPressed) {
  if (!this.mStillPressed) {
    if (keysPressed.M) {
      this.mStillPressed = true;
      this.delObj();
    }
  }
  this.mStillPressed = keysPressed.M;
};

Scene.prototype.delObj = function() {

  for(var i = 0; i < this.selectedObjIndexList.length; i++) {
    var delIndex = this.selectedObjIndexList[0];
    this.selectedObjIndexList.splice(0,1);
    this.gameObjList.splice(delIndex, 1);
    for (var j = 0; j < this.selectedObjIndexList.length; j++) {
      if(this.selectedObjIndexList[j] >= delIndex) {
        this.selectedObjIndexList[j]--;
      }
    }
  }

  this.selectedObjIndexList = [0];
};


Scene.prototype.clearSceneColor = function(gl) {
  gl.clearColor(0.2, .2, 1.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};