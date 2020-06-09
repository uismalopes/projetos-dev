		let $ = function (element) {
			return document.querySelector(element);
		}

		let $$ = function (element) {
			return document.querySelectorAll(element);
		}

		let form = $('#form');
		let campForm = $('#campo_formulario');
		let btnForForm = $('#btn_for_form');
		let bgFixed = $('#bg_fixed');
		let item = $('#item');
		let quantidade = $('#quantidade');
		let preco = $('#preco');
		let adicionar = $('#adicionar');
		let cancelar = $('#cancelar');
		let recebeItem = $('#recebeItem');
		let concluido = $('#concluido');
		let calculoTotal = $('#calculo_total');
		let dialog = $('#dialog');
		let campToast = $('#toast');

		let existing = localStorage.getItem('my-listShop');
		existing = existing ? JSON.parse(existing) : {};
		localStorage.setItem('my-listShop', JSON.stringify(existing));


		let inputPrecos = $('#preco');
		inputPrecos.addEventListener('input', function(){
			let maskVal = formatMoney(this.value);
			this.value = maskVal;
		});

		btnForForm.addEventListener('click', function(){
			campForm.style.display = 'block';
			bgFixed.style.display = 'flex';
			document.querySelectorAll('html, body')[0].style.overflow = 'hidden';
		});
		cancelar.addEventListener('click', function(event){
			form.reset();
			campForm.style.display = 'none';
			bgFixed.style.display = 'none';
			document.querySelectorAll('html, body')[0].style.overflow = 'auto';
			event.preventDefault();
		});

		adicionar.addEventListener('click', function(event){
			event.preventDefault();
			if(item.value == ''){
				return false;
			}else if(quantidade.value == ''){
				return false;
			}else if(preco.value == ''){
				return false;
			}

			const elementos = {
				id: getRandom(),
				nomeItem: item.value,
				qtd: quantidade.value,
				itemPreco: preco.value,
				total: calcTotal(preco.value, quantidade.value),
				check: false,
				bgColor: gera_cor()
			}

			existing[elementos.id] = elementos;
			localStorage.setItem('my-listShop', JSON.stringify(existing));

			loadStorage();
			toast(elementos.nomeItem+' adicionado!', 2000);
			form.reset();
			campForm.style.display = 'none';
			bgFixed.style.display = 'none';
			document.querySelectorAll('html, body')[0].style.overflow = 'auto';
		});

		function calcTotal(preco, qtd){
			preco = parseInt(preco.replace(/[\D]+/g,''));
			qtd = parseInt(qtd);
			let total = preco * qtd;
			let calc = formatMoney(String(total));
			return calc;
		}

		function formatMoney(v) { 
			v=v.replace(/\D/g,""); //Remove tudo o que não é dígito

			v=v.replace(/(\d{2})$/,",$1"); //Coloca a virgula

			v=v.replace(/(\d+)(\d{3},\d{2})$/g,"$1.$2"); //Coloca o primeiro ponto
			return v;
		 }


		function createBox(campo, storage){
			campo.innerHTML +=`
			<div class="box_item" id="${storage.nomeItem.split(' ').join('-')}" style="background:${storage.bgColor};">
				<p><strong>Produto:</strong> <input type="text" value="${storage.nomeItem}" class="input_edit" autocomplete="off" disabled /></p>
				<p><strong>Quantidade:</strong> <input type="number" value="${storage.qtd}" class="input_edit" autocomplete="off" disabled /> </p>
				<p><strong>Preço:</strong> R$ <input type="tel" value="${storage.itemPreco}" class="input_edit input_tel" autocomplete="off" disabled /></p>
				<p><strong>Preço total:</strong> R$ <span class="pontoSoma">${storage.total}</span></p>
				<div class="menu_item">
					<label for="active-menu-${storage.id}" class="icone">...</label>
					<input type="checkbox" id="active-menu-${storage.id}">
					<div class="lista_opcoes">
						<span class="editar" data-id="${storage.id}">Editar</span>
						<span class="excluir" data-id="${storage.id}">Excluir</span>
					</div>
				</div>
				<input type="checkbox" class="input_checkbox" id="check-${storage.id}" />
				<label for="check-${storage.id}" class="label_check"></label>
				<button class="btn_salvar_edit hide button_save" data-id="${storage.id}">Salvar</button>
				<button class="hide cancelar_edit button_cancel">Cancelar</button>
			</div>
			`;
			activeTel();
		}
		function activeTel(){
			let inputTel = $$('.input_tel');
			for(let i = 0; i < inputTel.length; i++){
				inputTel[i].addEventListener('input', function(){
					let maskVal = formatMoney(this.value);
					this.value = maskVal;
				});
			}
		}

		function loadStorage(){
			recebeItem.innerHTML = '';
			concluido.innerHTML = '';
			recebeItem.innerHTML = '<h1 class="center text-white"><em>Lista</em></h1>';
			let keys = Object.keys(existing).length;

			if(keys > 0){
				const storage = JSON.parse(localStorage.getItem('my-listShop'));
				for(let i in storage){
					if(!storage[i].check){
						createBox(recebeItem, storage[i]);
					}else{
						createBox(concluido, storage[i]);
						$('#check-'+storage[i].id).setAttribute('checked', true);
						$('#check-'+storage[i].id).closest('.box_item').style.textDecoration = 'line-through';
						let decoration = $('#check-'+storage[i].id).closest('.box_item').querySelectorAll('input');
						for(let i = 0; i < decoration.length; i++){
							decoration[i].style.textDecoration = 'line-through';
						}
						let box_item = $('#check-'+storage[i].id).closest('.box_item');
						concluido.appendChild(box_item);
					}
				}
				clicks();
				somaTotal();
				search();
			}else{
				recebeItem.innerHTML = '<h1 class="center text-white"><em>Lista vazia...</em></h1>';
				calculoTotal.style.display = 'none';
			}
		}

		function clicks(){
			let editar = $$('.editar');
			let excluir =  $$('.excluir');
			let salvarEdit = $$('.btn_salvar_edit');
			let cancelarEdit = $$('.cancelar_edit');
			let checkbox = $$('.input_checkbox');

			for(let i = 0; i < checkbox.length; i++){
				checkbox[i].addEventListener('change', function(){
					const id = this.id.replace('check-','');
					let array = JSON.parse(localStorage.getItem('my-listShop'));
					let newArray = [];
					for(let i in array){
						if(array[i].id == id){
							let decoration = getItem(this, '.box_item', 'input');
							let box_item = this.closest('.box_item');
							if(this.checked){
								array[i].check = true;
								box_item.style.textDecoration = 'line-through';
								concluido.appendChild(box_item);
								toast('Item movido para concluído!', 2000);
								somaTotal();
								for(let i =0; i < decoration.length; i++){
									decoration[i].style.textDecoration = 'line-through';
								}
								newArray.push(array[i]);
							}else{
								array[i].check = false;
								box_item.style.textDecoration = 'none';
								recebeItem.appendChild(box_item);
								somaTotal();
								toast('Item movido para Lista!', 2000);
								for(let i =0; i < decoration.length; i++){
									decoration[i].style.textDecoration = 'none';
								}
								newArray.push(array[i]);
							}
						}
					}
					for(let i in newArray){
						existing[newArray[i].id] = newArray[i];
						localStorage.setItem('my-listShop', JSON.stringify(existing));
					}
				});
			}

			for(let i = 0; i < editar.length; i++){
				editar[i].addEventListener('click', function(){
				let editAtivo = getItem(this, '.box_item', 'input');
				let btns = getItem(this, '.box_item', 'button');
				for(let i = 0; i < editAtivo.length; i++ ){
					editAtivo[i].removeAttribute('disabled');
					editAtivo[i].style.border = '1px solid #fff';
				}
				btns[0].style.display = 'block';
				btns[1].style.display = 'block';
				});
			}

			for(let i = 0; i < excluir.length; i++){
				excluir[i].addEventListener('click', function(event){
					const id = this.getAttribute('data-id');
					let storage = JSON.parse(localStorage.getItem('my-listShop'));
					dialog.style.visibility = 'visible';
					dialog.innerHTML = `
						<div class="box_dialog">
							Tem certeza que deseja excluir?
							<div class="options">
								<a id="yes_btn">SIM</a>
								<a id="no_btn">NÃO</a>
							</div>
						</div>
					`;
					$('#yes_btn').addEventListener('click', function(){
						for(let a in storage){
							if(storage[a].id == id){
								toast(storage[a].nomeItem+ ' excluido!', 2000);
								delete existing[storage[a].id];
								localStorage.setItem('my-listShop', JSON.stringify(existing));
							}
						}
						dialog.style.visibility = 'hidden';
						search();
						loadStorage();
					});
					$('#no_btn').addEventListener('click', function(){
						dialog.style.visibility = 'hidden';
					});
				});
			}

			
			for(let i = 0; i < salvarEdit.length; i++){
				salvarEdit[i].addEventListener('click', function(){
					let id = this.getAttribute('data-id');
					let array = JSON.parse(localStorage.getItem('my-listShop'));
					let inputs = getItem(this, '.box_item', 'input');

					for(let a in array){
						if(array[a].id == id){
							array[a].nomeItem = inputs[0].value;
							array[a].qtd = inputs[1].value;
							array[a].itemPreco = inputs[2].value;
							array[a].total = calcTotal(inputs[2].value, inputs[1].value);
							
							existing[array[a].id] = array[a];
							localStorage.setItem('my-listShop', JSON.stringify(existing));
						}
					}
					toast('Item atualizado!', 2000);
					loadStorage();
				});
			}

			for(let i = 0; i < cancelarEdit.length; i++){
				cancelarEdit[i].addEventListener('click', function(){
					let editAtivo = getItem(this, '.box_item', 'input');
					let btns = getItem(this, '.box_item', 'button');
					for(let i = 0; i < editAtivo.length; i++ ){
						editAtivo[i].setAttribute('disabled',true);
						editAtivo[i].style.border = 0;
					}
					btns[0].style.display = 'none';
					btns[1].style.display = 'none';
					loadStorage();
				});
			}

		}

		function toast(msg, time){
			campToast.style.opacity = 1;
			campToast.innerHTML = msg;
			setTimeout(function(){
			campToast.style.opacity = 0;
			campToast.innerHTML = '';
			}, time);
		}

		function getItem(ref, find, el){
			return ref.closest(find).querySelectorAll(el);
		}

		function getRandom(){
			let text = "";
			let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			for (let i = 0; i < 5; i++){
			    text += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			return text;
		}

		function somaTotal(){
			let num = recebeItem.querySelectorAll('.pontoSoma');
			let resultado = 0;
			for(let i = 0; i < num.length; i++){
				resultado += parseInt(num[i].textContent.replace(',','').replace('.',''));
			}
			calculoTotal.style.display = 'block';
			calculoTotal.innerHTML = '<strong>soma total:</strong> R$ '+formatMoney(parseFloat(resultado).toString());
		}


		function gera_cor(){
			let hexadecimais = '0123456789ABCDEF';
		    let cor = '#';
		    // Pega um numero aleatorio no array acima
		    for (let i = 0; i < 6; i++ ) {
		    //E concatena a variável cor
		        cor += hexadecimais[Math.floor(Math.random() * 16)];
		    }
		    return cor;
		}

		function search(){
			let storage = [],
				resultado = $('#resultado'),
				lengthItem = JSON.parse(localStorage.getItem('my-listShop'));
			for(let i in lengthItem){
				storage.push(lengthItem[i]);
			}

			$('#search').oninput = function(e){
				resultado.innerHTML = '';
				let search = this.value;
				let expression = new RegExp(search, 'i');
				storage.forEach( function(key, value) {
					// caso queria buscar por quantidade de produto <!-- key.qtd.search(expression) != -1 -->
					if(key.nomeItem.search(expression) != -1){
                    	resultado.innerHTML += `<li class="list"><a href="#${key.nomeItem}" class="link_search"><strong>Item:</strong> ${key.nomeItem}</a></li>`;
	                    let link = $$('.link_search');
	                    for(let i = 0; i < link.length; i++){
	                    	link[i].addEventListener('click', function(){
	                    		resultado.innerHTML = '';
	                    		$('#search').value = '';
	                    	});
	                    	link[i].onclick = scroll;
	                    }
					}
				});
				if(search == ''){
					resultado.innerHTML = '';
				}
			}
		}

		function scroll(e) {
		    e.preventDefault();
		    let id = this.getAttribute('href').replace('#', '').split(' ').join('-');
		    let box_search = $$('.box_item');
		    let removeBorder = function(){
		    	for(let i = 0; i < box_search.length; i++){
		    	box_search[i].classList.remove('select_box');
		    	}
		    }
		    removeBorder();
		    $('#'+id).classList.add('select_box');
		    setTimeout(removeBorder, 3000);
		    let target = document.getElementById(id).getBoundingClientRect().top;
		    animateScroll(target);
		}

		function animateScroll(targetHeight) {
		    targetHeight = document.body.scrollHeight - window.innerHeight > targetHeight + scrollY ? 
		        targetHeight : document.body.scrollHeight - window.innerHeight;
		    let initialPosition = window.scrollY;
		    let SCROLL_DURATION = 30;
		    let step_x = Math.PI / SCROLL_DURATION;
		    let step_count = 0;
		    requestAnimationFrame(step);
		    function step() {
		        if (step_count < SCROLL_DURATION) {
		            requestAnimationFrame(step);
		            step_count++;
		            window.scrollTo(0, initialPosition + targetHeight * 0.25 * Math.pow((1 - Math.cos(step_x * step_count)), 2));
		        }
		    }
		}

		let menu_link = $$('.menu_link');
		for(let i = 0; i < menu_link.length; i++){
			menu_link[i].onclick = function(event){
				let current = document.getElementsByClassName("active");
			    current[0].className = current[0].className.replace(" active", "");
			    this.className += " active";
			    let alvo = this.getAttribute('href').replace("#","");
			    if(alvo == 'recebeItem'){
			    	concluido.style.display = 'none';
			    	btnForForm.style.display = 'flex';
			    	calculoTotal.style.display = 'block';
			    	$('#'+alvo).style.display = 'block';
			    }else if(alvo == 'concluido'){
					recebeItem.style.display = 'none';
					btnForForm.style.display = 'none';
					calculoTotal.style.display = 'none';
			    	$('#'+alvo).style.display = 'block';
			    }
			    event.preventDefault();
			}
		}

		loadStorage();