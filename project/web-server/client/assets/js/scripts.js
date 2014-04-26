var socket = io.connect('http://localhost');
socket.on('tweet', function (data) {

  console.debug("Got tweet", data.tweet);
  var tweets = document.getElementById("tweets");
  var item = document.createElement("li");
  item.innerHTML = data.tweet.text;
  item.setAttribute("class",data.tweet.emotions[0]);


  tweets.insertBefore(item, tweets.firstChild);
  
});
