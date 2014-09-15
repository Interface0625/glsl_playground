Shader = {
	gl: null,
	program: null,

	vertexShader: null,
	fragmentShader: null,
	vertexShaderSource: null,
	fragmentShaderSource: null,

	init: function(gl){
	this.gl = gl;

    var request = new XMLHttpRequest();
    request.open('GET', "res/shaders/default.vs", false);  // `false` makes the request synchronous
    request.send(null);
    if (request.status === 200) {
      this.vertexShaderSource = request.responseText;
    }

    request = new XMLHttpRequest();
    request.open('GET', "res/shaders/default.fs", false);  // `false` makes the request synchronous
    request.send(null);
    if (request.status === 200) {
      this.fragmentShaderSource = request.responseText;
    }

    this.vertexShader = this.compileShader(gl.VERTEX_SHADER);
    this.fragmentShader = this.compileShader(gl.FRAGMENT_SHADER);
    this.program = this.createProgram(gl, this.vertexShader, this.fragmentShader);
    this.setAttributes();
    this.setUniforms();
  },
	setAttributes: function(){
    var gl = this.gl;
    var program = this.program;
		gl.useProgram(program);
    // Register Vertex - position, texture uvs, normal
    program.vertexPositionAttribute = gl.getAttribLocation(
    	program, "aVertexPosition");
    gl.enableVertexAttribArray(
      program.vertexPositionAttribute);

    program.textureCoordAttribute = gl.getAttribLocation(
    	program, "aTextureCoord");
    gl.enableVertexAttribArray(
      program.textureCoordAttribute);

    program.vertexNormalAttribute = gl.getAttribLocation(
    	program, "aNormal");
    gl.enableVertexAttribArray(
      program.vertexNormalAttribute);

    // this.program = program; // ?
	},
	setUniforms: function(){
    var gl = this.gl;
    var program = this.program;
		gl.useProgram(program);
		// Register Uniforms - View Matrix, World Matrix, uSampler
	program.pMatrixUniform = gl.getUniformLocation(
			program, "uPMatrix");
    program.mvMatrixUniform = gl.getUniformLocation(
    	program, "uMVMatrix");
    program.samplerUniform = gl.getUniformLocation(
    	program, "uSampler");

    // this.program = program;
	},

  compileShader: function(shaderType) {
    var gl = this.gl;
    var shaderSource = (shaderType == gl.VERTEX_SHADER) ? this.vertexShaderSource : this.fragmentShaderSource; 
    // Create the shader object
    var shader = gl.createShader(shaderType);
    // Set the shader source code.
    gl.shaderSource(shader, shaderSource);
    // Compile the shader
    gl.compileShader(shader);
    // Check if it compiled
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      // Something went wrong during compilation; get the error
      throw "could not compile shader:" + gl.getShaderInfoLog(shader);
    }
    return shader;
  },
  createProgram: function(gl, vertexShader, fragmentShader) {
    // create a program.
    var program = gl.createProgram();

    // attach the shaders.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // link the program.
    gl.linkProgram(program);

    // Check if it linked.
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        // something went wrong with the link
        throw ("program filed to link:" + gl.getProgramInfoLog (program));
    }

    return program;
  }
};

