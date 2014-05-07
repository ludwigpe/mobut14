var helper;
var map;
var marker;
var restaurants;

var $_CONTEN_LIST;
var $_CONTEN_INFO;
var $_CAROUSEL_INDICATOR;
var $_CAROUSEL_WRAPPER;

function setupDB() {

    for (var i = 0; i < ALL_RESTAURANTS.length; i++) {

        var rest = ALL_RESTAURANTS[i];
        helper.insertDocument("restaurants", rest, null, function(resp) {
            console.log(resp.outputString);
        });
    };
}
function initCB() {
    // initialise the helper object with the code, secret code and the
    // generic helper
    helper = new CBHelper("cloudrest", "a4d63cfffc2ce45f92caded0eca59134", new GenericHelper());
    // use the md5 library provided to set the password
    helper.setPassword(hex_md5("supersecret1337"));
}
function setupContent(restaurants) {
    // here we setup all content
    var container = $("#content");
    var row = $("#content.row");
    $("#content_comments").hide();

    var colCount = 0;
    var htmlString = "<div class='row'>";
    while(restaurants.length > 0) {
        var rest = restaurants.shift();
        colCount++;

        htmlString += "<div class='col-md-4'><div class='thumbnail'>";
        htmlString += "<img src='" + rest.cover_img + "'>";
        htmlString += "<div class='caption'>";
        htmlString += "<h3>"+rest.title+"</h3>";
        htmlString += "<p>"+rest.description+"</p>";
        htmlString += "<a href='#"+ rest.title + "' onclick='showInfo("+ rest.id +");'class='btn btn-primary' role='button'>Button</a>";
        htmlString += "</div></div></div>"

        if(0 == (colCount%3)) {
            // we append the htmlString to container
            htmlString += "</div>"; //closing div
            $_CONTEN_LIST.append(htmlString);
            htmlString = (restaurants.length > 0)? "<div class='row'>": "";
        }
    }
    container.append(row);


}
function showInfo(id) {
    console.log("entered showInfo with id: " + id);

    getRestaurant(id, function(resp) {
        var rest = resp.outputData[0];

        var $button = $('<button/>',
            {
                click: function(e) {
                    e.preventDefault();
                    console.log("pushed comments button");
                    toggleCommentArea(rest);
                }
            }
          ).addClass("btn btn-block btn-success btn-lg").append($("<span>").addClass("glyphicon glyphicon-plus").html("kommentera"));
        $("#comments_button").empty()
        $("#comments_button").prepend("<hr/>");
        $("#comments_button").append($button);
        console.log (rest.images);
        setupCarousel(rest.images);
        setupRestaurantInfo(rest.title, rest.description);
        setupRating(rest.rating);
        setupCost(rest.price);
        setupMap(rest.latlng);
        setupType(rest.type);
    });

    // swap what to show.
    $_CONTEN_LIST.hide();
    $_CONTEN_INFO.show();

}
function getRestaurant(id, callback) {
    if(helper){
        helper.searchDocuments({"id": id}, "restaurants", callback)
    } else {
        console.log ("could not retrieve restaurant since helper is undefined")
    }

}
function getRestaurants() {
    if(helper) {
     helper.searchAllDocuments("restaurants", function(resp){

            setupContent(resp.outputData);
        });
    }
}

