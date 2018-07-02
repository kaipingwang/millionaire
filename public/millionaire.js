var myTimer;
var id;
var count = 0;
var countTime = 60;
var money = 50;
var mytoken;
var height = 70;

function token() {// to get a new token 
  var Url = "https://opentdb.com/api_token.php?command=request";
  $.get(Url, function start(data) {
    mytoken = data.token;
  });

}

function resetToken() {// to reset the old token 
  var Url = "https://www.opentdb.com/api_token.php?command=reset&token="
      + mytoken;

}

function call(type, level) {

  var baseUrl = "https://opentdb.com/api.php?amount=1&type=" + type
      + "&difficulty=" + level + "&token=" + mytoken; // use the url to get the difficulty, level, and token
  // send off the query
  $.get(baseUrl, function searchCallback(data) {
    $('#question-box').empty();
    $('#answer0').empty();// clean the previous text on the element
    $('#answer1').empty();
    $('#answer2').empty();
    $('#answer3').empty();
    var arr = data.results[0].incorrect_answers;
    arr.push(data.results[0].correct_answer);
    arr.sort();// generate the random array
    $('#question-box').append("Q: " + data.results[0].question);
    $('#answer0').append((arr[0] == undefined ? "" : "A. " + arr[0]));// if the value of the element is undenfied, it does not show 
    $('#answer1').append((arr[1] == undefined ? "" : "B. " + arr[1]));// on the screen (True or False)
    $('#answer2').append((arr[2] == undefined ? "" : "C. " + arr[2]));
    $('#answer3').append((arr[3] == undefined ? "" : "D. " + arr[3]));
    countTime = 60;//the timer start from 60s
    height = 70;// the height of bar start from 70
    myTimer = setInterval(myCounter, 1000);// activate the Timer function
    id = setInterval(move, 1000);// activate the bar move function
    for (i = 0; i < 4; i++) {
      if (arr[i] == data.results[0].correct_answer) {// if it is correct answer, it sets the loop attribute
        $("#answer" + i).attr("loop", "loop");

      } else {
        $("#answer" + i).removeAttr("loop", "loop");
      }
    }

  });

};

$("#methods").change(function() {
  select();
  move();
});

$("#music").click(function() {
  var song = $("#background");
  song[0].play();
});
$('#answer0').click(function() {
  check('#answer0');
});
$('#answer1').click(function() {
  check('#answer1');
});
$('#answer2').click(function() {
  check('#answer2');
});
$('#answer3').click(function() {
  check('#answer3');
});
$('#fifty').click(
    function() {
      if ($("#answer0").attr("loop") == "loop"
          || $("#answer1").attr("loop") == "loop") {//choose the answer1 and answer2 if it is a correct answer , it will output the result.
        $('#answer0').text();                      // otherwise print the answer3 and answer4
        $('#answer1').text();
        $('#answer2').text("");
        $('#answer3').text("");
      } else {
        $('#answer0').text("");
        $('#answer1').text("");
        $('#answer2').text();
        $('#answer3').text();
      }
      $('#fifty').remove();
    });
$('#reStart').click(function() {
  location.reload();// restart the game
});

function check(element) {
  if ($(element).attr("loop") == "loop") {// if there is an loop attribute, it must be the correct answer.
    count++
    money = money + money;
    
    if (count == 3) {// fix the amount of money when user answer the third question. 
      money = 250;
    }
    if (count == 15) {// answer all the question
      winBigPrize();
      resetToken();
      return;
    };

    $("#amount" + (count - 1)).css({
      color : "white"
    });// cause the bar can move from white to red 
    $("#amount" + count).css({
      color : "red"
    });
    $('#money').text("$" + money);// show the accumulated money on the element
    levelChenage(count);
    stopCount();// clean the countdown in the timer element 
    stopMove();// clean the movement in the bar move element 
  } else {
    lose(count);
  }
}

function lose(count) {
  resetToken();
  $("#game").fadeOut('slow', function() {// disppear slowly on the screen 
    if (count > 5) {
      $("#game-over").html('You win at least 1000 pounds');// text shows  on the screen 
    } else {
      $("#game-over").html('Game Over!');
    }
    $("#game-over").fadeIn('slow');// slowly show up 
    $("#reStart").fadeIn('slow');
  });
}

function select() {
  var values = $("#methods").val();
  $("div").css({
    display : "block"// In the beginning the div element does show up 
  });
  $("#pre-start,#video").css({
    display : "none"// In the beginning the div element does show up 
  });
  levelChenage(0);// call change difficulty function 
}

function myCounter() {
  countTime--;
  var timer = $("#clock").text(countTime + "s");// show the remaining time
  if (countTime == 0) {
    lose()
    return;
  }

}

function stopCount() {
  clearInterval(myTimer);// clear the myTimer
}

function winBigPrize() {
  $("#game").fadeOut('slow', function() {
    $("#bigPrize").html('Congratulation Biggest Pize $ 1 million !!!!');
    $("#bigPrize").fadeIn('slow');
    $("#reStart").fadeIn('slow');
  });
}

function levelChenage(level) {

  if (level <= 5) {// difficulty is easy. question from 0-5
    $("#myBar").text("Easy Task");
    call($("#methods").val(), "easy");

  } else if (level <= 10) {
    $("#myBar").text("Medium Task")
    call($("#methods").val(), "medium");// give the method (true or false and difficulty to play the game)

  } else {
    $("#myBar").text("Hard Task")
    call($("#methods").val(), "hard");

  }

}

function move() {// bar can move
  var elem = document.getElementById("myBar");
      height= height-1.16;
      elem.style.height = height + '%';
}

function stopMove() {
  clearInterval(id);
}


window.onload = token;// the window start from this function
