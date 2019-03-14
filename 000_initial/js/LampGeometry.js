"use strict"
const LampGeometry = function(gl, numberVertices) {
	this.gl = gl;
	this.numberVertices = numberVertices;

	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

	//fill out vertexBuffer
	const l = 0.5;
	const a = 0.5;
	const b = 0.5;
	//Create the array of vertices for the circle geometry
	this.vertexBufferArray = new Float32Array((numberVertices+1)*3);
	this.vertexBufferArray[0] = 1.0;
	this.vertexBufferArray[1] = 0.0;
	this.vertexBufferArray[2] = 0.0;

	const angleOfVertex = (2 * Math.PI) / numberVertices;
	var i;
	for (i=1; i<numberVertices+1; i++){
		const angle = i*angleOfVertex;
		const arrayIndex = i*3;
		this.vertexBufferArray[arrayIndex] = 
			l*Math.cos(angle) + (a + b*Math.cos(angle)) * Math.cos(angle);
		this.vertexBufferArray[arrayIndex +1] = 
			(a + b*Math.cos(angle)) * Math.sin(angle);
		this.vertexBufferArray[arrayIndex +2] = 0.0;
	}

	gl.bufferData(gl.ARRAY_BUFFER, this.vertexBufferArray, gl.STATIC_DRAW);


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

	this.inputLayout = gl.createVertexArray();
	gl.bindVertexArray(this.inputLayout);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0,
		3, gl.FLOAT,
		false,
		0,
		0
	);

	gl.bindVertexArray(null);
};

LampGeometry.prototype.draw = function() {
	const gl = this.gl;

	gl.bindVertexArray(this.inputLayout);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

	gl.drawElements(gl.TRIANGLES, (this.numberVertices *3), gl.UNSIGNED_SHORT, 0);
}