http    = require './http'
sockets = require './web-sockets'
debug   = require('debug')("web-server")


debug "init started"
server = http.init()
sockets.init({ server : server })

