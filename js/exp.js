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

  // Initial Text
  addTextToResults("-------------------------------------<h1>Hi, I am <span class='craft'>TerBot</span></h1>-------------------------------------<p>Let's Get Started!</p><p>Try typing 'Hi' or 'News' or 'Weather in Bangalore'</p>-------------------------------------");

  // Clear text input
  var clearInput = function(){
    document.getElementById('terminalTextInput').value = "";
    // hideSpinner();
  }

  // Opening links in a new window
  var openLinkInNewWindow = function(linkToOpen){
    window.open(linkToOpen, '_blank');
    clearInput();
  }

  // Getting the time and date and post it depending on what you request for
  var getTimeAndDate = function(postTimeDay){
    var timeAndDate = new Date();
    var timeHours = timeAndDate.getHours();
    var timeMinutes = timeAndDate.getMinutes();
    var dateDay = timeAndDate.getDate();
    console.log(dateDay);
    var dateMonth = timeAndDate.getMonth() + 1; // Because JS starts counting months from 0
    var dateYear = timeAndDate.getFullYear(); // Otherwise we'll get the count like 98,99,100,101...etc.

    if (timeHours < 10){ // if 1 number display 0 before it.
      timeHours = "0" + timeHours;
    }

    if (timeMinutes < 10){ // if 1 number display 0 before it.
      timeMinutes = "0" + timeMinutes;
    }

    var currentTime = timeHours + ":" + timeMinutes;
    var currentDate = dateDay + "/" + dateMonth + "/" + dateYear;

    if (postTimeDay == "time"){
      addTextToResults(currentTime);
    }
    if (postTimeDay == "date"){
      addTextToResults(currentDate);
    }
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
    ques: "default",
  };

  $scope.save = function() {
    formData = $scope.form;
    console.log(formData);
  };

  $scope.submitForm = function() {
    // console.log("posting data....");
    formData = $scope.form;


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

        case "i love you":
        case "love you":
        case "love":
          clearInput();
          addTextToResults("Aww! That's so sweet 😍. Here's some love for you too ❤ ❤ ❤ !");
          hideSpinner();
          break;

        case "git":
          clearInput();
          addTextToResults("git is already installed! <br> git version 1.9.1");
          hideSpinner();
          break;

        case "git status":
          clearInput();
          addTextToResults("nothing to commit, working directory clean!");
          hideSpinner();
          break;

        case "git push origin master":
          clearInput();
          addTextToResults("Yeah! Push me baby!");
          hideSpinner();
          break;

        case "cat":
          clearInput();
          addTextToResults("Meow!! 🐱<br> psst: try typing (cat videos)");
          hideSpinner();
          break;

        case "what the":
        case "wtf":
          clearInput();
          addTextToResults("Really! F*** off!");
          hideSpinner();
          break;

        case "cat videos":
        case "cat v":
          addTextToResults("Okay I'll show you some in YouTube.");
          openLinkInNewWindow('https://www.youtube.com/results?search_query=cat videos');
          hideSpinner();
          break;

        case "lol":
        case "trololo":
          addTextToResults("Mr. Trololo!");
          openLinkInNewWindow('https://www.youtube.com/watch?v=1uTAJG3Khes');
          hideSpinner();
          break;
        // funny replies [END]

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

        case "time":
          clearInput();
          getTimeAndDate("time");
          hideSpinner();
          break;

        case "date":
          clearInput();
          getTimeAndDate("date");
          hideSpinner();
          break;

        case "reboot":
        case "sudo reboot":
          clearInput();
          document.getElementById('terminalReslutsCont').innerHTML ="Rebooting TerBot...<br>";
          setTimeout( function() {
            addTextToResults("System is going down!");
          }, 1000 );
          setTimeout( function() {
            addTextToResults("-------------------------------------<h1>Hi, I am <span class='craft'>TerBot</span></h1>-------------------------------------<p>Let's Get Started!</p><p>Try typing 'Hi' or 'News' or 'Weather in Bangalore'</p>-------------------------------------");
            hideSpinner();
          }, 3000 );
          break;

        case "update":
        case "sudo apt-get update":
        case "apt-get update":
          clearInput();
          document.getElementById('terminalReslutsCont').innerHTML ="Updating TerBot...<br>";
          setTimeout( function() {
            addTextToResults("System is Fetching data head!");
          }, 1000 );
          setTimeout( function() {
            addTextToResults("System is Up-to date!");
            hideSpinner();
          }, 3000 );
          break;

        case "clear":
          clearInput();
          document.getElementById('terminalReslutsCont').innerHTML ="";
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
            //console.log($scope.posts.result);
            var speechData = $scope.posts.result.speech;
            hideSpinner();
            if(speechData) {
              addTextToResults("<p> " + speechData + "</p>");
            } else {
              addTextToResults("<p>Sorry couldn't get that!</p>");
            }
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
      textInputValue = document.getElementById('terminalTextInput').value.trim(); //get the text from the text input to a variable
      textInputValueLowerCase = textInputValue.toLowerCase(); //get the lower case of the string
      showSpinner();
      if (textInputValue != ""){ //checking if text was entered
        addTextToResults("<p class='userEnteredText'>> " + textInputValue + "</p>");
        if (textInputValueLowerCase.substr(0,5) == "open ") { //if the first 5 characters = open + space
          addTextToResults("<i>The URL " + "<b>" + textInputValue.substr(5) + "</b>" + " should be opened now.</i>");
          openLinkInNewWindow('http://' + textInputValueLowerCase.substr(5));
        } else if (textInputValueLowerCase.substr(0,8) == "youtube ") {
          addTextToResults("<i>I've searched on YouTube for " + "<b>" + textInputValue.substr(8) + "</b>" + " it should be opened now.</i>");
          openLinkInNewWindow('https://www.youtube.com/results?search_query=' + textInputValueLowerCase.substr(8));
        } else if (textInputValueLowerCase.substr(0,7) == "google ") {
          addTextToResults("<i>I've searched on Google for " + "<b>" + textInputValue.substr(7) + "</b>" + " it should be opened shortly.</i>");
          openLinkInNewWindow('https://www.google.com/search?q=' + textInputValueLowerCase.substr(7));
        } else if (textInputValueLowerCase.substr(0,5) == "wiki "){
          addTextToResults("<i>I've searched on Wikipedia for " + "<b>" + textInputValue.substr(5) + "</b>" + " it should be opened now.</i>");
          openLinkInNewWindow('https://wikipedia.org/w/index.php?search=' + textInputValueLowerCase.substr(5));
        } else{
          textReplies();
        }
      } else {
        addTextToResults("Yo! I am an A.I. Not your astrologer :)");
        hideSpinner();
      }
    };

    checkWord();
  };

});
