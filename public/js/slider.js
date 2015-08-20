(function() {
	
	"use strict";

	function afterEfect(elementos, props, callback) {
		$(elementos.prox).addClass('ativo').removeClass('proxativo');
		$(elementos.atual).removeClass('ativo');
		for(var i in props) {
			elementos.atual.style[i] = props[i];
		}
		callback();
	}

	var Efeitos = {

		padrao: function(elementos, callback) {
			$(elementos.prox).addClass('proxativo');
			elementos.atual.style.display = 'none';
			afterEfect(elementos, {"display": "block"}, callback);
		},

		fade: function(elementos, callback) {
			$(elementos.prox).addClass('proxativo');
			$(elementos.atual).fadeOut(elementos.tempo, function() {
				afterEfect(elementos, {"opacity": "1", "display": "block"}, callback);
			});
		},

		slideVertical: function(elementos, callback) {
			var largura = parseInt(elementos.atual.offsetHeight) + 50;
			var side = elementos.dir === "prox" ? -1 : 1;
			$(elementos.prox).addClass('proxativo');
			$(elementos.atual).animate({top: largura * side}, elementos.tempo, function() {
				afterEfect(elementos, {"top": 0}, callback);
			});
		},

		slideHorizontal: function(elementos, callback) {
			var largura = parseInt(elementos.atual.offsetWidth);
			var side = elementos.dir === "prox" ? -1 : 1;
			$(elementos.prox).addClass('proxativo');
			$(elementos.atual).animate({left: (largura + 200) * side, "opacity": 0, width: largura + 500}, elementos.tempo, function() {
				afterEfect(elementos, {"left": 0, "opacity": 1, "width": largura + "px"}, callback);
			});
		},
	};

	var Slider = function(propriedades) {

		var _this       = this;
		var items       = undefined;
		var tmpProx     = undefined;
		var itemsPag    = [];
		var atual       = 0;
		var animando    = false;
		var timer       = false;
		var timeLoad 	= false;
		var tempoPadrao = 3000;

		var configuracoes = {
			paginacao: criaPaginacao,
			auto: play,
			setas: criaSetas,
		};

		var dir = {ant: -1, prox: 1};

		// [INI] Método Construtor
		(function() {

			var pai = propriedades.pai;
			if(pai) {
				items = pai.children;
				_this.getMetodos(propriedades, function(prop) {
					if(configuracoes[prop] && items.length > 1) {
						configuracoes[prop].call(_this);
					}
				});
				return ;
			}
			console.error('Necessário um elemento pai');
		})();
		// [FIM]


		// [INI] Pega o próximo elemento
		function getNext(numProx) {
			var result = atual + numProx;
			return result > items.length-1 ? 0 : (function() {
				return result < 0 ? items.length-1 : result;
			})();
		}
		// [FIM]


		// [INI] Define em qual direção o slider esta se encaminhando
		function getDir(numProx) {
			return atual === 0 && numProx === items.length-1 ? "ant" : (function() {
				return atual === items.length - 1 && numProx === 0 ? "prox" : (function() {
					return atual > numProx ? "ant" : "prox";
				})();
			})();
		}
		// [FIM]


		// [INI] Método para criar paginacao
		function criaPaginacao() {
			Array.prototype.forEach.call(items, function(elem, index) {
				itemsPag.push(pack.criaElemento({
					elem: 'li',
					classe: 'paginacao-item ' + (index === 0 ? 'ativo' : ''),
					texto: index,
					parentNode: _this.get('paginacao'),
				}));
			});
			// [INI] Gera evento de clique na paginacao
			this.get('paginacao').addEventListener('click', function(evento) {
				var num = parseInt(evento.target.innerHTML);
				stopAuto(function() {
					clearTimeLoad();
					tmpProx = num;
					trocaPag(num);
				});
			}, false);
			// [FIM]
		}
		// [FIM]


		// [INI] Método para criar evento de troca de setas
		function criaSetas() {
			this.get('setas').addEventListener('click', function(evento) {
				var dirAttr = evento.target.getAttribute('data-dir');
				var next = getNext(dir[dirAttr]);
				stopAuto(function() {
					clearTimeLoad();
					initTroca(next, function() {
						play();
					});
				});
			}, false);
		}
		// [FIM]


		// [INI] Métodos para a troca de elementos
		function initTroca(numProx, callback) {
			var efeito = getEfeitoTroca();
			if(efeito !== false) {
				var elementos = {atual: items[atual], prox: items[numProx], dir: getDir(numProx), tempo: _this.get('tempoEfeito') || 300};
				efeito(elementos, function() {
					atual    = numProx;
					animando = false;
					if(itemsPag) {
						$(itemsPag[atual]).addClass('ativo').siblings().removeClass('ativo');
					}
					if(callback) {
						callback();
					}
				});
			}
		}
		function getEfeitoTroca() {
			if(!animando) {
				var efeito = _this.get('efeito');
				animando = true;
				if(efeito) {
					if(typeof efeito === "string") {
						return Efeitos[efeito] ? Efeitos[efeito] : Efeitos['padrao'];
					} else {
						return efeito;
					}
				}
				return Efeitos['padrao'];
			}
			return false;
		}
		// [FIM]


		// [INI] Métodos para troca por paginação
		function trocaPag(numProx) {
			if(atual !== tmpProx) {
				var dir = atual < numProx ? 1 : -1;
				var prox = getNext(dir);
				initTroca(prox, function() {
					trocaPag(numProx);
				});
				return ;
			}
			return play();
		}
		// [FIM]


		// [INI] Métodos para troca automatica
		function play() {
			if(_this.get('auto') && !timer) {
				var prox = getNext(1);
				var tempo = parseInt(items[atual || 0].getAttribute("data-tempo")) || tempoPadrao;
				timer = setTimeout(function() {
					stopAuto(function() {
						initTroca(prox, function() {
							play();
						});
					});
				}, tempo);
				loadBar(tempo);
			}
		}


		function stopAuto(callback) {
			if(_this.get('auto')) {
				clearTimeout(timer);
				timer = false;
			}
			callback();
		}


		function loadBar(tempo) {
			var loadBar = _this.get("loadBar");
			if(loadBar) {
				var tempoInicio = Date.now();
				var range = 0;
				timeLoad = setInterval(function() {
					range = Math.round(((Date.now() - tempoInicio) / tempo) * 100);
					if(range <= 100) {
						loadBar.style.width = range + "%";
					} else {
						clearTimeLoad();
					}
				}, 30);
			}
		}

		function clearTimeLoad(callback) {
			var loadBar = _this.get("loadBar");
			if(loadBar && timeLoad) {
				loadBar.style.width = "0%";
				clearInterval(timeLoad);
				timeLoad = false;
			}
			if(callback && typeof callback === "function") {
				callback();
			}
		}
		// [FIM]
	};
	Slider.prototype = new pack.Classe();


	pack.Slider = Slider;
})();
/* [FIM] */
