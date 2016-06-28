var Movie = require('../models/movie');
var Category = require('../models/category');
var Comment = require('../models/comment');
var _ = require('underscore');

//detail page
exports.detail = function (req, res) {
    var id = req.params.id;
    Movie.findById(id, function (err, movie) {
        if (err) {
            console.log(err);
        }
        Comment
            .find({movie: id})
            .populate('from', 'name')
            .populate('reply.from reply.to', 'name')
            .exec(function (err, comments) {
                //console.log(comments);
                res.render('detail', {
                    title: 'imooc ' + movie.title,
                    movie: movie,
                    comments: comments
                })
            });
    })

}

//admin page
exports.new = function (req, res) {
    Category.find({},function(err, categories){
        if (err) {
            console.log(err);
        }
        res.render('admin', {
            title: 'imooc 后台录入页',
            categories:categories,
            movie: {}
        })
    })
}

//admin uodate movie
exports.update =  function (req, res) {
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
}

//admin post movie
exports.save = function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    console.log(movieObj);
    if (id) {
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
        _movie = new Movie(movieObj);

        var categoryId = _movie.category;
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }

            Category.findById(categoryId,function (err, category) {
                if (err) {
                    console.log(err);
                }
                category.movies.push(movie._id);

                category.save(function (err, category) {
                    res.redirect('/movie/' + movie._id);
                });
            });

        })
    }
}

//list page
exports.list = function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        })
    })
}

//list delete movie
exports.del = function (req, res) {
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
}