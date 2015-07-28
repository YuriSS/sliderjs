(function() {

	"use strict";


	window.onload = function() {

		var slider = new PluginSlider({
			pai: document.getElementById('slider'),
			paginacao: document.getElementById('slider_pagination'),
			auto: true,
			setas: document.getElementById('setas'),
		});

		// slider.test();
	};
})();