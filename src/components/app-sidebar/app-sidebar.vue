<template>
    <div class="app-sidebar"
        :class="{ 'is-hide' : hide} ">
        <div class="top">
            <span>网站导航</span>
        </div>

        <div class="menu">
            <div class="ul"
                :class="{'is-closed': closedMenus.indexOf(index1) > -1}"
                v-for="(item1, index1) in sidebarData"
                v-if="removeMenuCodes.indexOf(item1.code) == -1"
                :key="index1">
                <div class="ul-title"
                    @click="onToggleClosedMenus(index1)">
                    <img :src="iconSrc(item1.title)[0]"
                        class="sidebar-icon"
                        width="18">
                    <!-- <img :src="iconSrc(item1.title)[1]"
                        class="sidebar-icon"
                        width="18">  -->
                    {{item1.title}}
                </div>
                <div class="li"
                    :class="{'active': item2.url.path === activeIndex}"
                    v-for="(item2, index2) in item1.items"
                    v-if="removeMenuCodes.indexOf(item2.code) == -1"
                    :key="index2"
                    @click.stop="handleIndex(item2)">
                    {{item2.title}}
                </div>
            </div>
        </div>

        <div class="sidebar-hide"
            @click="onHide"></div>
    </div>
</template>

<script>
import img1 from './img/img1-icon@2x.png'
import img1a from './img/img1-icon-Anchor@2x.png'
import img2 from './img/img2-icon@2x.png'
import img2a from './img/img2-icon-Anchor@2x.png'
import img3 from './img/img3-icon@2x.png'
import img3a from './img/img3-icon-Anchor@2x.png'
import img4 from './img/img4-icon@2x.png'
import img4a from './img/img4-icon-Anchor@2x.png'
import img5 from './img/img5-icon@2x.png'
import img5a from './img/img5-icon-Anchor@2x.png'
import img6 from './img/img6-icon@2x.png'
import img6a from './img/img6-icon-Anchor@2x.png'
import img7 from './img/img7-icon@2x.png'
import img7a from './img/img7-icon-Anchor@2x.png'
import img8 from './img/img8-icon@2x.png'
import img8a from './img/img8-icon-Anchor@2x.png'
import img9 from './img/img9-icon@2x.png'
import img9a from './img/img9-icon-Anchor@2x.png'
import img10 from './img/img10-icon@2x.png'
import img10a from './img/img10-icon-Anchor@2x.png'
import Cookie from 'js-cookie'
import api from 'src/utils/api.js'
import http from 'src/utils/http.js'
import System from 'src/utils/System'

