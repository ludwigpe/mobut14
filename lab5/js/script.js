// First initialise the helper object with the code, secret code 
// and the generic helper
var helper = new CBHelper("pirelli-guide", "0b680bb2ea708d71e8b688d2a8f09b8c", new GenericHelper());
// use the md5 library provided to set the password
helper.setPassword(hex_md5("tamale4ever"));




$( document ).ready(function() {

	var model = new Model();

	var $availableCategories	= $("#availableCategories");
	var $restaurants 			= $("#restaurantsContainer");

	var cats = model.getCategories();
	$.each(cats, function(i, category){
		$availableCategories.append(
	        $('<button/>', 
		        {
		            text: category,
		            click: function(e) {
		                e.preventDefault();

		                $availableCategories.parent().hide("slow");
		                selectCategory(category);
		            }
		        }
	        ).addClass("btn btn-primary btn-lg btn-block")
	    );		
	});



	function selectCategory(category){
		var restaurants = model.getRestaurantsByCategory(category);

		$restaurants.parent().show("slow");
		$restaurants.find("#currentCategory").html(category);


		$.each(restaurants, function(i, rest){
			var $container = $("<div>").addClass("col-md-4").attr("id", rest.id);
			var $panel = $("<div>").addClass("panel panel-default");
			var $panelHeading = $("<div>").addClass("panel-heading");
			$panelHeading.append($("<h3>").addClass("panel-title").html(rest.title));
			var $panelBody = $("<div>").addClass("panel-body");
			$panelBody.append($("<p>").html(rest.description));
			$panelBody.append($("<hr>"));
			$panelBody.append($("<h4>").html("Bilder"));

			var $ul = $("<ul>").addClass("media-list");
			//show all images
			$.each(rest.images, function(i, image){
				var $li = $("<li>").addClass("media");
				$li.append($("<a>").addClass("pull-left").attr("href", "images/" + image.file).attr("target", "_blank").append($("<img>").addClass("media-object").attr("src", "images/"+image.file).attr("alt", image.description)));
				$li.append($("<div>").addClass("media-body").append($("<h4>").addClass("media-heading").html(image.title)).append($("<p>").html(image.description)));

				$ul.append($li);
			});
			$panelBody.append($ul);

			var $commentArea = $("<div>").hide();
			var $button = $('<button/>', 
		        {
		            click: function(e) {
		                e.preventDefault();

		                toggleCommentArea(rest, $commentArea);
		            }
		        }
	        ).addClass("btn btn-block btn-success btn-lg").append($("<span>").addClass("glyphicon glyphicon-plus").html("kommentera"));	
			
			$panelBody.append($("<hr>"));
			$panelBody.append($button);
			$panelBody.append($commentArea);

			$panel.append($panelHeading);
			$panel.append($panelBody);
			
			$container.append($panel);

			$restaurants.append($container);
		});	
	}

	function toggleCommentArea(rest, $container){
		if($container.is(':visible')){
			//we should hide it and not re-render 
			//grab exisiting comments from cloudbase instead
			alert("already visible comment area");
		}else{
			$container.append($("<hr>"));
			$container.append($("<h3>").html("Kommentera"))

			//create some rating stars
			var $rating = $("<input>",
		        {
		            change: function(e) {
		                e.preventDefault();

		                postComment(rest, this);
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

			                alert("skickat!!!");
			            }
			        }
		        ).addClass("btn btn-primary btn-default")
	    	);
			
			$container.append($rating);
			$container.append($form);
			$container.show("slow");
			$rating.rating(); //apparently this line needs to be done after DOM insertion
		}
		
	}

function postComment(rest, para){
	var val = $(para).val();




	alert(val);
}	

/*
	function selectCategory_WITH_BELOVED_STRING_APPENDANCE(category){
		var restaurants = model.getRestaurantsByCategory(category);
		var html = '';

		$restaurants.parent().show("slow");
		$restaurants.find("#currentCategory").html(category);



		$.each(restaurants, function(i, rest){
			html = '<div class="col-md-4" id="'+ rest.id + '">';
			html += '<div class="panel panel-default">';
			html += '<div class="panel-heading">';
			html += '	<h3 class="panel-title">' + rest.title + '</h3>';
			html += '</div>'
			html += '<div class="panel-body">'
			html += '	<p>' + rest.description + '</p>';
			html += '<hr><h4>Bilder</h4>';
			html += '	<ul class="media-list">';

			//show all images
			$.each(rest.images, function(i, image){
				html += '	<li class="media">';
				html += '	    <a class="pull-left" href="images/'+ image.file +'" target="_blank">';
				html += '			<img class="media-object" src="images/'+ image.file +'" alt="' + image.description + '">';
				html += '		</a>';
				html += '		<div class="media-body">';
				html += '			<h4 class="media-heading">' + image.title +'</h4>';
				html += '			<p>' + image.description + '</p>';
	      		html += '		</div>';
	      		html += '	</li>';
			});
			html += '	</ul>';

			//comment button
			html += '<button type="button" class="btn btn-block btn-success btn-lg">';
			html += '<span class="glyphicon glyphicon-plus"></span> Kommentera & Betygsätt';
          	html += '</button>';

			html += '</div>'; // end panel-body
			html += '</div>'; //end panel
			html += '</div>'; //end col-md-6

			$restaurants.append(html);
		});	
	}*/

}); //end doc ready
