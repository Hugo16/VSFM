/*
 * @Author: Hugo16
 * @Date: 2019-12-24 19:18:50
 * @LastEditTime : 2020-01-05 14:20:43
 */
import Vue from 'vue'
import Router from 'vue-router'
import index from "./views/index"

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '*',
            component: index
        },
        {
            path: '/',
            name: 'index',
            component: index
        }]
})