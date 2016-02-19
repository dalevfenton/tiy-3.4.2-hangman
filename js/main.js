(function(){


//------------------------------------------------------------------------------
//                       INTITIALIZE APPLICATION STATE
//------------------------------------------------------------------------------
  //filter list of commonWords to down to those with 4 letters or more
  var usefulWords = commonWords.filter(function(value){
    if(value.length > 3){
      return true;
    }else{
      return false;
    }
  });
  //get a random word from our list of usable words
  var randomWord = _.sample(usefulWords);
  console.log(randomWord);
  var gameBoard = document.querySelector('.game-board');
  var indicator = document.querySelector('.indicator');
  var numGuesses = 10;
  var guesses = [];
  var boardDisplay = {};
  // _.each(randomWord, function(element, index, list){
  //   boardDisplay[element] =
  // });
  updateIndicator();
  outputToBoard(randomWord, guesses);
  function outputToBoard( randomWord, guesses ){
    var outputStr = '';
    _.each( randomWord, function(value, indexVal, arr){
      if(guesses.indexOf(value) > -1 ){
        outputStr += '<span class="letter letter-' + indexVal + '">' + value + '</span>';
      }else{
        outputStr += '<span class="letter letter-' + indexVal + '"></span>';
      }
    });
    gameBoard.innerHTML = outputStr;
  }
  function updateIndicator(){
    indicator.innerHTML = 'Number of Guesses Left: ' + numGuesses;
  }
  function handleKey (){
    if(event.code.slice(0,3) == "Key"){
      console.log('key is: ' + event.code.slice(3,4));
      guesses.push(event.code.slice(3,4).toLowerCase());
      console.log(guesses);
      numGuesses--;
      updateIndicator();
      outputToBoard( randomWord, guesses );
    }else{
      console.log('not a valid letter');
    }
  }
  window.addEventListener('keypress', handleKey);
}());
