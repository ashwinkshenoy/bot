var app = angular.module('mainApp', []);

app.config([
  '$httpProvider',
  function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  },
]);

app.controller('PostsCtrl', function ($scope, $http) {
  var formData = {
    ques: 'null',
  };

  // Get the focus to the text input to enter a word right away.
  document.getElementById('terminalTextInput').focus();

  // Scroll to the bottom of the results div
  var scrollToBottomOfResults = function () {
    var terminalResultsDiv = document.getElementById('terminalResultsCont');
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
  };

  // Add Text to terminal
  var addTextToResults = function (textToAdd) {
    document.getElementById('terminalResultsCont').innerHTML += '<p>' + textToAdd + '</p>';
    scrollToBottomOfResults();
  };
  var addTextToUser = function (textToAdd) {
    document.getElementById('terminalResultsCont').innerHTML += "<p class='userEnteredText'>> " + textToAdd + '</p>';
    scrollToBottomOfResults();
  };

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
  addTextToResults(
    "-------------------------------------<h1>Hi, I am <span class='terbot'>TerBot</span></h1>-------------------------------------<p>Let's Get Started!</p><p>Try typing 'Hi' or 'Today's Quote'</p>-------------------------------------"
  );

  // Clear text input
  var clearInput = function () {
    document.getElementById('terminalTextInput').value = '';
  };

  // Opening links in a new window
  var openLinkInNewWindow = function (linkToOpen) {
    window.open(linkToOpen, '_blank');
    clearInput();
    hideSpinner();
  };

  // Ascii Spinner
  var showSpinner = function () {
    $('.spinner').show();
    $('#terminalTextInput').blur();
  };

  var hideSpinner = function () {
    $('.spinner').hide();
    $('#terminalTextInput').focus();
  };

  function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
  }

  // Suggestions
  var addTextToOption = function (textToAdd) {
    document.getElementById('suggestion').innerHTML = '';
    for (i = 0; i < textToAdd.length; i++) {
      document.getElementById('suggestion').innerHTML += "<span ng-click='submitForm()'>" + textToAdd[i] + '</span>';
    }
    scrollToBottomOfResults();
  };

  $(document).on('click', '#suggestion span', function () {
    formData.ques = this.innerText;
    clearInput();
    $scope.submitForm(formData);
    document.getElementById('suggestion').innerHTML = '';
  });

  // save and retrieve data from storage
  var savedinput = function (formVal) {
    var getinput = JSON.parse(localStorage.getItem('saveinput'));
    if (getinput == null) {
      var inputval = [];
      inputval[0] = formVal;
      localStorage.setItem('saveinput', JSON.stringify(inputval));
    } else {
      getinput[getinput.length] = formVal;
      localStorage.setItem('saveinput', JSON.stringify(getinput));
      // console.log(getinput.length);
    }
  };

  if (localStorage.getItem('saveinput')) {
    let historyIndex = JSON.parse(localStorage.getItem('saveinput')).length;
    let historyCount = JSON.parse(localStorage.getItem('saveinput')).length;
    let historyinput = JSON.parse(localStorage.getItem('saveinput'));
  }

  document.onkeydown = function (e) {
    historyIndex = JSON.parse(localStorage.getItem('saveinput')).length;
    historyCount = JSON.parse(localStorage.getItem('saveinput')).length;
    historyinput = JSON.parse(localStorage.getItem('saveinput'));
    // $scope.key = function($event){
    if (localStorage.getItem('saveinput')) {
      switch (e.keyCode) {
        case 38:
          // UP KEY
          historyIndex--;
          if (historyIndex < 0) {
            historyIndex++;
          }
          clearInput();
          $('#terminalTextInput').val(historyinput[historyIndex]);
          formData.ques = historyinput[historyIndex];
          break;
        case 40:
          // DOWN KEY
          historyIndex++;
          if (historyIndex > historyCount - 1) {
            historyIndex--;
          }
          clearInput();
          $('#terminalTextInput').val(historyinput[historyIndex]);
          formData.ques = historyinput[historyIndex];
          break;
      }
    } else {
      console.log('no old cmds');
    }
  };
  // save and retrieve data from storage - end

  $scope.submitForm = function (ques) {
    $('#suggestion').html('');
    formData = ques;
    $scope.path = 'img/plain.jpg';
    $scope.res = '';

    // Having a specific text reply to specific strings
    var textReplies = function () {
      // Save input to local storage
      savedinput(formData.ques);
      // console.log(formData.ques);

      switch (textInputValueLowerCase) {
        default:
          clearInput();
          // Use your OPENAI Token, else u'll train my bot
          var url = 'https://api.openai.com/v1/chat/completions';
          $http({
            method: 'POST',
            url: url,
            data: {
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'user',
                  content: formData.ques,
                },
              ],
            },
            headers: {
              'Content-Type': 'application/json',
              'OpenAI-Organization': 'org-az00G5ivf28Tpj0RMyKNtJJ6',
              Authorization: 'Bearer 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',
            },
          })
            .success(function (data, status, headers, config) {
              $scope.posts = data;
              console.log($scope.posts);
              var speechData = $scope.posts.choices?.[0]?.message?.content;
              if (speechData) {
                addTextToResults(speechData);
              } else {
                addTextToResults("Oops! 🤦 Couldn't get that. Let's try something different. 🤔");
              }
              // console.log($scope.posts.output.messages[1].replies);
              hideSpinner();
              clearInput();
            })
            .error(function (data, status, headers, config) {
              hideSpinner();
              addTextToResults('Error occured. Plz Try Again!');
              clearInput();
            });
          break;
      }
    };

    // Main function to check the entered text and assign it to the correct function
    var checkWord = function () {
      textInputValue = formData.ques.trim(); //get the text from the text input to a variable
      textInputValueLowerCase = textInputValue; //get the lower case of the string
      showSpinner();

      //event.preventDefault();
      if (textInputValue != '') {
        //checking if text was entered
        addTextToUser(textInputValue);
        if (textInputValueLowerCase.substr(0, 8) == 'youtube ') {
          addTextToResults(
            "<i>I've searched on YouTube for " +
              '<b>' +
              textInputValue.substr(8) +
              '</b>' +
              ' it should be opened now.</i>'
          );
          openLinkInNewWindow('https://www.youtube.com/results?search_query=' + textInputValueLowerCase.substr(8));
        } else if (textInputValueLowerCase.substr(0, 5) == 'wiki ') {
          addTextToResults(
            "<i>I've searched on Wikipedia for " +
              '<b>' +
              textInputValue.substr(5) +
              '</b>' +
              ' it should be opened now.</i>'
          );
          openLinkInNewWindow('https://wikipedia.org/w/index.php?search=' + textInputValueLowerCase.substr(5));
        } else {
          textReplies();
        }
      } else {
        addTextToResults('Yo! Type something :)');
        hideSpinner();
      }
    };

    checkWord();
  };
});
