
var lessMiddleware = require('less-middleware');
var express        = require('express');
var path           = require('path');
var app            = express();


app.set('views', 'views');
app.set('view engine', 'hjs');

app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});



app.get('/', function(req, res) {
	res.render('index', {titulo: "Slider Plugin"});
});



var server = app.listen(8000, function() {
	console.log('Rodando em http://%s:%s', server.address().address, server.address().port);
});