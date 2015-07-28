(function() {

	"use strict";

	var externalPack = window.pack;

	var Slider = function(propriedades) {

		var _this    = this;
		var items    = undefined;
		var tmpProx  = undefined;
		var itemsPag = [];
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


		// [INI] Método para criar paginacao
		function criaPaginacao() {
			Array.prototype.forEach.call(items, function(elem, index) {
				itemsPag.push(externalPack.criaElemento({
					elem: 'li',
					classe: index === 0 ? 'ativo' : '',
					texto: index,
					parentNode: _this.get('paginacao'),
				}));
			});
			// [INI] Gera evento de clique na paginacao
			this.get('paginacao').addEventListener('click', function(evento) {
				var num = parseInt(evento.target.innerHTML);
				tmpProx = num;
				trocaPag(num);
			}, false);
			// [FIM]
		}
		// [FIM]


		// [INI] Método para criar evento de troca de setas
		function criaSetas() {
			this.get('setas').addEventListener('click', function(evento) {
				var dirAttr = evento.target.getAttribute('data-dir');
				var next = getNext(dir[dirAttr]);
				initTroca(next);
			}, false);
		}
		// [FIM]


		// [INI] Métodos para a troca de elementos
		function initTroca(numProx, callback) {
			var efeito = getEfeitoTroca();
			if(efeito !== false) {
				var elementos = {atual: items[atual], prox: items[numProx], dir: atual < numProx ? 'prox' : 'ant'};
				efeito(elementos, function() {
					atual    = numProx;
					animando = false;
					if(callback) {callback();}
				});
			}
		}
		function getEfeitoTroca() {
			if(!animando) {
				var efeito = _this.get('efeito');
				animando = true;
				if(efeito) {
					if(typeof efeito === "string") {
						return externalPack.Efeitos[efeito] ? externalPack.Efeitos[efeito] : externalPack.Efeitos['padrao'];
					} else {
						return efeito;
					}
				}
				return externalPack.Efeitos['padrao'];
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
					$(itemsPag[atual]).addClass('ativo').siblings().removeClass('ativo');
					return trocaPag(numProx);
				});
			} 
		}
		// [FIM]
	};
	Slider.prototype = new Classe();



	window.PluginSlider = Slider;
})();
