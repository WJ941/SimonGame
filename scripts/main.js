$(document).ready(init());
function View() {
	let $main = $(".main").filter(":first"),
		greenBtn = $main.children(".greenBtn"),
		redBtn = $main.children(".redBtn"),
		yellowBtn = $main.children(".yellowBtn"),
		blueBtn = $main.children(".blueBtn"),
		operation_panel = $main.find(".operation_panel"),
		count = operation_panel.find(".count");
		soundSrcs = ["https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
					"https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
					"https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
					"https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"];
	greenBtn.prop("activeClass", "greenActive");
	redBtn.prop("activeClass", "redActive");
	blueBtn.prop("activeClass","blueActive");
	yellowBtn.prop("activeClass", "yellowActive");
	this.rgbyBtns = [greenBtn, redBtn, blueBtn, yellowBtn];
	this.startBtn = operation_panel.find(".startBtn");
	this.strictBtn = operation_panel.find(".strictBtn");
	this.strickLight = operation_panel.find(".strictLight");
	this.offon = operation_panel.find(".switch :checkbox");

	this.countDisplay = function (string) {
		if(string > 0 && string < 10) {
        	string = "0" + string;
        }
		count.text(string);
	};
	this.activeBtnandSound = function(randomNum) {
		if(randomNum >= 0 && randomNum <=3){
			let randomSound = soundSrcs[randomNum],
				randomBtn = this.rgbyBtns[randomNum];
			lightABtn(randomBtn);
			playsound(randomSound);
		}
	};
	this.displayError = function() {
		this.countDisplay("!!");
	}
	this.offon.click(function() {
		if(this.checked){
			game.on();
		} else {
			game.Off();
		}
	});
};
function Game() {
	var level = 1;
	this.required = [];
	this.answer = [];
	this.getLevel = function() {
		return level;
	};
	this.setLevel = function(value) {
		level = value;
        view.countDisplay(level);		
	};
	this.increaseLevel = function() {
		level++;
		view.countDisplay(level);
	}
	this.init = function() {
		this.setLevel(1);
		this.required = [];
		this.answer = [];		
	};
	this.on = function() {
		view.startBtn.click(start);
	// view.strictBtn.click(strict);		还没有添加strict的函数
		view.countDisplay("--");
	};
	this.Off = function() {
		this.init();
		view.countDisplay("");
		view.startBtn.off("click");
		view.strictBtn.off("click");
		view.rgbyBtns.map((x) => { x.prop("disabled","true")});
	}
}
function init() {
	window.view = new View();
	window.game = new Game();
}

function start() {
	// bind button click and props;
	game.init();
	view.rgbyBtns.forEach(function(btn,index) {
		$(btn).off('click')
		.click(function(){
			lightABtn(this)
			game.answer.push(index);
			nextlevel();
		})
		.prop("disabled",false)
		.prop("index",index);
	});
	game.setLevel(1);
	step();
}


function step() {
	let random = createRandom(4);
	game.required.push(random);
	view.activeBtnandSound(random);
}

// 当点击button后触发nextlevel，进到下一步
function nextlevel(){
	let answerLgh =game.answer.length; 
	if(game.required[answerLgh-1] !== game.answer[answerLgh-1]) {
		console.log("not to next level");
		view.displayError();
		setTimeout(function() {
			game.init();
			step();
		}, 1000);
	} else {
		if(game.required.length === answerLgh) { 
			game.required = []; 
			game.answer = []; 
			game.increaseLevel();
			repeatFunc(step,game.getLevel());
		}
	}
}

function lightABtn( btn ) {
	if( btn instanceof HTMLElement ){
		btn = $(btn);
	}
	$(btn).addClass($(btn).prop("activeClass"));
	setTimeout(function() {
		$(btn).removeClass($(btn).prop("activeClass"));
	}, 300);
}
function playsound(src) {
	let audio = document.createElement("audio");
	if(audio != null && audio.canPlayType && audio.canPlayType("audio/mpeg")) {
		audio.src = src;
		audio.playbackRate = 0.5;
		audio.play();
	}
}
function createRandom(num) {
	return Math.floor(Math.random()*num);
}
function repeatFunc(func,times){
	let time = 1;
	setTimeout(function a(){
		func();
		time++;
		if(time <= times) {
			setTimeout(a, 1000);
		}
	},1000);
}

function addPushListener(array,func) {
    Object.defineProperty(array,"push",{
        configurable: false,
        enumberable: false,
        writable: false,
        value: function(x) {
            let length  = this.length;
            array[length] = x;
            func();
        }
   });
}