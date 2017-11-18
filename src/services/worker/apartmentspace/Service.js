//报价项接口
let Services = {
    TEMPLATE:{
        //biz/t8t-prs-pqm/app
        name: 'xn8QzCUzoAE7KPVqAowQmXMFkFO90Ky', 
        methods: {
            QUERY: '0sm1rzIREcJRG0MZDYxnV8RoTGpbjnWqWIyKpBpGQ3ecrDjqLkxXl-YoKY3tnGB', //views.houseType.spaceMapping.queryBatchPage
            CREATE: 'mFD_4_xm2G5fVC3Ctf9icuqFnLgwVEsuSLoewNkNCC6Awp3O0bwwksvyLfL', //views.houseType.spaceMapping.createBatch
            UPDATE: '35-6x8iF0jID7w8omkoU_eAiEdsk_VcLEiZ340qFTI1blmzdvEedlptSGRG', //views.houseType.spaceMapping.updateBatch
            queryModuleQuotaionById: 'bsx0wpzI8XAEKxuFTSdpB0W2Y8USbAiRjBCrEjtryI8shhuaiGfqCf3', //views.houseType.spaceMapping.queryBatch
            queryUserSpace:'zL7FIJrQ3YGaZJ7KpRIA47B9I8xBHDP', //views.space.queryPage  
            querySpaceConfig:'BICJrUoNsiTmx8D707546J-EIPO'    //views.space.query     
        }
    },
    PROPERTY:{
        ///biz/supply-chain/app.supply-server
        name: '8m7ufp84fb2V0f5Z0e1LiSKvI9wfWGyPcR5O8IydTmjLcK9YcKE',
        methods:{
            propertyQueryPage:'xxyFxYonI0x3Fv7Po3D98lC_z76',//property.queryPage
            queryCategory :'fue2Bug7gAf8EzJAhQi-8IwMllaKWZlwhefb6kXUbX3', //sys.group.queryGroupTreeOfOne
        }
    }
};

export default Services
