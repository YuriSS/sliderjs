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
})();