var app = angular.module('mainApp', []);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }
]);

app.controller('PostsCtrl', function($scope, $http) {

  // Get the focus to the text input to enter a word right away.
  document.getElementById('terminalTextInput').focus();

  // Scroll to the bottom of the results div
  var scrollToBottomOfResults = function(){
    var terminalResultsDiv = document.getElementById('terminalReslutsCont');
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
  }

  // Add Text to terminal
  var addTextToResults = function(textToAdd){
    document.getElementById('terminalReslutsCont').innerHTML += "<p>" + textToAdd + "</p>";
    scrollToBottomOfResults();
  }
  var addTextToUser = function(textToAdd){
    document.getElementById('terminalReslutsCont').innerHTML += "<p class='userEnteredText'>> " + textToAdd + "</p>";
    scrollToBottomOfResults();
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
  addTextToResults("-------------------------------------<h1>Hi, I am <span class='craft'>TerBot</span></h1>-------------------------------------<p>Let's Get Started!</p><p>Try typing 'Hi' or 'News' or 'Today's Quote'</p>-------------------------------------");

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

  // save and retrieve data from storage
  // var savedinput = function(formVal) {
  //   var getinput = JSON.parse(localStorage.getItem('saveinput'));
  //   if(getinput == null) {
  //     var inputval = [];
  //     inputval[0] = formVal;
  //     localStorage.setItem("saveinput", JSON.stringify(inputval));
  //   } else {
  //     getinput[(getinput.length)] = formVal;
  //     localStorage.setItem("saveinput", JSON.stringify(getinput));
  //     // console.log(getinput.length);
  //   }
  // }

  // angular.element(document).ready(function () {
  //   if (localStorage.getItem('saveinput')){
  //     var historyIndex = JSON.parse(localStorage.getItem('saveinput')).length;
  //     var historyCount = JSON.parse(localStorage.getItem('saveinput')).length;
  //     var historyinput = JSON.parse(localStorage.getItem('saveinput'));
  //     console.log(historyIndex);
  //   }
  // });

  // if (localStorage.getItem('saveinput')){
  //   var historyIndex = JSON.parse(localStorage.getItem('saveinput')).length;
  //   var historyCount = JSON.parse(localStorage.getItem('saveinput')).length;
  //   var historyinput = JSON.parse(localStorage.getItem('saveinput'));
  //   // console.log(historyIndex);
  // }

  // document.onkeydown = function(e) {
  // // $scope.key = function($event){
  //   if (localStorage.getItem('saveinput')){
  //     switch (e.keyCode) {
  //       case 38:
  //         // UP KEY
  //         historyIndex--;
  //         if (historyIndex < 0){
  //           historyIndex++;
  //         }
  //         clearInput();
  //         $("#terminalTextInput").val(historyinput[historyIndex]);
  //         break;
  //       case 40:
  //         // DOWN KEY
  //         historyIndex++;
  //         if (historyIndex > historyCount-1) {
  //           historyIndex--;
  //         }
  //         clearInput();
  //         $("#terminalTextInput").val(historyinput[historyIndex]);
  //         break;
  //     }
  //   } else {
  //     console.log("no old cmds");
  //   }
  // };
  // save and retrieve data from storage - end


  var formData = {
    ques: "null",
  };



  $scope.submitForm = function() {
    formData = $scope.form;
    $scope.path = "img/plain.jpg";
    $scope.res = "";

    // Having a specific text reply to specific strings
    var textReplies = function() {

      // Create/call sessionid
      var mysession = session();

      // Save input to locala storage
      // savedinput(formData.ques);

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
          var url = 'https://api.api.ai/v1/query?v=20150910&query='+formData.ques+'&lang=en-us&sessionId='+mysession;
          $http({
            method: 'GET',
            url: url,
            // data: {
            //   'query': formData.ques,
            //   'lang' : 'EN',
            //   'sessionId':mysession,
            // },
            headers: {
              // PLZ: Use your authorization key, else you will train my bot, not yours!
              'Authorization': 'Bearer 553ab6017e584e0fa351952c8c9ca956',
              'Content-Type': 'application/json'
            }
          }).
          success(function(data, status, headers, config) {
            $scope.posts = data;
            // console.log($scope.posts.result.parameters.speech);
            var speechData = $scope.posts.result.fulfillment.speech;
            var action = $scope.posts.result.action;
            var params = $scope.posts.result.parameters;
            switch(action) {
              case "action.speak":
                addTextToResults(speechData);
                speak(params.speech);
                break;

              case "action.clean":
                addTextToResults(speechData);
                document.getElementById('terminalReslutsCont').innerHTML ="";
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
                document.getElementById('terminalReslutsCont').innerHTML ="Updating TerBot...<br>";
                setTimeout( function() {
                  addTextToResults("System is Fetching data head!");
                }, 1000 );
                setTimeout( function() {
                  addTextToResults("System is Up-to date!");
                }, 3000 );
                break;

              case "action.reboot":
                $('.angry.reload').show();
                setTimeout( function() {
                  $('.angry.reload').fadeOut(1000);
                }, 3000);
                document.getElementById('terminalReslutsCont').innerHTML ="Rebooting TerBot...<br>";
                setTimeout( function() {
                  addTextToResults("System is going down!");
                }, 1000 );
                setTimeout( function() {
                  addTextToResults("-------------------------------------<h1>Hi, I am <span class='craft'>TerBot</span></h1>-------------------------------------<p>Let's Get Started!</p><p>Try typing 'Hi' or 'News' or 'Weather in Bangalore'</p>-------------------------------------");
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

                function success(pos) {
                  showSpinner();
                  var crd = pos.coords;

                  console.log('Your current position is:');
                  console.log('Latitude : ' + crd.latitude);
                  console.log('Longitude: ' + crd.longitude);

                  var url = 'https://chat-bot-1.herokuapp.com/webhooks';
                  $http({
                    method: 'POST',
                    url: url,
                    data: {
                      "result": {
                        "resolvedQuery": $scope.posts.result.resolvedQuery,
                        "action" : "action.restaurant",
                        "sessionId": $scope.posts.sessionId,
                        "latitude": crd.latitude,
                        "longitude": crd.longitude
                      }
                    },
                  }).
                  success(function(data, status, headers, config) {
                    $scope.res = data;
                    addTextToResults($scope.res.displayText);
                    console.log($scope.res.data);
                    hideSpinner();
                  }).
                  error(function(data, status, headers, config) {
                    hideSpinner();
                    addTextToResults("Error occured. Plz Try Again!");
                    clearInput();
                  });
                };

                function error(err) {
                  console.warn('ERROR(' + err.code + '): ' + err.message);
                  // addTextToResults("Please enable location, so that we can help you out better!<br /> In case you blocked it, you can enable it by clicking on location icon on the address bar and clear the settings!");
                };

                navigator.geolocation.getCurrentPosition(success, error);
              break;

              case "action.person":
                addTextToResults(speechData);
                if(speechData != "") {
                  var img_path = $scope.posts.result.fulfillment.data.image;
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
      textInputValueLowerCase = textInputValue.toLowerCase(); //get the lower case of the string
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

