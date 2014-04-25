debug = require('debug') "web-server:http"
express = require 'express'
assets = require 'connect-assets'

http = require 'http'
path = require 'path'

setupExpress = (options = {}) ->
  app = express()
  app.use assets({
    paths : [
      path.resolve(__dirname,'../../client/assets/js'),
      path.resolve(__dirname,'../../client/assets/css'),
    ]
  })

  app.set 'views', path.resolve(__dirname,'../../client/views')
  app.set 'view engine', 'jade'
  app.set 'port', process.env.PORT or 3000

  app.get '/', (req, res) ->
    res.render "index"

  http.createServer(app).listen app.get('port'), ->
    debug 'Express server listening on port ' + app.get('port')

  return app

exports.init = (options = {}) ->
  debug "init"
  app = setupExpress options
  return
