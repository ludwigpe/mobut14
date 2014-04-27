$(function(){
   // Grab the elements
   var container = $(".container");
   var input = $("#input");
   var buttonSend = $("#buttonSend");
   

   var output = $("#containerMessages");
   var room;
   var username;
   var uuid;
   var position;
  

   $("#login_btn").click(login);
   input.keypress(function(e) {
    if(e.which == 13 && input.val()) {
      buttonSend.click();
    }
   });
   $("#login_form").submit(function(e) {
      e.preventDefault();
      login();
   })
    // Init PubNub
    var pubnub = PUBNUB.init({
      publish_key   : "pub-c-8c57667b-7da5-4365-b753-5255a1eaef8d",
      subscribe_key : "sub-c-5780bfc6-c0f6-11e3-a3ad-02ee2ddab7fe"
    });
    uuid = pubnub.uuid();

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
        var options = {timeout:10000};
        navigator.geolocation.getCurrentPosition(function (pos) {
          container.hide(500);
          position = pos; //store global
          setChatRoom(pos)
          container.show(500);
        }, function (err) {
          room = LOBBY;
          position = TEST_POSITION;
          $("#chat_room").empty();
          $("#chat_room").append(room.desc);
          setupPubNub();
          container.show(500);
          console.log("geolocation failed to get position");
          
          //$("#warning").html("Could not fetch your position, no chatting for you!").show();
        }, options); 
      } else {
        console.log('Browser does not support geolocation');
        room = LOBBY;
        position = TEST_POSITION;
        $("#chat_room").empty();
        $("#chat_room").append(room.desc);
        setupPubNub();
        container.show(500);
        //$("#warning").html("Could not fetch your position, no chatting for you!").show();
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
      $("#chat_room").empty();
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
        'callback'  : function(data) {          
          var messageClass = '';
          if(data.uuid == uuid){
            //output.html(output.html() + '<br />' + data.username+ ": " + data.msg);
            messageClass = "pull-right";
          }else{
            //output.html(output.html() + '<br />' + data.username+ ": " + data.msg);
            messageClass = "pull-left";
          }

          var html = '<div class="media message ' + messageClass + '">'
          html += '<span class="glyphicon glyphicon-user ' + messageClass + '"></span>';
          html += '<div class="media-body">';
          html += '<h3 class="media-heading ' + messageClass +' ">' + data.username + '</h3>';
          html += '<p class="message">' + data.msg + '</p>';
          html += '</div>';
          html += '</div>';

          output.prepend(html);          
        }
      });

      // send messages
      buttonSend.on('click', function() {
        if(!input.val())
          return;
        pubnub.publish({
          'channel' : room.channel,
          'message' :  {
            username: username,
            uuid: uuid,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
            msg: input.val(),
          },
        });
        input.val('');
      });
      }
      //init();
    });