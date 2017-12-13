/**
 * Created by tomy.li on 2017/5/9.
 */
import DateUtils from 'src/utils/DateUtils.js'

let config = {
    datas : {
        //`mould_status`  '报价模板状态 0-待启用 1-审核中 2-已启用 3-已驳回',
        'mould_status':[
            {
                'text': '待启用',
                'value': 0
            },
            {
                'text': '审核中',
                'value': 1
            },
            {
                'text': '已启用',
                'value': 2
            },
            {
                'text': '已驳回',
                'value': 3
            },
        ],

        //报价模板行状态  0-待启用 1-审核中 2-已启用 3-已驳回
        'temp_item_status':[
            {
                'text': '待启用',
                'value': 0
            },
            {
                'text': '审核中',
                'value': 1
            },
            {
                'text': '已启用',
                'value': 2
            },
            {
                'text': '已驳回',
                'value': 3
            },
        ],

        //报价项用量关系配置状态(报价项表)
        'dosage_mapping_status':[
            {
                'text': '待配置',
                'value': 0
            },
            {
                'text': '待启用',
                'value': 1
            },
            {
                'text': '审核中',
                'value': 2
            },
            {
                'text': '已启用',
                'value': 3
            },
        ],
        //价格状态 0-待启用 1-审核中 2-已启用 3-已驳回
        'item_price_status':[
            {
                'text': '待启用',
                'value': 0
            },
            {
                'text': '审核中',
                'value': 1
            },
            {
                'text': '已启用',
                'value': 2
            },
            {
                'text': '已驳回',
                'value': 3
            },
        ],

        //组合用量关系状态 0-待启用 1-审核中 2-已启用 3-已驳回
        'gd_mapping_status':[
            {
                'text': '待启用',
                'value': 0
            },
            {
                'text': '审核中',
                'value': 1
            },
            {
                'text': '已启用',
                'value': 2
            },
            {
                'text': '已驳回',
                'value': 3
            },
        ],
        "settle_type":[
            {
                'text': '不参与结算',
                'value': 0
            },
            {
                'text': '工长结算',
                'value': 1
            },
        ],

        //组合用量禁用状态 0-非禁用 1-禁用
        'gd_mapping_forbidden_status':[
            {
                'text': '否',
                'value': 0
            },
            {
                'text': '是',
                'value': 1
            },
        ],

        //是否需要选品，配合bom_gdm_id字段使用 0-不需要 1-需要
        'needSelectSel':[
            {
                'text': '不需要',
                'value': 0
            },
            {
                'text': '需要',
                'value': 1
            },
        ],

        //是否是bom 0-否 1-是
        'isBomSel':[
            {
                'text': '否',
                'value': 0
            },
            {
                'text': '是',
                'value': 1
            },
        ],

    },
    //表格列配置
    "columns": [
        {
            "prop": "tempCode",
            "label": "产品包模板编码"
        },
        {
            "prop": "tempName",
            "label": "产品包模板名称",
            "width":200
        },
        {
            "prop": "orgId",
            "label": "组织",
            "width":100,
            'list':'organizes'
        },
        {
            "prop": "pkgId",
            "label": "产品包",
            "list": "productPackages"
        },
        {
            "prop": "updateTime",
            "label": "修改时间"
        },
        {
            "prop": "effectTime",
            "label": "生效时间",
            formatter: function(val) {
                return val ? DateUtils(new Date(val).getTime(), 'yyyy-mm-dd HH:MM') : '--'
            }
        },
        {
            "prop": "freezeTime",
            "label": "冻结时间",
            formatter: function(val) {
                return val ? DateUtils(new Date(val).getTime(), 'yyyy-mm-dd HH:MM') : '--'
            }
        },
        {
            "prop": "forbiddenTime",
            "label": "禁用时间",
            formatter: function(val) {
                return val ? DateUtils(new Date(val).getTime(), 'yyyy-mm-dd HH:MM') : '--'
            }
        },
        {
            "prop": "tempStatus",
            "label": "模板状态",
            "list": 'mould_status'
        },

    ],

}

export default config
