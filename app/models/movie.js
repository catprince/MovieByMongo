var mongoose = require('mongoose');
/*var db = mongoose.connect('mongodb://127.0.0.1:27017/test');
db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("——数据库连接成功！——");
});*/
var MovieSchema = require('../schemas/movie');
var Movie = mongoose.model('movie', MovieSchema);

module.exports = Movie;