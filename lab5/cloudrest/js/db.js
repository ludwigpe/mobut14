var DB = function() {
  var helper;

  // initialise the helper object with the code, secret code and the
  this.init = function() {
    helper = new CBHelper("cloudrest", "a4d63cfffc2ce45f92caded0eca59134", new GenericHelper());
    // use the md5 library provided to set the password
    helper.setPassword(hex_md5("supersecret1337"));
  };
  
  this.get = {
    restaurant: function(id, callback) {
      ensureConnection();
      console.debug("db#get#restaurant with id#" + id);
      helper.searchDocuments({"id": id}, "restaurants", wrapper(callback));
    },
    restaurants: function(search, callback) {
      ensureConnection();
      if(search && callback){
        console.debug("db#get#restaurants by search: ", search);
        helper.searchDocuments(search, "restaurants", wrapper(callback));
      }
      else {
        callback = search; // If not search, then first argument is callback.
        console.debug("db#get#restaurants all");
        helper.searchAllDocuments("restaurants", wrapper(callback));
      }
    },
    comments: function(restaurant, callback) {
      ensureConnection();
      console.debug("db#get#comments for restaurant id#" + restaurant.id);
      helper.searchDocuments({"rest_id": restaurant.id}, "comments", wrapper(callback));
    }

  };

  this.insert = {
    comment: function(comment, callback) {
      ensureConnection();
      console.debug("db#insert#comment", comment);
      helper.insertDocument("comments", comment, null, wrapper(callback));
    }
  };

  this.update = {
    restaurant : function(restaurant, callback) {
      ensureConnection();
      console.debug("db#update#restaurant", restaurant);
      helper.updateDocument(restaurant, {"id":restaurant.id}, "restaurants", null, wrapper(callback));
    }
        
  };

  // Populates the database with content.
  this.setup = function() {
    ensureConnection();
    for (var i = 0; i < ALL_RESTAURANTS.length; i++) {
      helper.insertDocument("restaurants", ALL_RESTAURANTS[i], null, null);
    }
  };

  var ensureConnection = function() {
    if (!helper) {
      throw new Error("Could not make query since DB is not initialised");
    }
  };

  var wrapper = function(callback) {
    return function(data) {
      console.debug("db#receiving", data.outputData);
      if (callback)
        callback(data.outputData);
    };
  };


};