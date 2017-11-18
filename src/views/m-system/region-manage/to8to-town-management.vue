<template>
    <div>
        <t8t-breadcrumb :data="breadcrumbData"></t8t-breadcrumb>

        <div class="g-main-container-column">
            <t8t-search
                ref="search"
                :fields="fields"
                :showToggleBtn="false"
                @submit="submitSearch">
            </t8t-search>
            <t8t-toolbar
                @ADD="onAdd"
                @EDIT="onEdit"
                :disabledSymbols="disabledSymbols"
                ref="toolbar">
            </t8t-toolbar>
            <t8t-table
                :columns="tableColumns"
                :service="tableService"
                :method="tableMethod"
                :args="tableArgs"
                :expandCol="true"
                :expandFields="expandFields"
                :radioCol="true"
                @current-row-change="handleCurrentRowChange"
                @cell-click="cellClick"
                ref="t8ttable">
            </t8t-table>
        </div>

        <create-town
            v-if="showCreateRegion"
            :args="tableArgs"
            @close="showCreateRegion = false"
            @reloadTable="reloadTable">
        </create-town>

        <modify-town
            v-if="modifyTown"
            :id="modifyTownId"
            :cityid="cityIdOfThisTown"
            :townname="modifyTownName"
            :args="selectRow"
            @close="modifyTown = false"
            @reloadTable="reloadTable"
        >
        </modify-town>

    </div>

</template>

<script>
    import createTown from 'src/views/m-system/region-manage/to8to-town-new.vue'
    import RegionService from 'src/services/region/Service'
    import region from 'src/services/region/region'
    // import T8tBreadcrumb from 'src/components/t8t-breadcrumb/t8t-breadcrumb.vue'
    import modifyTown from 'src/views/m-system/region-manage/to8to-town-rename.vue'
    export default {
        components: {
            // T8tBreadcrumb,
            createTown,
            modifyTown
        },
        name: '',

        data () {
            return {
                modifyTownId: 0,
                cityIdOfThisTown: 0,
                modifyTownName: '',
                disabledSymbols: [],
                selectRow: {},
                modifyTown: false,
                showCreateRegion: false,
                breadcrumbData: [
                    {title: '系统管理'},
                    {title: '主数据'},
                    {title: '土巴兔区域数据管理'}
                ],
                tableService: RegionService.REGION.name,
                tableMethod: RegionService.REGION.methods.GET_LT_ALL,
                tableColumns: [
                    {prop: 'provinceName', label: '省名'},
                    {prop: 'provinceId', label: '省id'},
                    {prop: 'cityName', label: '市名'},
                    {prop: 'cityId', label: '市id'},
                    {prop: 'townName', label: '县/区域名'},
                    {prop: 'townId', label: '区/县id'}

                ],
                expandFields: [
                    {prop: 'standardId', label: '标准区域id'},
                    {prop: 'relatedId', label: '关联id'},
                    {prop: 'areaLevel', label: '区域级别'},
                    {prop: 'areaName', label: '区域名称'}
                ],
                tableArgs: {},
                fields: [
                    {type: 'input', label: '省', name: 'provinceName', subNames: ['level']},
                    {type: 'input', label: '市', name: 'cityName', subNames: ['level']},
                    {type: 'input', label: '区/县', name: 'townName', subNames: ['level']}
                ],
                searchArgs: {}
            }
        },
        methods: {
            // 新增
            onAdd (symbol, event) {
                this.showCreateRegion = true
            },
            //  编辑
            onEdit (symbol, event) {
                this.modifyTown = true
            },
            checkName (name) {
                var strExp = new RegExp(/^[\u4E00-\u9FA5]+$/)
                return strExp.test(name)
            },
            checkId (id) {
                var strExp = new RegExp(/^[0-9]\d*$/)
                return strExp.test(id)
            },
            submitSearch (data) {
                let areaName = ''
                let areaLevel = 0
                if (data['townName'] !== null) {
                    areaName = data['townName']
                    areaLevel = 3
                    this.tableArgs = {
                        req: {
                            name: areaName,
                            level: areaLevel
                        }
                    }
                    this.tableMethod = RegionService.REGION.methods.GET_LD_BYNAMEANDLEVEL
                } else if (data['cityName'] !== null) {
                    areaName = data['cityName']
                    areaLevel = 2
                    this.tableArgs = {
                        req: {
                            name: areaName,
                            level: areaLevel
                        }
                    }
                    this.tableMethod = RegionService.REGION.methods.GET_LD_BYNAMEANDLEVEL
                } else if (data['provinceName'] !== null) {
                    areaName = data['provinceName']
                    areaLevel = 1
                    this.tableArgs = {
                        req: {
                            name: areaName,
                            level: areaLevel
                        }
                    }
                    this.tableMethod = RegionService.REGION.methods.GET_LD_BYNAMEANDLEVEL
                } else {
                    this.tableArgs = {}
                    this.tableMethod = RegionService.REGION.methods.GET_LT_ALL
                }
            },
            cellClick (row, column, cell, event, config) {
            },
            handleCurrentRowChange (curRow, oldRow) {
                if (curRow === null) {
                } else {
                    if (curRow.hasOwnProperty('townId') && curRow['townId'] !== null) {
                        this.modifyTownId = curRow['townId']
                    }
                    if (curRow.hasOwnProperty('cityId') && curRow['cityId'] !== null) {
                        this.cityIdOfThisTown = curRow['cityId']
                    }
                    if (curRow.hasOwnProperty('townName') && curRow['townName'] !== null) {
                        this.modifyTownName = curRow['townName']
                    }
                }
            },
            reloadTable () {
                this.tableArgs = {}
                this.tableMethod = RegionService.REGION.methods.GET_LT_ALL
//                this.$refs['t8ttable'].reloadTable()
            }
        }
    }
</script>

<style lang="css" scope>
    .g-main-container-column {
        flex: 1;
        overflow: auto;
        margin-left: -1px;
    }
</style>
