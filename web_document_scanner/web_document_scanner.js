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
    xhr.open("GET", reqUri, true);
    xhr.onload = callback;
    xhr.send();
}


// SCANNER:

var Scanner = {
	scanGetDelay: 10000,
	initialScanGetDelay: 5000,
	scan: function(){
		xhrGet("http://localhost:8080/scan", function(){
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
		console.log("ID:" + id);

		xhrGet("http://localhost:8080/reqScan?"+id, function(){
			console.log(this.responseText);
			if(this.responseText == "{}"){ 
				setTimeout(
					Scanner.requestById, 
					Scanner.scanGetDelay, 
					id); 
			}else{
				var scannedImages = JSON.parse(this.responseText);
				for(var i = 0; i < scannedImages["url"].length;i++){
					View.addImage(scannedImages["url"][i]);
				}
			}
		});
	}
}
Scanner.scan();