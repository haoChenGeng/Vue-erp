// 引入console组件
const Console = resolve => require(['src/views/console/console.vue'], resolve)
//安装调度
const InstalltionScheduleList = resolve => require(['src/views/m-delivery/project-execution/installation-schedule/list.vue'], resolve)
const AgainInstallation = resolve => require(['src/views/m-delivery/project-execution/installation-schedule/again-installation.vue'], resolve)
const ReplenishInstallation = resolve => require(['src/views/m-delivery/project-execution/installation-schedule/replenish-installation.vue'], resolve)
const InstallationView = resolve => require(['src/views/m-delivery/project-execution/installation-schedule/view.vue'], resolve)

//安装单
const InstallationDucumentsList = resolve => require(['src/views/m-delivery/project-execution/installation-documents/list.vue'], resolve)
const InstallationDucumentsView = resolve => require(['src/views/m-delivery/project-execution/installation-documents/view.vue'], resolve)
const InstallationDucumentsEdit = resolve => require(['src/views/m-delivery/project-execution/installation-documents/view.vue'], resolve)
const InstallationDucumentsCost = resolve => require(['src/views/m-delivery/project-execution/installation-documents/add-cost.vue'], resolve)

const routes = [
    //交付
    {
        path: '/tuchat-delivery',
        component: Console,
        children: [
        	{ path: 'installtion-schedule-list', meta: { isFulldialog:false, title: '安装调度' }, component: InstalltionScheduleList},
        	{ path: 'again-installation', meta: { isFulldialog: true, title: '安装调度' }, component: AgainInstallation },
        	{ path: 'replenish-installation', meta: { isFulldialog: true, title: '安装调度' }, component: ReplenishInstallation },
        	{ path: 'installation-view', meta: { isFulldialog: true, title: '安装调度' }, component: InstallationView },
        	{ path: 'installation-ducuments-list', meta: { isFulldialog: false, title: '安装单' }, component: InstallationDucumentsList},
            { path: 'installation-ducuments-view', meta: { isFulldialog: true,title: '安装单' }, component: InstallationDucumentsView },
            { path: 'installation-ducuments-edit', meta: { isFulldialog: true, title: '安装单' }, component: InstallationDucumentsEdit },
            { path: 'installation-ducuments-cost', meta: { isFulldialog: true, title: '安装单' }, component: InstallationDucumentsCost },
        ]
    }
]

export default routes;
