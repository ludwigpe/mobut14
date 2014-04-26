debug   = require('debug') 'tweet-processor'
Twitter = require 'ntwitter'
config  = require './config'
request = require 'request'
url     = require 'url'

###
  Handels the tweets recived by the streaming api.
###
onTweeet = (tweet) ->
  return if not staticFilter tweet # Bail early if the tweet dosent match our filters.
  debug "receiving Tweet##{tweet.id}"
  if tweet.place?.name?
    debug "got tweet '#{tweet.text}' from #{tweet.place.name}"
  else
    debug tweet

  tweet.emotions = process tweet
  publish tweet

###
  Check if the tweet passes quick and staic filters.
  @return true if the tweet passes the filters
###
staticFilter = (tweet) ->
  return tweet.geo? or tweet.coordinates? or tweet.place? # We really need the geo infomration for this to work.

###
  Process the tweet and determine its emotional state.
  TODO: Improve this ALOT.
  @return an array of emotions.
###
process = (tweet) ->
  debug "processing Tweet##{tweet.id}"

  tracking = filters.track.split ","
  emotions = []

  for word in tracking
    re = new RegExp(word,"i")
    if tweet.text.match(re)?
      emotions.push word

  return emotions

###
  Publish the tweet via http to the web-server. 
###
publish = (tweet) ->
  debug "publishing Tweet##{tweet.id} with emotions #{tweet.emotions}"
  tweet = strip tweet 
  urlString = url.resolve config.webserver.url, "/api/tweet"
  request.post { url : urlString, json: { tweet } }, (err, res) ->
    throw new Error err if err? 
    if res.statusCode isnt 200
      throw new Error "Invalid response code #{res.statusCode}"

###
  Remove unnessesary data to limit data trafic.
###
strip = (tweet) ->
  delete tweet.filter_level
  return tweet


# Setup twitter stream.
twitter = new Twitter config.twitter

#TODO: Improve this ALOT.
filters = { track : "happy,sad" , language: "en" }

twitter.stream 'statuses/filter', filters, (stream) ->  
  stream.on 'data', onTweeet


