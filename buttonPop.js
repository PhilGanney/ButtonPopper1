var gameTick;
var t;
var gameState = "notStarted"; //running, paused, notStarted, gameOver

function startBtn(){
	//This function is run on the button that starts the game, that same button will pause it if the game is running and unpause if the game is paused
	if (gameState == "running") { //this must be the first check on the button, so that pauses are as instantaneous as possible
		pause();
	} else if (gameState == "paused") {
		gameTick = setInterval(function(){
			t++;
			document.getElementById("HS").innerHTML =  t; //Temporarily displaying the tick where High Scores will go as a way of proving tick is happening
		}, 1000);
		gameState = "running";
		document.getElementById("startBtn").innerHTML = "pause";
	} else if (gameState == "notStarted") {
		t = 0; //t for time elapsed
		gameTick = setInterval(function(){
			t++;
			document.getElementById("HS").innerHTML =  t; //Temporarily displaying the tick where High Scores will go as a way of proving tick is happening
		}, 1000);
		gameState = "running";
		document.getElementById("startBtn").innerHTML = "pause";
	}
}


function pause(){
	clearInterval(gameTick);
	gameState = "paused";
	document.getElementById("startBtn").innerHTML = "unpause";
}
