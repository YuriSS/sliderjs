(function() {

	"use strict";

	var Slider = function(propriedades) {

		var _this    = this;
		var items    = undefined;
		var tmpProx  = undefined;
		var atual    = 0;
		var animando = false;

		var configuracoes = {
			paginacao: criaPaginacao,
			auto: function() {
				console.log('vai ser automatico.');
			},
			setas: criaSetas,
		};

		var dir = {ant: -1, prox: 1};

		// [INI] Método Construtor
		(function() {

			var pai = propriedades.pai;
			if(pai) {
				items = pai.children;
				_this.getMetodos(propriedades, function(prop) {
					if(configuracoes[prop]) {
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


		// [INI] Pega a direção da troca
		function getDir(numProx) {
			return numProx === 0 && atual === items.length-1 ? -1 : (function() {
				return numProx === items.length-1 && atual === 0 ? 1 : (function() {
					return numProx > atual ? -1 : 1;
				})();
			})(); 
		}
		// [FIM]


		// [INI] Método para criar paginacao
		function criaPaginacao() {
			Array.prototype.forEach.call(items, function(elem, index) {
				pack.criaElemento({
					elem: 'li',
					classe: 'paginacao',
					texto: index,
					parentNode: _this.get('paginacao'),
				});
			});
			// [INI] Gera evento de clique na paginacao
			this.get('paginacao').addEventListener('click', function(evento) {
				var num = parseInt(evento.target.innerHTML);
				var next = getNext(atual > num ? -1 : 1);
				tmpProx = num;
				trocaPag(next);
			}, false);
			// [FIM]
		}
		// [FIM]


		// [INI] Método para criar evento de troca de setas
		function criaSetas() {
			this.get('setas').addEventListener('click', function(evento) {
				var dirAttr = evento.target.getAttribute('data-dir');
				var next = getNext(dir[dirAttr]);
				initTroca(next, function() {
					animando = false;
				});
			}, false);
		}
		// [FIM]


		// [INI] Métodos para a troca de elementos
		function initTroca(numProx, callback) {
			if(!animando) {
				var largura = items[atual].offsetWidth + 50;
				animando = true;
				$(items[numProx]).addClass('proxativo');
				$(items[atual]).animate({left: largura * getDir(numProx)}, function() {
					configuraTroca(numProx, callback);
				});
			}
		}
		function configuraTroca(numProx, callback) {
			$(items[numProx]).addClass('ativo').removeClass('proxativo');
			$(items[atual]).removeClass('ativo');
			items[atual].style.left = 0;
			atual = numProx;
			if(callback) {
				callback();
			}
		}
		// [FIM]


		// [INI] Métodos para troca por paginação
		function trocaPag(numProx) {
			if(numProx !== tmpProx) {
				initTroca(numProx, function() {
					var next = getNext(atual > tmpProx ? -1 : 1);
					return trocaPag(numProx);
				});
			}
			return animando = false; 
		}
		// [FIM]
	};
	Slider.prototype = new Classe();



	window.PluginSlider = Slider;
})();