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
  tweet.position = processPosition tweet
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
  positive = new RegExp("(happy|glad|positive|excited|Beautiful|Absolutely|Absorbing|Abundance|Ace|Active|Admirable|Adore|Agree|Alert|A1|Alive|Amazing|Appealing|Approval|Aroma|Attraction|Award|Bargain|Beaming|Beats|Beautiful|Best|Better|Bits|Boost|Bounce|Breakthrough|Breezy|Brief|Bright|Brilliant|Brimming|Buy|Care|Certain|Charming|Chic|Choice|Clean|Clear|Colourful|Comfy|Compliment|Confidence|Connoisseur|Cool|Courteous|Coy|Creamy|Crisp|Cuddly|Dazzling|Debonair|Delicate|Delicious|Delightful|Deluxe|Dependable|Desire|Diamond|Difference|Dimple|Discerning|Distinctive|Divine|Dreamy|Drool|Dynamic|Easy|Economy|Ecstatic|Effervescent|Efficient|Endless|Energy|Enhance|Enjoy|Enormous|Ensure|Enticing|Essence|Essential|Exactly|Excellent|Exceptional|Exciting|Exclusive|Exhilaration|Exotic|Expert|Exquisite|Extol|Extra|Eye-catching|Fabled|Fair|Famous|Fantastic|Fashionable|Fascinating|Fab|Fast|Favourite|Fetching|Finest|Finesse|First|Fizz|Flair|Flattering|Flip|Flourishing|Foolproof|Forever|Fragrance|Free|Freshness|Friendly|Full|Fun|Galore|Generous|Genius|Gentle|Giggle|Glamorous|Glitter|Glorious|Glowing|Go-ahead|Golden|Goodness|Gorgeous|Graceful|Grand|Great|Guaranteed|Happy|Healthy|Heartwarming|Heavenly|Ideal|Immaculate|Impressive|Incredible|Inspire|Instant|Interesting|Invigorating|Invincible|Inviting|Irresistible|Jewel|Joy|Juicy|Keenest|Kind|Kissable|K.O.|Know-how|Leads|Legend|Leisure|Light|Lingering|Logical|Longest|Lovely|Lucky|Luscious|Luxurious|Magic|Matchless|Magnifies|love|Maxi|Memorable|Mighty|Miracle|Modern|More|Mouthwatering|Multi|Munchy|Natural|Need|New|Nice|Nutritious|OK|Opulent|Outlasts|Outrageous|Outstanding|Palate|Palatial|Paradise|Pamper|Passionate|Peak|Pearl|Perfect|Pick-me-up|Pleasure|Pleases|Plenty|Plum|Plump|Plus|Popular|Positive|Power|Precious|Prefer|Prestige|Priceless|Pride|Prime|Prize|Protection|Proud|Pure|Quality|Quantity|Quenching|Quick|Quiet|Radiant|Ravishing|Real|Reap|Recommendation|Refined|Refreshing|Relax|Reliable|Renowned|Reputation|Rest|Rewarding|Rich|Right|Rosy|Royal|Safety|Save|Satisfaction|Scores|Seductive|Select|Sensitive|Sensational|Serene|Service|Sexy|Shapely|Share|Sheer|Shy|Silent|Silver|Simple|Singular|Sizzling|Skilful|Slick|Smashing|Smiles|Solar|Smooth|Soft|Sound|Sparkling|Special|Spectacular|Speed|Spicy|Splendid|Spice|Spotless|Spruce|Star|Strong|Stunning|Stylish|Subtle|Success|Succulent|Sun|Superb|Superlative|Supersonic|Supreme|Sure|Sweet|Swell|Symphony|Tan|Tangy|Tasty|Tempting|Terrific|Thoroughbred|Thrilling|Thriving|Timeless|Tingle|Tiny|Top|Totally|Traditional|Transformation|Treat|Treasure|Trendy|True|Trust|Ultimate|Ultra|Unbeatable|Unblemished|Undeniably|Undoubtedly|Unique|Unquestionnably|Unrivalled|Unsurpassed|Valued|Valuable|Vanish|Varied|Versatile|Victor|Vigorous|Vintage|Vital|Vivacious|Warm|Wealth|Wee|Whiz|Whole|Whopper|Winner|Wise|Wonderful|Worthy|Wow!|Youthful)","i");
  negative = new RegExp("(mad|abysmal|adverse|alarming|angry|annoy|anxious|apathy|appalling|atrocious|awful|bad|banal|barbed|belligerent|bemoan|beneath|boring|brokenC|callous|can't|clumsy|coarse|cold|cold-hearted|collapse|confused|contradictory|contrary|corrosive|corrupt|crazy|creepy|criminal|cruel|cry|cutting|dead|decaying|damage|damaging|dastardly|deplorable|depressed|deprived|deformed|deny|despicable|detrimental|dirty|disease|disgusting|disheveled|dishonest|dishonorable|dismal|distress|don't|dreadful|dreary|enraged|eroding|evil|fail|faulty|fear|feeble|fight|filthy|foul|frighten|frightful|gawky|ghastly|grave|greed|grim|grimace|gross|grotesque|gruesome|guilty|haggard|hard|hard-hearted|harmful|hate|hideous|homely|horrendous|horrible|hostile|hurt|hurtful|icky|ignore|ignorant|ill|immature|imperfect|impossible|inane|inelegant|infernal|injure|injurious|insane|insidious|insipid|jealous|junky|lose|lousy|lumpy|malicious|mean|menacing|messy|misshapen|missing|misunderstood|moan|moldy|monstrous|naive|nasty|naughty|negate|negative|never|no|nobody|nondescript|nonsense|not|noxious|objectionable|odious|offensive|old|oppressive|pain|perturb|pessimistic|petty|plain|poisonous|poor|prejudice|questionable|quirky|quit|reject|renege|repellant|reptilian|repulsive|repugnant|revenge|revolting|rocky|rotten|rude|ruthless|sad|savage|scare|scary|scream|severe|shoddy|shocking|sick|sickening|sinister|slimy|smelly|sobbing|sorry|spiteful|sticky|stinky|stormy|stressful|stuck|stupid|substandard|suspect|suspicious|tense|terrible|terrifying|threatening|ugly|undermine|unfair|unfavorable|unhappy|unhealthy|unjust|unlucky|unpleasant|upset|unsatisfactory|unsightly|untoward|unwanted|unwelcome|unwholesome|unwieldy|unwise|upset|vice|vicious|vile|villainous|vindictive|wary|weary|wicked|woeful|worthless|wound|yell|yucky|zero)","i");
  positiveResults = tweet.text.match(positive)
  negativeResults = tweet.text.match(negative)
  tweet.positiveResults = positiveResults
  tweet.negativeResults = negativeResults

  if tweet.text.match(positive)?
    emotions.push "happy"
  else if tweet.text.match(negative)?
    emotions.push "sad"

  return emotions
processPosition = (tweet) ->
  debug "processing position Tweet##{tweet.id}"
  position = {}
  if tweet.geo?
    position.lat = tweet.geo.coordinates[0]
    position.lng = tweet.geo.coordinates[1]
    return position
  else if tweet.coordinates?
    # inverse order of lat lang in coordinates
    position.lat = tweet.coordinates.coordinates[1]
    position.lng = tweet.coordinates.coordinates[0]
    return position
  else if tweet.place?
    # here goes magic stuff. The place holds a bounding-box(BB) with coordinates, simply take the first corner of the BB
    position.lat = tweet.place.bounding_box.coordinates[0][0][1]
    position.lat = tweet.place.bounding_box.coordinates[0][0][2]
    return position






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
filters = { track : "xbox one, battlefield, EU, russia, summer, weather, cake, vacation" , language: "en" }

twitter.stream 'statuses/filter', filters, (stream) ->
  stream.on 'data', onTweeet


