/*
 * @Author: Hugo16
 * @Date: 2020-01-02 21:40:24
 * @LastEditTime: 2020-03-15 12:05:20
 */
const https = require('https');
const http = require('http');
// 对dom操作库
const cheerio = require('cheerio');
// 转换编码（某些网站需要）
const iconv = require('iconv-lite');
const zlib = require('zlib');

class Search {
    // 按关键字搜索全部
    searchAll(keyword, name, cb) {
        switch (name) {
            case "独播库": {
                // 独播库
                https.get('https://www.duboku.net/vodsearch/-------------.html?wd=' + keyword, (res) => {
                    let html;
                    res.on('data', (d) => {
                        html += d;
                    });
                    res.on('end', () => {
                        try {
                            let $ = cheerio.load(html)
                            let data = [];
                            $('.myui-vodlist__thumb').each((i, ele) => {
                                data[i] = data[i] || {};
                                data[i].img = "https://www.duboku.net" + $(ele).attr('data-original').replace('https://www.duboku.net', "");
                            });
                            $('h4.title a.searchkey').each((i, ele) => {
                                data[i].link = "https://www.duboku.net" + $(ele).attr('href').replace('https://www.duboku.net', "");
                                data[i].title = $(ele).text();
                            });
                            cb(data.slice(0, 10), "影院");
                        } catch (error) {
                            cb([{ title: "错误", img: "https://s1.ax1x.com/2020/03/15/81oWRA.png", link: "https://github.com/Hugo16/VSFM/issues", img: "https://s1.ax1x.com/2020/03/15/81oWRA.png", link: "https://github.com/Hugo16/VSFM/issues" }], "影院")
                        }
                    })
                }).on('error', (e) => {
                    console.error(e);
                });
            }; break;
            case "天天爱去": {
                // 天天爱去
                https.get('https://www.tt27.tv/search.asp?searchword=' + toUrlGbk(keyword) + "&submit=%CB%D1+%CB%F7", (res) => {
                    let html;
                    res.on('data', (d) => {
                        // 从gzip解压缩
                        zlib.gunzip(d, function (err, dezipped) {
                        });
                        // 转码
                        d = iconv.decode(d, 'gbk')
                        // 拼接
                        html += d;
                    });
                    res.on('end', () => {
                        try {
                            console.log(html);
                            
                            let $ = cheerio.load(html)
                            let data = [];
                            $('.mlist li a img').each((i, ele) => {
                                data[i] = data[i] || {};
                                data[i].img = $(ele).attr('data-cfsrc');
                            });
                            $('.mlist li a.p').each((i, ele) => {
                                data[i].link = "http://www.tt27.tv" + $(ele).attr('href').replace('http://www.tt27.tv', "");
                                data[i].title = $(ele).attr('title');
                            });
                            cb(data.slice(0, 10), "影院");
                        } catch (error) {
                            cb([{ title: "错误", img: "https://s1.ax1x.com/2020/03/15/81oWRA.png", link: "https://github.com/Hugo16/VSFM/issues" }], "影院")
                        }
                    })
                }).on('error', (e) => {
                    console.error(e);
                });
            }; break;
            case "片集网": {
                // 片集网
                https.get('https://pianji.net/vod/name/' + encodeURI(keyword), (res) => {
                    let html;
                    res.on('data', (d) => {
                        // 从gzip解压缩
                        zlib.gunzip(d, function (err, dezipped) {
                        });
                        // 转码
                        d = iconv.decode(d, 'utf-8')
                        // 拼接
                        html += d;
                    });
                    res.on('end', () => {
                        try {
                            let $ = cheerio.load(html)
                            let data = [];
                            $('ul.list-unstyled li p.image a img').each((i, ele) => {
                                data[i] = data[i] || {};
                                data[i].img = $(ele).attr('data-original');
                                data[i].title = $(ele).attr('alt');
                            });
                            $('ul.list-unstyled li p.image a').each((i, ele) => {
                                data[i].link = "https://pianji.net" + $(ele).attr('href').replace('https://pianji.net', "");
                            });
                            cb(data.slice(0, 10), "影院");
                        } catch (error) {
                            cb([{ title: "错误", img: "https://s1.ax1x.com/2020/03/15/81oWRA.png", link: "https://github.com/Hugo16/VSFM/issues" }], "影院")
                        }
                    })
                }).on('error', (e) => {
                    console.error(e);
                });
            }; break;
            case "好剧屋": {
                // 好剧屋
                http.get('http://www.haojuwu.net/search.php?searchword=' + encodeURI(keyword), (res) => {
                    let html;
                    res.on('data', (d) => {
                        // 从gzip解压缩
                        zlib.gunzip(d, function (err, dezipped) {
                        });
                        // 转码
                        d = iconv.decode(d, 'utf-8')
                        // 拼接
                        html += d;
                    });
                    res.on('end', () => {
                        try {
                            let $ = cheerio.load(html)
                            let data = [];
                            $('dl.content dt a.videopic').each((i, ele) => {
                                data[i] = data[i] || {};
                                data[i].img = $(ele).attr('style').split("(")[1].split(")")[0];
                            });
                            $('dl.content dd div.head h3 a').each((i, ele) => {
                                data[i].link = "http://www.haojuwu.net" + $(ele).attr('href').replace('http://www.haojuwu.net', "");
                                data[i].title = $(ele).text();
                            });
                            cb(data.slice(0, 10), "影院");
                        } catch (error) {
                            cb([{ title: "错误", img: "https://s1.ax1x.com/2020/03/15/81oWRA.png", link: "https://github.com/Hugo16/VSFM/issues" }], "影院")
                        }
                    })
                }).on('error', (e) => {
                    console.error(e);
                });
            }; break;
            case "晨光影院": {
                // 晨光影院
                http.get('http://www.86cg.com/search/?wd=' + encodeURI(keyword), (res) => {
                    let html;
                    res.on('data', (d) => {
                        // 从gzip解压缩
                        zlib.gunzip(d, function (err, dezipped) {
                        });
                        // 转码
                        d = iconv.decode(d, 'utf-8')
                        // 拼接
                        html += d;
                    });
                    res.on('end', () => {
                        try {
                            let $ = cheerio.load(html)
                            let data = [];
                            $('ul.serach-ul li a.list-img img').each((i, ele) => {
                                data[i] = data[i] || {};
                                data[i].img = "http://www.86cg.com" + $(ele).attr('data-url').replace('http://www.86cg.com', "");
                            });
                            $('ul.serach-ul li a.list-img').each((i, ele) => {
                                data[i].link = "http://www.86cg.com" + $(ele).attr('href').replace('http://www.86cg.com', "");
                                data[i].title = $(ele).attr('title');
                            });
                            cb(data.slice(0, 10), "影院");
                        } catch (error) {
                            cb([{ title: "错误", img: "https://s1.ax1x.com/2020/03/15/81oWRA.png", link: "https://github.com/Hugo16/VSFM/issues" }], "影院")
                        }
                    })
                }).on('error', (e) => {
                    console.error(e);
                });
            }; break;
            case "星辰影院": {
                // 星辰影院
                https.get('https://www.vodxc.in/so/tid--sw-' + toUrlGbk(keyword).toUpperCase() + "-1-get.json", (res) => {
                    let html;
                    res.on('data', (d) => {
                        // 转码
                        d = iconv.decode(d, 'gbk')
                        // 拼接
                        html += d;
                    });
                    res.on('end', () => {
                        try {
                            if (!html) {
                                cb([], "影院");
                                return;
                            }
                            let $ = cheerio.load(html.slice(html.indexOf("pagetxt") + 9, -1));
                            let data = [];
                            $('li a.play-pic img').each((i, ele) => {
                                data[i] = data[i] || {};
                                data[i].img = $(ele).attr('src');
                            });
                            $('li a.play-pic').each((i, ele) => {
                                data[i].link = "https://www.vodxc.in" + $(ele).attr('href').replace('https://www.vodxc.in', "");
                                data[i].title = $(ele).attr('title');
                            });
                            cb(data.slice(0, 10), "影院");
                        } catch (error) {
                            cb([{ title: "错误", img: "https://s1.ax1x.com/2020/03/15/81oWRA.png", link: "https://github.com/Hugo16/VSFM/issues" }], "影院")
                        }
                    })
                }).on('error', (e) => {
                    console.error(e);
                });
            }; break;
            case "全视频TV": {
                // 全视频TV
                https.get('https://www.qsptv.net/search/?wd=' + encodeURI(keyword), (res) => {
                    let html;
                    res.on('data', (d) => {
                        // 从gzip解压缩
                        zlib.gunzip(d, function (err, dezipped) {
                        });
                        // 转码
                        d = iconv.decode(d, 'utf-8')
                        // 拼接
                        html += d;
                    });
                    res.on('end', () => {
                        try {
                            let $ = cheerio.load(html)
                            let data = [];
                            $('div#content a.video-pic').each((i, ele) => {
                                data[i] = data[i] || {};
                                data[i].img = $(ele).attr('data-original');
                                data[i].link = "https://www.qsptv.net" + $(ele).attr('href').replace('https://www.qsptv.net', "");
                                data[i].title = $(ele).attr('title');
                            });
                            cb(data.slice(0, 10), "影院");
                        } catch (error) {
                            cb([{ title: "错误", img: "https://s1.ax1x.com/2020/03/15/81oWRA.png", link: "https://github.com/Hugo16/VSFM/issues" }], "影院")
                        }
                    })
                }).on('error', (e) => {
                    console.error(e);
                });
            }; break;
            case "迅雷影院": {
                // 迅雷影院
                https.get('https://www.xunleiyy.com/search.php/?searchword=' + encodeURI(keyword), {
                    rejectUnauthorized: false
                }, (res) => {
                    let html;
                    res.on('data', (d) => {
                        // 从gzip解压缩
                        zlib.gunzip(d, function (err, dezipped) {
                        });
                        // 转码
                        d = iconv.decode(d, 'utf-8')
                        // 拼接
                        html += d;
                    });
                    res.on('end', () => {
                        try {
                            let $ = cheerio.load(html)
                            let data = [];
                            $('ul li div.list_lis_mov>a').each((i, ele) => {
                                data[i] = data[i] || {};
                                data[i].link = "https://www.xunleiyy.com" + $(ele).attr('href').replace('https://www.xunleiyy.com', "");
                            });
                            $('ul li div.list_lis_mov a div.imgs img').each((i, ele) => {
                                data[i].img = $(ele).attr('data-echo');
                                data[i].title = $(ele).attr('alt');
                            });
                            cb(data.slice(0, 10), "影院");
                        } catch (error) {
                            cb([{ title: "错误", img: "https://s1.ax1x.com/2020/03/15/81oWRA.png", link: "https://github.com/Hugo16/VSFM/issues" }], "影院")
                        }
                    })
                }).on('error', (e) => {
                    console.error(e);
                });
            }; break;
            case "樱花动漫": {
                // 樱花动漫
                http.get('http://www.imomoe.in/search.asp?searchword=' + toUrlGbk(keyword), {
                    rejectUnauthorized: false
                }, (res) => {
                    let html;
                    res.on('data', (d) => {
                        // 转码
                        d = iconv.decode(d, 'gbk')
                        // 拼接
                        html += d;
                    });
                    res.on('end', () => {
                        try {
                            let $ = cheerio.load(html)
                            let data = [];
                            $('.fire>.pics>ul>li>a').each((i, ele) => {
                                data[i] = data[i] || {};
                                data[i].link = "http://www.imomoe.in" + $(ele).attr('href').replace('http://www.imomoe.in', "");
                            });
                            $('.fire>.pics>ul>li>a>img').each((i, ele) => {
                                data[i].img = $(ele).attr('src');
                                data[i].title = $(ele).attr('alt');
                            });
                            cb(data.slice(0, 10), "动漫");
                        } catch (error) {
                            cb([{ title: "错误", img: "https://s1.ax1x.com/2020/03/15/81oWRA.png", link: "https://github.com/Hugo16/VSFM/issues" }], "动漫")
                        }
                    })
                }).on('error', (e) => {
                    console.error(e);
                });
            }; break;
            case "bimibimi": {
                // bimibimi
                http.get('http://www.bimibimi.tv/vod/search?wd=' + encodeURI(keyword), {
                    rejectUnauthorized: false
                }, (res) => {
                    let html;
                    res.on('data', (d) => {
                        // 从gzip解压缩
                        zlib.gunzip(d, function (err, dezipped) {
                        });
                        // 转码
                        d = iconv.decode(d, 'utf-8')
                        // 拼接
                        html += d;
                    });
                    res.on('end', () => {
                        try {
                            let $ = cheerio.load(html)
                            let data = [];
                            $('.v_tb>ul>li>a').each((i, ele) => {
                                data[i] = data[i] || {};
                                data[i].link = "http://www.bimibimi.tv" + $(ele).attr('href').replace('http://www.bimibimi.tv', "");
                                data[i].title = $(ele).attr('title');
                            });
                            $('.v_tb>ul>li>a>img').each((i, ele) => {
                                data[i].img = $(ele).attr('data-original');
                            });
                            cb(data.slice(0, 10), "动漫");
                        } catch (error) {
                            cb([{ title: "错误", img: "https://s1.ax1x.com/2020/03/15/81oWRA.png", link: "https://github.com/Hugo16/VSFM/issues" }], "动漫")
                        }
                    })
                }).on('error', (e) => {
                    console.error(e);
                });
            }; break;
            case "zzzfun": {
                // zzzfun
                http.get('http://www.zzzfun.com/index.php/vod-search.html?wd=' + encodeURI(keyword), {
                    rejectUnauthorized: false
                }, (res) => {
                    let html;
                    res.on('data', (d) => {
                        // 从gzip解压缩
                        zlib.gunzip(d, function (err, dezipped) {
                        });
                        // 转码
                        d = iconv.decode(d, 'utf-8')
                        // 拼接
                        html += d;
                    });
                    res.on('end', () => {
                        try {
                            let $ = cheerio.load(html)
                            let data = [];
                            $('ul.show-list>li>a').each((i, ele) => {
                                data[i] = data[i] || {};
                                data[i].link = "http://www.zzzfun.com" + $(ele).attr('href').replace('http://www.zzzfun.com', "");
                            });
                            $('ul.show-list>li>a>img').each((i, ele) => {
                                data[i].img = $(ele).attr('original') || $(ele).attr('src');
                                data[i].title = $(ele).attr('alt');
                            });
                            cb(data.slice(0, 10), "动漫");
                        } catch (error) {
                            cb([{ title: "错误", img: "https://s1.ax1x.com/2020/03/15/81oWRA.png", link: "https://github.com/Hugo16/VSFM/issues" }], "动漫")
                        }
                    })
                }).on('error', (e) => {
                    console.error(e);
                });
            }; break;
            case "美剧天堂": {
                // 美剧天堂
                https.get('https://www.meijutt.tv/search/index.asp?searchword=' + toUrlGbk(keyword), {
                    rejectUnauthorized: false
                }, (res) => {
                    let html;
                    res.on('data', (d) => {
                        // 从gzip解压缩
                        zlib.gunzip(d, function (err, dezipped) {
                        });
                        // 转码
                        d = iconv.decode(d, 'gbk')
                        // 拼接
                        html += d;
                    });
                    res.on('end', () => {
                        try {
                            let $ = cheerio.load(html)
                            let data = [];
                            $('.list3_cn_box .cn_box2>.cn_box_box3>.bor_img3_right>a').each((i, ele) => {
                                data[i] = data[i] || {};
                                data[i].link = "https://www.meijutt.tv" + $(ele).attr('href').replace('https://www.meijutt.tv', "");
                            });
                            $('.list3_cn_box .cn_box2>.cn_box_box3>.bor_img3_right>a>img').each((i, ele) => {
                                data[i].img = $(ele).attr('src');
                                data[i].title = $(ele).attr('alt');
                            });
                            cb(data.slice(0, 10), "美剧");
                        } catch (error) {
                            cb([{ title: "错误", img: "https://s1.ax1x.com/2020/03/15/81oWRA.png", link: "https://github.com/Hugo16/VSFM/issues" }], "美剧")
                        }
                    })
                }).on('error', (e) => {
                    console.error(e);
                });
            }; break;
            case "91美剧网": {
                // 91美剧网
                https.get('https://91mjw.com/?s=' + encodeURI(keyword), {
                    rejectUnauthorized: false
                }, (res) => {
                    let html;
                    res.on('data', (d) => {
                        // 从gzip解压缩
                        zlib.gunzip(d, function (err, dezipped) {
                        });
                        // 转码
                        d = iconv.decode(d, 'utf-8')
                        // 拼接
                        html += d;
                    });
                    res.on('end', () => {
                        try {
                            let $ = cheerio.load(html)
                            let data = [];
                            $('.m-movies>.u-movie>a').each((i, ele) => {
                                data[i] = data[i] || {};
                                data[i].link = "https://91mjw.com" + $(ele).attr('href').replace('https://91mjw.com', "");
                            });
                            $('.m-movies>.u-movie>a img').each((i, ele) => {
                                data[i].img = $(ele).attr('data-original');
                            });
                            $('.m-movies>.u-movie>a h2').each((i, ele) => {
                                data[i].title = $(ele).text();
                            });
                            cb(data.slice(0, 10), "美剧");
                        } catch (error) {
                            cb([{ title: "错误", img: "https://s1.ax1x.com/2020/03/15/81oWRA.png", link: "https://github.com/Hugo16/VSFM/issues" }], "美剧")
                        }
                    })
                }).on('error', (e) => {
                    console.error(e);
                });
            }; break;
            case "在线之家": {
                // 在线之家
                https.get('https://www.zxzj.me/vodsearch/-------------.html?wd=' + encodeURI(keyword), {
                    rejectUnauthorized: false
                }, (res) => {
                    let html;
                    res.on('data', (d) => {
                        // 从gzip解压缩
                        zlib.gunzip(d, function (err, dezipped) {
                        });
                        // 转码
                        d = iconv.decode(d, 'utf-8')
                        // 拼接
                        html += d;
                    });
                    res.on('end', () => {
                        try {
                            let $ = cheerio.load(html)
                            let data = [];
                            $('ul.stui-vodlist>li>div>a').each((i, ele) => {
                                data[i] = data[i] || {};
                                data[i].link = "https://www.zxzj.me" + $(ele).attr('href').replace('https://www.zxzj.me', "");
                                data[i].img = $(ele).attr('data-original');
                                data[i].title = $(ele).attr('title');
                            });
                            cb(data.slice(0, 10), "美剧");
                        } catch (error) {
                            cb([{ title: "错误", img: "https://s1.ax1x.com/2020/03/15/81oWRA.png", link: "https://github.com/Hugo16/VSFM/issues" }], "美剧")
                        }
                    })
                }).on('error', (e) => {
                    console.error(e);
                });
            }; break;
            case "综艺秀": {
                // 综艺秀
                http.get('http://www.zyshow.net/search.asp?bh=' + encodeURI(keyword), {
                    rejectUnauthorized: false
                }, (res) => {
                    let html;
                    res.on('data', (d) => {
                        // 从gzip解压缩
                        zlib.gunzip(d, function (err, dezipped) {
                        });
                        // 转码
                        d = iconv.decode(d, 'utf-8')
                        // 拼接
                        html += d;
                    });
                    res.on('end', () => {
                        try {
                            let $ = cheerio.load(html)
                            let data = [];
                            $('table>tbody>tr').each((i, ele) => {
                                if (i > 1) {
                                    let target1 = $(ele).find("td").eq(1).find("a");
                                    let target2 = $(ele).find("td").eq(2);

                                    data[i - 2] = data[i] || {};
                                    data[i - 2].link = "http://www.zyshow.net" + target1.attr('href').replace('../', "/");
                                    data[i - 2].title = target1.attr('title') + ":" + target2.text();
                                    data[i - 2].img = "https://pianji.net//Public/images/no.jpg";
                                }
                            });
                            cb(data.slice(0, 10), "综艺");
                        } catch (error) {
                            cb([{ title: "错误", img: "https://s1.ax1x.com/2020/03/15/81oWRA.png", link: "https://github.com/Hugo16/VSFM/issues" }], "综艺")
                        }
                    })
                }).on('error', (e) => {
                    console.error(e);
                });
            }; break;
        }
    }
}

// 将字符串转成gbk URI编码
function toUrlGbk(str) {
    let buffer = iconv.encode(str, "gbk");
    let result;
    for (let index = 0; index < buffer.length; index++) {
        result += "%" + buffer[index].toString(16)
    }
    return result.replace("undefined", "");
}

// (new Search()).searchAll("黑色", "天天爱去", (data) => {
//     console.log(data);
// })

module.exports = Search;