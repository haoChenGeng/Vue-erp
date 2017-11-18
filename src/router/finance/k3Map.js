//引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const k3Map = resolve => require(['../../views/m-finance/page-k3-map/k3-cloud-map.vue'], resolve)



const routes = [{
    path: '/finance',
    component: Console,
    children: [
        { path: 'k3-cloud-map', meta : { isFulldialog: false, title : '数据对照表'}, component: k3Map}

    ]
}]

export default routes
