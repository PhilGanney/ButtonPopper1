var gameTick; //the actual interval object
var t; //t as in ticks elapsed
const f = 700; //f for frequency - technically it's the amount of milliseconds between each game tick
var gameState = "notStarted"; //running, paused, notStarted, gameOver, targetReached
var isComplete = false;

function startBtn(){
	//This function is run on the button that starts the game, that same button will pause it if the game is running and unpause if the game is paused
	if (gameState == "running") { //this must be the first check on the button, so that pauses are as instantaneous as possible
		pause();
	} else if (gameState == "paused") {
		play();
	} else if (gameState == "notStarted") {
		t = 0; //t for time elapsed
		play();
	} else if (gameState == "targetReached") {
		//make #highRow, #midRow, #lowRow reappear
		showViaClass("highRow");
		showViaClass("midRow");
		showViaClass("lowRow");
		//make #TargetReached dissappear
		hideViaClass("TargetReached");
		gameState = "paused";
	} else if (gameState == "gameOver") {
		//make #highRow, #midRow, #lowRow reappear
		showViaClass("highRow");
		showViaClass("midRow");
		showViaClass("lowRow");
		//make #GAMEOVER dissappear
		hideViaClass("GAMEOVER");
		resetBoard();
	}
}

function play(){
	gameTick = setInterval(function(){
			var btn, val; //Needs to be set here, on each new run through of the interval (rather than the top of the play() function), in case we're running the interval frequently enough that this code can overlap itself and cause val to change for a new run while still being used for the previous run. That was the cause of a bug I caught in development, where on fast play throughs, clicking buttons often led to wildly different outcomes 
			t++;
			btn = document.getElementById("btn" + randomInt(1, 9));
			val = randomInt(-9, 4);
			if (val > 0){
				btn.innerHTML = "+" + val;
				
				btn.classList.add("green");
				btn.classList.remove("silver");
				btn.classList.remove("red");
				btn.classList.remove("black");
				btn.onclick = function() {goodBtn(val, this);} //Multiple notes on this line a) this uses an anonymous function to call our main function, but we need the main function to know what button is calling it, which it wouldn't be able to get from the "this" keyword, so we pass it here. b) can't put btn.onclick = goodBtn(1); as that would immediatly call the function, thought I could do btn.addEventListener("click", goodBtn, 1); but that doesn't actually work and it seems the only way to get addEventListener to work with a param is to use a polyfiller or an anonymous function anyway, so there's no advantage I can see
				//document.getElementById("HS").innerHTML =  t; //Temporarily displaying the tick where High Scores will go as a way of proving tick is happening
			} else if (val == -9  || val == -8 ) {
				btn.innerHTML = "FAIL";
				btn.classList.add("black");
				btn.classList.remove("silver");
				btn.classList.remove("green");
				btn.classList.remove("red");
				btn.onclick = function() {failBtn();} 
			} else {
				btn.innerHTML = "" + val;
				
				btn.classList.add("red");
				btn.classList.remove("silver");
				btn.classList.remove("green");
				btn.classList.remove("black");
				btn.onclick = function() {badBtn(val, this);} //Multiple notes on this line a) this uses an anonymous function to call our main function, but we need the main function to know what button is calling it, which it wouldn't be able to get from the "this" keyword, so we pass it here. b) can't put btn.onclick = goodBtn(1); as that would immediatly call the function, thought I could do btn.addEventListener("click", goodBtn, 1); but that doesn't actually work and it seems the only way to get addEventListener to work with a param is to use a polyfiller or an anonymous function anyway, so there's no advantage I can see
				//document.getElementById("HS").innerHTML =  t; //Temporarily displaying the tick where High Scores will go as a way of proving tick is happening
			}
		}, f); //f for "frequency" - technically the number of milliseconds between gameTicks. Different levels might have frequency values. To set the value right takes a bit of trial and improvement.
	gameState = "running";
	document.getElementById("startBtn").innerHTML = "pause";
}

function pause(){
	clearInterval(gameTick);
	gameState = "paused";
	document.getElementById("startBtn").innerHTML = "unpause";
}
function reachTarget(){
	clearInterval(gameTick);
	gameState = "targetReached";
	document.getElementById("startBtn").innerHTML = "Continue this level";
	
	isComplete = true;
	showViaClass("TargetReached");
	//make #highRow, #midRow, #lowRow dissappear
	hideViaClass("highRow");
	hideViaClass("midRow");
	hideViaClass("lowRow");
}

function resetBoard(){
	let i;
	var btn;
	document.getElementById("CS").innerHTML = "0";
	for (i = 1; i < 10; i++){
		//alert(i + ""); //sanity check
		btn = document.getElementById("btn" + i);
		btn.innerHTML = "0";
				
		btn.classList.add("silver");
		btn.classList.remove("red");
		btn.classList.remove("green");
		btn.classList.remove("black");
		//btn.onclick = function() {}
	}
	gameState = "notStarted";
	document.getElementById("startBtn").innerHTML = "Start";
	
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
		let ts = document.getElementById("TS");
		cs.innerHTML = (parseInt(cs.innerHTML) + n) + ""; //innerHTML is a string, but we want to do integer addition to it, so this takes the innerHTML as a string, converts it to integer, adds n, then converts that result back to a string via string concatenation with an empty string, and finally sets it back into the innerHTML

		btn.classList.remove("green");
		btn.classList.add("silver");
		btn.innerHTML = "0";
		if(!isComplete){
			if(parseInt(cs.innerHTML) >= parseInt(ts.innerHTML)){
				reachTarget();
			}
		}
		btn.onclick = function() {}
	}
}

function badBtn(n, btn){
	if (gameState == "running") {
		let cs = document.getElementById("CS");
		cs.innerHTML = (parseInt(cs.innerHTML) + n) + "";
		btn.classList.remove("red");
		btn.classList.add("silver");
		btn.innerHTML = "0";
		btn.onclick = function() {}
	}
}

function failBtn(){
	if (gameState == "running") {
		clearInterval(gameTick);
		//alert("GAMEOVER");
		//make #GAMEOVER appear 
		showViaClass("GAMEOVER");
		//make #highRow, #midRow, #lowRow dissappear
		hideViaClass("highRow");
		hideViaClass("midRow");
		hideViaClass("lowRow");
		gameState = "gameOver";
		document.getElementById("startBtn").innerHTML = "reset the board";
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