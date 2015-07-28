(function() {

	"use strict";


	window.Classe = function() {

		this.getMetodos = function(propriedades, callback) {
			for(var prop in propriedades) {
				(function(i) {
					this['get' + i] = function() {
						return propriedades[i];
					};
					callback(i);
				}.bind(this))(prop);
			};
		};

		this.get = function(prop) {
			if(this['get' + prop]) {
				return this['get' + prop]();
			}
			return null;
		};
	};
})();