
include("js/glMatrix.min.js");
include("js/webgl-utils.js");
include("js/content.js");
include("js/camera.js");
include("js/model.js");
include("js/shader.js")

var LOG = function(msg){
    var to = document.getElementById("TextOutput");
    to.innerHTML = "(" + new Date().toLocaleTimeString() + ") >> " + msg + "<br>" + to.innerHTML;
}

var gl; // GL Context
var cm; // Code Mirror

var lastTime = 0;
function main_loop() {
    window.requestAnimFrame(main_loop);
    var timeNow = new Date().getTime();
    var elapsed = timeNow - lastTime;
    if (lastTime != 0) {
        update(timeNow, elapsed);
        draw(timeNow, elapsed);
    }
    lastTime = timeNow;
}

function update(timeNow, elapsed) {
    Camera.update(elapsed);
}

function draw(timeNow, elapsed) {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    Model.draw(gl, Camera);
}

function initCodemirror(){
    cm = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        mode: "javascript",
        theme: "mbo"
    });
    // Load default fs
    xhrGet("res/shaders/fs.txt", function(){
        cm.doc.setValue(this.responseText);
    });
    // EVENTS:
    //cm.on("change", function(e, o){console.log(o);} );
}

window.onload = function () {
    initCodemirror();

    var canvas = document.getElementsByTagName("canvas")[0];
    gl = initGL(canvas);
    Content.init(gl);
    Model.init(gl);

    Shader.init(gl);

    Camera.init(canvas);

    // begin main loop
    main_loop();
}

