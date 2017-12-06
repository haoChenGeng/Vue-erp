/**
 * Created by clay.zhao on 2017/6/20.
 */
import axios from 'src/utils/axios.js'
import Service from '../region/Service.js'

export default {
    getStandardProvince (args) {
        return axios({
            method: Service.REGION.methods.GET_SP_ALL,
            service: Service.REGION.name,
            args: args
        })
    },
    getLDIdByStandardId (args) {
        return axios({
            method: Service.REGION.methods.GET_LID_BYSTANDARDID,
            service: Service.REGION.name,
            args: args
        })
    },
    addLocalTown (args) {
        return axios({
            method: Service.REGION.methods.ADD_LOCALTOWN,
            service: Service.REGION.name,
            args: args
        })
    },
    addLocalCity (args) {
        return axios({
            method: Service.REGION.methods.ADD_LOCALCITY,
            service: Service.REGION.name,
            args: args
        })
    },
    addRelatedDistrict (args) {
        return axios({
            method: Service.REGION.methods.ADD_RELATED_DISTRICT,
            service: Service.REGION.name,
            args: args
        })
    },
    getAllStandardDistrict (args) {
        return axios({
            method: Service.REGION.methods.GET_SD_ALL,
            service: Service.REGION.name,
            args: args
        })
    },
    getSDListByNameAndLevel (args) {
        return axios({
            method: Service.REGION.methods.GET_SD_LISTBYNAMEANDLEVEL,
            service: Service.REGION.name,
            args: args
        })
    },
    addStandardDistrict (args) {
        return axios({
            method: Service.REGION.methods.ADD_STANDARD_DISTRICT,
            service: Service.REGION.name,
            args: args
        })
    },
    updateLocalTown (args) {
        return axios({
            method: Service.REGION.methods.UPDATE_LOCAL_TOWN,
            service: Service.REGION.name,
            args: args
        })
    },
    updateStandardDistrict (args) {
        return axios({
            method: Service.REGION.methods.UPDATE_STANDARD_DISTRICT,
            service: Service.REGION.name,
            args: args
        })
    },
    getLocalTownById (args) {
        return axios({
            method: Service.REGION.methods.GET_LOCAL_TOWN,
            service: Service.REGION.name,
            args: args
        })
    },
    getAllStandardDistrictTree (args) {
        return axios({
            method: Service.REGION.methods.GET_LD_ALLTREE,
            service: Service.REGION.name,
            args: args
        })
    },
    getLocalCityTree (args) {
        return axios({
            method: Service.REGION.methods.GET_LOCALCITY_TREE,
            service: Service.REGION.name,
            args: args
        })
    },
    searchStandardDistrict (args) {
        return axios({
            method: Service.REGION.methods.SEARCH_STANDARD_DISTRICT,
            service: Service.REGION.name,
            args: args
        })
    },
    searchStandardDistrictByNames (args) {
        return axios({
            method: Service.REGION.methods.SEARCH_STANDARD_DISTRICT_BYNAMES,
            service: Service.REGION.name,
            args: args
        })
    }
}
