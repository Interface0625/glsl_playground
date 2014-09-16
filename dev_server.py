#!/usr/bin/env python
import os
import BaseHTTPServer
import time

checkForReloadElement = '''
		<script type="text/javascript">
		var DevReloadURL = "http://localhost:8080/reload";
		var DevReloadInterval = 5000;
		var DevServerCheckForReload = function (){
			var xhr = new XMLHttpRequest();
			xhr.open("GET", DevReloadURL, true);
			xhr.onload = function(){
				if (this.responseText == "true"){ 
					window.location.reload(true); 
				}
			};
			xhr.send();

			window.setTimeout(DevServerCheckForReload, DevReloadInterval);
		}
		DevServerCheckForReload();
		</script>
	'''

before = None
def check_for_changes(path):
	global before
	if before == None: 
		print("initializing first filelist...")
		before = dict ([(f, os.path.getmtime(f)) for f in os.listdir(path)])

	after = dict ([(f, os.path.getmtime(f)) for f in os.listdir(path)])
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
	def insert_in_head(self, html_file, element):
		if "DevServerCheckForReload" in html_file: return html_file
		index = html_file.lower().find("</head>")
		if index == -1: return html_file
		return html_file[:index] + element + html_file[index:]

	def do_GET(self):
		self.wfile.write(self.do_get())

	def do_get(self):
		path = self.path[1:]
		if len(path) == 0: 
			path = "index.html" 

		if path.endswith(".html"):
			print('get: %s' % self.path)
			return self.insert_in_head(
				open(path).read(), 
				checkForReloadElement)

		elif path == "reload":
			return str( check_for_changes('./') ).lower()

		else:
			if os.path.exists(path): 
				print('get: %s' % self.path)
				return open(path).read()
			else: return "BAD CALL"



if __name__ == '__main__':
	HOST_NAME = ''
	PORT_NUMBER = 8080

	server_class = BaseHTTPServer.HTTPServer 
	httpd = server_class((HOST_NAME, PORT_NUMBER), DevServer)
	print time.asctime(), "Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER)
	try:
		httpd.serve_forever()
	except:
		print('ERROR: ' + e)
	httpd.server_close()
	print time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER)
