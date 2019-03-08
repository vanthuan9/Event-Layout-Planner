"use strict";
const CoatRackGeometry = function(gl, numVertices) {
  this.gl = gl;
  this.numVertices = numVertices; //at least 200 is recommended
  // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

  var vertBuffer = new Float32Array((this.numVertices+1)*3);
  vertBuffer[0] = 0.0;
  vertBuffer[1] = 0.0;
  vertBuffer[2] = 0.5;

  //make this work with indices

  var numLeaves = 6;
  var rotAngle = (2*Math.PI / this.numVertices);
  var i;
  var count = 3;
  for (i = 0; i < 2*Math.PI; i += rotAngle) {
    var x = Math.cos(numLeaves * i) * Math.cos(i);
    var y = Math.cos(numLeaves * i) * Math.sin(i);
    vertBuffer[count] = x;
    vertBuffer[count + 1] = y;
    vertBuffer[count + 2] = .5;
    count += 3;
  }

  gl.bufferData(gl.ARRAY_BUFFER,
    vertBuffer,
    gl.STATIC_DRAW);

  //color buffer
  this.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);

  var colors = new Float32Array((numVertices + 1)*3);

  for (i = 0; i < this.numVertices + 1; i ++) {
    colors[3*i] = 1.0;
    colors[3*i + 1] = 1.0;
    colors[3*i + 2] = .5;
  }

  gl.bufferData(gl.ARRAY_BUFFER,
    colors,
    gl.STATIC_DRAW);

  // allocate and fill index buffer in device memory (OpenGL name: element array buffer)
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

  var indices = new Uint16Array(this.numVertices * 3);
  for(i = 0; i < this.numVertices; i ++) {
    indices[i*3] = 0;
    indices[i*3 + 1] = i + 1;
    indices[i*3 + 2] = (i+2 > numVertices) ? 1: i+2;
  }

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    indices,
    gl.STATIC_DRAW);

  // create and bind input layout with input buffer bindings (OpenGL name: vertex array)
  this.inputLayout = gl.createVertexArray();
  gl.bindVertexArray(this.inputLayout);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  gl.bindVertexArray(null);
};

CoatRackGeometry.prototype.draw = function() {
  const gl = this.gl;

  gl.bindVertexArray(this.inputLayout);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);  

  gl.drawElements(gl.TRIANGLES, 3*this.numVertices, gl.UNSIGNED_SHORT, 0);
};
