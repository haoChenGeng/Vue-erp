<template>
    <div>
        <script :id=randomId type="text/plain"></script>
    </div>
</template>
<script>

    // 引入Ueditor依赖
    import '../../../static/UE/ueditor.config.js'
    import '../../../static/UE/ueditor.all.js'
    import '../../../static/UE/lang/zh-cn/zh-cn.js'
    import '../../../static/UE/ueditor.parse.js'

    // 引入工具函数
    import utils from 'src/utils/Utils.js'

    // 加载Ueditor上传配置
    import { uploadConfig } from './config'

    export default {
        name: 'UE',
        data () {
            return {
                // 防止编辑器ID冲突
                randomId: 'editor_'+Math.random().toString(16).substring(2),
                editor: null,
                editorConfig: {
                    // Ueditor 宽度
                    initialFrameWidth: null,
                    // Ueditor 高度
                    initialFrameHeight: 350,
                    // 修改z-index 解决下拉框被其他页面覆盖的问题
                    zIndex: 4000,

                    // 图片上传配置参数
                    // 图片回显的前缀
                    imageUrlPrefix: utils.getUploadURL()+'&path=',
                    // 图片上传 post 请求中添加自定义参数 例{ bucket: 'scm', module: 'helpcenter' }
                    imageAddFormData: {},

                    // 文件上传配置参数
                    fileUrlPrefix: utils.getUploadURL()+'&path=',
                    // 文件上传 post 请求添加的自定义参数 例 { bucket: 'scm', module: 'helpcenter' }
                    fileAddFormData: {},

                    // 截图上传回显前缀
                    snapscreenUrlPrefix: utils.getUploadURL()+'&path='
                }
            }
        },
        props: {
            // Ueidtor初始化配置
            config: {
                type: Object,
                default: {}
            },
        },
        mounted() {
            // 防止多个编辑器ID冲突
            let options = Object.assign(uploadConfig, this.editorConfig, this.config)
            // 初始化UE
            this.editor = UE.getEditor(this.randomId, options)

            // 覆盖获取上传路径的方法
            // action：　uploadimage（上传图片）　uploadscrawl（上传截图）　uploadfile（上传文件）  uploadvideo（上传视频）
            this.editor.getActionUrl = function(action){
                let url = ''
                // 编辑器初始化时去加载配置信息 不设置时不去请求服务器获取上传配置
                if (action === 'config') {

                } else {
                    url = utils.getUploadURL()
                }
                return url
            }
        },
        methods: {
            // 获取内容方法
            getUEContent() {
                return this.editor.getContent()
            },
            // 获取编辑器实例
            getUEInstance()
            {
                return this.editor
            }
        },
        destroyed() {
            this.editor.destroy()
        }
    }
</script>
