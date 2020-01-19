/*
 * @Author: Hugo16
 * @Date: 2020-01-05 12:56:31
 * @LastEditTime : 2020-01-19 23:16:27
 */
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios);

const searchUrl = "http://localhost:3000/search/";

function getAll(keyword, data) {
    for (let i = 0; i < data.length; i++) {
        get(searchUrl + "?keyword=" + keyword + "&name=" + data[i].name, (d) => {
            data[i].data = d[0];
            data[i].loading = false;
            data[i].type = d[1];
        })
    }
}

function get(url, cb) {
    Vue.axios.get(url).then((response) => {
        cb(response.data);
    }).catch((error) => {
        console.log(error);
    })
}

export default ({
    getAll
})