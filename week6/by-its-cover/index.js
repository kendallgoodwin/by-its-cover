var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var session = require('express-session');
var flash = require('connect-flash');
var bcrypt = require('bcrypt');
var request = require('request');
var db = require('./models');
// var selflink = require('./static/text-json/selflink.json');
// var test = require('./static/text-json/test.json');

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
});

app.post ('/', function(req, res) {
	console.log("form data:", req.body);
	db.user.findOrCreate({
		where: {
   			$or: [{username: req.body.username}, {email: req.body.email}]
		},
		defaults: {
			username: req.body.username,
			email: req.body.email,
			password: req.body.password
		}
	}).spread(function(user, isNew) {
  	if (isNew) {
  		req.session.userId = user.id;
  		req.flash('success', 'Yay! You have successfully created an account!');
    	res.redirect('/rec');
  	} else {
  		req.flash('danger', 'Username or email already in use.')
    	res.redirect('/');
  	}
  }).catch(function(err) {
    req.flash('danger', 'Username already taken. Please choose another name.');
    res.redirect('/');
  });
});

app.get('/rec', function(req, res) {
	var booksInfo = [];

	var limitText = function(str) {
	  var splitString = str.split('.');
	  var newString = [];
	   for (var i = 0; i < splitString.length; i++) {
	   		if (i < 3) {
				newString.push(splitString[i]);
			}  
		}
		var shortSen = newString.join('. ');
		return shortSen;
	};
request('https://www.googleapis.com/books/v1/volumes?q=subject:fiction&startIndex=100&maxResults=10', function(err, response, body) {
	var body = JSON.parse(body);
	for (var i = 0; i < body.items.length; i++) {
		request(body.items[i].selfLink, function(err2, response2, body2) {
			var body2 = JSON.parse(body2);
			var book = {};
			book.title = body2.volumeInfo.title;
			book.author = body2.volumeInfo.authors[0];
			book.description = body2.volumeInfo.description;
			book.rating = Math.round(body2.volumeInfo.averageRating);
			book.isbn = body2.volumeInfo.industryIdentifiers[1].identifier;
			book.pageCount = body2.volumeInfo.pageCount;
			book.image = body2.volumeInfo.imageLinks.large;

			var description = body2.volumeInfo.description;
			description = description.replace(/<(?:.|\n)*?>/gm, '');
			book.description = limitText(description);
			// book.description = limitText(description);
			booksInfo.push(book);
		})
		
	};
		

// 	for (var i = 0; i < body.items.length; i++) {
// 		request(body.items[i].selfLink, function(err2, response2, body2) {
// 			var body2 = JSON.parse(body2);
// 			var book = {};
// 			book.title = body2.volumeInfo.title;
// 			book.author = body2.volumeInfo.authors[0];
// 			book.description = body2.volumeInfo.description;
// 			book.rating = Math.round(body2.volumeInfo.averageRating);
// 			book.isbn = body2.volumeInfo.industryIdentifiers[1].identifier;
// 			book.pageCount = body2.volumeInfo.pageCount;
// 			book.image = body2.volumeInfo.imageLinks.large;

// 			var description = body2.volumeInfo.description;
// 			description = description.replace(/<(?:.|\n)*?>/gm, '');
// 			book.description = description;

// 			// console.log(i, "calling limitText", description);
// 			book.description = limitText(description);

// 			// booksInfo.push(book);
// 			console.log(book);
// 			booksInfo.push(book);
// 			// console.log(booksInfo);
// 			// console.log(booksInfo);
// 		// 	});
// 		// }
// 		})
// 	}

// 	setTimeout(function(){
// 		res.render('rec', {book: booksInfo, alerts: req.flash()})
// 	}, 5000)
	
})
setTimeout(function(){
	res.render('rec', {book: booksInfo, alerts: req.flash()})
}, 2000)
	

	// res.render('rec', {book: booksInfo, alerts: req.flash()})

		
	
	// request('https://www.googleapis.com/books/v1/volumes?q=subject:fiction&startIndex=100&maxResults=40', function(err, response, body) {
	// 	var body = JSON.parse(body);
	// 	var booksInfo = [];
	// 	for (i = 0; i < body.items.length; i++) {
			// request(body.items[i].selfLink, function(err2, response2, body2) {
			// var body2 = JSON.parse(body2);
	// 		
	
});


app.get('/my-list', function(req, res) { 
	if (req.currentUser) {

		var userId = req.currentUser.id;
		db.user.findOne({
			where: {
				id: userId
			}
		}).then(function(user) {
			console.log(user)
			user.getFavorites().then(function(favorites) {
				res.render('my-list', {user: user, favorites: favorites});
			});
		});
	} else {
		req.flash('danger', 'You must be logged in to view lists');
		res.redirect('/');
	}
});


app.post('/my-list', function(req, res) {	
	if (req.currentUser) {

	db.favorite.create({
		userId: req.body.userId,
		title: req.body.title,
		author: req.body.author,
		isbn: req.body.isbn,
		rating: req.body.rating,
		pageCount: req.body.pageCount,
		description: req.body.description,
		image: req.body.image
	}).then(function() {
		res.redirect("/my-list");
	}) 
	} else {
		req.flash('danger', 'You must be logged in to view lists');
	}
});

app.get('/my-list/:id/:isbn', function(req, res) {
	// if (!req.body.userId) {
	// 	return res.redirect('/login');
	// }

	var userId = req.params.id;
	var isbn = req.params.isbn;
	db.user.findOne({where: {id: userId}}).then(function(user) {
		user.getFavorites({where: {isbn: isbn}}).then(function(favorite) {
				res.render('favoriteInfo', {favorite: favorite});
			});
	});
});

app.delete("/my-list/:favoriteId", function(req, res) {
	var favoriteId = req.params.favoriteId;

		db.favorite.destroy({where: {id: favoriteId}}).then(function(favorite) {
			res.status(200).send('Deleted favorite');
		});
});



// app.get('/sign-up', function(req, res) {
// 	res.render('sign-up', {alerts: req.flash()});
// });

// app.post('/sign-up', function(req, res) {
// 		db.user.findOrCreate({
// 		where: {
//    			$or: [{username: req.body.username}, {email: req.body.email}]
// 		},
// 		defaults: {
// 			password: req.body.password
// 		}
// 	}).spread(function(user, isNew) {
//   	if (isNew) {
//   		req.session.userId = user.id;
//   		req.flash('success', 'Yay! You have successfully created an account!');
//     	res.redirect('/rec');
//   	} else {
//   		req.flash('danger', 'Username or email already in use.')
//     	res.redirect('/sign-up');
//   	}
//   }).catch(function(err) {
//     req.flash('danger', 'Username already taken. Please choose another name.');
//     res.redirect('/sign-up');
//   });
// });

app.get('/login', function(req, res) {
	res.render('login', {alerts: req.flash()});
});

app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  db.user.authenticate(username, password, function(err, user) {
    if (err) {
    	res.send(err);
    } else if (user) {
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
  req.flash('success', 'You are now logged out');
  res.redirect('/');
});



app.listen(3000);







