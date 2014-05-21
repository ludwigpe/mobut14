var socket = io.connect('http://localhost');

socket.on('tweet', function (data) {
  console.debug("Got tweet", data.tweet);

  createTweetElement(data)
  addMarker(data.tweet);
});

var icons = {
  happy: {
    url: 'img/icons/happy.png',
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)
  },
  sad: {
    url: 'img/icons/sad.png',
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)
  },
  neutral: {
    url: 'img/icons/neutral.png',
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)
  }
};

var map;
function initialize() {
  //uncomment for mockup IO
  //mockupSocket();
  var mapOptions = {
    zoom: 2,
    center: new google.maps.LatLng(44.0428154, 1.7936342)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

function createTweetElement(data){

  var ul = $("#tweets");

  var li = $("<li>").hide()
    .addClass("list-group-item")
    .addClass(data.tweet.emotions[0])
    .html(data.tweet.text)
      //attributes below needed for a potential tooltip
      .attr("data-toggle", "tooltip")
      .attr("data-placement", "top")
      .attr("title", data.tweet.text);

  li.append($("<hr/>"));
  
  var badges = $("<div>");

  //moment badge
  //TODO: replace date with tweet date
  var now = moment("2014-02-32").fromNow();
  badges.append(
    $("<span>")
      .addClass("badge")
      .html(now)
  );

  //emotion badge
  badges.append(
    $("<span>")
      .addClass("badge")
      .addClass("emotion")
      .addClass("pull-right")
      .html(data.tweet.emotions[0])
  );

  li.append(badges);

  //init the tooltip
  //li.tooltip();

  ul.prepend(li.show("slow"));
}

function addMarker(tweet) {
  var emoticon = null
  var emotion;
  if (tweet.emotions[0] != null) {
    emotion = tweet.emotions[0];
    console.log(emotion);
    emoticon  = icons[emotion];
  } else {
    emoticon = icons.neutral;
  }
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(tweet.position.lat, tweet.position.lng),
    icon: emoticon,
    map: map,
    draggable:false,
    animation:google.maps.Animation.DROP,
  });
}

function mockupSocket(){

  var emotions = ["happy", "sad", "neutral"];
  var positions = {
    lat: 59.344671,
    lng: 18.061951,
  };

  var fakeTweets = [];
  var fakeTweet = [];
  fakeTweet = [];
  fakeTweet.emotions = [];
  fakeTweet.emotions.push(emotions[Math.floor(Math.random()*emotions.length)]);
  fakeTweet.position = {};
  fakeTweet.position.lat = 59.344671;
  fakeTweet.position.lng = 18.061951;
  fakeTweet.text = "I am a tweet. I have exactly 140 characters. If you want to make sure that I only have 140 characters you can check for yourself. 0123456789″";
  var data = {};
  data.tweet = fakeTweet;

  createTweetElement(data);
  
  setTimeout(function(){
      mockupSocket();
  }, 3000);
}


google.maps.event.addDomListener(window, 'load', initialize);
