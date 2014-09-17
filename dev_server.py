#!/usr/bin/env python
import os
import BaseHTTPServer
import time

jsElement = '''
		<script type="text/javascript">
			var DevServer = {
				checkForReloadInterval: 5000, 
				checkForReloadURL: "http://localhost:8080/reload", 
				checkForReload: function (){
					var xhr = new XMLHttpRequest();     
					xhr.open("GET",	DevServer.checkForReloadURL, true);     
					xhr.onload = function(){ if(this.responseText == "true"){ window.location.reload(true); } };     
					xhr.send();
					window.setTimeout(DevServer.checkForReload, DevServer.checkForReloadInterval);
				},
				init: function(){
					DevServer.checkForReload();
				}
			};
			DevServer.init();
		</script>
'''

def listdir(path):
	for r, b, l in os.walk(path):
		for f in l:
			yield os.path.join(r, f)


before = dict ([(f, os.path.getmtime(f)) for f in listdir(os.getcwd())])
def check_for_changes():
	global before
	path = os.getcwd()

	after = dict ([(f, os.path.getmtime(f)) for f in listdir(path)])
	added = [f for f in after if not f in before]
	removed = [f for f in before if not f in after]
	modified = []
	for f in after:	
		if f in before: 
			if not before[f] == after[f]: 
				modified += [f]

	if modified or added or removed:
		before = after
		return True
	else: return False

 

class DevServer(BaseHTTPServer.BaseHTTPRequestHandler):
	def add_to_html_head(self, path, element):
		html_file = open(path).read()
		index = html_file.lower().find("<head>")
		if "var DevServer" in html_file: return html_file
		if index == -1: 
			html_index = html_file.lower().find("</html>")
			if html_index == -1: return html_file + "<html><head>"+element+"</head></html>"
			return html_file[:html_index] + element + html_file[html_index:]
		index += 6;
		return html_file[:index] + element + html_file[index:]

	def add_to_html_body(self, path, element):
		html_file = open(path).read()
		index = html_file.lower().find("</head>")
		if "var DevServer" in html_file: return html_file
		if index == -1: return html_file
		return html_file[:index] + element + html_file[index:]

	def do_GET(self): self.wfile.write(self.do_get())

	def do_get(self):
		path = self.path[1:]
		if len(path) == 0: 
			path = "index.html" 

		if path.endswith(".html"):
			print('get: %s' % self.path)
			return self.add_to_html_head(path, jsElement)

		elif path == "reload":
			return str( check_for_changes() ).lower()

		else:
			if os.path.exists(path): 
				print('get: %s' % self.path)
				return open(path).read()
			else: return "BAD CALL"



if __name__ == '__main__':
	HOST_NAME = ''
	PORT_NUMBER = 8080
	jsElement = jsElement.replace("8080", str(PORT_NUMBER))
	server_class = BaseHTTPServer.HTTPServer 
	httpd = server_class((HOST_NAME, PORT_NUMBER), DevServer)
	print time.asctime(), "Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER)
	try:
		httpd.serve_forever()
	except:
		print('ERROR: ' + e)
	httpd.server_close()
	print time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER)
