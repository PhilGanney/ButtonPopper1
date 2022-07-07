var gameTick; //the actual interval object
var t; //t as in ticks elapsed
var f = 700; //f for frequency - technically it's the amount of milliseconds between each game tick
var gameState = "notStarted"; //running, paused, notStarted, gameOver, targetReached
var isComplete = false;
var gameModes = ["standard", "complex", "devious"]; //all of the game modes
var gameMode = "standard";//the current game mode
var score = 0;
const popSounds = ["Pop1.mp3", "Pop2.mp3", "Pop1.mp3", "Snap.mp3", "Pop2.mp3", "Snap2.mp3", "Pop1.mp3", "Pop2.mp3", "Pop1.mp3", "Snap3.mp3","Pop1.mp3", "Pop2.mp3", "Eee.mp3"]; //The sound files to play in order
var nextPop = 0;//which index of popSounds to play next
const failSounds = ["Faaailuuuuure.mp3", "SadTrombone.mp3", "Faaailuuuuure.mp3", "DisappointedSigh.mp3", "SadTrombone.mp3", "DisappointedSigh.mp3", "Faaailuuuuure.mp3", "SadTrombone.mp3", "Faaailuuuuure.mp3", "DisappointedSigh.mp3","Faaailuuuuure.mp3", "SadTrombone.mp3", "DisappointedSigh.mp3"]; //The sound files to play in order
var nextFail = 0;//which index of popSounds to play next

var globals = {
	"lvlNames": ["Standard Slow","Standard Faster","Standard Crazy","Complex Slow","Complex Faster","Complex Crazy","Devious Slow","Devious Faster","Devious Crazy"],
	"lvls": {
		1: {
			"f": 700,
			"txt": "Standard Slow: Pop green, not red or black.",
			"ts": 20,
			"mode": "standard"
		},
		2: {
			"f": 550,
			"txt": "Standard Faster: A bit faster and a higher target",
			"ts": 40,
			"mode": "standard"
		},
		3: {
			"f": 150,
			"txt": "Standard Crazy: Crazy fast and an even higher target",
			"ts": 60,
			"mode": "standard"
		},
		4: { 
			"f": 700,
			"txt": "Complex Slow: if blue button shows score × 2 then score is doubled, otherwise lose the difference",
			"ts": 20,
			"mode": "complex"
		},
		5: {
			"f": 500,
			"txt": "Complex Faster: A bit faster and a much higher target. -- Seriously, look at that target!  Double Double Double!!",
			"ts": 4080,
			"mode": "complex"
		},
		6: {
			"f": 150,
			"txt": "Complex Crazy: Crazy fast and an even higher target",
			"ts": 9999,
			"mode": "complex"
		},
		7: { 
			"f": 700,
			"txt": "Devious Slow: If your score is an even number then green & red buttons will do the opposite of what they normally do",
			"ts": 20,
			"mode": "devious"
		},
		8: {
			"f": 550,
			"txt": "Devious Faster: A bit faster and a higher target",
			"ts": 40,
			"mode": "devious"
		},
		9: { 
			"f": 150,
			"txt": "Devious Crazy: Crazy fast and an even higher target",
			"ts": 60,
			"mode": "devious"
		}
	}
}

function showLevelChoices(){
	//Hides whatever screen the player was on, and shows the level choices in the mainPanel
	/*resetBoard() handles a bunch of things that we also need here:
		resetting the current score to 0
		setting the colour of all the game buttons back to silver
		setting the game state to notStarted
		and last but not least: setting the button used for start and pause, back to showing "Start"
	It also sets all the game buttons back to showing 0 which we don't need, but it's not problematic
	*/
	resetBoard();
	showViaClass("highRow");
	showViaClass("midRow");
	showViaClass("lowRow");
	/*hide all the divs that could have been showing the back to level choices button 
	GAMEOVER
	TargetReached
	AlreadyDone
	*/
	hideViaClass("levelInstructions");
	hideViaClass("GAMEOVER");
	hideViaClass("TargetReached");
	hideViaClass("AlreadyDone");
	//hide the back to level choices button
	hideViaClass("backToLvlChoicesBtn");
	//hide the start button
	hideViaClass("startBtn");
	//set the target score back to ##
	document.getElementById("TS").innerText = "##";
	
	//add the choices class to mainPanel to set css correctly
	document.getElementById("mainPanel").classList.add("choices");
	
	/*set all the button texts to the apropriate names
	globals.lvlNames is an array just of the names to use on the buttons in same order. 
	buttons are numbered 1 to 9 but arrays start at index 0, so btn1 text should become value in globals.lvlNames[0]*/
	for (i = 1; i < 10; i++){
		btn = document.getElementById("btn" + i);
		btn.innerText = globals.lvlNames[i-1];
		/*Following doesn't look needed, but it's here to avoid a bug / JS working differently to my expectations 
		Simply doing btn.onclick = function() {showLevel(i);}  will set all of the onclicks to showLevel(10)
		presumably because JS would use the last value of i after the loop completes, rather than the value it had when the onclick was assigned
		*/
		let j = i; 
		btn.onclick = function() {showLevel(j);} 
	}
	
}

