var express = require('express');
var path = require('path');
var port = process.env.PORT || 3000;
var session = require('express-session');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var cookieParser = require('cookie-parser');

//models loading
var models_path = __dirname + '/app/models';
var walk = function (path) {
    fs
        .readdirSync(path)
        .forEach(function(file){
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);

            if (stat.isFile()) {
                if (/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath)
                }
            } else if (stat.isDirectory()) {
                walk(newPath);
            }
        })
}

walk(models_path);


var dbUrl = 'mongodb://127.0.0.1:27017/imooc';
var db = mongoose.connect(dbUrl);
//db.connection.on("error", function (error) {
//    console.log("数据库连接失败：" + error);
//});
//db.connection.on("open", function () {
//    console.log("——数据库连接成功！——");
//});

app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded());
//app.use(express.static(path.join(__dirname,'bower_components')))
//app.use(express.multipart());
app.use(require('connect-multiparty')());
app.use(cookieParser());
app.use(session({
    secret: 'imooc',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));

var logger = require('morgan');

if ('development' === app.get('env') ) {
    app.set('showStackError',true);
    //app.use(express.logger(':method :url :status'));
    app.use(logger(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}


require('./config/routes')(app)
app.use(serveStatic('public'));
app.locals.moment = require('moment');
app.listen(port);

//console.log('imooc started on port ' + port);

