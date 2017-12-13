/**
 * Created by tomy.li on 2017/6/1.
 */
let config = {
    datas:{
        //标配类型 0-标配 1-非标配
        tempItemType: [
            {
                'text': '标配',
                'value': 0
            },
            {
                'text': '非标配',
                'value': 1
            },
        ],

        //报价单状态 0-完成初稿 1-审核中 2-审核驳回 3-报价已出 4-核算中 5-核算驳回 6-报价完成
        order_status: [
            {
                'text': '完成初稿',
                'value': 0
            },
            {
                'text': '审核中',
                'value': 1
            },
            {
                'text': '审核驳回',
                'value': 2
            },
            {
                'text': '报价已出',
                'value': 3
            },
            {
                'text': '核算中',
                'value': 4
            },
            {
                'text': '核算驳回',
                'value': 5
            },
            {
                'text': '报价完成',
                'value': 6
            },
            {
                'text': '已签约',
                'value': 7
            },
        ],
        //用量明细状态 0-待提交审核 1-审核中 2-已驳回 3-待要货 4-待测量 5-测量中 6-已下单
        'detailStatus':[
            {
                'text': '待提交审核',
                'value': 0
            },
            {
                'text': '审核中',
                'value': 1
            },
            {
                'text': '已驳回',
                'value': 2
            },
            {
                'text': '待要货',
                'value': 3
            },
            {
                'text': '待测量',
                'value': 4
            },
            {
                'text': '测量中',
                'value': 5
            },
            {
                'text': '已下单',
                'value': 6
            },
        ]
    },
    formFields:[
        {
            prop: 'yid',
            label: '项目ID',
            type: 'input',
            disabled:true
        },
        {
            prop: 'projectAddress',
            label: '工程地址',
            type: 'input',
            disabled:true
        },
        {
            prop: 'owner',
            label: '业主称呼',
            type: 'input',
            disabled:true
        },
        {
            prop: 'area',
            label: '计价面积',
            type:'input',
            disabled:true,
            rules:[
                {
                    pattern: /^((0|[1-9]\d{0,6})((\.[0-9]{1,2})?))$/, message: '必须为数字，最大7位，最多保留两位小数'
                },
                {
                    required: true ,message: "请填写计价面积"
                }
            ],
        },
        {
            prop: 'houseTypeId',
            label: '户型',
            type: 'select',
            list: 'houseTypes',
            disabled:true,
        },
        {
            prop: 'style',
            label: '风格',
            type: 'input',
            disabled:true
        },
        /*{
            prop: 'residentPopulation',
            label: '居住人口',
            type: 'input',
            disabled:true,
           /!* rules:[
                {
                    pattern: /^[1-9]{1,}\d{0,}$/, message: '必须为数字'
                },
                {
                    required: true ,message: "请填写居住人口"
                }
            ],*!/
        },*/
        {
            prop: 'tempName',
            label: '模板名称',
            type: 'input',
            disabled:true
        },
        {
            prop: 'totalPrice',
            label: '合同金额',
            type: 'input',
            disabled:true
        },
        {
            prop: 'orderStatus',
            label: '报价单状态',
            type: 'select',
            list:'order_status',
            disabled:true
        },
      /*  {
            prop: 'cutName',
            label: '保价状态',
            type: 'input',
            disabled:true
        },*/

    ]
}

export default config
