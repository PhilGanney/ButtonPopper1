var gameTick;
var t;

function start(){
	t = 0; //t for time elapsed
	gameTick = setInterval(function(){
		t++;
		document.getElementById("HS").innerHTML =  t; //Temporarily displaying the tick where High Scores will go as a way of proving tick is happening
	}, 1000);
}
