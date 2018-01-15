<template>
    <div class="app-sidebar"
         :class="{ 'is-hide' : hide} ">
        <!--<el-menu unique-opened-->
                 <!--@select="handleSelect"-->
                 <!--:default-active="defaultActive">-->
            <!--<el-submenu v-for="item1 in sidebarData"-->
                        <!--:index="item1.index"-->
                        <!--class="sidebar-bb">-->
                <!--<template slot="title">-->
                    <!--<img :src="iconSrc(item1.title)" class="sidebar-icon">{{item1.title}}-->
                <!--</template>-->
                <!--&lt;!&ndash; 第二层非子节点 &ndash;&gt;-->
                <!--<el-submenu v-if="item2.items"-->
                            <!--v-for="item2 in item1.items"-->
                            <!--:index="item2.index"-->
                            <!--class="ani-menu sidebar2">-->
                    <!--<template slot="title">-->
                        <!--<i class="el-icon-caret-right ani-icon"></i>-->
                        <!--{{item2.title}}-->
                    <!--</template>-->
                    <!--&lt;!&ndash;第三次节点&ndash;&gt;-->
                    <!--<el-menu-item v-for="item3 in item2.items"-->
                                  <!--:index="item3.url.path"-->
                                  <!--class="sidebar3">-->
                        <!--{{item3.title}}-->
                    <!--</el-menu-item>-->
                <!--</el-submenu>-->
                <!--&lt;!&ndash; 第二层子节点 &ndash;&gt;-->
                <!--<el-menu-item v-if="!item2.items"-->
                              <!--v-for="item2 in item1.items"-->
                              <!--:index="item2.url.path"-->
                              <!--class="sidebar4">-->
                    <!--{{item2.title}}-->
                <!--</el-menu-item>-->
            <!--</el-submenu>-->
        <!--</el-menu>-->

        <el-menu
            unique-opened
            @select="handleSelect"
            :default-active="defaultActive"
        >
            <div>
                <!-- 第1层非子节点 -->
                <el-submenu
                    v-for="item1 in sidebarData"
                    v-if="item1.items && removeMenuCodes.indexOf(item1.code) == -1"
                    :index="item1.index"
                    class="sidebar-bb"
                >
                    <template slot="title">
                        <img :src="iconSrc(item1.title)" class="sidebar-icon">
                        {{item1.title}}
                    </template>
                    <!-- 下一层 START -->
                    <div>
                        <!-- 第2层非子节点 -->
                        <el-submenu
                            v-for="item2 in item1.items"
                            v-if="item2.items && removeMenuCodes.indexOf(item2.code) == -1"
                            :index="item2.index"
                            class="ani-menu sidebar23"
                        >
                            <template slot="title">
                                <i class="el-icon-caret-right ani-icon"></i>
                                {{item2.title}}
                            </template>
                            <!-- 下一层 START -->
                            <div>
                                <!-- 第3层非子节点 -->
                                <el-submenu
                                    v-for="item3 in item2.items"
                                    v-if="item3.items && removeMenuCodes.indexOf(item3.code) == -1"
                                    :index="item3.index"
                                    class="ani-menu sidebar23"
                                >
                                    <template slot="title">
                                        <i class="el-icon-caret-right ani-icon"></i>
                                        {{item3.title}}
                                    </template>
                                    <!-- 下一层 START -->
                                    <div>
                                        <!-- 第4层非子节点 -->
                                        <el-submenu
                                            v-for="item4 in item3.items"
                                            v-if="item4.items && removeMenuCodes.indexOf(item4.code) == -1"
                                            :index="item4.index"
                                            class="ani-menu sidebar23"
                                        >
                                            <template slot="title">
                                                <i class="el-icon-caret-right ani-icon"></i>
                                                {{item4.title}}
                                            </template>
                                            <!-- 下一层 START -->
                                            <div>
                                                <!-- 第5层非子节点 -->
                                                <el-submenu
                                                    v-for="item5 in item4.items"
                                                    v-if="item5.items && removeMenuCodes.indexOf(item5.code) == -1"
                                                    :index="item5.index"
                                                    class="ani-menu sidebar23"
                                                >
                                                    <template slot="title">
                                                        <i class="el-icon-caret-right ani-icon"></i>
                                                        {{item5.title}}
                                                    </template>
                                                    <!-- 下一层 START -->

                                                    <!-- 下一层 END -->
                                                </el-submenu>
                                                <!-- 第5层子节点 -->
                                                <el-menu-item
                                                    v-for="item5 in item4.items"
                                                    v-if="!item5.items && removeMenuCodes.indexOf(item5.code) == -1"
                                                    :index="getPath(item5)"
                                                    class="sidebar-item"
                                                >
                                                    {{item5.title}}
                                                </el-menu-item>
                                            </div>
                                            <!-- 下一层 END -->
                                        </el-submenu>
                                        <!-- 第4层子节点 -->
                                        <el-menu-item
                                            v-for="item4 in item3.items"
                                            v-if="!item4.items && removeMenuCodes.indexOf(item4.code) == -1"
                                            :index="getPath(item4)"
                                            class="sidebar-item"
                                        >
                                            {{item4.title}}
                                        </el-menu-item>
                                    </div>
                                    <!-- 下一层 END -->
                                </el-submenu>
                                <!-- 第3层子节点 -->
                                <el-menu-item
                                    v-for="item3 in item2.items"
                                    v-if="!item3.items && removeMenuCodes.indexOf(item3.code) == -1"
                                    :index="getPath(item3)"
                                    class="sidebar-item"
                                >
                                    {{item3.title}}
                                </el-menu-item>
                            </div>
                            <!-- 下一层 END -->
                        </el-submenu>
                        <!-- 第2层子节点 -->
                        <el-menu-item
                            v-for="item2 in item1.items"
                            v-if="!item2.items && removeMenuCodes.indexOf(item2.code) == -1"
                            :index="getPath(item2)"
                            class="sidebar-item"
                        >
                            {{item2.title}}
                        </el-menu-item>
                    </div>
                    <!-- 下一层 END -->
                </el-submenu>
                <!-- 第1层子节点 -->
                <el-menu-item
                    v-for="item1 in sidebarData"
                    v-if="!item1.items && removeMenuCodes.indexOf(item1.code) == -1"
                    :index="getPath(item1)"
                    class="sidebar-item"
                >
                    {{item1.title}}
                </el-menu-item>
            </div>
        </el-menu>

        <div class="sidebar-hide" @click="onHide"></div>
    </div>
