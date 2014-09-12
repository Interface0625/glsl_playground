
include("js/glMatrix.min.js");
include("js/webgl-utils.js");
include("js/camera.js");

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

}

window.onload = function () {

    var canvas = document.getElementsByTagName("canvas")[0];
    gl = initGL(canvas);
    LOG("WebGl initialized.");
    //var gl = initGL();
    //var canvas = document.getElementsByTagName("canvas")[0];
    Camera.init(canvas);


    cm = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        mode: "javascript",
        theme: "mbo"
    });
    cm.on("change", function(e, o){console.log(o);} );
    LOG("CodeMiror initialized.");
    // begin main loop
    main_loop();
}
