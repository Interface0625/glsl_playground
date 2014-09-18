// web_document_scanner.js

// TOOLS:


var View = {
	addImage: function(url){
		var img = document.createElement("img");
		img.src = url;
		document.body.appendChild(img);
	}
}

function xhrGet(reqUri, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", reqUri, false);
    xhr.onload = callback;
    xhr.send();
}


// SCANNER:

var Scanner = {
	scanGetDelay: 1000,
	initialScanGetDelay: 1000,
	scan: function(){
		console.log("GET:http://localhost:8080/scan");
		xhrGet("http://localhost:8080/scan", function(){
			console.log(this.responseText);
			var id = this.responseText;
			if( id == "busy" ){
				return "busy";
			}else{
				setTimeout(
					Scanner.requestById,
					Scanner.initialScanGetDelay,
					id);
			}

		});
	},
	requestById: function(id){
		console.log("GET:http://localhost:8080/reqScan?"+id);
		xhrGet("http://localhost:8080/reqScan?"+id, function(){
			console.log(this.responseText);
			if(this.responseText == "{}"){ 
				setTimeout(
					Scanner.requestById, 
					Scanner.scanGetDelay, 
					id); 
			}else{
				var scannedImages = JSON.parse(this.responseText);
				console.log(scannedImages);
				for(var i = 0; i < scannedImages["urls"].length;i++){
					View.addImage(scannedImages["urls"][i]);
				}
			}
		});
	}
}
Scanner.scan();