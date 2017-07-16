$(document).ready(init());
function createView() {
	var o = new Object();
	let $main = $(".main").filter(":first");
	let greenBtn = $main.children(".greenBtn");
	let redBtn = $main.children(".redBtn");
	let yellowBtn = $main.children(".yellowBtn");
	let blueBtn = $main.children(".blueBtn");
	greenBtn.prop("activeClass", "greenActive");
	redBtn.prop("activeClass", "redActive");
	blueBtn.prop("activeClass","blueActive");
	yellowBtn.prop("activeClass", "yellowActive");
	o.rgbyBtns = [greenBtn, redBtn, blueBtn, yellowBtn];
	let operation_panel = $main.find(".operation_panel");
	o.count = operation_panel.find(".count");
	o.startBtn = operation_panel.find(".startBtn");
	o.strictBtn = operation_panel.find(".strictBtn");
	o.strickLight = operation_panel.find(".strictLight");
	o.offon = operation_panel.find(".switch :checkbox");
	o.soundSrcs = ["https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
					"https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
					"https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
					"https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"]
	o.countDisplay = function (string) {
		o.count.html(string);
	};
	return o;
};
function init() {
	window.view = createView();
	view.activeBtnandSound = function(randomNum) {
		if(randomNum >= 0 && randomNum <=3){
			let randomSound = view.soundSrcs[randomNum],
				randomBtn = view.rgbyBtns[randomNum];
			lightABtn(randomBtn);
			playsound(randomSound);
		}
	};
	view.displayError = function() {
		this.countDisplay("!!");
	}
	view.offon.click(function() {
		if(this.checked){
			game.on();
		}else {
			game.Off();
		}
	});
	window.game = {
		required: [],
		answer:[],
		init: function() {
			this.level = 1;
			this.required = [];
			this.answer = [];
		}
	};
	// game.level变化时引起count显示的变化，count只和game.level关联；
	let level = 1;
	Object.defineProperty(game,"level",{
	    get :function() {
	        return level;
	    },
	    set: function(value) {
	        level = value;
	        let string = level;
	        if(string < 10){
	        	string = "0" + string;
	        }
	        view.countDisplay(string);
	    }
	});
	// game.level = 1;
}
game.Off = function() {
	game.init();
	view.countDisplay("");
	view.startBtn.off("click");
	view.strictBtn.off("click");
	view.rgbyBtns.map((x) => { x.prop("disabled","true")});
}
game.on = function() {
	view.startBtn.click(start);
	// view.strictBtn.click(strict);		还没有添加strict的函数

	
	view.countDisplay("--");
}
function start() {
	// bind button click and props;
	view.rgbyBtns.forEach(function(btn,index) {
		$(btn).click(function(){
			lightABtn(this)
			game.answer.push(index);
			nextlevel();
		})
		.prop("disabled",false)
		.prop("index",index);
	});
		game.level = 1;
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
			game.level++;
			repeatFunc(step,game.level);
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
	let interval = setInterval(() => {
		func();
		time ++;
		if(time > times) { clearInterval(interval);}
	},500);
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