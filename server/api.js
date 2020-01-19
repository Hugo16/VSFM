/*
 * @Author: Hugo16
 * @Date: 2020-01-02 21:25:17
 * @LastEditTime : 2020-01-14 16:16:10
 */
let $search = new (require('./search'));

class Api {
    constructor() {

    }

    search(keyword, name, cb) {
        $search.searchAll(keyword, name, cb);
    }
}

module.exports = Api;