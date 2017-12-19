var app = angular.module('mainApp', []);

app.config(['$httpProvider', function($httpProvider) {
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}
]);

app.controller('PostsCtrl', function($scope, $http) {

	var formData = {
		ques: "null",
	};

	// Get the focus to the text input to enter a word right away.
	document.getElementById('terminalTextInput').focus();

	// Scroll to the bottom of the results div
	var scrollToBottomOfResults = function(){
		var terminalResultsDiv = document.getElementById('terminalResultsCont');
		terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
	}

	// Add Text to terminal
	var addTextToResults = function(textToAdd){
		document.getElementById('terminalResultsCont').innerHTML += "<p>" + textToAdd + "</p>";
		scrollToBottomOfResults();
	}
	var addTextToUser = function(textToAdd){
		document.getElementById('terminalResultsCont').innerHTML += "<p class='userEnteredText'>> " + textToAdd + "</p>";
		scrollToBottomOfResults();
	}
	// Add Restaurants to terminal
	var addSlider = function(results){
		var list_length = results.data.zomato.length;
		var results = results.data.zomato;
		var terminalResultsDiv = document.getElementById('terminalResultsCont');
		var dt = $.now();
		var slider_name = 'foo_slider_'+ dt;
		terminalResultsDiv.innerHTML += "<div class='item_slider "+ slider_name +"'></div>";
		for(i=0;i<list_length;i++){
			var template = '<div>';
			template += '<div class="res_list_div">';
			template += '<a href="'+results[i].url+'" target="_blank">';
			template += '<div class="res_name">'+results[i].name+'</div>';
			template += '<div class="res_bg" style="background: url('+results[i].thumb +');"></div>';
			template += '<div class="res_type">'+results[i].cuisines+'</div>';
			template += '<div class="res_star">';
			template += '<span style="background: #'+results[i].rating_color+'">'+results[i].rating+' / 5</span>';
			template += '</div>';
			template += '</a>';
			template += '</div><!--res_list_div-->';
			template += '</div>';
			$("."+slider_name).append(template);
			// console.log(slider_name);
		}
		$("."+slider_name).slick({
			dots: false,
			infinite: true,
			speed: 1000,
			slidesToShow: 2,
			slidesToScroll: 1,
		});
		terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
	}

	// Speech
	function speak(text, callback) {
		var u = new SpeechSynthesisUtterance();
		u.text = text;
		u.lang = 'en-us';
		u.name = 'male';
		u.onend = function () {
			if (callback) {
				callback();
			}
		};
		u.onerror = function (e) {
			if (callback) {
				callback(e);
			}
		};
		speechSynthesis.speak(u);
		hideSpinner();
	}

	// Initial Text
	addTextToResults("-------------------------------------<h1>Hi, I am <span class='terbot'>TerBot</span></h1>-------------------------------------<p>Let's Get Started!</p><p>Try typing 'Hi' or 'Weather in New York' or 'Today's Quote'</p>-------------------------------------");

	// Clear text input
	var clearInput = function(){
		document.getElementById('terminalTextInput').value = "";
	}

	// Opening links in a new window
	var openLinkInNewWindow = function(linkToOpen){
		window.open(linkToOpen, '_blank');
		clearInput();
		hideSpinner();
	}

	// Ascii Spinner
	var showSpinner = function() {
		$('.spinner').show();
		$('#terminalTextInput').blur();
	}

	var hideSpinner = function() {
		$('.spinner').hide();
		$('#terminalTextInput').focus();
	}

	function sleep(delay) {
		var start = new Date().getTime();
		while (new Date().getTime() < start + delay);
	}

	var session = function() {
		// Retrieve the object from storage
		if(sessionStorage.getItem('session')) {
			var retrievedSession = sessionStorage.getItem('session');
		} else {
			// Random Number Generator
			var randomNo = Math.floor((Math.random() * 1000) + 1);
			// get Timestamp
			var timestamp = Date.now();
			// get Day
			var date = new Date();
			var weekday = new Array(7);
			weekday[0] = "Sunday";
			weekday[1] = "Monday";
			weekday[2] = "Tuesday";
			weekday[3] = "Wednesday";
			weekday[4] = "Thursday";
			weekday[5] = "Friday";
			weekday[6] = "Saturday";
			var day = weekday[date.getDay()];
			// Join random number+day+timestamp
			var session_id = randomNo+day+timestamp;
			// Put the object into storage
			sessionStorage.setItem('session', session_id);
			var retrievedSession = sessionStorage.getItem('session');
		}
		return retrievedSession;
		// console.log('session: ', retrievedSession);
	}

	// Suggestions
	var addTextToOption = function(textToAdd){
		document.getElementById('suggestion').innerHTML = "";
		for(i=0;i<textToAdd.length;i++) {
			document.getElementById('suggestion').innerHTML += "<span ng-click='submitForm()'>" + textToAdd[i] + "</span>";
		}
		scrollToBottomOfResults();
	}

	$(document).on("click", "#suggestion span", function() {
		formData.ques = this.innerText;
		clearInput();
		$scope.submitForm(formData);
		document.getElementById('suggestion').innerHTML = "";
	});


	// Simple Hi Get (Initialization of Bot Server)
	var mysession = session();
	showSpinner();
	$http({
		method: 'POST',
		url: 'https://bot.foofys.com/mybot',
		data: {
			'query': 'Hi',
			'sessionId': mysession
		},
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(function successCallback(response) {
			// this callback will be called asynchronously
			// when the response is available
			$scope.posts = response;
			// console.log($scope.posts);
			var speechData = $scope.posts.data.output.speech;
			speechData = speechData.replace(new RegExp('\r?\n','g'), '<br />');
			addTextToResults(speechData);
			var suggLength = $scope.posts.data.output.messages.length;
			// console.log(suggLength);
			if($scope.posts.data.output.messages){
				if(suggLength > 1) {
					addTextToOption($scope.posts.data.output.messages[1].replies);
				} else {
					// console.log('No suggestions - '+ suggLength);
				}
			}
			// console.log("Yipee! Bot activated :) ");
			hideSpinner();
	}, function errorCallback(response) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
		addTextToResults(" Error Connecting to bot server 😴 ");
		addTextToResults(" We have informed the 💀 web-master 😈.");
		console.log("Error Connecting to bot server :( ");
		console.log("Get in touch at ashwinkshenoy@gmail.com.com ");
		hideSpinner();
	});

	// save and retrieve data from storage
	// var savedinput = function(formVal) {
	// 	var getinput = JSON.parse(localStorage.getItem('saveinput'));
	// 	if(getinput == null) {
	// 		var inputval = [];
	// 		inputval[0] = formVal;
	// 		localStorage.setItem("saveinput", JSON.stringify(inputval));
	// 	} else {
	// 		getinput[(getinput.length)] = formVal;
	// 		localStorage.setItem("saveinput", JSON.stringify(getinput));
	// 		// console.log(getinput.length);
	// 	}
	// }

	// if (localStorage.getItem('saveinput')){
	// 	var historyIndex = JSON.parse(localStorage.getItem('saveinput')).length;
	// 	var historyCount = JSON.parse(localStorage.getItem('saveinput')).length;
	// 	var historyinput = JSON.parse(localStorage.getItem('saveinput'));
	// 	console.log(historyIndex);
	// }

	// document.onkeydown = function(e) {
	// // $scope.key = function($event){
	// 	if (localStorage.getItem('saveinput')){
	// 		switch (e.keyCode) {
	// 			case 38:
	// 				// UP KEY
	// 				historyIndex--;
	// 				if (historyIndex < 0){
	// 					historyIndex++;
	// 				}
	// 				clearInput();
	// 				$("#terminalTextInput").val(historyinput[historyIndex]);
	// 				formData.ques = historyinput[historyIndex];
	// 				console.log(historyinput[historyIndex]);
	// 				break;
	// 			case 40:
	// 				// DOWN KEY
	// 				historyIndex++;
	// 				if (historyIndex > historyCount-1) {
	// 					historyIndex--;
	// 				}
	// 				clearInput();
	// 				$("#terminalTextInput").val(historyinput[historyIndex]);
	// 				formData.ques = historyinput[historyIndex];
	// 				console.log(historyinput[historyIndex]);
	// 				break;
	// 		}
	// 	} else {
	// 		console.log("no old cmds");
	// 	}
	// };
	// save and retrieve data from storage - end



	$scope.submitForm = function(ques) {
		$('#suggestion').html('');
		formData = ques;
		$scope.path = "img/plain.jpg";
		$scope.res = "";

		// Having a specific text reply to specific strings
		var textReplies = function() {

			// Create/call sessionid
			var mysession = session();

			// Save input to local storage
			// savedinput(formData.ques);
			// console.log(formData.ques);

			switch(textInputValueLowerCase){

				case "youtube":
					clearInput();
					addTextToResults("Type youtube + something to search for.");
					hideSpinner();
				break;

				case "google":
					clearInput();
					addTextToResults("Type google + something to search for.");
					hideSpinner();
				break;

				default:
					clearInput();
					// Use your api.ai url else u'll train my bot
					var url = 'https://bot.foofys.com/mybot';
					$http({
						method: 'POST',
						url: url,
						data: {
							'query': formData.ques,
							'sessionId': mysession
						},
						headers: {
							'Content-Type': 'application/json'
						}
					}).
					success(function(data, status, headers, config) {
						$scope.posts = data;
						// console.log($scope.posts);
						var speechData = $scope.posts.output.speech;
						speechData = speechData.replace(new RegExp('\r?\n','g'), '<br />');
						var action = $scope.posts.action;
						var params = $scope.posts.parameters;
						switch(action) {
							case "action.speak":
								addTextToResults(speechData);
								speak(params.speech);
							break;

							case "action.clean":
								addTextToResults(speechData);
								document.getElementById('terminalResultsCont').innerHTML = "";
								addTextToResults("Cleared!");
							break;

							case "action.search":
								addTextToResults(speechData);
								openLinkInNewWindow('https://www.google.com/search?q=' + params.search);
							break;

							case "action.browse":
								addTextToResults(speechData);
								openLinkInNewWindow('http://www.'+params.domain);
							break;

							case "action.update":
								document.getElementById('terminalResultsCont').innerHTML ="Updating TerBot...<br>";
								setTimeout( function() {
									addTextToResults("System is Fetching data head!");
								}, 1000 );
								setTimeout( function() {
									addTextToResults("System is Up-to date!");
								}, 3000 );
							break;

							case "action.reboot":
								showSpinner();
								$('.angry.reload').show();
								setTimeout( function() {
									$('.angry.reload').fadeOut(1000);
								}, 3000);
								document.getElementById('terminalResultsCont').innerHTML = "";
								setTimeout( function() {
									showSpinner();
									addTextToResults("Rebooting TerBot...");
									addTextToResults("System is going down!");
								}, 1000 );
								setTimeout( function() {
									showSpinner();
									document.getElementById('terminalResultsCont').innerHTML = "";
									addTextToResults("-------------------------------------<h1>Hi, I am <span class='craft'>TerBot</span></h1>-------------------------------------<p>Let's Get Started!</p><p>Try typing 'Hi' or 'News' or 'Weather in Bangalore'</p>-------------------------------------");
									hideSpinner();
								}, 3000 );
							break;

							case "action.slang":
								addTextToResults(speechData);
								$('.angry.slang').show();
								setTimeout( function() {
									$('.angry.slang').fadeOut(1000);
								}, 3000);
							break;

							case "action.restaurant":
								addTextToResults(speechData);
								addSlider($scope.posts);
								// console.log($scope.posts.data.zomato)
								hideSpinner();
							break;

							case "action.person":
								addTextToResults(speechData);
								if(speechData != "") {
                  var img_path = $scope.posts.output.data.image;
									$('.s_p_img').fadeIn();
									if(img_path != "") {
										$scope.path = img_path;
										setTimeout( function() {
											$('.s_p_img').fadeOut(3000);
										}, 5000);
									}
								} else {
									addTextToResults("Oops! 🤦 Couldn't get that. Let's try something different. 🤔");
								}
							break;

							default:
								if(speechData) {
									addTextToResults(speechData);
								} else {
									addTextToResults("Oops! 🤦 Couldn't get that. Let's try something different. 🤔");
								}
							break;
						}
						// Suggestions Check if available in API
						if($scope.posts.output.messages){
							var suggLength = $scope.posts.output.messages.length;
							if(suggLength > 1) {
								addTextToOption($scope.posts.output.messages[1].replies);
							} else {
								// console.log('No suggestions - '+ suggLength);
							}
						}
						// console.log($scope.posts.output.messages[1].replies);
						hideSpinner();
						clearInput();
					}).
					error(function(data, status, headers, config) {
						hideSpinner();
						addTextToResults("Error occured. Plz Try Again!");
						clearInput();
					});
				break;
			}
		}

		// Main function to check the entered text and assign it to the correct function
		var checkWord = function() {
			textInputValue = formData.ques.trim(); //get the text from the text input to a variable
			textInputValueLowerCase = textInputValue; //get the lower case of the string
			showSpinner();

			//event.preventDefault();
			if (textInputValue != ""){ //checking if text was entered
				addTextToUser(textInputValue);
				if (textInputValueLowerCase.substr(0,8) == "youtube ") {
					addTextToResults("<i>I've searched on YouTube for " + "<b>" + textInputValue.substr(8) + "</b>" + " it should be opened now.</i>");
					openLinkInNewWindow('https://www.youtube.com/results?search_query=' + textInputValueLowerCase.substr(8));
				} else if (textInputValueLowerCase.substr(0,5) == "wiki "){
					addTextToResults("<i>I've searched on Wikipedia for " + "<b>" + textInputValue.substr(5) + "</b>" + " it should be opened now.</i>");
					openLinkInNewWindow('https://wikipedia.org/w/index.php?search=' + textInputValueLowerCase.substr(5));
				} else{
					textReplies();
				}
			} else {
				addTextToResults("Yo! Type something :)");
				hideSpinner();
			}
		};

		checkWord();
	};

});
