<template>
    <div>

        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

    </div>
</template>
<style>
</style>
<script>
    export default{
        data(){
            return {
                breadcrumbData: [
                    {title: '流程中心'},
                    {title: '属性配置'}
                ],
            }
        },
        components: {},
        name: 'WF-Attributes'
    }
</script>
