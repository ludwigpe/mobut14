http    = require './http'
sockets = require './web-sockets'
debug   = require('debug')("web-server")


debug "init started"
http.init()
sockets.init()

