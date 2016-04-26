var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var session = require('express-session');
var flash = require('connect-flash');
var bcrypt = require('bcrypt');
var request = require('request');
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

app.use(function(req, res, next) {
  if (req.session.userId) {
    db.user.findById(req.session.userId).then(function(user) {
      req.currentUser = user;
      res.locals.currentUser = user;
      next();
    });
  } else {
    req.currentUser = false;
    res.locals.currentUser = false;
    next();
  }
});


app.get('/', function(req, res) {
	res.render('index', {alerts: req.flash()});
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
	// if (req.session.userId) {
 //    db.user.findById(req.session.userId).then(function(user) {
 //      req.currentUser = user;
 //      res.locals.currentUser = user;
 //      next();
 //    });
 //  	} else {
 //    req.currentUser = false;
 //    res.locals.currentUser = false;
 //    next();
 //  }
 	res.render('my-list');
});


app.post('/my-list', function(req, res) {

})

app.delete('/my-list', function(req, res) {

})

app.get('/sign-up', function(req, res) {
	res.render('sign-up', {alerts: req.flash()});
});

app.post('/sign-up', function(req, res) {
		db.user.findOrCreate({
		where: {
			username: req.body.username,
			email: req.body.email
		},
		defaults: {
			password: req.body.password
		}
	}).spread(function(user, isNew) {
  	if (isNew) {
  		req.session.userId = user.id;
    	res.redirect('/rec');
  	} else {
  		req.flash('danger', 'Username or email already in use.')
    	res.redirect('/sign-up');
  	}
  }).catch(function(err) {
    req.flash('danger', 'Username already taken. Please choose another name.');
    res.redirect('/sign-up');
  });
});

app.get('/login', function(req, res) {
	res.render('login', {alerts: req.flash()});
});

app.post('/login', function(req, res) {
  console.log("sign in:", req.body);
  db.user.authenticate(req.body.username, req.body.password, function(err, user) {
    if (user) {
      req.session.userId = user.id;
      req.flash('success', 'Successfully logged in');
      res.redirect('/rec');
    } else {
    	req.flash('danger', 'Incorrect username or password');
    	res.redirect('/login');
    }
  });
});

app.get('/logout', function(req, res) {
  req.session.userId = false;
  res.redirect('/');
});


app.get('/search', function(req, res) {
	request('https://www.googleapis.com/books/v1/volumes?q=subject:fiction&startIndex=100&maxResults=40', function(err, response, body) {
		var body = JSON.parse(body);
		var booksInfo = [];
		// for (i = 0; i < body.items.length; i++) {
			request(body.items[1].selfLink, function(err2, response2, body2) {
			var body2 = JSON.parse(body2);
			// var image = body2.volumeInfo.imageLinks.large;
			var book = {};
			book.title = body2.volumeInfo.title;
			book.author = body2.volumeInfo.authors[0];
			book.description = body2.volumeInfo.description;
			book.rating = body2.volumeInfo.averageRating;
			book.isbn = body2.volumeInfo.industryIdentifiers[1].identifier;
			book.pageCount = body2.volumeInfo.pageCount;
			book.image = body2.volumeInfo.imageLinks.large;

			//go through body2, and create an object with all the info from it you want
			//push that object into booksInfo
			booksInfo.push(book);
			console.log(booksInfo);
			console.log(body.items.length);
			res.render('rec', {book: book});
			});
		// }; 
	}); 
	//pass booksInfo into the view
	
});


app.listen(3000);







