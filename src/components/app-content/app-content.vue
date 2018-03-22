<template>
  <div class="app-content-container"
    :class="{'stretch':stretch}">
    <div class="erp-tabs"
      id="erp-tabs">
      <div class="left-slide slide-chunk"
        @click="scrollLeft(-116)">
        <i class="el-icon-caret-left"></i>
      </div>
      <div id="g-item-wrapper"
        class="item-wrapper">
        <div id="g-item-container"
          class="item-container clearfix">
          <el-tooltip v-for="(item, index) in tabs"
            effect="dark"
            popper-class="tabs-tooltip"
            :content="item.route.meta.title"
            placement="bottom">
            <router-link :to="item.route.fullPath"
              tag="div"
              class="router-link">
              <span class="router-link-span">{{item.route.meta.title}}</span>
              <i class="el-icon-circle-close"
                @click.stop="popTab(index)"></i>
            </router-link>
          </el-tooltip>
        </div>
      </div>
      <div class="right-slide slide-chunk"
        @click="scrollLeft(116)">
        <i class="el-icon-caret-right"></i>
      </div>
      <div class="close-all slide-chunk"
        @click="closeAllTabs">
        <i class="el-icon-circle-cross"></i>
      </div>
    </div>
    <!-- 右键菜单 -->
    <context-menu ref="headerMenu">
      <div class="menu-item"
        @click="memuHandler(1)">关闭全部标签页</div>
    </context-menu>

    <!-- 新页面 -->
    <keep-alive>
      <router-view v-if="$route.meta.isFulldialog===false"
        class="app-content"></router-view>
    </keep-alive>
    <router-view v-if="$route.meta.isFulldialog===true"></router-view>

  </div>
</template>
<script>
import { uniqBy, last, indexOf, isNumber } from 'lodash'
import horwheel from './horwheel.js'
import ContextMenu from './t8t-context-menu.vue'

export default {
    name: 'app-content',
    components: {
        ContextMenu,
    },
    props: {
        stretch: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            tabs: [],
            dCachedRoutes: [],
        }
    },
    methods: {
        pushTabs() {
            // TODO 没被缓存的需要销毁
            // 针对现有的使用popView类型的路由不加入到tab页中
            // 考虑有些页面不同参数对功能影响，所以以fullPath作为唯一标识
            this.$nextTick(() => {
                if (!this.needCache(this.$route)) return
                this.tabs.push({
                    _uid: this.$route.matched[1].instances.default['_uid'],
                    route: this.$route,
                    instance: this.$route.matched[1].instances.default,
                })
            })
            this.scrollIntoView()
        },
        /**
         * 判断路由是否需要被缓存
         * @param route
         * @returns {boolean}
         */
        needCache(route) {
            if (this.hasCached(route)) return false
            // 新页面
            if (
                route.meta.isFulldialog === true ||
                route.meta.isFulldialog === false
            ) {
                return !route.meta.isFulldialog
            }
            // 旧页面
            return route.matched.every(match => {
                // 全屏弹窗和404这种非业务类型不需要被缓存
                if (
                    (match.components && match.components.popView) ||
                    match.path.indexOf('/forbidden') !== -1
                ) {
                    return false
                }
                return true
            })
        },
        hasCached(route) {
            if (!this.tabs.length) return false
            return this.tabs.some(tab => {
                // 防止参数生成多个标签
                return tab.route.path === route.path
            })
        },
        popTab(index) {
            console.log('poptab')
            // 当只剩一个时，不允许删除
            if (this.tabs.length <= 1) return
            let delRoute = this.tabs[index].route.fullPath
            // 点击删除如果删除的是当前标签页则默认将路由切换到邻近标签
            if (delRoute === this.$route.fullPath) {
                this.resetTab(index)
                return
            }
            this.destroyTab(index)
        },
        /**
         * 重置当前显示的tab, 显示邻近tab
         */
        resetTab(index) {
            let path = ''
            console.log(index, this.tabs.length)
            if (index + 1 >= this.tabs.length) {
                path = this.tabs[index - 1].route.fullPath
            } else {
                path = this.tabs[index + 1].route.fullPath
            }
            this.$router.push(path)
            this.destroyTab(index)
        },

        scrollLeft(offset) {
            document.getElementById('g-item-wrapper').scrollLeft += offset
        },
        destroyTab(index) {
            this.tabs[index].instance.$destroy()
            this.tabs.splice(index, 1)
        },
        scrollIntoView() {
            setTimeout(function() {
                let obj = document.querySelector(
                    '#g-item-container .router-link-active'
                )
                obj &&
                    obj.scrollIntoViewIfNeeded &&
                    obj.scrollIntoViewIfNeeded()
            }, 0)
        },
        closeAllTabs() {
            this.$router.push('/forbidden/400')
            for (let i = this.tabs.length - 1; i >= 0; i--) {
                this.destroyTab(i)
            }
            setTimeout(() => {
                this.$router.push('/index')
            }, 0)
        },
        closeOtherTabs(nowIndex) {
            for (let i = this.tabs.length - 1; i >= 0; i--) {
                if (i === nowIndex) {
                    break
                }
                this.destroyTab(i)
            }
        },
        memuHandler(index) {
            this.$refs['headerMenu'].closeMenu()
            if (index === 1) {
                this.closeAllTabs()
                return
            }
        },
    },

    watch: {
        $route: function(route) {
            this.pushTabs()
        },
    },

    mounted() {
        this.pushTabs()
        horwheel(document.getElementById('g-item-wrapper'))
        document.getElementById('g-item-wrapper').oncontextmenu = event => {
            this.$refs['headerMenu'].openMenu(event)
            return false
        }
    },
}
</script>
<style scoped>
.erp-tabs {
    display: flex;
    flex-direction: row;
    background: #eef3f6;
    height: 37px;
    border-bottom: 1px solid #e9edf0;
    width: 100%;
}

