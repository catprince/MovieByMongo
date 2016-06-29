var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
var Category = require('../app/controllers/category');
var Comment = require('../app/controllers/comment');

module.exports = function (app){
    //pre handle user
    app.use(function (req, res, next) {
        //console.log(req.session.user);
        var _user = req.session.user;

        app.locals.user = _user;

        return next();
    });

    //Index
    app.get('/', Index.index);

    //Movie
    app.get('/movie/:id', Movie.detail);
    app.get('/admin/movie/new', User.singninRequired, User.adminRequired, Movie.new);
    app.get('/admin/movie/update/:id', User.singninRequired, User.adminRequired, Movie.update);
    app.post('/admin/movie/new', User.singninRequired, User.adminRequired, Movie.savePoster, Movie.save);
    app.get('/admin/movie/list', User.singninRequired, User.adminRequired, Movie.list);
    app.delete('/admin/movie/list', User.singninRequired, User.adminRequired, Movie.del);

    //User
    app.post('/user/signup', User.signup);
    app.get('/admin/user/list', User.singninRequired, User.adminRequired, User.list);
    app.post('/user/signin', User.signin);
    app.get('/signin', User.showSignin);
    app.get('/signup', User.showSignup);
    app.get('/logout', User.logout);

    //comment
    app.post('/user/comment', User.singninRequired, Comment.save);

    //category
    app.get('/admin/category/new', User.singninRequired, User.adminRequired, Category.new);
    app.post('/admin/category', User.singninRequired, User.adminRequired, Category.save);
    app.get('/admin/category/list', User.singninRequired, User.adminRequired, Category.list);

    //results
    app.get('/results', Index.search);
};

