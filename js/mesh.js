var Mesh = {
	vertexPositions: [],
	vertexNormals: [],
	vertexTextureCoords: [],
	indices: [],

	vertexPositionBuffer: null,
	vertexNormalBuffer: null,
	vertexTextureCoordBuffer: null,
	vertexIndexBuffer: null,
	loadJSON: function(txt){
		var obj = JSON.parse(txt);
		this.vertexPositions = obj["vp"];
		this.vertexNormals = obj["vn"];
		this.vertexTextureCoords = obj["vt"];
		this.indices = obj["i"];
	},
	initBuffers: function (gl) {
		if( !this.vertexPositions ||
			!this.vertexNormals ||
			!this.indices ||
			!this.vertexTextureCoords){
			return false;
		}
		// POSITIONS:
		this.vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(
			gl.ARRAY_BUFFER, 
			this.vertexPositionBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER, 
			new Float32Array(this.vertexPositions), 
			gl.STATIC_DRAW);
		this.vertexPositionBuffer.itemSize = 3;
		this.vertexPositionBuffer.numItems = this.vertexPositions.length / 3;
		// NORMALS:
		
		this.vertexNormalBuffer = gl.createBuffer();
		gl.bindBuffer(
			gl.ARRAY_BUFFER, 
			this.vertexNormalBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER, 
			new Float32Array(this.vertexNormals), 
			gl.STATIC_DRAW);
		this.vertexNormalBuffer.itemSize = 3;
		this.vertexNormalBuffer.numItems = this.vertexNormals.length / 3;
		
		// TEXTURE UV:
		this.vertexTextureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(
			gl.ARRAY_BUFFER, 
			this.vertexTextureCoordBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER, 
			new Float32Array(this.vertexTextureCoords), 
			gl.STATIC_DRAW);
		this.vertexTextureCoordBuffer.itemSize = 2;
		this.vertexTextureCoordBuffer.numItems = this.vertexTextureCoords.length / 2;

		// INDICES:
		this.vertexIndexBuffer = gl.createBuffer();
		gl.bindBuffer(
			gl.ELEMENT_ARRAY_BUFFER, 
			this.vertexIndexBuffer);
		gl.bufferData(
			gl.ELEMENT_ARRAY_BUFFER, 
			new Uint16Array(this.indices), 
			gl.STATIC_DRAW);
		this.vertexIndexBuffer.itemSize = 1;
		this.vertexIndexBuffer.numItems = this.indices.length;
	},
    bindBuffers: function(gl, shaderProgram){
    	// POSITIONS:
        gl.bindBuffer(gl.ARRAY_BUFFER, 
        	this.vertexPositionBuffer);
        gl.vertexAttribPointer(
        	shaderProgram.vertexPositionAttribute, 
        	this.vertexPositionBuffer.itemSize, 
        	gl.FLOAT, false, 0, 0);
        // TEXTURE UV:
        gl.bindBuffer(gl.ARRAY_BUFFER, 
        	this.vertexTextureCoordBuffer);
        gl.vertexAttribPointer(
        	shaderProgram.textureCoordAttribute, 
        	this.vertexTextureCoordBuffer.itemSize, 
        	gl.FLOAT, false, 0, 0);
        // NORMALS:
        /*
        gl.bindBuffer(gl.ARRAY_BUFFER, 
        	this.vertexNormalBuffer);
        gl.vertexAttribPointer(
        	shaderProgram.vertexNormalAttribute, 
        	this.vertexNormalBuffer.itemSize, 
        	gl.FLOAT, false, 0, 0);
		*/
        // INDICES:
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, 
        	this.vertexIndexBuffer);
    }
};
