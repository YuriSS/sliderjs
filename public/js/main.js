(function() {

	"use strict";


	window.onload = function() {
		
		var sliderTopo = new pack.Slider({
			pai: document.getElementById('slider'),
			paginacao: document.getElementById('slider_pagination'),
			auto: true,
			setas: document.getElementById('setas'),
			tempoEfeito: 700,
			efeito: "slideHorizontal",
		});

		// slider.test();
	};
})();
