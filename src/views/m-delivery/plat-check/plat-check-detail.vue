<template>
    <div>
        <!-- 需要另一个el-dialog时并列，不要嵌套 -->
        <el-dialog v-loading.fullscreen.lock="fullscreenLoading" @close="closeDialog" v-model="isDialogShow" size="full" class="t8t-full-dialog2 yanshou-view-dialog dialog-new"
            :class="{'isHide': isTopHide}">
            <div class="t8t-full-dialog2-container">
                <!-- 顶部按钮区 -->
                <div class="full-dialog-toolbar-container">
                    <div class="toolbar-container">
                    </div>
                </div>
                <div class="dialog2-main-container">
                    <!-- 收缩按钮 -->
                    <div class="top-hide el-icon-d-arrow-left" @click="onTopHide"></div>
                    <!-- 表单区 -->
                    <div class="full-dialog-form-container">
                        <el-tabs v-model="tab_info">
                            <el-tab-pane label="基本信息" name="basic">
                                <el-form class="dialog2-form-container" :model="detailInfo" :rules="rules" ref="formRef" label-position="right" label-width="120px">
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="验收编号:">
                                            <el-input v-model="detailInfo.billCode" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="项目ID:">
                                            <el-input v-model="detailInfo.projectId" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="业主姓名:">
                                            <el-input v-model="detailInfo.ownerName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="详细地址:">
                                            <el-input v-model="detailInfo.addressDetail" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="验收类型:">
                                            <el-input v-model="detailInfo.checkTypeName" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container" prop="checkStatus">
                                        <el-form-item label="验收结果:">
                                            <!-- <el-input v-model="detailInfo.checkStatus" disabled></el-input> -->
                                            <el-select v-model="detailInfo.checkStatus" placeholder="--请选择--" disabled>
                                                <el-option v-for="item in checkStatusList" :label="item.text" :value="item.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="申请验收开始时间:">
                                            <el-date-picker disabled :value="!detailInfo.expectStartTime ? '' : detailInfo.expectStartTime * 1000" placeholder="" type="datetime">
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="申请验收结束时间:">
                                            <el-date-picker disabled :value="!detailInfo.expectCheckTime ? '' : detailInfo.expectCheckTime * 1000" placeholder="" type="datetime">
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="实际验收开始时间:">
                                            <el-date-picker disabled :value="!detailInfo.checkStartTime ? '' : detailInfo.checkStartTime * 1000" placeholder="" type="datetime">
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="dialog2-form-item-container">
                                        <el-form-item label="实际验收结束时间:">
                                            <el-date-picker disabled :value="!detailInfo.checkTime ? '' : detailInfo.checkTime * 1000" placeholder="" type="datetime">
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-tab-pane>
                        </el-tabs>
                    </div>

                    <!-- 标签页区 -->
                    <div class="full-dialog-tabs-container">
                        <el-tabs v-model="tab_detail">
                            <el-tab-pane label="验收信息" name="check_detail">
                                <div v-for="group in detailInfo.platGroupVOList" class="an_detail">
                                    <div class="groupItem">
                                        <h3>{{group.groupName}}</h3>
                                        <div class="checkItem_detail">
                                            <table class="my-table" cellpadding="6" cellspacing="0">
                                                <thead>
                                                    <tr>
                                                        <td align="center" width="100">序号</td>
                                                        <td align="center" width="800">检测内容</td>
                                                        <td align="center" width="150">检测结果</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(item,index) in group.platQuestionVOs">
                                                        <td align="center">{{++index}}</td>
                                                        <td align="left">{{item.questionContent}}</td>
                                                        <td align="center">{{item.checkAnswer}}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div class="checkItem">
                                    <h3>上传图片</h3>
                                    <el-row class="checkItem_detail">
                                        <el-col :span="3" v-for="item in detailInfo.picUrls">
                                            <img :src=item style="width:130px;height:130px;" class="img-show" @click="imgClick(item)">
                                        </el-col>
                                    </el-row>

                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 另一个el-dialog放这里 -->
        <!-- "'http://pic.to8to.com/${item}'" -->
        <!-- <el-dialog v-model="dialogVisible" size="large">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog> -->
        <!-- 查看图片弹窗 -->
        <t8t-gallery v-model="galleryVisible" :data="galleryData" @input="closeGallery">
        </t8t-gallery>
    </div>

