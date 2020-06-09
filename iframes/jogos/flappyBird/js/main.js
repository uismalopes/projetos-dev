window.onload = function(){
	const c = document.getElementById('canvas');
	const ctx = c.getContext('2d');
	c.width = window.innerWidth;
	c.height = window.innerHeight;

	if(screen.width >= 500){
			c.height = 600;
			c.style.border = '1px solid #000';
	}


	const environment = new Environment(c, ctx);
	const bird = new Bird(100, c.height/2, ctx);//(250, 300, ctx);
	environment.render();
	bird.render();
	const obstaculos = [];

    telaInicial(ctx, c);

	function telaInicial(ctx,c){
	// TEMPO PARA INICIAR
	this.ctx = ctx;
	this.c = c;
	var tempo = 5;
	var tela = document.getElementById('tela_inicial'),
		btnPlay = document.getElementById('play'),
		txtTempo = document.getElementById('contagem');
	tela.style.display = 'block';
	txtTempo.innerHTML = tempo;

	play.addEventListener('click', function(){
		tela.setAttribute('class', 'fadeOut');
		btnPlay.setAttribute('class', 'fadeOut');
		setTimeout(function(){
			txtTempo.style.display = 'block';
			tela.style.display = 'none';
			btnPlay.style.display = 'none';
			time();
		},1000);
	});

	function time(){
		var cronometro = setInterval(function(){
			tempo--;
			txtTempo.innerHTML = tempo;
			//console.log(tempo);
			if(tempo<=0){
				clearInterval(cronometro);
				txtTempo.style.display = 'none';
				geraObstaculos(obstaculos);
				gameLoop();
				// TEMPO DE PONTUAÇÃO
				document.getElementById('pontos').style.display = 'block';
				if(!bird.dead){
					var tempoPontos = setInterval(function(){
				    	pontuacao++;
				    	pPontos.innerHTML = pontuacao;
				    	if(bird.dead){
							clearInterval(tempoPontos);
							telaOver.style.display = 'block';
							ptFinal.innerHTML = 'Pontuação: '+pontuacao;
				    	}
					}, 3000);
				}
				//
			}
		},1000);
	}
	}

	//CRIA SISTEMA DE PONTUAÇÃO
		var pPontos = document.createElement('P'),
    	idP = pPontos.id = 'pontos',
    	pontuacao = 0;
	    document.body.appendChild(pPontos);
	    pPontos.innerHTML = pontuacao;
	    document.getElementById('pontos').style.display = 'none';
	//
	// GAME OVER
	   var telaOver = document.getElementById('tela_game_over'),
	   	   ptFinal = document.getElementById('ptFinal'),
	   	   btn_return = document.getElementById('btn_return');
	   	//VOLTA O JOGO
	   	btn_return.addEventListener('click', function(){
	   		location.reload();
	   	});
	//
	/*
		GAME LOOP
	*/
	function gameLoop() {
		bird.update(obstaculos);
		if(!bird.dead){
			environment.update();
			obstaculos.forEach( function(obs1) {
			obs1.update();
			});
		}
		environment.render(ctx);
		obstaculos.forEach( function(obs1) {
			obs1.render();
		});
		bird.render();
		if(bird.dead){
			document.getElementById('pontos').style.display = 'none';
			//drawGameOver(ctx, c);
		}
		window.requestAnimationFrame(gameLoop);
	}
};

function generateRandomObs(ctx, canvasWidth, canvasHeight) {
	let lengthTop = Math.round(Math.random()*200+50);
	//console.log(lengthTop);
	let lengthBottom = canvasHeight - 300 - lengthTop;
	let returnVal = { };
	let velocidade = 4;
	returnVal.top = new Obstaculos(canvasWidth, -5, lengthTop, velocidade, ctx);
	returnVal.bottom = new Obstaculos(canvasWidth, canvasHeight+5-lengthBottom, lengthBottom, velocidade, ctx);
	return returnVal;
}

function geraObstaculos(obstaculos){
	let obsSet = generateRandomObs(ctx, c.width, c.height);
	obstaculos.push(obsSet.top, obsSet.bottom);
    setInterval(function(){
    	let obsSet = generateRandomObs(ctx, c.width, c.height);
    	obstaculos.push(obsSet.top, obsSet.bottom);
    }, 2600);
}