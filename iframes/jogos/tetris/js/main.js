const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
// TAMANHO DA TELA
 canvas.width = 240;
 canvas.height = 400;
 canvas.style.border = 'solid 2px #fff';
 context.scale(20, 20);
//

// SISTEMA DE PAUSE
var pause = false;
var $ = document.querySelector.bind(document);

$('.iniciar-jogo').onclick = function(){
	$('.init').style.display = 'none';
	pause = !pause;
}

$('.btn-iniciar').onclick = function(){
	$('.init').style.display = 'none';
	pause = !pause;
}

$('.dicas-jogos').onclick = function(){
	$('.home').classList.add('hide');
	$('.dicas').classList.add('show');
}

$('.voltar-home').onclick = function(){
	$('.home').classList.remove('hide');
	$('.dicas').classList.remove('show');
}

var inputcheck = document.querySelectorAll('input');

for(var i = 0; i < inputcheck.length; i++){
	inputcheck[i].onchange = function(){
		var compara = this.getAttribute('id');
		if(compara == 'desktop'){
			$('#desktop-dicas').classList.remove('hide');
			$('#mobile-dicas').classList.remove('show');
		}else{
			$('#desktop-dicas').classList.add('hide');
			$('#desktop-dicas').classList.remove('show');
			$('#mobile-dicas').classList.add('show');
		}
	}
}


$('.camp_pause').addEventListener('click', ()=> {
	if(pause){
		$('.pause').style.display ='none';
		$('.play').style.display = 'block';
		$('.txt_pause').style.display = 'block';
	}else{
		$('.pause').style.display = 'block';
		$('.play').style.display ='none';
		$('.txt_pause').style.display ='none';
	}
	pause = !pause;
});

function arenaSweep(){
	let rowCount = 1;
	outer: for (let y = arena.length -1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
        getScore(player.score);
	}
}

function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}


function createMatrix(w,h){
	const matrix = [];
	while (h--) {
		matrix.push(new Array(w).fill(0));
	}
	return matrix;
}

function createPiece(type)
{
    if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if (type === 'J') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'Z') {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'T') {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
}

function draw(){
	context.fillStyle='#000';
	context.fillRect(0,0, canvas.width, canvas.height);

	drawMatrix(arena, {x: 0, y:0});
	drawMatrix(player.matrix, player.pos);
}

function drawMatrix (matrix, offset) {
	matrix.forEach((row, y) =>{
		row.forEach((value, x) =>{
			if(value !== 0){
				context.fillStyle = colors[value];
				context.fillRect(x + offset.x, y + offset.y, 1, 1);
			}
		});
	}); 
}

function merge(arena, player){
	player.matrix.forEach((row, y) =>{
		row.forEach((value, x) =>{
			if(value !== 0){
				arena[y + player.pos.y][x + player.pos.x] = value;
			}
		});
	});
}

function playerDrop(){
	if(pause){
		player.pos.y++;
	}else{
		player.pos.y;
	}
	 if(collide(arena, player)){
	 	player.pos.y--;
	 	merge(arena, player);
	 	playerReset();
	 	arenaSweep();
	 	updateScore();
	 }
	dropCounter = 0;
}

function playerRotate(dir){
	const pos = player.pos.x;
	let offset = 1;
	rotate(player.matrix, dir);
	while (collide(arena, player)) {
		player.pos.x += offset;
		offset = -(offset + (offset > 0 ? 1 : -1));
		if(offset > player.matrix[0].length){
			rotate(player.matrix, - dir);
			player.pos.x = pos;
			return;
		}
	}
}

function rotate(matrix, dir){
	for(let y=0; y < matrix.length; ++y){
		for(let x = 0; x < y; ++x){
			[
				matrix[x][y],
				matrix[y][x]
			] = [
				matrix[y][x],
				matrix[x][y]
			];
		}
	}
	if(dir > 0){
		matrix.forEach(row => row.reverse());
	}else{
		matrix.reverse();
	}
}

function playerMove(dir){
 player.pos.x += dir;
 if(collide(arena, player)){
 	player.pos.x -= dir;
 }
}

function playerReset(){
	const pieces = 'ILJOTSZ';
	player.matrix = createPiece(pieces[pieces.length * Math.random() | 0 ]);
	player.pos.y = 0;
	player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

	if(collide(arena, player)){
		arena.forEach(row => row.fill(0));
		player.score = 0;
		updateScore();
	}
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0){
	const deltaTime = time - lastTime;
	lastTime = time;

	dropCounter += deltaTime;
	if(dropCounter > dropInterval){
		playerDrop();
		dropInterval++;
	}
	draw();
	requestAnimationFrame(update);
}

function updateScore(){
	document.getElementById('score').innerText = "PONTUACAO: " + player.score;
}

const colors = [
	null,
	'#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];

const arena = createMatrix(12, 20);

const player = {
	pos: {x: 0, y:0},
	matrix: null, 
	score: 0,
}

// TECLAS
document.addEventListener('keydown', event =>{
		//ESQUEDA
		if(event.keyCode === 37){
			playerMove(-1);
		}
		//DIREIRTA
		else if (event.keyCode === 39) {
			playerMove(1);
		}
		// BAIXO
		else if(event.keyCode === 40){
			playerDrop();
		}
		// ROTAÇÃO LETRA R
		else if(event.keyCode === 82) {
			playerRotate(-1);
		}
		// ROTAÇÃO LETRA Q
		else if(event.keyCode === 81) {
			playerRotate(1);
		}
});

// // MOBILE
window.onload = function(){
 var posX1;
 var posX2;
 var obj_swiper = canvas;

 obj_swiper.addEventListener('touchstart', function(e){
    e = e || window.event;
    posX1 = e.changedTouches[0].pageX;
    posY1 = e.changedTouches[0].pageY;
 });

obj_swiper.addEventListener('touchend', function(e){
    e = e || window.event;
    posx2 = e.changedTouches[0].pageX;
    posy2 = e.changedTouches[0].pageY;
    control = posx2-posX1;
    control2 = posy2-posY1;

    if(control>50){
      playerMove(1);
    }
    if(control<-50){
       playerMove(-1);
    }
    //
    if(control2>50){
    	dropInterval = 100;
    	playerDrop();
    	setTimeout(function(){
    		dropInterval = 1000;
    	},120);
    	
    }

 });
// DUPLO TOUCH
obj_swiper.addEventListener("touchstart", tapHandler);
var tapedTwice = false;
function tapHandler(event) {
    if(!tapedTwice) {
        tapedTwice = true;
        setTimeout( function() { tapedTwice = false; }, 300 );
        return false;
    }
    event.preventDefault();
    //action on double tap goes below
    playerRotate(1);
 }
 // 
}

function getScore(store){
	if(store > localStorage.getItem('pontuacao')){
	    localStorage.clear();
	    localStorage.setItem('pontuacao', player.score);
	    document.getElementById('max_ponts').classList.add('flash');
	    document.getElementById('max_ponts').innerText = "NOVO RECORDE: "+localStorage.getItem('pontuacao');
	    setInterval(function(){
	    	document.getElementById('max_ponts').classList.remove('flash');
	    	document.getElementById('max_ponts').innerText = "RECORDE: "+localStorage.getItem('pontuacao');
	    }, 5000);
	}
}
if(!localStorage.getItem('pontuacao')){
	document.getElementById('max_ponts').innerText = "RECORDE: "+0;
}else{
	document.getElementById('max_ponts').innerText = "RECORDE: "+localStorage.getItem('pontuacao');	
}


playerReset();
updateScore();
update();