include("js/mesh.js");
Model = {
	mesh: null,
	texture: null,
	shader: null,

	init: function(){
		Content.getMesh("@teapot.json");
		this.mesh = Mesh;
		this.texture = Content.getImage("@default.gif")
		this.shader = Shader;
	},
	draw: function (gl, camera) {
    	// TEXTURE:
    	
		gl.useProgram(this.shader.program);
			
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(this.shader.program.samplerUniform, 0);
		// LIGHTS:

		// CAMERA SETUP:
        var perspective = camera.perspectiveMatrix;
        var view = camera.viewMatrix;
        gl.uniformMatrix4fv(this.shader.program.pMatrixUniform, false, perspective);
        gl.uniformMatrix4fv(this.shader.program.mvMatrixUniform, false, view);


        this.mesh.bindBuffers(gl, this.shader.program);

        gl.drawElements(
        	gl.TRIANGLES, 
        	this.mesh.vertexIndexBuffer.numItems, 
        	gl.UNSIGNED_SHORT, 
        	0);
    }
}