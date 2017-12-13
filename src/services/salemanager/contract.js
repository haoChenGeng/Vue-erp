import axios from 'src/utils/axios.js'
import Service from './Service.js'

export default{
    getDetailByProcessId (args) {
        return axios({
            service: Service.CONTRACT.name,
            method: Service.CONTRACT.methods.GETDETAILBYPROCESSID,
            args: args
        })
    },
    findPhotosByProjectId (args) {
        return axios({
            service: Service.PHOTOS.name,
            method: Service.PHOTOS.methods.FINDPHOTOSBYPROJECTID,
            args: args
        })
    },
    showNoVerify (args) {
        return axios({
            service: Service.QUOTE.name,
            method: Service.QUOTE.methods.SHOWNOVERIFY,
            args: args
        })
    },
    create (args) {
        return axios({
            service: Service.CONTRACT.name,
            method: Service.CONTRACT.methods.CREATE,
            args: args
        })
    },
    verify (args) {
        return axios({
            service: Service.CONTRACT.name,
            method: Service.CONTRACT.methods.VERIFY,
            args: args
        })
    },
    getValidContractUrl(args) {
        return axios({
            service: Service.CONTRACT.name,
            method: Service.CONTRACT.methods.GETVALIDCONTRACTURL,
            args: args
        })
    }

}
