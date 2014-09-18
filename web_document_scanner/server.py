#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import sys
import BaseHTTPServer
import time
import json
import thread

# sys.path.insert(0, '/mnt/data/Code/python/lkserv/src/tools')
# import scanimage
class test():
	def scan(self):
		time.sleep(30)
		return ["scans/testImg.png", "scans/testImg.png", "scans/testImg.png"]

scanimage = test()


BUSY = False






def performscan(idx):
	global BUSY
	images = scanimage.scan();
	result = {"urls": []}
	for i in images:
		result["urls"] += [i]
	open("ids/" + idx, "w").write(json.dumps(result))
	BUSY = False

def scan():
	global BUSY
	if BUSY: return "busy"
	BUSY = True
	idx = str(time.time())
	#performscan(idx)
	thread.start_new_thread(performscan, (idx,))
	return idx

class DevServer(BaseHTTPServer.BaseHTTPRequestHandler):
	def scan(self):
		return scan();

	def getJSON(self, idx):
		print("Requested file: ids/"+idx)
		fname = "ids/"+idx
		if os.path.exists(fname): return open(fname).read()
		else: return "{}"

	def getLastScan(self):
		pass

	def getLast5(self):
		pass

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
		elif path.startswith("thumbs/"):
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



