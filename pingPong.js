const canvas = document.querySelector('.pong');
const canvasContext = canvas.getContext('2d');


// create the player paddle
const player = {
	x : 0,
	y : canvas.height/2 - 100/2,
	width : 10,
	height : 100,
	color : "WHITE",
	score : 0
}

// create the computer paddle
const computer = {
	x : canvas.width - 10,
	y : canvas.height/2 - 100/2,
	width : 10,
	height : 100,
	color : "WHITE",
	score : 0
}

// create the ball
const ball = {
	x: canvas.width/2,
	y: canvas.height/2,
	redius: 10,
	speed: 7,
	velocityX: 5,
	velocityY: 5,
	color: "WHITE"
}

// create the net
const net = {
	x : canvas.width/2 - 1,
	y : 0,
	width : 2,
	height : 10,
	color : "WHITE"
}

// draw rect fct
function drawRect(x, y, w, h, color){
	canvasContext.fillStyle = color;
	canvasContext.fillRect(x, y, w, h);
}

// draw the net
function drawNet(){
	for (let i = 0; i <= canvas.height; i += 15){
		drawRect(net.x, net.y + i, net.width, net.height, net.color);
	}
}

// draw Circle
function drawCircle(x, y, r, color){
	canvasContext.fillStyle = color;
	canvasContext.beginPath();
	canvasContext.arc(x, y, r, 0, Math.PI *2, false);
	canvasContext.closePath();
	canvasContext.fill();
}


// draw Text
function drawText(text, x, y, color){
	canvasContext.fillStyle = color;
	canvasContext.font = "50px Georgia";
	canvasContext.fillText(text, x, y);
}

// render the game
function render(){
	// clear the canvas
	drawRect(0, 0, canvas.width, canvas.height, "BLACK");

	// drwa the net
	drawNet();

	// draw score
	drawText(player.score, canvas.width/4, canvas.height/5 , "WHITE");
	drawText(computer.score, 3*canvas.width/4, canvas.height/5, "WHITE");

	//draw the player and computer paddle
	drawRect(player.x, player.y, player.width, player.height, player.color);
	drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);

	//draw the ball
	drawCircle(ball.x, ball.y, ball.redius, ball.color)
}

// control the playerpaddle
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evnt){
	let rect = canvas.getBoundingClientRect();
	player.y = evnt.clientY - rect.top - player.height/2;
}

// collision detection 
function collision(ball, player){

	ball.top = ball.y - ball.redius;
	ball.bottom = ball.y + ball.redius;
	ball.left = ball.x - ball.redius;
	ball.right = ball.x + ball.redius;

	player.top = player.y;
	player.bottom = player.y + player.height;
	player.left = player.x;
	player.right = player.x + player.width;

	return ball.right > player.left && ball.bottom > player.top 
			&& ball.left < player.right && ball.top < player.bottom;
}

// reset the Ball
function resetBall(){
	ball.x = canvas.width/2;
	ball.y = canvas.height/2

	ball.speed = 0.5;
	ball.velocityX = -ball.velocityX;
}

//update: pos, mov, score, ...
function update(){
	ball.x += ball.velocityX;
	ball.y += ball.velocityY

	let computerLevel = 0.1;
	computer.y += (ball.y - (computer.y + computer.height/2)) * computerLevel;

	if (ball.y + ball.redius > canvas.height || ball.y - ball.redius < 0){
		ball.velocityY = -ball.velocityY;
	}
	let user = (ball.x < canvas.width/2) ? player : computer;

	if(collision(ball, user)){
		
		let collidePoint = ball.y - (user.y + user.height/2);

		collidePoint = collidePoint/(user.height/2);

		let anglerad = collidePoint * Math.PI/4;

		let direction = (ball.x < canvas.width/2) ? 1 : -1;

		ball.velocityX = direction * ball.speed * Math.cos(anglerad);
		ball.velocityY =			ball.speed * Math.sin(anglerad);

		ball.speed += 0.5;
	}
	// update the score 
	if (ball.x - ball.redius < 0){
		computer.score++;
		resetBall();
	}else if (ball.x + ball.redius > canvas.width){
		player.score++
		resetBall();
	}
}

//game init
function game(){
	update();
	render();
}

//loop 
const framePerSec = 50;
setInterval(game, 1000/framePerSec);
