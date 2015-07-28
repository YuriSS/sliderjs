(function() {

	"use strict";

	window.pack = {};

	pack.criaElemento = function(props) {
		var elem = document.createElement(props.elem);
		elem.className = props.classe || '';
		elem.appendChild(document.createTextNode(props.texto + '' || ' '));
		if(props.parentNode) {
			props.parentNode.appendChild(elem);
		}
		return elem;
	};


	pack.Efeitos = {

		padrao: function(elementos, callback) {
			$(elementos.prox).addClass('proxativo');
			elementos.atual.style.display = 'none';
			$(elementos.prox).addClass('ativo').removeClass('proxativo');
			$(elementos.atual).removeClass('ativo');
			elementos.atual.style.display = 'block';
			callback();
		},

		fade: function(elementos, callback) {
			$(elementos.prox).addClass('proxativo');
			$(elementos.atual).fadeOut(300, function() {
				$(elementos.prox).addClass('ativo').removeClass('proxativo');
				$(elementos.atual).removeClass('ativo');
				elementos.atual.style.display = 'block';
				callback();
			});
		}
	};
})();
