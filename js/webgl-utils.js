
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();

function initGL(canvas) {
    if (!canvas){
      canvas = document.createElement("canvas");        
      canvas.style.width="100%";
      canvas.style.height="100%";

      body = document.getElementsByTagName("body")[0];
      body.style.margin = "0px";
      body.style.padding = "0px";
      body.appendChild(canvas);
    }
    canvas.width=512;
    canvas.height=512;
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.enable(gl.DEPTH_TEST);
    if (!gl) { alert("Could not initialise WebGL"); }
    return gl;
}