export default {
    name: 'app-sidebar',

    props: {
        hide: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            closedMenus: [],
            activeIndex: null,
            sidebarData: [],
            defaultActive: '',
            removeMenuCodes: [], //需要移除的菜单
        }
    },
    created() {
        api.account
            .listMenuTree({
                accountId: Cookie.get('t8t-tc-uid'),
                sysCode: 'DSP',
            })
            .then(res => {
                if (res.data.status === 200) {
                    let temp = res.data.result || []

                    if (temp.length && temp[0].items) {
                        //树的第一级是根节点不需要展示, 取其下的项目作为菜单
                        temp = temp[0].items
                    }

                    //不需要展示的菜单。目前菜单是基于角色控制的， 不能满足业务更细化的配置。临时通过过滤数据实现控制
                    let removeMenu = []
                    this.getRemoveMenuCodes(Cookie.get('t8t-tc-comid'))
                        .then(removeMenu => {
                            /* temp = temp.filter(function (item) {
                                return removeMenu.indexOf(item.code) == -1
                            })*/
                            this.removeMenuCodes = removeMenu.filter(item => {
                                if (item) return item
                            })
                            this.sidebarData = temp

                            this.setActiveIndex('#' + this.$route.path)
                            setTimeout(() => {
                                let obj = document.querySelector(
                                    '.app-sidebar .li.active'
                                )

                                obj &&
                                    obj.scrollIntoViewIfNeeded &&
                                    obj.scrollIntoViewIfNeeded()
                            }, 0)
                        })
                        .catch(e => {})
                }
            })
    },
    watch: {
        $route: function() {
            // 根据路由初始化展开路径
            this.setActiveIndex('#' + this.$route.path)
        },
    },
    methods: {
        onToggleClosedMenus(index) {
            if (this.closedMenus.indexOf(index) === -1) {
                // 关闭menu
                this.closedMenus.push(index)
            } else {
                // 展开menu
                this.closedMenus.splice(this.closedMenus.indexOf(index), 1)
            }
        },
        setActiveIndex(path) {
            this.$nextTick(() => {
                this.activeIndex = path
            })
        },
        handleIndex(item) {
            let path = this.getPath(item)
            let routePrefix = path[0]
            if (path[0] === '#') {
                this.activeIndex = item.url.path
                this.$router.push(path.slice(1))
            } else if (routePrefix === '$') {
                // 跳转演示系统逻辑
                Cookie.set('demo', System.createSystemTag(), {
                    path: '/',
                    domain: '.to8to.com',
                })
                let realPath = path.slice(1)
                window.open(realPath)
            } else {
                //window.location.href = 'http://www.to8to.com/' + path.replace(new RegExp('^\\/+', 'g'), '');
                window.open(this.urlRewrite(path))
                // window.location.href = path//直接跳转完整路径
            }
        },
        onHide() {
            this.$emit('toggle-button-click')
        },
        iconSrc(title) {
            let arr = [
                '',
                [img1, img1a],
                [img2, img2a],
                [img3, img3a],
                [img4, img4a],
                [img5, img5a],
                [img6, img6a],
                [img7, img7a],
                [img8, img8a],
                [img9, img9a],
                [img10, img10a],
            ]
            if (title === '工作台') return arr[1]
            if (title === '公司管理') return arr[2]
            if (title === '项目管理') return arr[3]
            if (title === '辅材管理') return arr[4]
            if (title === '财务设置') return arr[5]
            if (title === '运营管理') return arr[6]
            if (title === '商城管理') return arr[9]
            if (title === '店铺宝') return arr[7]
            if (title === '数据中心') return arr[8]
            return arr[1]
        },
        getPath(item) {
            try {
                return item.url.path
            } catch (e) {
                return null
            }
        },

        //动态生成url @exp:  userid=:userId&uname=:userName
        urlRewrite(path) {
            //在此处扩展支持的通配符列表
            let params = {
                userId: +Cookie.get('t8t-tc-uid') || '',
                userName: Cookie.get('t8t-tc-username') || '',
                comName: Cookie.get('t8t-tc-comname') || '',
                ticket: Cookie.get('t8t-tc-ticket') || '',
                comId: Cookie.get('t8t-tc-comid') || '',
            }

            for (var item in params) {
                path = path.replace(new RegExp(':' + item, 'g'), params[item])
            }

            return path
        },

        getRemoveMenuCodes(comId) {
            const baseRemove = new Promise(function(resolve, reject) {
                if (comId) {
                    // 装修公司下单配置校验, 决定是否开放‘批量采购下单功能’
                    http
                        .fetch('pim/demandConfigCompanyCanOrder', {
                            companyId: comId,
                        })
                        .then(function(res) {
                            // 1 可以下单 2 不可以下单 3 还未配置
                            if (res.data.status === 200) {
                                // 不可以下单和未配置都不允许
                                if (res.data.result === 1) {
                                    resolve()
                                }
                            }
                            resolve('DSP002003002')
                        })
                        .catch(function(e) {
                            resolve('DSP002003002')
                        })
                } else {
                    resolve('DSP002003002')
                }
            })
            const storeRemove = new Promise(function(resolve, reject) {
                if (comId) {
                    // 装修公司下单配置校验, 决定是否开放‘批量采购下单功能’
                    http
                        .fetch('dcm/company/shoptreasure', {
                            companyId: comId,
                        })
                        .then(function(res) {
                            if (res.data.status === 200) {
                                // 到期 未合作的不展示店铺宝
                                if (res.data.result.cooperation) {
                                    resolve()
                                }
                            }
                            resolve('DSP009')
                        })
                        .catch(function(e) {
                            resolve('DSP009')
                        })
                } else {
                    resolve('DSP009')
                }
            })
            return Promise.all([baseRemove, storeRemove])
        },
    },
}
</script>

<style scoped>
.top {
    font-size: 14px;
    color: #666666;
    height: 37px;
    text-align: center;
    line-height: 37px;
    border-bottom: 1px solid #e3e3e3;
    overflow: hidden;
}
.menu {
    background-color: #fff;
    position: absolute;
    top: 38px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
}

.ul-title {
    font-size: 14px;
    color: #333333;
    font-weight: bold;
    padding-top: 7.5px;
    padding-bottom: 7.5px;
    height: 19px;
    display: flex;
    align-items: center;
    cursor: pointer;
}
.ul-title:hover {
    background-color: #eee;
}

.li {
    font-size: 14px;
    color: #666666;
    padding-left: 48px;
    padding-top: 7.5px;
    padding-bottom: 7.5px;
    cursor: pointer;
}
.li:hover {
    background-color: #eee;
}
.li.active {
    color: #17c692;
}

.is-closed .li {
    display: none;
}

.app-sidebar ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 0;
    height: 0;
}
.app-sidebar {
    z-index: 100;
    position: relative;
    user-select: none;
    box-sizing: border-box;
    background-color: #fff;
    height: 100%;
    border-right: 1px solid #e3e3e3;
    width: 180px;
}

.app-sidebar.is-hide {
    width: 0;
}

.app-sidebar .sidebar-icon {
    margin-left: 20px;
    margin-right: 10px;
}

.app-sidebar .sidebar-hide {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate3d(100%, -50%, 0);
    width: 17px;
    height: 61px;
    background-image: url(./img/icon_arrow.png);
    z-index: 1001;
    cursor: pointer;
}

.app-sidebar .sidebar-hide:hover {
    background-position: -21px 0px;
}

.app-sidebar.is-hide .sidebar-hide {
    background-position: 0px -61px;
}

.app-sidebar.is-hide .sidebar-hide:hover {
    background-position: -21px -61px;
}
</style>

