debug = require('debug') "web-server:web-sockets"
socketIO = require('socket.io')


exports.init = ({server, eventEmitter}) ->
  debug "init"
  io = socketIO.listen server
  io.set 'log level', 1

  io.sockets.on 'connection', (socket) ->
    debug "socket connection"

    eventEmitter.on "tweet", (tweet) ->
      socket.emit 'tweet', { tweet: tweet }  
