debug   = require('debug') "web-server:http"
express = require 'express'
assets  = require 'connect-assets'
http    = require 'http'
path    = require 'path'
bodyParser     = require('body-parser')


eventEmitter = {}


setupExpress = (options = {}) ->
  app = express()
  app.use bodyParser()
  app.use assets({
    paths : [
      path.resolve(__dirname,'../../client/assets/js'),
      path.resolve(__dirname,'../../client/assets/css'),
    ]
  })
  app.use '/img', express.static(path.resolve(__dirname,'../../client/assets/img'))
  app.set 'views', path.resolve(__dirname,'../../client/views')
  app.set 'view engine', 'jade'
  app.set 'port', process.env.PORT or 3000

  app.get '/', (req, res) ->
    res.render "index"

  app.post '/api/tweet', (req, res) ->
    debug "Got tweet from TweetProcessor"
    eventEmitter.emit "tweet", req.body.tweet
    res.send 200

  server = http.createServer(app)
  server.listen app.get('port'), ->
    debug 'Express server listening on port ' + app.get('port')

  return server

exports.init = (options = {}) ->
  debug "init"
  eventEmitter = options.eventEmitter

  server = setupExpress options
  return server
