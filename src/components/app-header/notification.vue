<template>
    <div class="app-header-notification"
        @mouseenter="onMouseenter">
        <el-badge class="notification-badge"
            :max="99"
            :value="sum">
            <img src="./bell.png"
                class="bell-img" @click="showMessages()">
        </el-badge>
        <div class="notification-popup">
            <ul class="el-dropdown-menu notification-menu"
                v-if="sum!==0">

                <div class="list-title bb"
                    v-if="list1.length">任务消息</div>
                <li class="el-dropdown-menu__item notification-item clearfix"
                    v-for="(item, index) in list1"
                    @click="handleSelect(item.url)">
                    <span class="item-title">{{item.title}}</span>
                    <span class="item-number">( {{item.number}} )</span>
                </li>

                <div class="list-title bt bb"
                    v-if="list2.length">审批消息</div>
                <li class="el-dropdown-menu__item notification-item clearfix"
                    v-for="(item, index) in list2"
                    @click="handleSelect(item.url)">
                    <span class="item-title">{{item.title}}</span>
                    <span class="item-number">( {{item.number}} )</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import axios, { notifyAxios } from 'src/utils/axios.js'
    export default {
        name: 'app-header-notification',

        data() {
            return {
                list: [],
                list1: [],
                list2: [],
                sum: 0
            }
        },

        methods: {
            initData(args) {
                // Cookie失效不发请求
                if (!Cookie.get('t8t-it-uid')) {
                    return
                }
                axios({
                    method: 'zAqsU2QWGvEta-vfyvv7ZKM0bEHsgtCkvDGmvbJjobGgLuHiudz2gmX09out9_Vgwi3yrUQkrGH',
                    service: 'abqLtBZRxYd9AbDFankow0Azfw7jdUj',
                    args: args
                }).then(res => {
                    if (res.data.status === 200) {
                        res.data.result.forEach(item => {
                            item.number = 0
                        })
                        this.list = (res.data.result || [])
                    }
                }).then(_ => {
                    this.getListNumbers()
                })
            },
            getListNumbers() {
                // Cookie失效不发请求
                if (!Cookie.get('t8t-it-uid')) {
                    return
                }
                this.list.forEach(item => {
                    this.getNumber(item.serverName, item.interfaceName, item.url)
                        .then(num => {
                            item.number = num
                        })
                })
            },
            getNumber(s, m, refSrc) {
                return notifyAxios({
                    method: m,
                    service: s,
                    args: {
                        operId: +Cookie.get('t8t-it-uid')
                    },
                    refSrc: refSrc
                }).then(res => {
                    if (res.data.status === 200) {
                        return res.data.result || 0
                    } else {
                        return 0
                    }
                })
            },
            handleSelect(path) {
                if (path[0] === '#') {
                    this.$router.push(path.slice(1))
                } else {
                    window.location.href = 'http://www.to8to.com/' + path.replace(new RegExp('^\\/+', 'g'), '');
                }
            },
            getSum(list) {
                let _sum = 0
                list.forEach(item => {
                    _sum += item.number
                })
                return _sum || 0
            },
            // 任务消息
            getList1(list) {
                let res = []
                list.forEach(item => {
                    if (item.type === 1 && item.number !== 0) {
                        res.push(item)
                    }
                })
                return res
            },
            // 审批消息
            getList2(list) {
                let res = []
                list.forEach(item => {
                    if (item.type === 2 && item.number !== 0) {
                        res.push(item)
                    }
                })
                return res
            },
            onMouseenter() {
                this.getListNumbers()
            },
            showMessages:function (){
                window.open('http://www.to8to.com/my/message_list_fcom.php')
            }
        },
        watch: {
            list: {
                handler: function (val, oldVal) {
                    this.sum = this.getSum(val)
                    this.list1 = this.getList1(val)
                    this.list2 = this.getList2(val)
                },
                deep: true
            }
        },
        created() {
           /* setTimeout(() => {
                this.initData({
                    accountId: +Cookie.get('t8t-tc-uid'),
                    token: Cookie.get('t8t-tc-ticket')
                })
            }, 1000)*/
        }
    }

</script>

<style scoped>
    .app-header-notification {
        display: flex;
        align-items: center;
        position: relative;
    }

    .app-header-notification:hover .notification-popup {
        display: block;
    }

    .bell-img {
        width: 24px;
        cursor: pointer;
    }

    .notification-popup {
        position: absolute;
        top: 100%;
        left: -135px;
        z-index: 9999;
        display: none;
    }

    .notification-menu {
        margin: 0;
        width: 300px;
    }

    .list-title {
        font-weight: bold;
        line-height: 36px;
        padding: 0 10px;
        color: #a0a0a0;
    }

    .item-number {
        float: right;
        color: #ff5664;
    }

    .bt {
        border-top: 1px solid #ebedec;
    }

    .bb {
        border-bottom: 1px solid #ebedec;
    }
</style>
<style>
    .notification-badge .el-badge__content {
        border: none;
    }
</style>
