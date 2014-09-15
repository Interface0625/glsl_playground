//
// Should handle all content loading and mapping.
// 
var logg = function(obj){
	console.log(obj);
};

Content = {
	gl: null,
	images: {},
	meshes: {},
	shaders: {},
	scripts: {},
	json: {},

	init: function(gl){
		this.gl = gl;
	},
	getImage: function(path){
		if(path[0]=='@') { 
			path = path.replace("@", "res/images/"); 
		}
		if(path in this.images){ 
			return this.images[path]; 
		}else{
			return this.loadImage(path)
		}
	},
	loadImage: function(path){
		var texture = this.gl.createTexture();
        texture.image = new Image();
        var gl = this.gl;

        texture.image.onload = function () {
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.bindTexture(gl.TEXTURE_2D, null);
        }
        texture.image.src = path;
        this.images[path] = texture;
        return texture;
	},
	getMesh: function(path){
		if(path[0]=='@') { 
			path = path.replace("@", "res/models/"); 
		}
		if(path in this.meshes){ 
			return this.meshes[path]; 
		}else{
			return this.loadMesh(path);
		}
	},
	loadMesh: function(path){
		var mesh = {};
		var gl = this.gl;
		xhrGet(path, function(){
			mesh["src"] = path;
			mesh["response"] = this.response;
			if(path == "res/models/teapot.json"){
				console.log("teapot loaded");
				Mesh.loadJSON(this.response);
				Mesh.initBuffers(gl);
				mesh["json"] = JSON.parse(this.response);
			}
		});
		this.meshes[path] = mesh;
		return mesh;
	},
	getShader: function(path){
		if(path[0]=='@') { 
			path = path.replace("@", "res/shaders/"); 
		}
		if(path in this.shaders){ 
			return this.shader[path]; 
		}else{
			this.loadShader(path);
		}
	},
	loadShader: function(path){
		var shader = {};
		xhrGet(path, function(){
			shader["src"] = path;
			shader["sourceCode"] = this.response;
			// Process it here:
			// var type = path.split('.').pop();
		});
		this.shaders[path] = shader;
		return shader;
	},
	log: function(obj){ console.log(obj); }
};

/********************************************************************
	getScript: function(path){
		if(path[0]=='@') { path = path.replace("@", "js/"); }
		if(path in this.scripts){ 
			return this.scripts[path]; 
		}else{
			return this.loadScript(path);
		}
	},
	loadScript: function(path){
		var script = {};
		this.xhrGet(path, function(){
			script["src"] = path;
			script["sourceCode"] = this.response;
		});
		this.scripts[path] = script;
		return script;
	},
********************************************************************/