.item-wrapper {
    flex: 1;
    overflow: auto;
    position: relative;
}

.item-wrapper::-webkit-scrollbar {
    display: none;
}

.item-container {
    width: max-content;
}

.tab-item {
    max-width: 50px;
    float: left;
    overflow: hidden;
    border-right: 1px solid red;
}

.slide-chunk {
    width: 24px;
    height: 37px;
    background: #fff;
    border: 1px solid #e9edf0;
    border-top: none;
    border-bottom: none;
    margin-right: -1px;
    text-align: center;
    line-height: 37px;
    cursor: pointer;
    color: #b2b2b2;
    font-size: 12px;
    position: relative;
    z-index: 10;
}

.erp-tabs .router-link {
    float: left;
    cursor: pointer;
    border: 1px solid #e9edf0;
    border-top: none;
    border-bottom: none;
    margin-right: -1px;
    background: #f7fcff;
    padding: 0 10px;
    max-width: 99px;
    align-items: center;
    font-size: 12px;
    float: left;
    height: 37px;
    line-height: 37px;
}

.erp-tabs .router-link-active {
    height: 38px;
    background: #fff;
    position: relative;
}

.erp-tabs .router-link .router-link-span {
    color: #666666;
    max-width: 72px;
    height: 37px;
    float: left;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
}

.erp-tabs .router-link-active .router-link-span {
    color: #3296fa;
}

.erp-tabs .el-icon-circle-close {
    font-size: 12px;
    color: #bbbbbb;
    float: right;
    margin-top: 13px;
    margin-left: 10px;
}

.erp-tabs .el-icon-circle-close:hover {
    color: #ff5660;
}

.erp-tabs .router-link-span {
    /*min-width: 50px;*/
    text-align: center;
}

.slide-chunk:hover {
    color: #3296fa;
}
.app-content-container .ctx-menu-content-tab {
    position: fixed;
    z-index: 5000;
    padding: 0;
    overflow: hidden;
    background-color: #fff;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.app-content-container .ctx-menu-content-tab .menu-item {
    font-size: 12px;
    cursor: pointer;
    padding: 4px 10px;
}
.app-content-container .ctx-menu-content-tab .menu-item:hover {
    background-color: rgb(218, 218, 218);
}
.left-slide {
    border-left: none;
}
</style>
<style lang="css">
.app-content-container {
    width: calc(100% - 179px);
    height: 100%;
    /*overflow: hidden;*/
    position: absolute;
    /*transition: width 0.3s;*/
    right: -1px;
    display: flex;
    flex-direction: column;
}
.app-content-container .el-tabs__content {
    overflow: visible;
}
.app-content-container.stretch {
    /*transition: width 0.3s;*/
    width: calc(100%);
}

.app-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.g-main-container {
    flex: 1;
    display: flex;
    flex-direction: row;
}

.g-main-container-column {
    display: -ms-flexbox;
    display: flex;
    -ms-flex: 1;
    flex: 1;
    -ms-flex-direction: column;
    flex-direction: column;
    overflow: auto;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: ' ';
}

.clearfix:after {
    clear: both;
}

.tabs-tooltip {
    opacity: 0.6;
}
</style>
