var express = require('express');
var path = require('path');
var port = process.env.PORT || 3000;
var session = require('express-session');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var _ = require('underscore');
var Movie = require('./models/movie');
var User = require('./models/user');
var app = express();
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var cookieParser = require('cookie-parser');


var dbUrl = 'mongodb://127.0.0.1:27017/test';
var db = mongoose.connect(dbUrl);
db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("——数据库连接成功！——");
});

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded());
//app.use(express.static(path.join(__dirname,'bower_components')))
app.use(cookieParser());
app.use(session({
    secret: 'imooc',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));
app.use(serveStatic('public'));
app.locals.moment = require('moment');
app.listen(port);

console.log('imooc started on port ' + port);

//index page
app.get('/', function (req, res) {
    console.log(req.session.user);

    var _user = req.session.user;

    app.locals.user = _user;

    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: 'imooc 首页',
            movies: movies
        })
    })
})

//detail page
app.get('/movie/:id', function (req, res) {
    var id = req.params.id;
    Movie.findById(id, function (err, movie) {
        if (err) {
            console.log(err);
        }
        res.render('detail', {
            title: 'imooc ' + movie.title,
            movie: movie
        })
    })

})

//admin page
app.get('/admin/new', function (req, res) {
    res.render('admin', {
        title: 'imooc 后台录入页',
        movie: {
            doctor: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    })
})

//admin uodate movie
app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }

            res.render('admin', {
                title: 'imooc 后台更新页',
                movie: movie
            })
        })
    }
})

//admin post movie
app.post('/admin/movie/new', function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    console.log(movieObj);
    if (id !== 'undefined') {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }

            _movie = _.extend(movie, movieObj)
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }

                res.redirect('/movie/' + movie._id);
            })
        })
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            country: movieObj.country,
            title: movieObj.title,
            year: movieObj.year,
            poster: movieObj.poster,
            language: movieObj.language,
            flash: movieObj.flash,
            summary: movieObj.summary
        })

        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }

            res.redirect('/movie/' + movie._id);
        })
    }
})

//list page
app.get('/admin/list', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        })
    })
})

//list delete movie
app.delete('/admin/list', function (req, res) {
    var id = req.query.id;

    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({success: 1})
            }

        })
    }
})

//signup
app.post('/user/signup', function (req, res) {
    var _user = req.body.user;//req,param('user')
    //'/user/signup:id' req.params.id
    //'/user/signup:124?id=111' req.query.id

    console.log(_user);


    User.findOne({name: _user.name}, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (user) {
            return res.redirect('/');
        } else {
            var user = new User(_user);
            user.save(function (err, user) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/admin/userlist');
            })
        }
    });
})

//userlist page
app.get('/admin/userlist', function (req, res) {
    User.fetch(function (err, users) {
        console.log(users);
        if (err) {
            console.log(err);
        }
        res.render('userlist', {
            title: 'imooc 用户列表页',
            users: users
        })
    })
})

//signin
app.post('/user/signin', function(req, res){
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({name: name}, function(err, user){
        if (err) {
            console.log(err);
        }

        if (!user) {
            return res.redirect('/');
        }

        user.comparePassword(password, function(err, isMatch){
            if (err) {
                console.log(err);
            }

            if (isMatch) {
                console.log('password is matched!');
                req.session.user = user;
                return res.redirect('/');
            } else {
                console.log('password is not matched!')
            }
        })
    });
});

//logout
app.get('/logout', function(req, res){
    delete req.session.user;

    res.redirect('/');
});