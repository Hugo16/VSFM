<!--
 * @Author: Hugo16
 * @Date: 2019-12-24 19:28:50
 * @LastEditTime: 2020-03-15 12:10:41
 -->
<template>
  <div class="layout">
    <div class="header">
      <div class="left">VSFM</div>
      <div class="right">
        <a-button icon="question" @click="config = true"></a-button>
        <a-button icon="minus" @click="minusWin"></a-button>
        <a-button icon="close" type="danger" @click="closeWin"></a-button>
      </div>
    </div>
    <div
      ref="scrollDiv"
      id="scrollDiv"
      :class="{'content-scroll':true,'content-scroll-forbar':searched}"
    >
      <a-back-top :target="backToTop" />
      <div class="content">
        <div :class="{'search-wrap':true,'search-wrap-mode0':searching}">
          <a-input-search
            ref="search-btn"
            placeholder="搜索影视"
            size="large"
            @search="onSearch"
            enterButton
            v-model="keyword"
          />
          <div class="checkbox">
            <a-checkbox
              :indeterminate="indeterminate"
              @change="onCheckAllChange"
              :checked="checkAll"
            >全选 ：</a-checkbox>
            <a-checkbox-group :options="plainOptions" v-model="checkedList" @change="onChange" />
          </div>
        </div>
        <transition name="result">
          <div class="result-wrap" v-show="searching">
            <div class="result-title">
              <h1>
                "
                <span>{{resultWord}}</span> "的搜索结果:
              </h1>
            </div>
            <div class="result-list">
              <a-collapse v-model="activeKey" :bordered="false">
                <a-collapse-panel
                  v-for="(val,index) in websiteList"
                  :key="val.name"
                  class="panel-box"
                  v-show="checkType(val.type)"
                >
                  <template v-slot:header>
                    <div class="collapse-panel-header">
                      <span>{{val.name}}</span>
                      <div class="collapse-panel-header-btn">
                        <a-button
                          v-if="index != 0"
                          icon="arrow-up"
                          size="small"
                          title="上移"
                          @click.stop="changePosition(val.name,0,index)"
                        ></a-button>
                        <a-button
                          v-if="index != websiteList.length -1"
                          icon="arrow-down"
                          size="small"
                          title="下移"
                          @click.stop="changePosition(val.name,1,index)"
                        ></a-button>
                        <a-button
                          v-if="index != 0"
                          icon="to-top"
                          size="small"
                          title="置顶"
                          @click.stop="changePosition(val.name,2,index)"
                        ></a-button>
                      </div>
                    </div>
                  </template>
                  <transition name="result">
                    <div class="panel-item" v-show="!val.loading">
                      <div
                        class="movie-box"
                        v-for="(item,index) in val.data"
                        :key="index"
                        @click="openLink(item.link)"
                      >
                        <div class="img" :style="{'background-image': 'url('+item.img+')'}"></div>
                        <div class="title">{{item.title}}</div>
                      </div>
                    </div>
                  </transition>

                  <transition name="result">
                    <div class="panel-loading" v-show="val.loading">
                      <a-spin tip="加载中" size="large" />
                    </div>
                  </transition>

                  <transition name="result">
                    <div class="panel-loading" v-show="!val.loading && val.data.length == 0">无结果</div>
                  </transition>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <a-modal title="关于" v-model="config" footer>
      <p>版本号：V1.0.1</p>
    </a-modal>
  </div>
</template>

