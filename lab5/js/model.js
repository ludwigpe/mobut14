/*
// create an object to be inserted in our CloudBase instance,
// e.g a firstName, lastName and title into a collection called ‘users’
var dataObject = {
    "firstName" : "Niklas",
    "lastName" : "Nummelin",
    "title" : "Wizard"
};
 // use the insertDocument method to send the call and insert the data
// in the users collection then print out the response using the
// outputString property of the CBHelperResponseInfo object

helper.insertDocument("users", dataObject, null, function(resp) {
    hyper.log(resp.outputString);
});



var searchCondition = { "firstName" : "Niklas" };
// call the searchDocuments function
helper.searchDocuments(searchCondition,"users", function(resp) {
        // uncomment next row to get entire string
       // alert(resp.outputString);   
       
        if (resp.callStatus){       // if successful
        	for (index in resp.outputData){
        		var user = resp.outputData[index];
        		alert (user.firstName + ' ' + user.lastName + ', ' + user.title);
        	}
        }
    }
);
*/




var Model = function(){


	this.getCategories = function(){
		var ret = [];

		$.each(restaurants, function(i, rest){
			if(ret.indexOf(rest.category) == -1){
				ret.push(rest.category);
			} 
		});

		return ret;
	}

	this.getRestaurantsByCategory = function(category){
		var ret = [];

		$.each(restaurants, function(i, rest){
			if(rest.category == category){
				ret.push(rest);
			} 
		});

		return ret;
	}


	//nicely loaded from our database, hehe.
	var restaurants = [
		{
			title: "Treat",
			id: 1,
			category: "Husmanskost",
			description: "Treat ligger i stadsdelen Vasastan (Stockholm) och har 18-årsgräns. Populärt och trevligt litet förkrökshak med billiga priser i baren. Öppettider för Treat är 15:00-01:00. Notera att avvikande öppettider, inträdesavgifter och åldersgränser kan förekomma under t ex jul, nyår, midsommar, valborg, pingst, påsk, mm. Kontakta Treat för mer info. ",
			location: {
				town: "Stockholm",
				address: "Roslagsgatan 2",
				coordinates:{
					longitude: null,
					latitude: null,
				}
			},
			priceRange: {
				min: 100,
				max: 400,
			},
			images: [
				{
					title: "Entré",
					description: "Jättefin",
					file: "2.jpg", 
				},
				{
					title: "Toalett",
					description: "jätterena",
					file: "2.jpg", 
				},
				{
					title: "Rökruta",
					description: "Inrökta",
					file: "3.jpg", 
				},
			]
		},
		{
			title: "Sturehof",
			id: 93,
			category: "Husmanskost",
			description: "Sturehof är långt ifrån en vanlig restaurang. Med sin stolta, över sekellånga historia och sitt läge mitt på sydsidan av Stureplan i Stockholm är Sturehof en pulserande mötesplats – en scen som lever intensivt från tidig förmiddag till sen natt, sju dagar i veckan, 365 dagar om året.Sturehof är en traditionstung men även modern och samtida krogklassiker som knappast står något av Paris eller New Yorks berömda brasserier efter i något avseende. Sturehof är också scen för konstutställningar, konserter och artistframträdanden. Vår publik är en salig blandning av olika åldrar, ursprung, yrken, intressen, ja på alla tänkbara sätt.",
			location: {
				town: "Stockholm",
				address: "Sturegallerian 42",
				coordinates:{
					longitude: null,
					latitude: null,
				}
			},
			priceRange: {
				min: 400,
				max: 900,
			},
			images: [
				{
					title: "Entré",
					description: "Jättefin",
					file: "2.jpg", 
				},
				{
					title: "Toalett",
					description: "jätterena",
					file: "2.jpg", 
				},
				{
					title: "Rökruta",
					description: "Inrökta",
					file: "3.jpg", 
				},
			]
		},		
		{
			title: "Lion Bar",
			id: 2,
			category: "Engelsk",
			description: "Här är man full",
			location: {
				town: "Stockholm",
				address: "Valhallavägen",
				coordinates:{
					longitude: null,
					latitude: null,
				}
			},
			priceRange: {
				min: 100,
				max: 150,
			},
			images: [
				{
					title: "Entré",
					description: "Jättefin",
					file: "2.jpg", 
				},
				{
					title: "Toalett",
					description: "jätterena",
					file: "2.jpg", 
				},
				{
					title: "Rökruta",
					description: "Inrökta",
					file: "3.jpg", 
				},
			]
		},
		{
			title: "Donken",
			id: 3,
			category: "Amerikanskt",
			description: "Din räddning kl 04:33",
			location: {
				town: "Stockholm",
				address: "Sveavägen",
				coordinates: {
					longitude: null,
					latitude: null,
				}
			},
			priceRange: {
				min: 10,
				max: 90,
			},
			images: [
				{
					title: "Entré",
					description: "Jättefin",
					file: "2.jpg", 
				},
				{
					title: "Toalett",
					description: "jätterena",
					file: "2.jpg", 
				},
				{
					title: "Rökruta",
					description: "Inrökta",
					file: "3.jpg", 
				},
			]
		},
	];

}