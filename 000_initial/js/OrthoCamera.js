const OrthoCamera = function() { 
  this.position = new Vec2(0, 0); 
  this.rotation = 0; 
  this.windowSize = new Vec2(2, 2); 
  this.ar = 1;
  
  this.viewProjMatrix = new Mat4(); 
  this.updateViewProjMatrix(); 
};

OrthoCamera.prototype.updateViewProjMatrix = function(){ 
  this.viewProjMatrix.set(). 
    scale(0.5). 
    scale(this.windowSize). 
    rotate(this.rotation). 
    translate(this.position). 
    invert(); 
}; 

OrthoCamera.prototype.setAspectRatio = function(ar) 
{ 
  this.windowSize.x = this.windowSize.y * ar;
  this.ar = ar;
  this.updateViewProjMatrix();
}; 

OrthoCamera.prototype.zoom = function(distanceY) {
  const distanceX = distanceY * this.ar;
   
  this.windowSize.x = this.windowSize.x - distanceX;
  this.windowSize.y = this.windowSize.y - distanceY;

  const screenDistance = new Vec4(distanceX, distanceY, 0, 1);
  const realDistance = screenDistance.mul(this.viewProjMatrix.invert());
  this.position = this.position + realDistance;

  this.updateViewProjMatrix();
};

