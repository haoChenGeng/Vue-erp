<!--
 * File: index.vue
 * Comment:banner 管理
 * Created by WebStorm.
 * User: tony.huang
 * Date: 2018/1/17
 * Time: 13:45
 -->
<template>
    <div>
        <!-- 顶部按钮区 -->
        <!-- 表单区 -->
        <div class="container-center banner-config">
            <el-tabs
                v-model="mainActiveTab"
                class="tab-zone">
                <el-tab-pane
                    style="overflow: auto"
                    label="广告图片"
                    name='banner'>
                    <div class="container-center banner-details">
                        <div class="infos">
                            <p>位置说明：1-5号位代表店铺页的广告展示位（每张图片大小不超过2M）</p>
                        </div>
                        <div class="pic-list">
                            <pic-box
                                v-for="pic in bannerList"
                                :fields="pic"
                                :maxSizeImg="maxSize"
                                @submit="submitPic"
                                @delete="deletePic"
                            >
                            </pic-box>
                        </div>

                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>


<script>
    import picBox from './picBox'
    import Api from 'src/services/salemanager/stores/storeApi.js'

    export default {
        components: {picBox},
        name: 'index',
        data() {
            return {
                maxSize: 2 * 1024 * 1024,
                mainActiveTab: 'banner',
                bannerList: [
                    {
                        title: '1号广告位',
                        status: null,
                        imageUrl: '',
                        showSort: 1,
                        verifyRemark: ''

                    }, {
                        title: '2号广告位',
                        status: null,
                        imageUrl: '',
                        showSort: 2,
                        verifyRemark: ''

                    }, {
                        title: '3号广告位',
                        status: null,
                        imageUrl: '',
                        showSort: 3,
                        verifyRemark: ''

                    }, {
                        title: '4号广告位',
                        status: null,
                        imageUrl: '',
                        showSort: 4,
                        verifyRemark: ''

                    }, {
                        title: '5号广告位',
                        status: null,
                        imageUrl: '',
                        showSort: 5,
                        verifyRemark: ''
                    }
                ]

            }
        },
        created() {
            this.getDetail()
        },
        methods: {
            getDetail() {
                Api.BANNER.query({page: 1, size: 5}).then(res => {
                    let _fields = this.bannerList
                    if (res.data.status === 200) {
                        for (let item in _fields) {
                            let _infos = res.data.result.rows.find(ritem => ritem.showSort === _fields[item].showSort)
                            if (_infos) _fields[item] = {
                                ..._fields[item], ...{
                                    status: _infos.verifyStatus,
                                    imageUrl: _infos.imageUrl,
                                    id: _infos.id,
                                    verifyRemark: _infos.verifyRemark || ''
                                }
                            }
                        }
                        this.bannerList = {...this.bannerList, ..._fields}
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            submitPic(obj, cb) {
                let _args = {
                    showSort: null,
                    imageUrl: null,
                    id: null
                }
                let serv = 'create'
                _args = {..._args, ...obj}
                if (obj.id) {
                    serv = 'update'
                }
                Api.BANNER[serv]({banner: _args}).then(res => {
                    if (res.data.status === 200) {
                        cb(res.data.result)
                        this.$message.success('提交成功')
                    } else {
                        cb(false)
                        this.$message.error(res.data.result || res.data.error || res.data.message || '提交失败')
                    }
                    return
                }).catch(err => {
                    cb(false)
                    console.log(err)
                    this.$message.error('提交失败')
                })
            },
            deletePic(obj, cb) {
                let args = {id: obj.id}
                if (!args.id) {
                    this.$message.error('数据异常', cb(false))
                    return
                }
                Api.BANNER.delete({banner: args}).then(res => {
                    if (res.data.status === 200) {
                        this.$message.success('删除成功')
                        cb(true)
                    } else {
                        this.$message.error(res.data.result || res.data.error || res.data.message || '删除失败')
                        cb(false)
                    }
                }).catch(error => {
                    console.log(error)
                    cb(false)
                    this.$message.error('删除失败')
                })
            }
        }
    }
</script>
<style>

    .banner-config,.banner-config .tab-zone,.banner-config .tab-zone .el-tabs__content,.banner-config .tab-zone .el-tabs__content .el-tab-pane {
        display: flex;
        flex-direction: column;
        flex: 1;
    }
</style>

<style scoped>
    .banner-details .infos {
        margin-bottom: 25px;
    }
    .banner-details .infos p {
        font-size: 14px;
    }
    .banner-details {
        padding: 0 30px;
        overflow: auto;
        min-width: 1300px;
        flex: 1;
    }


    .pic-list {
        display: flex;
        flex-direction: row;
        padding-bottom: 30px;
    }

</style>
