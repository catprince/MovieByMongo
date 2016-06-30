var User = require('../models/user');

//signup
exports.showSignup = function (req, res) {
    res.render('signup',{
        title: '注册页面'
    });
};

exports.signup = function (req, res) {
    var _user = req.body.user;//req,param('user')
    //'/user/signup:id' req.params.id
    //'/user/signup:124?id=111' req.query.id

    console.log(_user);


    User.findOne({name: _user.name}, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (user) {
            return res.redirect('/signin');
        } else {
            user = new User(_user);
            user.save(function (err, user) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/');
            })
        }
    });
};

//userlist page
exports.list = function (req, res) {
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
};

//signin
exports.showSignin = function (req, res) {
    res.render('signin',{
        title: '登录页面'
    });
};

exports.signin = function(req, res){
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({name: name}, function(err, user){
        if (err) {
            console.log(err);
        }

        if (!user) {
            return res.redirect('/signup');
        }

        user.comparePassword(password, function(err, isMatch){
            if (err) {
                console.log(err);
            }

            if (isMatch) {
                req.session.user = user;
                return res.redirect('/');
            } else {
                return res.redirect('/signin');
            }
        })
    });
}

//logout
exports.logout = function(req, res){
    delete req.session.user;
    //delete app.locals.user;

    res.redirect('/');
};

//midware for user
exports.singninRequired = function (req, res, next) {
    var user = req.session.user;

    if (!user) {
        return res.redirect('/signin')
    }

    next();
};

//midware for admin
exports.adminRequired = function (req, res, next) {
    var user = req.session.user;

    if (user.role <= 10) {
        return res.redirect('/signin')
    }

    next();
};
