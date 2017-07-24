var app = (function() {
	var view;
	var game;
	var timers = [];
	const error = '!!';
	init();
	function View() {
		let $main = $(".main").filter(":first"),
			greenBtn = $main.children(".greenBtn"),
			redBtn = $main.children(".redBtn"),
			yellowBtn = $main.children(".yellowBtn"),
			blueBtn = $main.children(".blueBtn"),
			operation_panel = $main.find(".operation_panel"),
			count = operation_panel.find(".count");
		greenBtn.prop("activeClass", "greenActive");
		redBtn.prop("activeClass", "redActive");
		blueBtn.prop("activeClass","blueActive");
		yellowBtn.prop("activeClass", "yellowActive");
		this.soundSrcs = ["https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
						"https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
						"https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
						"https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"];
		this.rgbyBtns = [greenBtn, redBtn, blueBtn, yellowBtn];
		this.startBtn = operation_panel.find(".startBtn");
		this.strictBtn = operation_panel.find(".strictBtn");
		this.strictLight = operation_panel.find(".strictLight");
		this.offon = operation_panel.find(".switch :checkbox");

		this.countDisplay = function (string) {
			if(string > 0 && string < 10) {
	        	string = "0" + string;
	        }
			count.text(string);
		};
		this.activeBtnandSound = function(randomNum) {
			if(randomNum >= 0 && randomNum <=3){
				let randomSound = this.soundSrcs[randomNum],
					randomBtn = this.rgbyBtns[randomNum];
				lightABtn(randomBtn);
				playsound(randomSound);
			}
		};
		this.displayError = function() {
			this.countDisplay(error);
		}
		this.offon.click(function() {
			if(this.checked){
				game.on();
			} else {
				game.Off();
			}
		});
		this.strictToggle =function() {
			if(game.isStrictMode === true){
				game.isStrictMode = false;
				view.strictLight.removeClass('bgred');
			}else{
				game.isStrictMode = true;
				view.strictLight.addClass('bgred');
			}
		};
		this.disableBtns = function(bool)  {
			this.rgbyBtns.forEach((btn) => {
				$(btn).prop('disabled',bool);
			})
		};
	};
	function Game() {
		var level = 1;
		this.required = [];
		this.answer = [];
		this.isStrictMode = false;
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
		 view.strictBtn.click(view.strictToggle);		//还没有添加strict的函数
			view.countDisplay("--");
		};
		this.Off = function() {
			this.init();
			view.countDisplay("");
			view.startBtn.off("click");
			view.strictBtn.off("click");
			view.rgbyBtns.map((x) => { x.prop("disabled","true")});
			timers.map((x) => { clearTimeout(x);});
		}
	}
	function init() {
		view = new View();
		game = new Game();
	}

	function start() {
		game.init();
		view.rgbyBtns.forEach(function(btn,index) {
			$(btn).off('click')
			.click(function(){
				playsound(view.soundSrcs[index]);
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
			view.displayError();
			setTimeout(function() {
				if(game.isStrictMode === true){
					game.init();
					step();
				} else {
					game.setLevel(game.getLevel());
					game.answer = [];
				}
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
		}, 400);
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
		timers[timers.length] = setTimeout(function a(){
			func();
			time++;
			if(time <= times) {
				timers[timers.length] = setTimeout(a, 800);
			}
		},800);
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
})();

//view 只有 