function showLevel(lvlNum){
	console.log("showLevel(" + lvlNum + ")");
	showViaClass("levelInstructions");
	//instructionsHere
	document.getElementById("instructionsHere").innerText = globals.lvls[lvlNum].txt;
	//Target Score TS
	document.getElementById("TS").innerText = globals.lvls[lvlNum].ts;
	//Set the frequency
	f = globals.lvls[lvlNum].f;
	//set the gameMode
	gameMode = globals.lvls[lvlNum].mode;
	//hide highRow midRow lowRow
	hideViaClass("highRow");
	hideViaClass("midRow");
	hideViaClass("lowRow");
	//show the back to level choices button
	showViaClass("backToLvlChoicesBtn");
	//show the start button
	showViaClass("startBtn");
	let btn = document.getElementById("startBtn");
	btn.onclick = function() {
		/*on the next click we also want to show highRow midRow lowRow again, and hide the level instructions, 
		but we don't need to do it usually, it's at best inneficient code and at worst potentially problematic
		so we also set the onclick function back to just being startBtn()
		*/
		showViaClass("highRow");
		showViaClass("midRow");
		showViaClass("lowRow");
		hideViaClass("levelInstructions");
		hideViaClass("backToLvlChoicesBtn");
		//remove the "choices" class from #mainPanel, that class makes the text fit the buttons, but would make the numbers in game a bit small
		document.getElementById("mainPanel").classList.remove("choices");
		//set the board to how it should be at the start of play
		resetBoard();
		startBtn();
		btn.onclick = function() {
			startBtn();
		}
	}
}

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
		//make #TargetReached, #AlreadyDone dissappear
		hideViaClass("TargetReached");
		hideViaClass("AlreadyDone");
		gameState = "paused";
	} else if (gameState == "gameOver") {
		//make #highRow, #midRow, #lowRow reappear
		showViaClass("highRow");
		showViaClass("midRow");
		showViaClass("lowRow");
		//make #GAMEOVER dissappear
		hideViaClass("GAMEOVER");
		hideViaClass("TargetReached");
		resetBoard();
	}
}

function play(){
	if (gameMode == "standard"){
		gameTick = setInterval(playStandard, f); //f for "frequency" - technically the number of milliseconds between gameTicks. Different levels might have frequency values. To set the value right takes a bit of trial and improvement.
	} else if (gameMode == "complex"){
		gameTick = setInterval(playComplex, f);
	} else if (gameMode == "devious"){
		gameTick = setInterval(playDevious, f);
	} else {  //developer error
		console.log("gameMode not found in play() else if chain");
		return;
	} 
	gameState = "running";
	document.getElementById("startBtn").innerHTML = "pause";
}

