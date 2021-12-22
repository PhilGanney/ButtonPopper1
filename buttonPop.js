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
			btn.onclick = function() {goodBtn(1, this);} //Multiple notes on this line a) this uses an anonymous function to call our main function, but we need the main function to know what button is calling it, which it wouldn't be able to get from the "this" keyword, so we pass it here. b) can't put btn.onclick = goodBtn(1); as that would immediatly call the function, thought I could do btn.addEventListener("click", goodBtn, 1); but that doesn't actually work and it seems the only way to get addEventListener to work with a param is to use a polyfiller or an anonymous function anyway, so there's no advantage I can see
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

function goodBtn(n, btn){
	if (gameState == "running") {
		//n is an integer that we add to the score
		//btn is the button - this function is called indirectly via an anonymous function, so using the "this" keyword in this function wouldn't get the button but we can use "this" in the anonymous function and pass it down
		let cs = document.getElementById("CS");
		cs.innerHTML = (parseInt(cs.innerHTML) + n) + ""; //innerHTML is a string, but we want to do integer addition to it, so this takes the innerHTML as a string, converts it to integer, adds n, then converts that result back to a string via string concatenation with an empty string, and finally sets it back into the innerHTML

		btn.classList.remove("green");
		btn.classList.add("silver");
		btn.innerHTML = "0";
	}
}

/*by "via class" we mean by removing or adding a class called "hidden" that sets css display to none
Use in conjuction with hideViaClass(id) and a css class called "hidden".
This is a slight change in how I've done this technique on other projects - there's no "showing" class, will also need specific selectors written in.
*/
function showViaClass(id){
  document.getElementById(id).classList.remove("hidden");
}
function hideViaClass(id){
	document.getElementById(id).classList.add("hidden");
}