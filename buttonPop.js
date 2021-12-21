var gameTick;
var t;
var gameState = "notStarted"; //running, paused, notStarted, gameOver

function startBtn(){
	//This function is run on the button that starts the game, that same button will pause it if the game is running and unpause if the game is paused
	if (gameState == "running") { //this must be the first check on the button, so that pauses are as instantaneous as possible
		pause();
	} else if (gameState == "paused") {
		play();
	} else if (gameState == "notStarted") {
		t = 0; //t for time elapsed
		play();
	}
}

function play(){
	var btn;
	gameTick = setInterval(function(){
			t++;
			btn = document.getElementById("btn" + randomInt(1, 9));
			btn.innerHTML = "+1";
			btn.classList.add("green");
			btn.classList.remove("silver");
			//document.getElementById("HS").innerHTML =  t; //Temporarily displaying the tick where High Scores will go as a way of proving tick is happening
		}, 1000); //Using 1000 for now to run this once per second. It's hard to know how often this should run, and I think I'm going to need to do some trial and error at some point once I have more stuff built. 33 would make the game run at roughly 30 gameTicks per Second, which I was thinking would be ideal because of the 30fps standard for games that don't need super responsiveness, but this isn't frames of animation!
	gameState = "running";
	document.getElementById("startBtn").innerHTML = "pause";
}

function pause(){
	clearInterval(gameTick);
	gameState = "paused";
	document.getElementById("startBtn").innerHTML = "unpause";
}

function randomInt(min, max) {
	//lifted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random getRandomIntInclusive
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}