function playStandard(){
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
}
function playComplex(){
	//Pop double your current score, mistakes take off difference from your score, if score goes negative you fail
	var btn, val; //Needs to be set here, on each new run through of the interval - same as playStandard
	t++; //increment timer
	btn = document.getElementById("btn" + randomInt(1, 9)); //randomly choose btn to alter
	correctVal = score * 2;
	val = randomInt(correctVal - 32, correctVal + 10); //randomly set a value for the button in a range around the correct value
	console.log("val:" + val)
		console.log("score:" + score)
	if (val <= correctVal - 24) { //
		btn.innerHTML = "FAIL";
		btn.classList.add("black");
		btn.classList.remove("green");
		btn.classList.remove("silver");
		btn.classList.remove("blue");

		btn.onclick = function() {failBtn();} 
	} else if (val <= correctVal - 14) {
		btn.innerHTML = "+1";
		btn.classList.add("green");
		
		btn.classList.remove("black");
		btn.classList.remove("silver");
		btn.classList.remove("blue");
		btn.onclick = function() {goodBtn(1, this);}
		
	} else if (val <= correctVal - 6) { //this block to give more likelihood of doubles showing
		btn.innerHTML = correctVal;
		btn.classList.add("blue");
		
		btn.classList.remove("black");
		btn.classList.remove("silver");
		btn.classList.remove("green");
		btn.onclick = function() {dblBtn(correctVal, this);}
		
	} else {
		btn.innerHTML = "" + val;
		
		btn.classList.add("blue");
		btn.classList.remove("green");
		btn.classList.remove("silver");
		btn.classList.remove("black");
		btn.onclick = function() {dblBtn(val, this);} //Multiple notes on this line, just like for playStandard equivalent line: a) this uses an anonymous function to call our main function, but we need the main function to know what button is calling it, which it wouldn't be able to get from the "this" keyword, so we pass it here. b) can't put btn.onclick = dblBtn(1); as that would immediatly call the function, thought I could do btn.addEventListener("click", goodBtn, 1); but that doesn't actually work and it seems the only way to get addEventListener to work with a param is to use a polyfiller or an anonymous function anyway, so there's no advantage I can see
		//document.getElementById("HS").innerHTML =  t; //Temporarily displaying the tick where High Scores will go as a way of proving tick is happening
	}
}


function playDevious(){
	/*"If your score is an even number then buttons will do the opposite of what they normally do"
		So for odd scores:
			The same button events should end up happening as playComplex and playStandard (though we wont know if the player will have odd or even score at click time, since buttons persist after clicking other buttons)
				Blue buttons: correct values double current score, mistakes take off difference from  score,
		For even scores:
			do the opposite of what they normally do
				"if blue button shows score × 2 then score is doubled, otherwise lose the difference"
				Blue buttons: I can see at least two forms of opposite to choose between, either: 
					a) correct values halve current score, mistakes add difference to  score,
					or b) mistakes double current score, correct doubles take off difference from  score --- nah
				Green buttons: take value off of the score
				Red buttons: add to the score
				fail buttons: instant win??? if I did that Id want them to be super rare
		To pick the correct action at click time:
			we need new btn functions that check if the score is odd or even, and then either do the regular click event, or an opposite event
		
			if (score % 2 == 0){
				console.log("score is even");
				//opposite
			} else {
				console.log("score is odd");
				//regular
			}
	*/
	var btn, val; //Needs to be set here, on each new run through of the interval - same as playStandard
	t++; //increment timer
	btn = document.getElementById("btn" + randomInt(1, 9)); //randomly choose btn to alter
	correctVal = score * 2;
	val = randomInt(correctVal - 32, correctVal + 10); //randomly set a value for the button in a range around the correct value
	console.log("val:" + val)
		console.log("score:" + score)
	if (val <= correctVal - 24) { //
		btn.innerHTML = "FAIL";
		btn.classList.add("black");
		btn.classList.remove("green");
		btn.classList.remove("silver");
		btn.classList.remove("blue");

		btn.onclick = function() {failBtn();} 
	} else if (val <= correctVal - 14) {
		btn.innerHTML = "+1";
		btn.classList.add("green");
		
		btn.classList.remove("black");
		btn.classList.remove("silver");
		btn.classList.remove("blue");
		btn.onclick = function() {deviousGoodBtn(1, this);}
		
	} else if (val <= correctVal - 6) { //todo this is just here for a way to have some deviousBad buttons, but ideally they should have varied values, presumably random but not necessarily 
		btn.innerHTML = "-3";
		btn.classList.add("red");
		btn.classList.remove("silver");
		btn.classList.remove("green");
		btn.classList.remove("black");
		btn.classList.remove("blue");
		btn.onclick = function() {deviousBadBtn(-3, this);}
		
	} else {
		btn.innerHTML = "" + val;
		
		btn.classList.add("blue");
		btn.classList.remove("green");
		btn.classList.remove("silver");
		btn.classList.remove("black");
		btn.onclick = function() {dblBtn(val, this);} //For code walkthrough, see the note on other play... functions
	}
}

