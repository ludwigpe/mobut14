debug = require('debug') "web-server:http"

express = require 'express'

http = require 'http'

setupExpress = (options = {}) ->
  app = express()
  app.set 'port', process.env.PORT or 3000

  http.createServer(app).listen app.get('port'), ->
    debug 'Express server listening on port ' + app.get('port')

  return app

exports.init = (options = {}) ->
  debug "init"
  app = setupExpress options
  return
