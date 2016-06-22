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
  addTextToResults("-------------------------------------<h1>Hi, I am <span class='craft'>TerBot</span></h1>-------------------------------------<p>Let's Get Started!</p><p>Try typing 'Hi' or 'News' or 'Weather in Bangalore'</p>-------------------------------------");

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

  var formData = {
    ques: "null",
  };

  $scope.submitForm = function() {
    var formData = $scope.form;

    // Having a specific text reply to specific strings
    var textReplies = function() {
      switch(textInputValueLowerCase){
        // funny replies [START]
        case "ashwin":
          clearInput();
          addTextToResults("He's my maker <a target='_blank' href='https://twitter.com/ashwinkshenoy'>@ashwinkshenoy</a>");
          hideSpinner();
          break;

        case "mohan":
          clearInput();
          addTextToResults("He's Been called the joker @foofys");
          hideSpinner();
          break;

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
          var url = "https://api.api.ai/v1/query";
          $http({
            method: 'post',
            url: url,
            data: {
              'query': formData.ques,
              'lang' : 'EN',
            },
            headers: {
              // PLZ: Use your authorization key, else you will train my bot, not yours!
              'Authorization': 'Bearer 553ab6017e584e0fa351952c8c9ca956',
              'Content-Type': 'application/json'
            }
          }).
          success(function(data, status, headers, config) {
            $scope.posts = data;
            // console.log($scope.posts.result.parameters.speech);
            var speechData = $scope.posts.result.speech;
            var action = $scope.posts.result.action;
            var params = $scope.posts.result.parameters;
            switch(action) {
              case "action.speak":
                addTextToResults("<p> " + speechData + "</p>");
                speak(params.speech);
                break;

              case "action.clean":
                addTextToResults("<p> " + speechData + "</p>");
                document.getElementById('terminalReslutsCont').innerHTML ="";
                break;

              case "action.search":
                addTextToResults("<p> " + speechData + "</p>");
                openLinkInNewWindow('https://www.google.com/search?q=' + params.search);
                break;

              case "action.browse":
                addTextToResults("<p> " + speechData + "</p>");
                openLinkInNewWindow('http://www.'+params.domain);
                break;

              case "action.quote":
                $http({
                  method : "post",
                  url : "https://andruxnet-random-famous-quotes.p.mashape.com/?cat=famous",
                  headers: {
                    // PLZ: Use your authorization keys (its free)!!
                    // Link : https://market.mashape.com/andruxnet/random-famous-quotes
                    'X-Mashape-Key': 'mcC6PSAJWFmshJcL3ZnBsNUdRXZXp1NKslVjsnoqC0Xlmpxkxx',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                  }
                }).
                success(function(response) {
                  // console.log(response.joke);
                  addTextToResults("<p>"+response.quote+"</p>");
                  addTextToResults("<p>--"+response.author+"</p>");
                }).
                error(function(response) {
                  //$scope.myWelcome = response.statusText;
                  console.log("Error occured!");
                });
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
                addTextToResults("<p> " + speechData + "</p>");
                $('.angry.slang').show();
                setTimeout( function() {
                  $('.angry.slang').fadeOut(1000);
                }, 3000);
                break;

              default:
                if(speechData) {
                  addTextToResults("<p> " + speechData + "</p>");
                } else {
                  addTextToResults("<p>Sorry couldn't get that. I am still under Training!</p>");
                }
                break;
            }
            hideSpinner();
            clearInput();
          }).
          error(function(data, status, headers, config) {
            hideSpinner();
            addTextToResults("<p>Error occured. Plz Try Again!</p>");
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
        addTextToResults("<p class='userEnteredText'>> " + textInputValue + "</p>");
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
$(function() {
});
