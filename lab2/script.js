$(function() {
  var currImgIndex = 0, IMAGE_HOLDERS = [], $_IMAGE_HOLDER = $("#img_holder");
  
  var ImageHolder = function (description, path) {
    this.image = new Image(); // This will preload the image.
    this.image.src = path;
    this.description = description;

    this.onClick = function() {
      $.mobile.navigate("#pagetwo");
      var id = parseInt(this.id.split("_").pop());
      showImage(id);
    };
  };

  function showImage(id) {
    console.debug("Showing image #"+id+" aka '" + IMAGE_HOLDERS[id].description + "'");
    currImgIndex = id;
    $_IMAGE_HOLDER.attr("src", IMAGE_HOLDERS[id].image.src);
  }

  function init() {
    var $_TEAM_MEMBERS = $("#team_members"), $_IMAGE_LIST = $("#img_list");

    // Set basic on load theme
    changeGlobalTheme("a");

    // Add team members to about view dynamic
    $.each(TEAM_MEMBERS, function(_, member) {
      $_TEAM_MEMBERS.append('<li><a href="#">' + member.name + '</a></li>');
    });
    
    // Populate images
    $.each(ALL_IMAGES, function(i, obj) {
      var imageHolder = new ImageHolder(obj.desc, "images/" + obj.path);
      IMAGE_HOLDERS.push(imageHolder);

      var id = "img_btn_" + i;
      $_IMAGE_LIST.append("<li><a id='"+ id +"'class='ui-btn ui-corner-all ui-icon-arrow-r ui-btn-icon-right'>" + imageHolder.description + "</a></li>");
      $("#"+id).on("click", imageHolder.onClick);
    });
    
    // Add swipe handler for left image swipe
    $_IMAGE_HOLDER.on("swipeleft", function() {
      showImage(Math.min(currImgIndex+1 , IMAGE_HOLDERS.length-1));
    });

    // Add swipe handler for right image swipe
    $_IMAGE_HOLDER.on("swiperight", function() {
      showImage(Math.max(currImgIndex-1, 0));
    });
  
  }

  init();
});

// Dynamically changes the theme of all UI elements on all pages,
// also pages not yet rendered (enhanced) by jQuery Mobile.
//SOURCE: http://stackoverflow.com/questions/7667603/change-data-theme-in-jquery-mobile
function changeGlobalTheme(theme){
    // These themes will be cleared, add more
    // swatch letters as needed.
    var themes = " a b c d e";

    // Updates the theme for all elements that match the
    // CSS selector with the specified theme class.
    function setTheme(cssSelector, themeClass, theme)
    {
        $(cssSelector)
            .removeClass(themes.split(" ").join(" " + themeClass + "-"))
            .addClass(themeClass + "-" + theme)
            .attr("data-theme", theme);
    }

    // Add more selectors/theme classes as needed.
    setTheme(".ui-mobile-viewport", "ui-overlay", theme);
    setTheme("[data-role='page']", "ui-body", theme);
    setTheme("[data-role='header']", "ui-bar", theme);
    setTheme("[data-role='listview'] > li", "ui-bar", theme);
    setTheme(".ui-btn", "ui-btn-up", theme);
    setTheme(".ui-btn", "ui-btn-hover", theme);
    //extra
    setTheme("[data-role='list-divider']", "ui-bar", theme);
}