</template>

<script>
    import img1 from './img/icon-side01.png'
    import img2 from './img/icon-side02.png'
    import img3 from './img/icon-side03.png'
    import img4 from './img/icon-side04.png'
    import img5 from './img/icon-side05.png'
    import img6 from './img/icon-side06.png'
    import img7 from './img/icon-side07.png'
    import img8 from './img/icon-side08.png'
    import img9 from './img/icon-side09.png'
    import img10 from './img/icon-side10.png'
    import Cookie from 'js-cookie'
    import api from 'src/utils/api.js'
    import http from 'src/utils/http.js'

    export default {

        name: 'app-sidebar',

        props: {
            hide: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                sidebarData: [],
                defaultActive: '',
                removeMenuCodes:[] //需要移除的菜单
            }
        },
        created() {
            api.account.listMenuTree({accountId: Cookie.get('t8t-tc-uid'),sysCode:"DSP"})
                .then(res => {
                    if (res.data.status === 200) {
                        let temp = res.data.result || []

                        let item1 = {
                            index: "1-101",
                            url: {path: "#/index/"},
                            title: "我的工作台"
                        }

                        let item2 = {
                            index: "1-102",
                            url: {path: "#/helpcenter/page-faq"},
                            title: "帮助"
                        }

                        if(temp.length && temp[0].items){
                            //树的第一级是根节点不需要展示, 取其下的项目作为菜单
                            temp = temp[0].items
                        }else{
                            temp[0] = {
                                index: 100,
                                title: '工作台',
                                items: [
                                    item1,
                                    item2
                                ]
                            }
                        }

                        //不需要展示的菜单。目前菜单是基于角色控制的， 不能满足业务更细化的配置。临时通过过滤数据实现控制
                        let removeMenu  = []
                        this.getRemoveMenuCodes(Cookie.get('t8t-tc-comid')).then((removeMenu) => {
                           /* temp = temp.filter(function (item) {
                                return removeMenu.indexOf(item.code) == -1
                            })*/
                            this.removeMenuCodes = removeMenu
                            this.sidebarData = temp
                        }).catch(e => {

                        })

                        // 根据路由初始化展开路径
                        this.$nextTick(function () {
                            this.setDefaultActive('#' + this.$route.path)
                        })
                    }
                })
        },
        watch: {
            $route: function () {
                // 根据路由初始化展开路径
                this.$nextTick(function () {
                    this.setDefaultActive('#' + this.$route.path)
                })
            }
        },
        methods: {
            handleSelect(path) {
                this.handleIndex(path)
            },
            handleIndex(path) {
                if (path[0] === '#') {
                    this.$router.push(path.slice(1))
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
                if (title === '工作台') return img1
                if (title === '进度管理') return img2
               // if (title === '运营管理') return img3
                if (title === '项目管理') return img4
                if (title === '公司管理') return img5
                if (title === '功能设置') return img6
                if (title === '交付管理') return img7
                if (title === '运营管理') return img8
                if (title === '财务管理') return img9
                if (title === '数据中心') return img10
                return img1
            },
            setDefaultActive(path) {
                this.defaultActive = path
            },
            getPath(item) {
                try {
                    return item.url.path
                } catch (e) {
                    return null
                }
            },

            //动态生成url @exp:  userid=:userId&uname=:userName
           urlRewrite(path){

                //在此处扩展支持的通配符列表
                let params = {
                    userId: +Cookie.get('t8t-tc-uid') || '',
                    userName: Cookie.get('t8t-tc-username') || '',
                    comName: Cookie.get('t8t-tc-comname')  || '',
                    ticket: Cookie.get('t8t-tc-ticket') || '',
                    comId: Cookie.get('t8t-tc-comid')  || '',
                }

               for(var item in params){
                    path = path.replace(new RegExp(':'+item, 'g'), params[item]);
                }

               return path
            },

            getRemoveMenuCodes(comId){
               let codes = []
               return new Promise(function (resolve,reject){
                   if(comId){
                       //装修公司下单配置校验, 决定是否开放‘批量采购下单功能’
                        http.fetch(
                            'pim/demandConfigCompanyCanOrder',
                            {
                                companyId: comId
                            }
                        ).then(function (res) {
                            //1 可以下单 2 不可以下单 3 还未配置
                            if( res.data.status == 200 ){
                                //不可以下单和未配置都不允许
                                if( res.data.result != 1 ){
                                    codes.push('DSP002003002');//'批量采购下单'功能
                                }
                                resolve(codes)
                            }
                       }).catch(function (e){
                           reject()
                        })
                   }else{
                       reject()
                   }
               })

            }
        }
    }

