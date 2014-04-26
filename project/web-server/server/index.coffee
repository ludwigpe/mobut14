http    = require './http'
sockets = require './web-sockets'
debug   = require('debug')("web-server")
{ EventEmitter } = require('events')

ServerEventEmitter = new EventEmitter()

debug "init started"
server = http.init({ eventEmitter : ServerEventEmitter })
sockets.init({ server : server, eventEmitter : ServerEventEmitter })

