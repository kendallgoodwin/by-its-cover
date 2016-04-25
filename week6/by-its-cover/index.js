var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var session = require('express-session');
var flash = require('connect-flash');
var db = require('./models');

var app = express();

app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/static'));
app.use(session({
  secret: 'l3m0n@d3',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// req.session.lastPage = '/login';
// console.log(req.session.lastPage);


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
});

app.post('/sign-up', function(req, res) {
		db.user.findOrCreate({
		where: {
			username: req.body.username,
		},
		defaults: {
			password: req.body.password,
			email: req.body.email
		}
	}).spread(function(user, isNew) {
		if (isNew) {
			res.redirect('/rec')
		} else {
			req.flash('danger', 'username already taken');
			res.redirect('/sign-up')
		}
		// res.redirect('/rec')
	}).catch(function(err) {
		res.send(err);
	}); console.log(req.body);
});

app.get('/login', function(req, res) {
	res.render('login');
});

app.post('/login', function(req, res) {
	db.user.findOne({where: {username: req.body.username, password: req.body.password}}.then(function(user) {
		console.log(user);
		res.redirect('/rec', {user: user});
	}));
});

app.listen(3000);







