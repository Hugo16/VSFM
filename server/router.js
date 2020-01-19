/*
 * @Author: Hugo16
 * @Date: 2020-01-02 14:40:21
 * @LastEditTime : 2020-01-19 19:01:48
 */
let express = require('express');
let app = express();
let api = new (require('./api'));

function router() {
    app.all("*", function (req, res, next) {
        //设置允许跨域的域名，*代表允许任意域名跨域
        res.header("Access-Control-Allow-Origin", "*");
        //允许的header类型
        res.header("Access-Control-Allow-Headers", "content-type");
        //跨域允许的请求方式 
        res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
        if (req.method.toLowerCase() == 'options')
            res.send(200);  //让options尝试请求快速结束
        else
            next();
    })
    app.get('/search', function (req, res) {
        api.search(req.query.keyword, req.query.name, (data, type) => {
            res.send([data, type]);
        })
    })

    app.listen(3000)
}

module.exports = router;