// Setup functions
function setupCarousel(images){
    $.each(images, function( index, img) {
        var active = (0 == index)? "active": "";
        $_CAROUSEL_INDICATOR.append("<li data-target='#carousel_container' data-slide-to='"+index+" class='"+active+"''></li>");
        $_CAROUSEL_WRAPPER.append("<div class='item "+ active +"'><img src='"+img.src+"'></div>");
    });
}
function setupRestaurantInfo(title, description) {
    var $title = $("#content_title");
    var $desc = $("#content_desc");
    $title.text(title);
    $desc.text(description);
}
function setupRating(rating) {
    var $rating = $("<input>",
                {
                    change: function(e) {
                        e.preventDefault();
                        var val = parseInt(this.value);
                        if(val) postRating(val);

                    }

                }
                )
                .attr("data-max", 5)
                .attr("data-min", 1)
                .attr("id", "ididid")
                //.addClass("rating") //don't use this class if the rating is appended to DOM after the rating script is loaded
                .attr("name", "Betygssätt")
                .attr("type", "number")
                .attr("data-clearable", "remove");
  $("#content_rating").append($rating);
  $("#content_rating").append("<p>betyg: "+rating+ "</p>");
  $rating.rating(); //apparently this line needs to be done after DOM insertion

}
function setupCost(price) {
  var html = "<p>pris: "+price.low+" - "+ price.high+" </p>";
  $("#content_price").append(html);
}
function setupMap(latlng) {

  var loc = new google.maps.LatLng(latlng.lat, latlng.lng);
    if(!map) {
      var mapOptions = {
          center: loc,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
      };

      map = new google.maps.Map(document.getElementById("content_map"),
        mapOptions);

      marker = new google.maps.Marker({
        map:map,
        draggable:false,
        animation: google.maps.Animation.DROP,
        position: loc,
      });

    } else {
      map.setCenter(loc);
      marker.setPosition(loc);
    }

}
function setupType(type) {

}

function toggleCommentArea(rest){
  var $container = $("#content_comments");

    if($container.is(':visible')){
      //we should hide it and not re-render
      //grab exisiting comments from cloudbase instead
      $container.hide("slow");
      console.log("hiding comments");
      //alert("already visible comment area");
    }else{
      console.log("fetch comments for ");
      console.log(rest);

      if($container.children().length > 0) {
        $container.show("slow");
        return;
      }
      $container.append($("<hr>"));
      $container.append($("<h3>").html("Kommentera"))

      //create the form
      var $form = $("<form>").attr("role", "form");

      //name
      var $group = $("<div>").addClass("form-group");
      $group.append($("<label>").attr("for", "inputName"));
      $group.append($("<input>").addClass("form-control")
        .attr("type", "text")
        .attr("id", "inputName")
        .attr("placeholder", "Fyll i ditt namn")
      );
      $form.append($group);

      //comment area
      var $group = $("<div>").addClass("form-group");
      $group.append($("<label>").attr("for", "inputComment"));
      $group.append($("<input>").addClass("form-control")
        .attr("type", "text")
        .attr("id", "inputComment")
        .attr("placeholder", "Kommentar")
      );
      $form.append($group);

      $form.append($('<button/>',
              {
                  text: "Skicka",
                  click: function(e) {
                      e.preventDefault();
                      var comment = {};
                      comment.rest_id = rest.id;
                      comment.author = $("#inputName").val();
                      comment.text = $("#inputComment").val();
                      postComment(comment, null);

                  }
              }
            ).addClass("btn btn-primary btn-default")
        );

      $container.append($form);
      getComments(rest, function(resp) {

        // <div class="media">
        //             <div class="pull-left">
        //               <span class="glyphicon glyphicon-user media-object"></span>
        //             </div>
        //             <div class="media-body">
        //               <h4 class="media-heading">Media heading</h4>
        //               My comment rocks!
        //             </div>
        // we have the comments now put them into the document.
        $.each(resp.outputData, function(index, comment) {

          var $comment = $("<div>").addClass("media");
          $comment.append($("<div>").addClass("pull-left").append($("<span>").addClass("glyphicon glyphicon-user media-object")));
          var $body = $("<div>").addClass("media-body").append($("<h4>").addClass("media-heading").text(comment.author));
          $body.append($("<p>").text(comment.text));
          $comment.append($body);
          $container.append($comment);

        });

      });
      $container.show("slow");
    }

  }

function postComment(comment, callback) {

  if(helper){
    helper.insertDocument("comments", comment, null, callback);
  } else {
    console.log("helper not setup in postComment");
  }
}

function getComments(rest, callback) {
  if(helper){
        helper.searchDocuments({"rest_id": rest.id}, "comments", callback)
    } else {
      console.log("Helper not setup for comments");
    }

}


$(function() {

    $_CONTEN_LIST = $("#content_list");
    $_CONTEN_INFO = $("#content_info");
    $_CAROUSEL_INDICATOR = $("#carousel_indicator");
    $_CAROUSEL_WRAPPER = $("#carousel_wrapper");
    initCB();
    //setupDB();
    getRestaurants();
});