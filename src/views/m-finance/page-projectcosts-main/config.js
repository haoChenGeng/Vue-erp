/**
 * Created by luke.lv on 2017/9/5.
 */
import Cookie from 'js-cookie'

export const breadcrumbData = [
    {
        title: '财务'
    },
    {
        title: '成本核算'
    },
    {
        title: '项目成本分析'
    }
];
// 表头描述
export const columns = [
    {
        prop: 'projectId',
        label: '项目ID',
        show: true,
        sortable: true,
        editor:{
            type:'hyperlink',
            onClick: (val, row, col, tab) => {
                tab.$router.push({
                    path: '/finance/projectCosts-detail',
                    query: {
                        id: row.id,
                        projectId: row.projectId,
                        editType: "view"
                    }
                })
            }
        }
    },
    {
        prop: 'orgName',
        label: '组织',
        show: true,
        sortable: true
    },
    {
        prop: 'bizTypeName',
        label: '业务类型',
        show: true,
    },
    {
        prop: 'houseStyle',
        label: '户型',
        show: true,
    },
    {
        prop: 'houseValuationArea',
        label: '计价面积',
        show: true,
    },
    {
        prop: 'statusName',
        label: '项目状态',
        show: true,
    },
    {
        prop: 'startTime',
        label: '项目开工时间',
        formatter: "dateParser",
        show: true,
    },
    {
        prop: 'completedTime',
        label: '项目竣工时间',
        formatter: "dateParser",
        show: true,
    },
    {
        prop: 'chiefWorkerName',
        label: '项目经理',
        show: true,
    },
    {
        prop: 'workPlanAmount',
        label: '工费计划金额',
        align: 'right',
        show: true,
        formatter: 'retainTwoDecimal',
        summaryType: function (data, prop) {
            let sum = Number(0);
            data.forEach((row) => {
                sum += Number(row[prop]);
            });
            return sum.toFixed(2);
        }
    },
    {
        prop: 'workActualAmount',
        label: '工费实际金额',
        align: 'right',
        show: true,
        formatter: 'retainTwoDecimal',
        summaryType: function (data, prop) {
            let sum = Number(0);
            data.forEach((row) => {
                sum += Number(row[prop]);
            });
            return sum.toFixed(2);
        }
    },
    {
        prop: 'laborPalnAmount',
        label: '劳务管理费计划金额',
        align: 'right',
        show: true,
        formatter: 'retainTwoDecimal',
        summaryType: function (data, prop) {
            let sum = Number(0);
            data.forEach((row) => {
                sum += Number(row[prop]);
            });
            return sum.toFixed(2);
        }
    },
    {
        prop: 'laborActualAmount',
        label: '劳务管理费实际金额',
        align: 'right',
        show: true,
        formatter: 'retainTwoDecimal',
        summaryType: function (data, prop) {
            let sum = Number(0);
            data.forEach((row) => {
                sum += Number(row[prop]);
            });
            return sum.toFixed(2);
        }
    },
    {
        prop: 'materialsPlanAmount',
        label: '材料领用计划金额',
        align: 'right',
        show: true,
        formatter: 'retainTwoDecimal',
        summaryType: function (data, prop) {
            let sum = Number(0);
            data.forEach((row) => {
                sum += Number(row[prop]);
            });
            return sum.toFixed(2);
        }
    },
    {
        prop: 'materialsActualAmount',
        label: '材料领用实际金额',
        align: 'right',
        show: true,
        formatter: 'retainTwoDecimal',
        summaryType: function (data, prop) {
            let sum = Number(0);
            data.forEach((row) => {
                sum += Number(row[prop]);
            });
            return sum.toFixed(2);
        }
    },
    {
        prop: 'installPlanAmount',
        label: '安装费计划金额',
        align: 'right',
        show: true,
        formatter: 'retainTwoDecimal',
        summaryType: function (data, prop) {
            let sum = Number(0);
            data.forEach((row) => {
                sum += Number(row[prop]);
            });
            return sum.toFixed(2);
        }
    },
    {
        prop: 'installActualAmount',
        label: '安装费实际金额',
        align: 'right',
        show: true,
        formatter: 'retainTwoDecimal',
        summaryType: function (data, prop) {
            let sum = Number(0);
            data.forEach((row) => {
                sum += Number(row[prop]);
            });
            return sum.toFixed(2);
        }
    },
    {
        prop: 'projectPlanCosts',
        label: '项目计划成本',
        align: 'right',
        show: true,
        formatter: 'retainTwoDecimal',
        summaryType: function (data, prop) {
            let sum = Number(0);
            data.forEach((row) => {
                sum += Number(row[prop]);
            });
            return sum.toFixed(2);
        }
    },
    {
        prop: 'projectActualCosts',
        label: '项目实际成本',
        align: 'right',
        show: true,
        formatter: 'retainTwoDecimal',
        summaryType: function (data, prop) {
            let sum = Number(0);
            data.forEach((row) => {
                sum += Number(row[prop]);
            });
            return sum.toFixed(2);
        }
    },
    {
        prop: 'costDifference',
        label: '成本差异',
        align: 'right',
        show: true,
        formatter: 'retainTwoDecimal',
        summaryType: function (data, prop) {
            let sum = Number(0);
            data.forEach((row) => {
                sum += Number(row[prop]);
            });
            return sum.toFixed(2);
        },
        colStyle: (val) => ({
            color: val > 0 ? 'red' : (val < 0 ? 'green': 'dark')
        })
    },
    {
        prop: 'differenceRate',
        label: '差异率',
        align: 'right',
        show: true,
        formatter: 'percent',
        colStyle: (val) => ({
            color: val > 0 ? 'red' : (val < 0 ? 'green': 'dark')
        })
    }
]
