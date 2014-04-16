  google.maps.event.addDomListener(window, 'load', initialize);

  var map = null;
  var marker;
  var marker2;
  var currentMarker = null;
  var currentFocus = null;
  var browserSupportFlag =  new Boolean();
  var myLocation;
  var treat = {
    name : "Treat bar",
    location : new google.maps.LatLng(59.344671, 18.061951),
    infowindow: new google.maps.InfoWindow({
      content: "<strong>Treat Bar!</strong>"
    }),
    showInfo: function() {
      treat.infowindow.open(map,this);
    },
  }
  var mcdonalds = {
    name: "Mc Donalds",
    location: new google.maps.LatLng(59.333592, 18.032138),
    infowindow: new google.maps.InfoWindow({
      content: "<strong>Mc Donalds</strong>"
    }),
    showInfo: function() {
      mcdonalds.infowindow.open(map,this);
    },
  }
  var lion_bar = {
    name: "Lion bar",
    location: new google.maps.LatLng(59.342116, 18.051723),
    infowindow: new google.maps.InfoWindow({
      content: "<strong>Lion Bar</strong>"
    }),
    showInfo: function() {
      lion_bar.infowindow.open(map,this);
    },
    
  }
  var my_location = {
    name: "My location",
    infowindow: new google.maps.InfoWindow({
      content: "<strong>My position!</strong>"
    }),
    showInfo: function() {
      my_location.infowindow.open(map,this);
    },
  }
  var ourLocs = [treat, lion_bar, mcdonalds];
  var locations = {
  	campus: new google.maps.LatLng(59.347424, 18.072929),
  	nymble: new google.maps.LatLng(59.347481, 18.071168),
  	indek: 	new google.maps.LatLng(59.348044, 18.074140),
  	usa:   	new google.maps.LatLng(37.339085, -121.8914807),
    treat:  new google.maps.LatLng(59.344671, 18.061951),
    lion_bar:  new google.maps.LatLng(59.342116, 18.051723),
    mcdonalds:  new google.maps.LatLng(59.333592, 18.032138),
  }
  var favs = [];
  function init_favourites() {
    var locs = ["treat", "lion_bar", "mcdonalds"];
    console.log(locs)
    for (var i = 0; i < 3; i++) {
      var loc = locs[i];
      var curr = ourLocs[i];

      favs[loc] = new google.maps.Marker({
        map:map,
        draggable:false,
        animation:google.maps.Animation.DROP,
        position: curr.location,
        visible:false,
        
      });
      
      curr.marker = favs[loc];
      google.maps.event.addListener(curr.marker, 'click', curr.showInfo);
      console.log(curr);

    }
    console.log(favs);
  }

  function initialize() {
  	var mapOptions = {
  		center: locations["campus"],
  		zoom: 15,
  		mapTypeId: google.maps.MapTypeId.SATELLITE,
  	};
  	map = new google.maps.Map(document.getElementById("map-canvas"),
  		mapOptions);

  	marker = new google.maps.Marker({
  		map:map,
  		draggable:true,
  		animation: google.maps.Animation.DROP,
  		position: locations["nymble"],
  	});

  	marker2 = new google.maps.Marker({
  		map:map,
  		draggable:false,
  		animation: google.maps.Animation.BOUNCE,
  		position: locations["indek"],

  	});

  	google.maps.event.addListener(marker2, 'click', toggleBounce);
    if(navigator.geolocation) {
      console.log("yeay");
      browserSupportFlag = true;
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log(my_location);

        my_location.location = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        my_location.marker = new google.maps.Marker({
          map:map,
          draggable:false,
          animation: google.maps.Animation.DROP,
          position: my_location.location,
        });
        google.maps.event.addListener(my_location.marker, 'click', my_location.showInfo);
        console.log("min position");
        console.log(my_location.location);
      }, function(err) {
        browserSupportFlag = false;
      alert("geolocation service failed");
      });

      

    } else {
      browserSupportFlag = false;
      alert("geolocation not supported");
    }

  
    //favouriteLocations();
    init_favourites();
    
    //buttons onClick
    $('#treat').click(function() {
        goto_location(treat);
      });
    $('#lion_bar').click(function() {
        goto_location(lion_bar);
      });
    $('#mcdonalds').click(function() {
        goto_location(mcdonalds);
      });
    $('#my_location').click(function() {
        goto_location(my_location);
      });

  }
/*
function favourkiteLocations(){

  var contentString = "<strong>Treat Bar!</strong>";
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  var marker = new google.maps.Marker({
    position: locations["treat"],
    map: map,
    title: 'Uluru (Ayers Rock)'
  });
  
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });

}
*/
  function toggleBounce() {

  	if (marker2.getAnimation() != null) {
  		marker2.setAnimation(null);
  	} else {
  		marker2.setAnimation(google.maps.Animation.BOUNCE);
  	}
  }

  function toggleTilt(){
  	if(map.getTilt() == 0){
  		map.setHeading(90);
  		map.setTilt(45);
  		
  	}else{
  		map.setTilt(0);
  	}
  }

  function switchMapType(obj){
  	var mapTypes = [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.TERRAIN];
  	
  	map.setMapTypeId(mapTypes[obj.id]);

  }
  function goto_location(key) {
    console.log(key);
    if(currentFocus != null) {
      currentFocus.marker.setVisible(false);
      currentFocus.infowindow.close();
    }
    if (!browserSupportFlag && key === my_location) {
      console.log("browser not supported");
      return;
    };
    
    currentFocus = key;
    currentFocus.marker.setVisible(true);
    currentFocus.marker.setAnimation(google.maps.Animation.DROP);
    map.panTo(key.marker.getPosition());
    
  }
  function goto_my_location() {

  }

  $(function() {

    var docEl = window.document.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen; 
    console.log(requestFullScreen);

    requestFullScreen.call(docEl);
    console.log("hejsan!");
    if(navigator.userAgent.match(/Android/i)){
      window.scrollTo(0,100);
    }

  });

