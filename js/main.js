(function(){
  var usefulWords = commonWords.filter(function(value){
    if(value.length > 3){
      return true;
    }else{
      return false;
    }
  });
  console.log(usefulWords);
}());