</script>

<style lang="css">
    .app-sidebar {
        z-index: 100;
        position: relative;
        -webkit-user-select: none;
        box-sizing: border-box;
        background-color: #eef3f6;
        height: 100%;
        border-right: 1px solid #d4dde6;
        width: 200px;
    }

    .app-sidebar.is-hide {
        width: 0;
    }

    .app-sidebar .sidebar-icon {
        margin-right: 10px;
    }

    .app-sidebar .sidebar-bb {
        border-bottom: 1px solid #d4dee7;
    }

    .app-sidebar .sidebar-bb > .el-menu {
        border-top: 1px solid #d4dee7;
        padding-top: 10px;
        padding-bottom: 10px;
        background-color: #f7fcff;
    }

    .app-sidebar .sidebar2 > .el-menu {
        background-color: #f7fcff;
    }

    .app-sidebar .ani-icon {
        font-size: 12px;
        transform: scale(0.8);
    }

    .app-sidebar .ani-menu.is-opened>.el-submenu__title>.ani-icon {
        transform: rotate(90deg) scale(0.8);
    }

    .app-sidebar .el-menu-item,
    .app-sidebar .el-submenu__title {
        height: 32px !important;
    }

    .app-sidebar .sidebar-bb > .el-submenu__title {
        height: 50px !important;
        padding-left: 10px !important;
    }

    .app-sidebar .sidebar4 {
        padding-left: 16px !important;
    }

    .app-sidebar .sidebar2 .el-submenu__title {
        background-color: #f7fcff;
        padding-left: 18px !important;
    }

    .app-sidebar .sidebar2 .el-submenu__title:hover {
        background-color: rgb(209, 217, 229);
    }

    .app-sidebar .sidebar-item {
        background-color: #f7fcff;
        display: flex;
        align-items: center;
        /*padding-left: 40px !important;*/
        overflow: hidden;
    }

    /*.app-sidebar .sidebar3:before {
        content: '';
        width: 6px;
        height: 6px;
    }*/

    .app-sidebar .sidebar4 {
        background-color: #f7fcff;
        /*display: flex;
            align-items: center;*/
        height: 32px !important;
        line-height: 32px !important;
    }

    .app-sidebar .sidebar4:before {
        float: left;
        margin-top: 13px;
        content: '';
        width: 6px;
        height: 6px;
        margin-right: 12px;
        margin-left: 6px;
        border-radius: 50%;
        background-color: #354052;
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

    .app-sidebar > .el-menu {
        height: 100%;
        overflow: auto;
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

    .app-sidebar .el-submenu__title {
        display: flex;
        /*background-color: #eef3f6;*/
        align-items: center;
    }

    .app-sidebar .el-submenu__icon-arrow {
        display: none;
    }
</style>
