// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
    //工模售前--合同管理
const Certification = resolve => require(['src/views/m-commodule/contract/certification/certification.vue'], resolve)
const Templet = resolve => require(['src/views/m-commodule/contract/templet/templet.vue'], resolve)
const TempletAdd = resolve => require(['src/views/m-commodule/contract/templet/templetAdd.vue'], resolve)
const TempletSee = resolve => require(['src/views/m-commodule/contract/templet/templetSee.vue'], resolve)
const Traffic = resolve => require(['src/views/m-commodule/contract/traffic/traffic.vue'], resolve)
const TrafficSee = resolve => require(['src/views/m-commodule/contract/traffic/trafficSee.vue'], resolve)
const ProcessSee = resolve => require(['src/views/m-commodule/contract/traffic/trafficProcess.vue'], resolve)

const routes = [{
    path: '/tuchat-commodule',
    component: Console,
    children: [
        { path: 'certification', meta: { isFulldialog: false, title: '实名认证库' }, component: Certification },
        { path: 'templet', meta: { isFulldialog: false, title: '模板管理' }, component: Templet },
        { path: 'templet/add', meta: { isFulldialog: true, title: '模板管理' }, component: TempletAdd },
        { path: 'templet/see', meta: { isFulldialog: true, title: '模板管理' }, component: TempletSee },
        { path: 'traffic', meta: { isFulldialog: false, title: '业务合同' }, component: Traffic },
        { path: 'traffic/see', meta: { isFulldialog: true, title: '业务合同' }, component: TrafficSee },
        { path: 'traffic/process', meta: { isFulldialog: true, title: '业务合同' }, component: ProcessSee }
    ]
}]

export default routes
