export const breadcrumbData = [
    { title: '财务' },
    { title: '返款管理' },
    { title: '托管款' }
];


export const columns = [
    { "prop": "projectId", "label": "项目ID" },
    { "prop": "operation", "label": "操作", "list": "channelTypeOptions" },
    { "prop": "acceptType", "label": "验收类型" },
    { "prop": "houseAddress", "label": "项目地址" },
    { "prop": "appellation", "label": "业主称呼" },
    { "prop": "refundNode", "label": "返款节点" },
    { "prop": "projectManagerName", "label": "项目经理" },
    { "prop": "acceptResult", "label": "验收结果" },
    { "prop": "applyAcceptTime", "label": "申请验收时间" },
    { "prop": "actualAcceptTime", "label": "实际验收时间" },
];
/**
 * 返款状态 1.全部 2.无返款状态 3.返款申请中 4.待定 5.已返款 6.返款被驳回
 */
export const reFundStatuses = [
    { text: '全部', value: 1 },
    { text: '无返款状态', value: 2 },
    { text: '返款申请中', value: 3 },
    { text: '待定', value: 4 },
    { text: '已返款', value: 5 },
    { text: '返款被驳回', value: 6 }
];
