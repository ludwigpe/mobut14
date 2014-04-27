

var socket = io.connect('http://localhost');
socket.on('tweet', function (data) {

  console.debug("Got tweet", data.tweet);
  var tweets = document.getElementById("tweets");
  var item = document.createElement("li");
  item.innerHTML = data.tweet.text;
  item.setAttribute("class",data.tweet.emotions[0]);
  tweets.insertBefore(item, tweets.firstChild);
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
  console.log("tjena");
  var mapOptions = {
    zoom: 2,
    center: new google.maps.LatLng(44.0428154, 1.7936342)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  /*var fakeTweet = {};
  fakeTweet.emotions = [];
  fakeTweet.emotions.push("happy");
  fakeTweet.position = {};
  fakeTweet.position.lat = 59.344671;
  fakeTweet.position.lng = 18.061951;
  addMarker(fakeTweet);*/

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

google.maps.event.addDomListener(window, 'load', initialize);
