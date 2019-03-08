"use strict";
const Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);

  //geometries
  this.triangleGeometry = new TriangleGeometry(gl);
  this.circleGeometry = new CircleGeometry(gl, 90);
  this.chairGeometry = new ChairGeometry(gl);

  this.timeAtLastFrame = new Date().getTime();

  this.position1 = {x:-.4, y:0, z:0};
  this.position2 = {x:.4, y: 0, z: 0};

  this.camera = new OrthoCamera();
  this.cameraPosition = {x : 0, y : 0, z : 0};
  
  //make materials
  this.pinkMaterial = new Material(gl, this.solidProgram);
  this.greenMaterial = new Material(gl, this.solidProgram);
  this.pinkMaterial.solidColor.set(1.0,.4,.5);
  this.pinkMaterial.modelViewProjMatrix.set(new Mat4());
  this.greenMaterial.solidColor.set(.5,1.0,.5);
  this.greenMaterial.modelViewProjMatrix.set(new Mat4());

  //make meshes
  this.greenCircle = new Mesh(this.circleGeometry, this.greenMaterial);

  this.gameObjList = [];
  this.gameObjList.push(new GameObject(this.greenCircle));
};


Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false
  const timeAtThisFrame = new Date().getTime();
  const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

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

  // clear the screen
  gl.clearColor(0.2, .2, 1.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.gameObjList[0].position = this.position1;

  //this.gameObjList[1].position = this.position2;

  this.camera.position = this.cameraPosition
  this.camera.updateViewProjMatrix()

  for(var i = 0; i < this.gameObjList.length; i++){
    this.gameObjList[i].draw(this.camera);
  }

};


