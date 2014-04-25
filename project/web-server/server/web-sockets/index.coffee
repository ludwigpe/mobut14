debug = require('debug') "web-server:web-sockets"
socketIO = require('socket.io')


exports.init = (options = {}) ->
  debug "init"
  io = socketIO.listen options.server
  io.set 'log level', 1


  io.sockets.on 'connection', (socket) ->
    debug "socket connection"

    socket.emit 'news', { hello: 'world' }


