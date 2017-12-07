/**
 * Created by tomy.li on 2017/5/9.
 */
const Console = resolve => require(['src/views/console/console.vue'], resolve)
const index = resolve => require(['src/views/m-worker/quote/packtemp/index.vue'], resolve);
const view = resolve => require(['src/views/m-worker/quote/packtemp/view.vue'], resolve);
const priceConfig = resolve => require(['src/views/m-worker/quote/packtemp/priceConfig.vue'], resolve);
const groupDosageMapping = resolve => require(['src/views/m-worker/quote/packtemp/groupDosageMapping.vue'], resolve);
const groupDosageMappingSku = resolve => require(['src/views/m-worker/quote/packtemp/groupDosageMappingSku.vue'], resolve);
const preview = resolve => require(['src/views/m-worker/quote/packtemp/previewTemp.vue'], resolve);
const version = resolve => require(['src/views/m-worker/quote/packtemp/version.vue'], resolve);


const routes = [{
        path: '/tochat-worker',
        component: Console,
        children: [
            { path: 'quote-packtemp-index', component: index, meta: { title: '产品包模板',isFulldialog:false } },
            { path: 'quote-packtemp-view', component: view, meta: { title: '模板详情' ,isFulldialog:true} },
            { path: 'quote-packtemp-priceconfig', component: priceConfig, meta: { title: '标配套餐价格配置',isFulldialog:true } },
            { path: 'quote-packtemp-gdm', component: groupDosageMapping, meta: { title: '组合用量关系',isFulldialog:true} },
            { path: 'quote-packtemp-gdmsku', component: groupDosageMappingSku, meta: { title: '配置sku',isFulldialog:true } },
            { path: 'quote-packtemp-preview', component: preview, meta: { title: '产品包模板预览',isFulldialog:true } },
            { path: 'quote-packtemp-version', component: version, meta: { title: '产品包模板版本记录',isFulldialog:true} },
        ]
    }]

export default routes