</template>

<script>
    import Utils from 'src/utils/Utils.js'
    import Cookie from 'js-cookie'
    import CheckCommon from 'src/services/delivery/check/checkCommon.js'
    export default {
        data() {
            return {
                isDialogShow: true,
                isTopHide: false,
                tab_info: 'basic',
                tab_detail: 'check_detail',
                checkStatusList: [
                    {
                        text: '无',
                        value: 0
                    },
                    {
                        text: '合格',
                        value: 1
                    },
                    {
                        text: '不合格',
                        value: 2
                    }
                ],
                detailInfo: {
                    id: '',
                    billCode: '',
                    sourceProjectId: '',
                    ownerName: '',
                    addressDetail: '',
                    checkTypeName: '',
                    checkStatus: '',
                    expectStartTime: '',
                    expectCheckTime: '',
                    checkStartTime: '',
                    checkTime: '',
                    platGroupVOList: [],
                    picUrls: {},
                },
                dialogImageUrl: '',
                dialogVisible: false,
                fullscreenLoading: true,
                galleryVisible: false,
                galleryData: [],
            }
        },
        created() {
            //获取基本信息
            //let _this = this
            CheckCommon.getCheckDetail({ id: this.$route.query.id })
                .then((res) => {
                    if (res.data.status === 200) {
                        this.detailInfo = Object.assign(this.detailInfo, res.data.result);
                    }
                    else {
                        this.$msgbox({
                            title: '消息',
                            type: 'error',
                            message: '此项目信息不存在！',
                            confirmButtonText: '知道了',
                            confirmButtonClass: 'is-plain'
                        });
                    }
                    this.fullscreenLoading = false;
                });
        },
        methods: {
            onTopHide() {
                this.isTopHide = !this.isTopHide
            },
            closeDialog() {
                // 填写对应的路由
                //this.$router.push({ path: '/delivery/yanshou-bill' })
                this.$router.go(-1)
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            imgClick(path) {
                //let href = Utils.getFullURL(path)
                this.imgDialog = false
                this.galleryData = [{ title: 'img', src: path }]
                this.galleryVisible = true
            },
            closeGallery(val) {
                if (!val) {
                    this.imgDialog = true
                    this.galleryVisible = false
                }
            }
        }
    };

</script>

<style>
    .plat-check-detail-dialog .full-dialog-tabs-container .el-tab-pane {
        display: block;
    }

    .plat-check-detail-dialog .my-table tbody td {
        max-width: 500px;
        line-height: 25px;
    }

    .plat-check-detail-dialog .el-upload {
        display: none;
    }

    .plat-check-detail-dialog .el-upload-list__item-actions .el-upload-list__item-delete {
        display: none;
        opacity: 0;
        position: absolute;
    }
</style>

<style lang="css" scoped>
    .full-dialog-tabs-container {
        width: 1220px;
        margin-left: auto;
        margin-right: auto;
    }

    .checkItem {
        margin-bottom: 30px;
    }

    .groupItem h3 {
        margin-bottom: 15px;
        border-left: 4px solid #6b6b6b;
        padding-left: 6px;
        height: 20px;
        line-height: 20px;
    }

    .checkItem .checkItem_detail {
        padding-left: 20px;
    }

    .my-table {
        border-left: 1px solid #dfe6ec;
        border-top: 1px solid #dfe6ec;
        font-size: 14px;
    }

    .my-table td {
        border-right: 1px solid #dfe6ec;
        border-bottom: 1px solid #dfe6ec;
        height: 32px;
        line-height: 32px;
    }

    .table-row {
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>