var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
// var db = require('./models');

var app = express();

app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/static'));


app.get('/', function(req, res) {
	res.render('index');
})

app.get('/rec', function(req, res) {
	// var query = req.query.q;

	// request('https://www.googleapis.com/books/v1/volumes?q=' + query, function(err, response, body) {
	// 	var data = JSON.parse(body);
	// 	if (!err && response.statusCode === 200 && data.Search) {
	// 		var results= data.Search;
	// 		res.render("rec", {results: results})
	// 	} 
	// })
	res.render('rec');
});

app.post('/rec', function(req, res) {

});

app.get('/my-list', function(req, res) {
	res.render('my-list');
})

app.post('/my-list', function(req, res) {

})

app.delete('/my-list', function(req, res) {

})

app.get('/sign-up', function(req, res) {
	res.render('sign-up');
})

app.get('/login', function(req, res) {
	res.render('login');
})

app.listen(3000);