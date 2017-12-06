<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>
        <t8t-search ref="search"
                    :fields="fields"
                    :showToggleBtn="true"
                    @submit="submitSearch">
        </t8t-search>

        <t8t-toolbar @ADD="onAdd"
                     @EDIT="onEdit"
                     ref="toolbar">
        </t8t-toolbar>

        <t8t-table
            :columns="tableColumns"
            :service="tableService"
            :method="tableMethod"
            :args="tableArgs"
            :editable="true"
            :expendCol="true"
            :expendFields="expendFields"
            :radioCol="true"
            @current-row-change="handleCurrentRowChange"
            @cell-click="cellClick"
            ref="t8ttable">
        </t8t-table>

        <creat-new-district
            v-if="showCreateRegion"
            @close="showCreateRegion = false"
            @reloadTable="reloadTable">
        </creat-new-district>

        <update-district
            v-if="showUpdateRegion"
            :standardCid="modifyCid"
            :standardName="modifyName"
            :standardPid="modifyPid"
            @close="showUpdateRegion = false"
            @reloadTable="reloadTable">
        </update-district>


    </div>

</template>

<script>
    // import T8tBreadcrumb from '../../../components/t8t-breadcrumb/t8t-breadcrumb'
    import RegionService from 'src/services/region/Service'
    import region from 'src/services/region/region'
    import creatNewDistrict from 'src/views/m-system/region-manage/standard-district-new.vue'
    import updateDistrict from 'src/views/m-system/region-manage/standard-district-update.vue'
    export default {

        components: {
            // T8tBreadcrumb,
            creatNewDistrict,
            updateDistrict
        },
        name: '',

        data () {
            return {
                modifyCid: 0,
                modifyName: '',
                modifyPid: '',
                showUpdateRegion: false,
                showCreateRegion: false,
                breadcrumbData: [
                    {title: '系统管理'},
                    {title: '主数据'},
                    {title: '土巴兔区域数据管理'}
                ],
                fields: [
                    {type: 'input', label: '省', name: 'provinceName', subNames: ['level']},
                    {type: 'input', label: '市', name: 'cityName', subNames: ['level']},
                    {type: 'input', label: '区/县', name: 'townName', subNames: ['level']},
                    {type: 'input', label: '区域id', name: 'cid'},
                    {type: 'input', label: '父级区域id', name: 'pid'}
                ],
                tableColumns: [
                    {prop: 'provinceName', label: '省名'},
                    {prop: 'provinceId', label: '省id'},
                    {prop: 'cityName', label: '市名'},
                    {prop: 'cityId', label: '市id'},
                    {prop: 'townName', label: '县/区域名'},
                    {prop: 'townId', label: '区/县id'}
                ],
                tableService: RegionService.REGION.name,
                tableMethod: RegionService.REGION.methods.GET_SD_ALL,
                tableArgs: {},
                expendFields: [
                    {prop: 'oldId', label: '标准区域id'},
                    {prop: 'relatedId', label: '关联id'},
                    {prop: 'areaLevel', label: '区域级别'},
                    {prop: 'areaName', label: '区域名称'}
                ],
                searchArgs: {}
            }
        },
        methods: {
            onAdd () {
                this.showCreateRegion = true
            },
            onEdit () {
                this.showUpdateRegion = true
            },
            submitSearch (data) {
                let areaName = ''
                let areaLevel = 0
                if (data['cid'] !== null || data['pid'] !== null) {
                    this.tableArgs = {
                        cid: data['cid'],
                        pid: data['pid']
                    }
                    this.tableMethod = RegionService.REGION.methods.SEARCH_STANDARD_DISTRICT
                } else if (data['townName'] !== null && (data['cityName'] !== null || data['provinceName'] !== null)) {
                    this.tableArgs = {
                        provinceName: data['provinceName'],
                        cityName: data['cityName'],
                        townName: data['townName']
                    }
                    this.tableMethod = RegionService.REGION.methods.SEARCH_STANDARD_DISTRICT_BYNAMES
                } else if (data['townName'] !== null) {
                    areaName = data['townName']
                    areaLevel = 3
                    this.tableArgs = {
                        req: {
                            name: areaName,
                            level: areaLevel
                        }
                    }
                    this.tableMethod = RegionService.REGION.methods.GET_SD_LISTBYNAMEANDLEVEL
                } else if (data['cityName'] !== null || data['provinceName'] !== null) {
                    this.tableArgs = {
                        provinceName: data['provinceName'],
                        cityName: data['cityName'],
                        townName: data['townName']
                    }
                    this.tableMethod = RegionService.REGION.methods.SEARCH_STANDARD_DISTRICT_BYNAMES
                } else {
                    this.tableArgs = {}
                    this.tableMethod = RegionService.REGION.methods.GET_SD_ALL
                }
            },
            cellClick () {

            },
            checkName (name) {
                var strExp = new RegExp(/^[\u4E00-\u9FA5]+$/)
                return strExp.test(name)
            },
            checkId (id) {
                var strExp = new RegExp(/^[0-9]\d*$/)
                return strExp.test(id)
            },
            handleCurrentRowChange (curRow, oldRow) {
                if (curRow === null) {
                } else {
                    if (curRow.hasOwnProperty('townId') && curRow['townId'] !== null && curRow['townId'] !== undefined) {
                        this.modifyCid = curRow['townId']
                        this.modifyName = curRow['townName']
                        this.modifyPid = curRow['cityId']
                    } else if (curRow.hasOwnProperty('cityId') && curRow['cityId'] !== null && curRow['cityId'] !== undefined) {
                        this.modifyCid = curRow['cityId']
                        this.modifyName = curRow['cityName']
                        this.modifyPid = curRow['provinceId']
                    } else if (curRow.hasOwnProperty('provinceId') && curRow['provinceId'] !== null && curRow['provinceId'] !== undefined) {
                        this.modifyCid = curRow['provinceId']
                        this.modifyName = curRow['provinceName']
                        this.modifyPid = 0
                    }
                }
            },
            reloadTable () {
//                this.$refs['t8ttable'].reloadTable()
                this.tableArgs = {}
                this.tableMethod = RegionService.REGION.methods.GET_SD_ALL
            }
        }
    }
</script>

<style lang="css" scoped>

    /*.toolbar {*/
        /*display: flex;*/
        /*justify-content: space-between*/
    /*}*/
</style>
