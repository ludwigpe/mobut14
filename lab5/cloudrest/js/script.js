var helper;
var map;
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

    var colCount = 0;
    var htmlString = "<div class='row'>";
    while(restaurants.length > 0) {
        var rest = restaurants.shift();
        colCount++;

        htmlString += "<div class='col-xs-4'><div class='thumbnail'>";
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
    debugger
    getRestaurant(id, function(resp) {
        var rest = resp.outputData[0];
        debugger;
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

}
function setupCost(price) {

}
function setupMap(latlng) {

}
function setupType(type) {

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