function pause(){
	clearInterval(gameTick);
	gameState = "paused";
	document.getElementById("startBtn").innerHTML = "unpause";
	if(isComplete){ //game has been completed at some point
		//alert("it's complete");
		if(parseInt(document.getElementById("CS").innerHTML) >= parseInt(document.getElementById("TS").innerHTML)){ //score currently high enough to complete game here
			showViaClass("TargetReached");
			hideViaClass("AlreadyDone");
		} else{  //game was completed on a previous run through but now the score isn't at target so it would be weird to see the regular message
			showViaClass("AlreadyDone");
			hideViaClass("TargetReached");
		}
		//make #highRow, #midRow, #lowRow dissappear
		hideViaClass("highRow");
		hideViaClass("midRow");
		hideViaClass("lowRow");
		gameState = "targetReached";
		document.getElementById("startBtn").innerHTML = "Continue this level";
	}
}
function reachTarget(){
	clearInterval(gameTick);
	isComplete = true;
	gameState = "targetReached";
	//playSound('Sounds/success.mp3'); TODO: some kind of success sound!
	
	//show backToLvlChoicesBtn
	showViaClass("backToLvlChoicesBtn");
	//change the startBtn text
	document.getElementById("startBtn").innerHTML = "Continue this level";
	showViaClass("TargetReached");
	//make #highRow, #midRow, #lowRow dissappear
	hideViaClass("highRow");
	hideViaClass("midRow");
	hideViaClass("lowRow");
}

function resetBoard(){
	/*As name implies, this func does a set of things needed to reset the game "board":
		resets the current score to 0
		sets all the game buttons back to showing 0 on them
		sets the colour of all the game buttons back to silver
		sets the game state to notStarted
		and last but not least: sets the button used for start and pause, back to showing "Start"
	*/
	let i;
	var btn;
	document.getElementById("CS").innerHTML = "0";
	score = 0;
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
	
	hideViaClass("backToLvlChoicesBtn");
	
}

function randomInt(min, max) {
	//max and min are inclusive, and can actually be decimals though they'll be rounded away from the middle
	//lifted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random getRandomIntInclusive
	min = Math.ceil(min); //Rounds min up to the next nearest int above
	max = Math.floor(max); //Rounds max down to the next nearest int below
	return Math.floor(Math.random() * (max - min + 1) + min); //Gets a random floating point number and converts it into an int within the given range. See full logic below.
	/*(max - min + 1) gets the size of the range, 
		in other words the amount of different options 
		eg if min is 10 and max is 15 then this would be 6. 
	Math.random() gets a "floating-point, pseudo-random number between 0 (inclusive) and 1 (exclusive)",
		This uses the maths concept of using probabilities in terms of numbers between 0 & 1. 
	So we multiply the size of the range and the random 0-1 value together and then add on the minimum number to get a random number in the right range
		then it's rounded off to an int
*/
}

function goodBtn(n, btn){
	if (gameState == "running") {
		//n is an integer that we add to the score
		//btn is the button - this function is called indirectly via an anonymous function, so using the "this" keyword in this function wouldn't get the button but we can use "this" in the anonymous function and pass it down
		let cs = document.getElementById("CS");
		let ts = document.getElementById("TS");
		score = parseInt(cs.innerHTML) + n;
		cs.innerHTML = score + ""; //innerHTML is a string, but we want to do integer addition to it, so this takes the innerHTML as a string, converts it to integer, adds n, then converts that result back to a string via string concatenation with an empty string, and finally sets it back into the innerHTML
		playNextPop();
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
		score = (parseInt(cs.innerHTML) + n);
		cs.innerHTML = score + "";
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
		//show backToLvlChoicesBtn
		showViaClass("backToLvlChoicesBtn");
		document.getElementById("startBtn").innerHTML = "reset the board";
		playNextFail();
	}
}

