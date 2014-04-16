$(function(){
   // Grab the elements
   var container = $(".container");
   var input = $("#input");
   var buttonSend = $("#buttonSend");
   var buttonHistory = $("#buttonHistory");
   var output = $("#output");
   var chatlist = $("#chatlist");
   var room;
   var username;

   $("#login_btn").click(login);
   input.keypress(function(e) {
    if(e.which == 13) {
      buttonSend.click();
    }
   });
    // Init PubNub
    var pubnub = PUBNUB.init({
      publish_key   : "pub-c-8c57667b-7da5-4365-b753-5255a1eaef8d",
      subscribe_key : "sub-c-5780bfc6-c0f6-11e3-a3ad-02ee2ddab7fe"
    });
    function login() {
      var form = $("#login_form");
      username = $("#username_input").val();
      if(!username)
        return;
      $("#login_form").hide();
      init();
    }
    function init() {
      if(navigator.geolocation) {
        console.log("Browser supports geolocation")
        navigator.geolocation.getCurrentPosition(function (pos) {
          setChatRoom(pos)
          container.show(500);
        }, function (err) {
          console.log("geolocation failed to get position");
          setChatRoom(TEST_POSITION); 
          container.show(500);
        }); 
      } else {
        console.log('Browser does not support geolocation');
        setChatRoom(TEST_POSITION)
        container.show(500);
      }
      
    }
    function setChatRoom(position) {
      var closest = {};
      closest.dist = 1000000;
      $.each(ALL_ROOMS, function (index, room) {
        var dist = calcDist(room.loc, position);
        if(dist < closest.dist) {
          console.log("currently known closest room: " + room.desc);
          closest.room = room;
          closest.dist = dist;
        }
      });
      room = closest.room;
      console.log("closes room was");
      console.log(room);
      $("#chat_room").append(room.desc);
      //chatlist.append("<li class='list-group-item'> Room: " + room.desc + "</li>");
      setupPubNub();
    }
    function calcDist(roomLoc, pos) {
      var x = roomLoc.lat - pos.coords.latitude;
      x = x*x;
      var y = roomLoc.lng - pos.coords.longitude;
      y = y*y;
      var lenght = Math.sqrt(x + y);

      console.log("caculated length: " + length);
      return lenght;
    }
    function setupPubNub() {
      // receive messages
      pubnub.subscribe({
        'channel'   : room.channel,
        'callback'  : function(message) {
          output.html(output.html() + '<br />' + username+ ": " + message);
        }
      });

        // send messagesess
        buttonSend.on('click', function() {
          var msg = username + ": " + input.val();
          pubnub.publish({
            'channel' : room.channel,
            'message' : msg
          });
          input.val('');
        });

        // check history
        buttonHistory.on('click', function() {
          output.html("");
          pubnub.history({
            count : 10,
            channel : room.channel,
            callback : function (message) {
              output.append(message[0].join("<br />"))
            }
          });
        });
      }
      //init();
    });