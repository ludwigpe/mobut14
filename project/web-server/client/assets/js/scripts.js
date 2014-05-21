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
var num_happy = 0;
var num_sad = 0;
var num_neutral = 0;
var map;
function initialize() {
  //uncomment for mockup IO
  //mockupSocket();
  var mapOptions = {
    zoom: 3,
    center: new google.maps.LatLng(44.0428154, 1.7936342),
    styles: [{"featureType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"lightness":-100}]}],
    streetViewControl: false,
    mapTypeControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP

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

  // ul.prepend(li.show("slow"));
}

function addMarker(tweet) {
  var emoticon = null
  var emotion;
  var info = $("<div>").append(
            $("<strong>").text(tweet.text));


  var labelClass;
  console.log(tweet.text);
  if (tweet.emotions[0] != null) {
    emotion = tweet.emotions[0];
    emoticon  = icons[emotion];
    if(emotion == "happy")
    {
      labelClass = "label label-success";
      num_happy++;
      $("#happy").html(num_happy);
    }
    else
    {
      labelClass = "label label-danger";
      num_sad++;
      $("#sad").html(num_sad);
    }
  } else {
    labelClass = "label label-default";
    emotion = "neutral"
    emoticon = icons.neutral;
    num_neutral++;
    $("#neutral").html(num_neutral);
  }

  var total = num_happy+num_neutral+num_sad;

  var green = Math.floor(((num_happy+(num_neutral/2))/total)*255);
  var red = Math.floor(((num_sad+(num_neutral/2))/total)*255);

  var color = 'rgb(' + [red, green, 0].join(',') + ')';

  $("#nav").css("background-color", color);


  info.append($("<span>").addClass(labelClass).html(emotion));
  info = $("<div>").append(info).html();
  var infoWindow = new google.maps.InfoWindow({
    content: info,
  });
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(tweet.position.lat, tweet.position.lng),
    icon: emoticon,
    map: map,
    draggable:false,
    animation:google.maps.Animation.DROP,
  });
   google.maps.event.addListener(marker, 'click', function() {
    infoWindow.open(map,marker);
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