function dblBtn(n, btn){
	if (gameState == "running") {
		//n is the integer that was on the button the user clicked
		//btn is the button - this function is called indirectly via an anonymous function, so using the "this" keyword in this function wouldn't get the button but we can use "this" in the anonymous function and pass it down
		let cs = document.getElementById("CS");
		let ts = document.getElementById("TS");
		let target = score * 2;
		if (n == target){
			score = n;
			playNextPop();
		} else {
			score = score - Math.abs(target - n); //Math.abs gets the absolute value, the value without positive or negative, so Math.abs(-3) would make 3
		}
		cs.innerHTML = score + ""; //innerHTML is a string, but we want to do integer addition to it, so this takes the innerHTML as a string, converts it to integer, adds n, then converts that result back to a string via string concatenation with an empty string, and finally sets it back into the innerHTML

		btn.classList.remove("blue");
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

function deviousGoodBtn(n, btn){
/*"If your score is an even number then buttons will do the opposite of what they normally do"
	For even scores:
		Deduct the value on the button from the score
		(note that we dont switch over the full code blocks for goodBtn and badBtn, because we only do the opposite effect on the scores, wheras those code blocks also do the minimum to reset the button - knowing what classes will to remove
	
	For odd scores:
		The same button events should end up happening as playComplex and playStandard 
			

*/
	if (score % 2 == 0){
		console.log("score is even");
		//opposite
		if (gameState == "running") {
			//n is an integer that we normally add to the score, but in devious: subtract!
			//btn is the button - this function is called indirectly via an anonymous function, so using the "this" keyword in this function wouldn't get the button but we can use "this" in the anonymous function and pass it down
			let cs = document.getElementById("CS");
			let ts = document.getElementById("TS");
			score = parseInt(cs.innerHTML) - n;
			cs.innerHTML = score + ""; //innerHTML is a string, but we want to do integer addition to it, so this takes the innerHTML as a string, converts it to integer, adds n, then converts that result back to a string via string concatenation with an empty string, and finally sets it back into the innerHTML
			playNextPop();
			btn.classList.remove("green");
			btn.classList.add("silver");
			btn.innerHTML = "0";
			btn.onclick = function() {}
		}
		
	} else {
		console.log("score is odd");
		//regular
		goodBtn(n, btn);
	}
}
function deviousBadBtn(n, btn){
/*"If your score is an even number then buttons will do the opposite of what they normally do"
	For even scores:
		Make the score go up - though warning, there is some maths complexity here because n comes in as a negative number to add onto the score in normal circumstances, so the reverse is to minus that negative number.
		(note that we dont switch over the full code blocks for goodBtn and badBtn, because we only do the opposite effect on the scores, wheras those code blocks also do the minimum to reset the button - knowing what classes will to remove
	
	For odd scores:
		The same button events should end up happening as playComplex and playStandard 
			

*/
	if (score % 2 == 0){
		console.log("score is even");
		//opposite
		if (gameState == "running") {
			let cs = document.getElementById("CS");
			score = (parseInt(cs.innerHTML) - n); //n will be a negative number, maths: -- = +
			cs.innerHTML = score + "";
			btn.classList.remove("red");
			btn.classList.add("silver");
			btn.innerHTML = "0";
			btn.onclick = function() {}
		}
	} else {
		console.log("score is odd");
		//regular
		badBtn(n, btn);
	}
}
function deviousFailBtn(){
/*"If your score is an even number then buttons will do the opposite of what they normally do"
	For even scores:
		instant win???  
		extra life?
		do you have to tap it in a within a time limit to not fail? (more complex code)
			tap it as the next button once shown? (more complex code)
		TODO: Decide if these buttons should exist, and what they should do
	
	For odd scores:
		The same button events should end up happening as playComplex and playStandard 
			

*/
	if (score % 2 == 0){
		console.log("score is even");
		//opposite
	} else {
		console.log("score is odd");
		//regular
	}
}
function deviousDblBtn(){
/*"If your score is an even number then buttons will do the opposite of what they normally do"

	For even scores:
		
		
		
	for odd scores:
		The same button events should end up happening as playComplex and playStandard 
			
*/
	if (score % 2 == 0){
		console.log("score is even");
		//opposite
		
	} else {
		console.log("score is odd");
		//regular
		dblBtn(n, btn);
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

function playNextPop() {
	console.log("playNextPop");
	/*Globals used:
		const popSounds = ["soundFile.mp3","soundFile2.mp3" ...]; where each string is the filename of the next sound to be played - with multiple duplicate strings since we're using a small handful of sounds and want them to be psuedo-random, yet influenced by the developer
		var nextPop = 0; where we keep track of which index in popSounds is next to be played
	
	*/
	var audio = new Audio('Sounds/' + popSounds[nextPop]);
	audio.play();
	nextPop++; //increment nextPop so that next time, the next sound will be played
	if (nextPop >= popSounds.length){ //if we'd be past the end of the array, loop it round to 0
		nextPop = 0;
	}
}
function playNextFail() {
	console.log("playNextFail");
	//same as playNextPop but through the fails
	var audio = new Audio('Sounds/' + failSounds[nextFail]);
	audio.play();
	nextFail++; //increment nextFail so that next time, the next sound will be played
	if (nextFail >= nextFail.length){ //if we'd be past the end of the array, loop it round to 0
		nextFail = 0;
	}
}

function playSound(href) {
	console.log("playsound");
	//Sound files are in /Sounds
	var audio = new Audio(href);
	audio.play();
}