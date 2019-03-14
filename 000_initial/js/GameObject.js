"use strict"; 
const GameObject = function(mesh) { 
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0); 
  this.orientation = 0; 
  this.scale = new Vec3(1, 1, 1); 

  this.modelMatrix = new Mat4(); 
};

GameObject.prototype.draw = function(camera, elapsedTime, isSelected) {

	this.mesh.material.elapsedTime.set(elapsedTime);

	this.mesh.material.selectUniform.set(isSelected);

	this.updateModelMatrix();

	var viewMat = this.modelMatrix.mul(camera.viewProjMatrix);

	this.mesh.material.modelViewProjMatrix.set(viewMat);

	this.mesh.draw();
}

GameObject.prototype.updateModelMatrix = function() {
	this.modelMatrix.set();
	this.modelMatrix.scale(this.scale);
	this.modelMatrix.rotate(this.orientation);
	this.modelMatrix.translate(this.position);
}