<script>
let ipc = null;
let shell = null;
if (window.require) {
  ipc = window.require("electron").ipcRenderer;
  shell = window.require("electron").shell;
}
const plainOptions = ["影院", "港剧", "动漫", "美剧", "综艺"];
export default {
  data() {
    return {
      keyword: "",
      resultWord: "",
      searching: false,
      searched: false,
      activeKey: [],
      websiteList: [],
      config: false,
      checkedList: plainOptions,
      indeterminate: false,
      checkAll: true,
      plainOptions
    };
  },
  mounted() {
    this.listInit();
    // 聚焦input
    this.$refs["search-btn"].$el.getElementsByTagName("input")[0].focus();
  },
  created() {
    let that = this;
    document.onkeydown = function(e) {
      // 上下键，空格
      if (
        e.keyCode != 38 &&
        e.keyCode != 40 &&
        e.keyCode != 32 &&
        that.searching == true
      ) {
        that.$refs["scrollDiv"].scrollTop = 0;
        setTimeout(() => {
          that.$refs["search-btn"].$el.getElementsByTagName("input")[0].focus();
        }, 200);
      }
    };
  },
  methods: {
    closeWin() {
      ipc.send("closeWin");
    },
    minusWin() {
      ipc.send("minusWin");
    },
    onSearch() {
      // 空字符不搜索
      if (this.keyword.replace(/\s+/g, "") == "") return;

      //设为搜索中
      for (let index = 0; index < this.websiteList.length; index++) {
        this.websiteList[index].loading = true;
      }

      // setTimeout(() => {
      //   for (let index = 0; index < this.websiteList.length; index++) {
      //     this.websiteList[index].loading = false;
      //   }
      // }, 1000);

      // 搜索全部网站
      this.$api.getAll(this.keyword, this.websiteList);

      this.resultWord = this.keyword;
      this.searching = true;

      // 等动画完成
      setTimeout(() => {
        this.searched = true;
      }, 1000);
    },
    /* 在默认浏览器打开链接 */
    openLink(link) {
      shell.openExternal(link);
    },
    /* 更换网站位置，mode（0：上移，1：下移，2：置顶）*/
    changePosition(item, mode, index) {
      switch (mode) {
        case 0:
          cp(index, index - 1, this);
          break;
        case 1:
          cp(index, index + 1, this);
          break;
        case 2:
          cp(index, 0, this);
          break;
      }
      function cp(indexOld, indexNew, that) {
        let temp = null;
        temp = that.websiteList[indexNew];
        that.websiteList[indexNew] = that.websiteList[indexOld];
        that.$set(that.websiteList, indexOld, temp);
        // 修改本地存储的内容
        let listTemp = null;
        let list = JSON.parse(window.localStorage.getItem("websiteList"));
        listTemp = list[indexNew];
        list[indexNew] = list[indexOld];
        list[indexOld] = listTemp;
        window.localStorage.setItem("websiteList", JSON.stringify(list));
      }
    },
    /* 网站数组初始化 */
    listInit() {
      let namelist = [
        "独播库",
        "天天爱去",
        "片集网",
        "好剧屋",
        "晨光影院",
        "星辰影院",
        "全视频TV",
        "迅雷影院",
        "樱花动漫",
        "bimibimi",
        "zzzfun",
        "美剧天堂",
        "91美剧网",
        "在线之家",
        "综艺秀"
      ];
      let list = window.localStorage.getItem("websiteList");
      if (list && JSON.parse(list).length == namelist.length) {
        this.websiteList = JSON.parse(list);
      } else {
        for (let index = 0; index < namelist.length; index++) {
          this.websiteList.push({
            name: namelist[index],
            loading: true,
            type: "影院",
            data: []
          });
        }
        window.localStorage.setItem(
          "websiteList",
          JSON.stringify(this.websiteList)
        );
      }

      let activeKey = window.localStorage.getItem("activeKey");
      this.activeKey = activeKey != null ? JSON.parse(activeKey) : namelist;
    },
    backToTop() {
      return document.getElementById("scrollDiv");
    },
    onChange(checkedList) {
      this.indeterminate =
        !!checkedList.length && checkedList.length < plainOptions.length;
      this.checkAll = checkedList.length === plainOptions.length;
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      });
    },
    checkType(type) {
      for (let i = 0; i < this.checkedList.length; i++) {
        if (type.indexOf(this.checkedList[i]) >= 0) {
          return true;
        }
      }
      return false;
    }
  },
  watch: {
    activeKey: function(val) {
      window.localStorage.setItem("activeKey", JSON.stringify(val));
    }
  }
};
</script>

<style lang='less' scoped>
.layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    -webkit-app-region: drag;
    min-height: 50px;
    background-color: @main-color;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      color: white;
      font-size: 2rem;
      padding-left: 20px;
    }
    .right {
      -webkit-app-region: no-drag;
      padding-right: 20px;
      button {
        margin-left: 10px;
      }
    }
  }

  .content-scroll-forbar {
    &:hover {
      overflow-y: scroll;
    }
    &:hover .content {
      width: calc(~"100% + 10px");
    }

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: @main-color;
      border-radius: 5px;
    }
  }

  .content-scroll {
    overflow: hidden;

    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .search-wrap {
        width: 600px;
        margin-top: 300px;
        margin-bottom: 50px;
      }

      .search-wrap-mode0 {
        margin-top: 50px;
        transition: all 1s;
      }

      .checkbox {
        margin-top: 10px;
      }

      .result-enter {
        opacity: 0;
      }

      .result-enter-active {
        transition: all 1s;
      }

      .result-wrap {
        width: 1000px;
        .result-title {
          h1 {
            span {
              color: red;
            }
          }
        }

        .result-list {
          .collapse-panel-header {
            display: flex;
            justify-content: space-between;
            padding-right: 10px;
            span {
              color: @main-color;
            }
            .collapse-panel-header-btn {
              button {
                margin-left: 5px;
              }
            }
          }

          .panel-box {
            margin-bottom: 24px;
            background-color: #f7f7f7;
            border: 1px solid #d9d9d9;
            border-radius: 5px;

            .panel-loading {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100px;
            }
            .panel-item {
              display: flex;
              flex-wrap: wrap;
              .movie-box {
                &:hover {
                  background-color: @main-color-light;
                  padding: 5px;
                  color: white;
                }
                width: calc((100% / 5));
                height: 280px;
                padding: 15px;
                cursor: pointer;
                border-radius: 5px;
                transition: all 0.3s;
                display: flex;
                flex-direction: column;
                align-items: center;
                .img {
                  width: 100%;
                  height: 100%;
                  background-size: cover;
                  background-position: center center;
                  border-radius: 5px;
                }
                .title {
                  font-size: 18px;
                  font-weight: bold;
                  padding-top: 5px;
                  text-align: center;
                  width: 100%;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>