var Movie = require('../models/movie');
var Category = require('../models/category');

exports.index = function (req, res) {
    Category
        .find({})
        .populate({
            path: 'movies',
            select: 'title poster',
            options: { limit: 6 }
        })
        .exec(function(err, categories){
            if (err) {
                console.log(err);
            }
            res.render('index', {
                title: 'imooc 首页',
                categories: categories
            })
        });
}

//search page
exports.search = function (req, res) {
    var catId = req.query.cat;
    var page = req.query.p;
    var index =  page * 2;

    Category
        .find({_id: catId})
        .populate({
            path: 'movies',
            select: 'title poster'
            //options: { limit: 2, skip: index }
        })
        .exec(function(err, categories){
            if (err) {
                console.log(err);
            }
            var category = categories[0] || {};
            res.render('results', {
                title: 'imooc 结果列表页面',
                keyword: category.name,
                category: category
            })
        });
}
