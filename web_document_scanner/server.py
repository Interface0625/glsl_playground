#!/usr/bin/env python
import os
import BaseHTTPServer
import time


class DevServer(BaseHTTPServer.BaseHTTPRequestHandler):
	def scan(self):
		return "firstScan";

	def getJSON(self, idx):
		print("ids/"+idx)
		fname = "ids/"+idx
		if os.path.exists(fname): return open(fname).read()
		else: return "{}"

	def do_GET(self): self.wfile.write(self.do_get())

	def do_get(self):
		print(self.path)
		path = self.path[1:]
		if len(path) == 0: 
			return open("index.html").read() 

		elif path == "scan":
			return self.scan();
		elif path.startswith("reqScan?"):
			return self.getJSON(path.split("?")[-1])
		elif path == "web_document_scanner.js":
			return open("web_document_scanner.js").read()
		elif path.startswith("scans/"):
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



