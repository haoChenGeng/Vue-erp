import axios from 'src/utils/axios.js'
import Service from './Service.js'
export default {
    forBid(args) {
        return axios({
            method: Service.TEMPLETRECORD.methods.UPDATE_STATUS_MODEL,
            service: Service.TEMPLETRECORD.name,
            args: args
        })
    },
    findById(args){
    	return axios({
            method: Service.TEMPLETRECORD.methods.FIND_BY_ID_MODEL,
            service: Service.TEMPLETRECORD.name,
            args: args
        })
    },
    createModelBasic(args)
    {
        return axios({
            method: Service.TEMPLETRECORD.methods.MODELBASIC_CREATE,
            service: Service.TEMPLETRECORD.name,
            args: args
        })

    },
    updateVersion(args)
    {
        return axios({
            method: Service.TEMPLETRECORD.methods.UPDATE_STATUS_VERSION,
            service: Service.TEMPLETRECORD.name,
            args: args
        })
    },
    createModelVersion(args)
    {
        return axios({
            method: Service.TEMPLETRECORD.methods.CREATE_MODEL_VERSION,
            service: Service.TEMPLETRECORD.name,
            args: args
        })

    },
    queryModelBasic(args)
    {
        return axios({
            method: Service.TEMPLETRECORD.methods.QUERY_MODEL_BASIC,
            service: Service.TEMPLETRECORD.name,
            args: args
        })

    },
    contraNameModelBasic(args)
    {
        return axios({
            method: Service.TEMPLETRECORD.methods.CONTRANAME_MODEL_BASIC,
            service: Service.TEMPLETRECORD.name,
            args: args
        })
    },
    getTitle(args)
    {
        return axios({
            method: Service.TEMPLETRECORD.methods.REPLACE_GET_TITLE,
            service: Service.TEMPLETRECORD.name,
            args: args
        })
    },
    createWord(args)
    {
        return axios({
            method: Service.TEMPLETRECORD.methods.CREATE_REPLACE_WORD,
            service: Service.TEMPLETRECORD.name,
            args: args
        })
    },
    getSaveFile(args)
    {
        return axios({
            method: Service.TEMPLETRECORD.methods.GET_SAVE_FILE,
            service: Service.TEMPLETRECORD.name,
            args: args
        })
    },
    uploadAndWord(args)
    {
        return axios({
            method: Service.TEMPLETRECORD.methods.UPLOAD_AND_WORD,
            service: Service.TEMPLETRECORD.name,
            args: args
        })
    },
    getContractName(args)
    {
        return axios({
            method: Service.TEMPLETRECORD.methods.GET_CONTRACT_NAME,
            service: Service.TEMPLETRECORD.name,
            args: args
        })
    },
    getAllContractName(args)
    {
        return axios({
            method: Service.TEMPLETRECORD.methods.GET_ALL_CONTRACTNAME,
            service: Service.TEMPLETRECORD.name,
            args: args
        })
    }



}