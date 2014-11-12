var canvas;
var ctx;	//контекст
var w;	// ширина 
var h;	// высота 
var game = true;
var ball;
var platform;
var toLeft = true;
var toRight = true;



var ball = function (x,y){
	this.x = x;		// координата х
	this.y = y;		// координата y
	this.color = "red"; 	// СТАТИЧНО цвет
	this.radius = 10; 	// СТАТИЧНО радиус шарика
	this.vx = 3; 	// СТАТИЧНО скорость перемищения относительно х
	this.vy = -3 ; 	/* СТАТИЧНО скорость перемищения относительно y, для
								 того чтобы вектор скорости был направлен вверх ставим минус*/

}

var platform = function (x,y){
	this.x = x;		// координата х
	this.y = y;		// координата y
	this.color = "black"; 	// СТАТИЧНО цвет
	this.width = 100;	// ширина платформы
	this.height = 5;	// высота платформы
	this.vx = 5;	// СТАТИЧНО скорость перемищения относительно х
}

var blocks = function (width, height, rows, cols){
	this.width = width;
	this.height = height;
	this.rows = rows;
	this.cols = cols;
	this.padding = 1;

	this.obj;

}

window.onload = init;

document.addEventListener('keydown',moveByKey);	//слушатель событий на нажатие клавиш


function init () {
	canvas = document.getElementById("canvas");
	w = canvas.width;	// ширина канваса
	h = canvas.height;	// высота канваса
	ctx = canvas.getContext("2d");	//контекст
	ball = new ball(w/2,h/2);	//создаем новый мяч по центру
	platform = new platform(w/2,h-20); //создаем новую платформу
	platform.x -= platform.width/2;
	blocks = new blocks((w/20)-1, 20, 5, 20);
	blocks.obj = []; //проиницилизировали, создали пустой масив
	for (var i = 0; i < blocks.rows; i++) {
		blocks.obj[i] = [];
		for (var j = 0; j < blocks.cols; j++) {
			blocks.obj[i][j] = 1;
		};
	};

	beginGame();
}

function beginGame () {
	if (game = true) {
		ctx.clearRect(0,0,w,h);	//очищаем каждый раз перед новой анимацией

		//PHISICS BALL
		ball.x += ball.vx;	//приращиваем х
		ball.y += ball.vy;	//приращиваем y

		if ((ball.x + ball.vx + ball.radius)>w || (ball.x + ball.vx - ball.radius)<0) {	//отбивание от стенок по х
			ball.vx = -ball.vx;
		}
		if ((ball.y + ball.vy - ball.radius)<0) {		//отбивание от верха по y
			ball.vy = -ball.vy;
		}else if ((ball.y +ball.radius +ball.vy) >= (h-platform.height-15) && (ball.y +ball.radius +ball.vy) < h) {		//отбивание от платформы
			if ((ball.x +ball.radius) >= platform.x && (ball.x +ball.radius) <= (platform.x +platform.width)) {
				ball.vy = -ball.vy;
				// ball.vx = 
			}else{		//конец игры
				game = false;
			}
		
		};


		//PHISICS PLATFORM
		// движение платформы
		if (toRight && platform.x+platform.width < w) {
			platform.x += platform.vx;
		};
		if (toLeft && platform.x > 0) {
			platform.x -= platform.vx;
		};


		//DRAWING BALL
		ctx.fillStyle = ball.color;
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.radius, 0, 2*Math.PI, true);
		ctx.closePath();
		ctx.fill();

		// DRAWING PLATFORM
		ctx.fillStyle = platform.color;
		ctx.beginPath();
		ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
		ctx.closePath();

		// DRAWING BLOCKS
		ctx.fillStyle = "orange";
		ctx.strokeStyle = "black";
		for (var i = 0; i < blocks.rows; i++) {
			for (var j = 0; j < blocks.cols; j++) {
				if (blocks.obj[i][j] == 1) {
					ctx.beginPath();
					ctx.fillRect(j*(blocks.width +blocks.padding), i*(blocks.height+blocks.padding), blocks.width, blocks.height);
					// ctx.strokeRect(j*(blocks.width +blocks.padding), i*(blocks.height+blocks.padding), blocks.width, blocks.height);
					ctx.closePath();
				};
			};
		};


		window.requestAnimationFrame(beginGame);	/*указывает браузеру на то, что вы хотите произвести 
																анимацию,и просит его запланировать перерисовку на
																следующем кадре анимации. */
	} else{
		// end Game
	};
}

function moveByKey(event){		// движение платформы по нажатию клавиш
	if(event.keyCode == 39){
		//right
		toRight = true;
		toLeft = false;
	}
	if (event.keyCode == 37){
		//left
		toLeft = true;
		toRight = false;
	}
	if(event.keyCode == 40){
		//stop
		toRight = false;
		toLeft = false;
	}
}