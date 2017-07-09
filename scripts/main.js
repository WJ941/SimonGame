document.onload = init();
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
	o.countDisplay = function (string) {
		o.count.html(string);
	};
	return o;
};
function init() {
	window.view = createView();
	window.game = {
		level: 1,
		required: [],
		answer:[]
	};
	view.offon.click(function() {
		if(this.checked){
			gameon();
		}else {
			gameOff();
		}
	});
}
function gameOff() {
	view.countDisplay("");
	view.startBtn.off("click");
	view.strictBtn.off("click");
}
function gameon() {
	view.countDisplay("--");
	view.startBtn.click(start);
	// view.strictBtn.click(strict);		还没有添加strict的函数
}
function start() {
	addPushListener(game.answer,nextlevel);
	bindBtnProp();
	repeatFunc(step,1);
	definLevel();
}


// game.level变化时引起count显示的变化，count只和game.level关联；

function definLevel() {
	Object.defineProperty(game,"level",{
	    get :function() {
	        return level;
	    },
	    set: function(value) {
	        level = value;
	        let string = game.level;
	        if(string < 10){
	        	string = "0" + string;
	        }
	        view.countDisplay(string);
	    }
	});
	game.level = 1;
}


function step() {
	let random = getRandomTo4();
	let btn = view.rgbyBtns[random];
	game.required.push(random);
	lightBtn(btn);
}

function toNextLevel(){
	if(game.answer.length === game.level){
		if(game.required.toString() === game.answer.toString()){
			return true;
		}else {
			game.level = 1;
			view.countDisplay("!!");
			game.answer.length = 0;
			game.required.length = 0;
			setTimeout(step, 1000);
			return false;
		}
	}else {
		return false;
	}
}

// 当点击button后触发nextlevel，进到下一步
function nextlevel(){
	if(toNextLevel()){
		game.required.length = 0; 
		game.answer.length = 0; 
		game.level++;
		repeatFunc(step,game.level);
	}else {
		console.log("not to next level");
	}
}

function lightBtn( btn ) {
	if( btn instanceof HTMLElement ){
		btn = $(btn);
	}
	$(btn).addClass($(btn).prop("activeClass"));
	setTimeout(function() {
		$(btn).removeClass($(btn).prop("activeClass"));
	}, 400);
	playsound($(btn).prop("index"));
}
function playsound(index) {
	if(index<0 || index >3){ console.log("wrong index",index); return;}
	let audio = document.createElement("audio");
	index += 1;
	let src = "https://s3.amazonaws.com/freecodecamp/simonSound"+index+".mp3";
	if(audio != null && audio.canPlayType && audio.canPlayType("audio/mpeg")) {
		audio.src = src;
		audio.playbackRate = 0.5;
		audio.play();
	}
}
function getRandomTo4() {
	return Math.floor(Math.random()*4);
}
function repeatFunc(func,times){
	let time = 1;
	let interval = setInterval(() => {
		func();
		time ++;
		if(time > times) { clearInterval(interval);}
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
function bindBtnProp() {
	view.rgbyBtns.forEach(function(btn,index) {
		$(btn).click(function(){
			lightBtn(this)
			game.answer.push(index);
		})
		.prop("disabled",false)
		.prop("index",index);
	});
};
