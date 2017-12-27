<template>
    <div class="base-form-date">
        <el-form label-position="right"
            label-width="110px"
            :model="formData"
            :rules="formRule"
            :inline="true"
            :ref="tabType"
            v-if="tab == tabType">
            <div class="field_container"
                v-for="(base,key) in baseDate"
                :key="key"
                :class="base.type == 'form' || base.type == 'img' ? 'form-container' : 'table-container' "
                v-loading.body.lock="lock && !base.service">
                <section>
                    <h1>{{base.label}}</h1>
                </section>
                <base-panel v-if="base.type == 'form'"
                    :dataSource="dataSource"
                    :fields="base.fields"
                    :options="options || {}"></base-panel>
                <t8t-grid v-else-if="base.type == 'table'"
                    :indexCol="!base.hideIndex"
                    :dataSource="tableDate[base.name]"
                    :commonData="options || {}"
                    :columns="base.fields"
                    :pageBar="base.showPage"
                    :pageSizes="[5,10,20,50,100]"
                    :service="base.service"
                    :method="base.method"
                    :args="base.args"
                    :selectCol="false"></t8t-grid>
                <div class="picture-gallery"
                    v-else-if="base.type == 'picList'">
                    <t8t-gallery :data="_fileList"
                        :showThumb="true"></t8t-gallery>
                </div>
                <div class="pdf-field"
                    v-else-if="base.type === 'pdf'">
                    <div id="pdf"></div>
                </div>
                <slot v-else-if="!base.type"
                    :name="base.prop"></slot>
            </div>
        </el-form>

    </div>
</template>

<script>
import PDFObject from 'src/utils/pdfobject.js'
import BasePanel from 'src/components/t8t-base-panel/t8t-base-panel.vue'
import schema from './formSchema.js'

export default {
    components: { BasePanel },
    name: 'project-base-form',
    data() {
        return {
            dataSource: {},
            tableDate: {},
            options: [],
            baseDate: [],
            dialogVisible: false,
            options: schema.options,
            _fileList: [],
            pdfUrl: null,
        }
    },
    props: {
        tab: {
            type: String,
            default: null,
        },
        id: {
            type: Number,
            default: null,
        },
        tabType: {
            type: String,
            default: null,
        },
        lock: {
            type: Boolean,
            default: false,
        },
        dataOption: Object,
    },
    created() {
        this._fileList = []
        this.$set(this, '_fileList', [])
        if (!this.id) {
            this.$message.error('项目信息获取失败')
            return
        }
        if (this.tabType && schema[this.tabType]) this.baseDate = JSON.parse(JSON.stringify(schema[this.tabType]).replace(/\@id/g, this.id))
        this.tableInit()
        this.detailInit(this.dataOption)
    },
    watch: {
        dataOption(val) {
            this.detailInit(val)
        },
        pdfUrl(val) {
            if (val)
                this.$nextTick(() => {
                    this.pdfUrl = val
                    PDFObject.embed(val, '#pdf')
                })
        },
        tab(val) {
            if (val === this.tabType && this.pdfUrl)
                this.$nextTick(() => {
                    PDFObject.embed(this.pdfUrl, '#pdf')
                })
        },
    },
    methods: {
        handlePictureCardPreview(file) {
            this.$emit('handle-preview', file)
        },
        tableInit() {
            let _tables = this.tableDate
            this.baseDate.forEach(item => {
                if (item.type === 'table' && !item.args) {
                    if(!_tables[item.name]) _tables[item.name] = []
                }
            })
            this.tableDate = {..._tables}
        },
        detailInit(val) {
            if (!val) return
            this.dataSource = { ...this.dataSource, ...val }
            if (val.fileList) {
                this.$set(this, '_fileList', val.fileList)
            }
            if (val.tables) {
                this.tableDate = { ...val.tables }
            }
            if (val.pdf) {
                this.pdfUrl = val.pdf
            }
        },
    },
}
</script>
<style>
.base-form-date {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.base-form-date .el-form {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.base-form-date .table-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    /* overflow-y: auto; */
}

.base-form-date .table-container .t8t-table,
.el-table {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.base-form-date .el-tabs {
    flex: 1;
}
.base-form-date .picture-gallery {
    overflow: auto
}

.base-form-date .picture-gallery .t8t-viewer-item {
    margin-right: 10px;
    margin: 5px;
}
.base-form-date .picture-gallery .t8t-viewer-item .t8t-viewer-pic {
    height: 100%;
}

.base-form-date .pdf-field,
.base-form-date .pdfobject-container {
    height: 100%;
    overflow: hidden;
}
</style>
