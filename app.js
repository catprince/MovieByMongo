var express = require('express');
var path = require('path');
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');
var app = express();
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');

/*var db = mongoose.connect('mongodb://127.0.0.1:27017/MongoDB');
db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("——数据库连接成功！——");
});*/

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParser.urlencoded());
//app.use(express.static(path.join(__dirname,'bower_components')))
app.use(serveStatic('bower_components'));
app.locals.moment = require('moment');
app.listen(port);

console.log('imooc started on port ' + port);

//index page
app.get('/', function(req, res){
    Movie.fetch(function(err, movies){
        if(err){
            console.log(err);
        }
        res.render('index',{
            title: 'imooc 首页',
            movies: movies
        })
    })
})

//detail page
app.get('/movie/:id', function(req, res){
    var id = req.params.id;
    Movie.findById(id, function(err, movie){
        if (err){
            console.log(err);
        }
        res.render('detail',{
            title: 'imooc ' + movie.title,
            movie: movie
        })
    })

})

//admin page
app.get('/admin/movie', function(req, res){
    res.render('admin',{
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
app.get('/admin/update/:id', function(req, res){
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function(err,movie){
            if (err){
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
app.post('/admin/movie/new', function(req, res){
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    console.log(movieObj);
    if (id !== 'undefined') {
        Movie.findById(id, function(err,movie){
            if (err){
                console.log(err);
            }

            _movie = _.extend(movie, movieObj)
            _movie.save(function(err,movie){
                if (err){
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

        _movie.save(function(err,movie){
            if (err){
                console.log(err);
            }

            res.redirect('/movie/' + movie._id);
        })
    }
})

//list page
app.get('/admin/list', function(req, res){
    Movie.fetch(function(err, movies){
        if(err){
            console.log(err);
        }
        res.render('list',{
            title: 'imooc 列表页',
            movies: movies
        })
    })
})