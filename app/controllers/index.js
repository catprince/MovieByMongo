var Movie = require('../models/movie');
var Category = require('../models/category');

exports.index = function (req, res) {
    //console.log(req.session.user);
    Category
        .find({})
        //.populate({
        //    path: 'movies',
        //    //select: 'title poster',
        //    options: { limit: 5 }
        //})
        .populate({path: 'movies'})
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
