(function(){


//------------------------------------------------------------------------------
//                       INTITIALIZE APPLICATION STATE
//------------------------------------------------------------------------------
  //filter list of commonWords to down to those with 3 letters or more
  var usefulWords = commonWords.filter(function(value){
    if(value.length >= 3){
      return true;
    }else{
      return false;
    }
  });


function getRandomWord(){
  var length =  Math.floor(5*Math.random() + 4);
  $.ajax({
    type: "GET",
    url: ('http://randomword.setgetgo.com/get.php'),
    data: {
      len: length
    },
    dataType: "jsonp"
  }).done(function(data){
    initializeGame( data );
  });
}
getRandomWord();
// var apiWord = RandomWord();
  //     function RandomWordComplete(data) {
  //         console.dir(data);
  //     }
  // for(var i=0; i<10; i++){
  //   RandomWord().done( function(result){
  //     console.log(result);
  //   });
  // }
  //declare variables
  var randomWord, numGuesses, alphabetObj;
  var gamesWon = 0;
  var gamesLost = 0;
  var gameBoard = document.querySelector('.game-board');
  var indicator = document.querySelector('.indicator');
  var guessLetters = document.querySelector('.guessed-letters');
  var winScreen = document.querySelector('.winner');
  var loseScreen = document.querySelector('.loser');
  var restart = document.querySelector('.restart');
  var wrong_audio = new Audio('sounds/wrong.mp3');
  var right_audio = new Audio('sounds/right.mp3');
  var restart_audio = new Audio('sounds/restart.mp3');
  document.querySelector('#wins').innerHTML = gamesWon;
  document.querySelector('#losses').innerHTML = gamesLost;

  function initializeGame(word){
    console.log(word.Word);
    restart_audio.play();
    randomWord =  word.Word;
    alphabetObj = new Alphabet();
    numGuesses = 10;
    outputToBoard();
    updateIndicator();
    winScreen.innerHTML = '';
    loseScreen.innerHTML = '';
    winScreen.style.bottom = '';
    winScreen.classList.remove('frame-down');
    loseScreen.classList.remove('frame-down');
    // loseScreen.style.top = '-50%';
    // console.log(alphabetObj);
    // console.log(randomWord);
  }

  function outputToBoard(  ){
    var outputStr = '';
    _.each( randomWord, function(value, indexVal, arr){
      if(alphabetObj[value].correct === true ){
        outputStr += '<span class="letter letter-' + indexVal + '">' + value + '</span>';
      }else{
        outputStr += '<span class="letter letter-' + indexVal + '"></span>';
      }
    });
    gameBoard.innerHTML = outputStr;
  }

  function updateIndicator(){
    //Main Indicator Window
    indicator.innerHTML = 'Number of Guesses Left: ' + numGuesses;
    alphaOutput = '';

    //Update our Alphabet Display with Guessed Letters
    _.each(alphabetObj, function(value, indexVal, arr){
      var prefix = '<span class="letter ';
      if(value.isVowel === true){
        prefix += 'letter-vowel';
      }
      if(value.guessed === true){
        if(value.correct === true){
          alphaOutput += prefix + ' letter-correct">' + indexVal + '</span>';
        }else{
          alphaOutput += prefix + ' letter-wrong">' + indexVal + '</span>';
        }
      }else{
        alphaOutput += prefix + ' letter-not-guessed">' + indexVal + '</span>';
      }
    });
    guessLetters.innerHTML = alphaOutput;
  }

  function checkWin(){
    var win = true;
    _.each(randomWord, function(value){
      if(alphabetObj[value].correct === false){
        win = false;
      }
    });
    // console.log(win);
    return win;
  }

  function checkLose(){
    var lose = false;
    if(numGuesses === 0){
      lose = true;
    }
    return lose;
  }


  function handleKey (){
    if(event.code.slice(0,3) == "Key"){
      var key = event.code.slice(3,4).toLowerCase();
      // console.log('key is: ' + event.code.slice(3,4));
      if(alphabetObj[key].guessed === true){
        //key was already guessed
        wrong_audio.play();
        updateIndicator();
        flashWarn('You Already Guessed That Letter');
      }else{
        alphabetObj[key].guessed = true;
        if(randomWord.indexOf(key) > -1){
          //key was correct
          alphabetObj[key].correct = true;
          right_audio.play();
          updateIndicator();
          flashGood('You Were Correct');
        }else{
          //letter was incorrect
          wrong_audio.play();
          updateIndicator();
          flashWarn('Sorry That Letter Is Not Correct');
          numGuesses--;
        }
      }

      outputToBoard();

      if(checkWin()){
        winScreen.classList.add('frame-down');
        winScreen.innerHTML = '<span class="win-msg restart-game">Great Job!</br>Click or Hit Enter to Restart Game</span><iframe class="youtube" width="420" height="315" src="https://www.youtube.com/embed/NubH5BDOaD8?start=115&controls=0&amp;showinfo=0&autoplay=1" frameborder="0" allowfullscreen></iframe>';
        gamesWon += 1;
        updateGames();
      }
      if(checkLose()){
        loseScreen.classList.add('frame-down');
        loseScreen.innerHTML = '<span class="lose-msg restart-game">Sorry You Didn\'t Win</br>Please Try Again!</br>Click or Hit Enter to Restart Game</span><iframe class="youtube" width="560" height="315" src="https://www.youtube.com/embed/TnOdAT6H94s?start=128&controls=0&amp;showinfo=0&autoplay=1" frameborder="0" allowfullscreen></iframe>';
        gamesLost += 1;
        updateGames();
      }
    }else if(event.code == 'Enter'){
      getRandomWord();
    }else{
      //flash indicator with warning;
      wrong_audio.play();
      flashWarn('Not A Letter');
    }
  }

  function updateGames(){
    document.querySelector('#wins').innerHTML = gamesWon;
    document.querySelector('#losses').innerHTML = gamesLost;
  }
  function flashWarn( warning ){
    indicator.innerHTML += '<br>' + warning + '!';
    indicator.classList.add('indicator-red');
    window.setTimeout( function(){ indicator.classList.remove('indicator-red'); } , 250);
    window.setTimeout( function(){ indicator.classList.add('indicator-red'); } , 500);
    window.setTimeout( function(){ indicator.classList.remove('indicator-red'); } , 750);
  }
  function flashGood( success ){
    indicator.innerHTML += '<br>' + success + '!';
    indicator.classList.add('indicator-green');
    window.setTimeout( function(){ indicator.classList.remove('indicator-green'); } , 250);
    window.setTimeout( function(){ indicator.classList.add('indicator-green'); } , 500);
    window.setTimeout( function(){ indicator.classList.remove('indicator-green'); } , 750);
  }
  window.addEventListener('keypress', handleKey);
  winScreen.addEventListener('click', getRandomWord);
  loseScreen.addEventListener('click', getRandomWord);
  restart.addEventListener('click', getRandomWord);
}());
