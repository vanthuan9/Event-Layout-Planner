"use strict";
const CircleGeometry = function(gl, numberVertices) {
  this.gl = gl;
  this.numberVertices = numberVertices;

  // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

  //Create the array of vertices for the circle geometry
  this.vertexBufferArray = new Float32Array((numberVertices+1)*3);
  this.vertexBufferArray[0] = 0.0;
  this.vertexBufferArray[1] = 0.0;
  this.vertexBufferArray[2] = 0.0;
  
  const angleOfTriangle = (2 * Math.PI) / numberVertices;
  var i;
  for (i=1; i<numberVertices+1; i++){
    const angle = i*angleOfTriangle;
    const arrayIndex = i*3;
    this.vertexBufferArray[arrayIndex] = Math.cos(angle);
    this.vertexBufferArray[arrayIndex +1] = Math.sin(angle);
    this.vertexBufferArray[arrayIndex +2] = 0.0;
  }

  gl.bufferData(gl.ARRAY_BUFFER, this.vertexBufferArray, gl.STATIC_DRAW);

  // allocate and fill index buffer in device memory (OpenGL name: element array buffer)
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

  this.indexBufferArray = new Uint16Array(numberVertices*3);

  for (i=0; i<numberVertices; i++){
    const arrayIndex = i*3;
    this.indexBufferArray[arrayIndex] = 0;
    this.indexBufferArray[arrayIndex+1] = i+1;
    this.indexBufferArray[arrayIndex+2] = (i+2 > numberVertices) ? 1: i+2;
  }

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexBufferArray, gl.STATIC_DRAW);

  // create and bind input layout with input buffer bindings (OpenGL name: vertex array)
  this.inputLayout = gl.createVertexArray();
  gl.bindVertexArray(this.inputLayout);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);//Questionable code
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,
    3, gl.FLOAT, //< three pieces of float per posision
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );


  gl.bindVertexArray(null);
};

CircleGeometry.prototype.draw = function() {
  const gl = this.gl;

  gl.bindVertexArray(this.inputLayout);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);  

  gl.drawElements(gl.TRIANGLES, (this.numberVertices*3), gl.UNSIGNED_SHORT, 0);
};
