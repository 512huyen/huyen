import constants from '../resources/strings';
import clientUtils from '../utils/client-utils';

export default {
    search(param) {
        let parameters =
        (param.page ? '?page=' + param.page : '?page=' + -1) +
        (param.size ? '&size=' + param.size : '&size=' + - 1) +
        (param.hospitalId ? '&hospitalId=' + param.hospitalId : "&hospitalId=" + -1) +
        (param.paymentAgentId ? '&paymentAgentId=' + param.paymentAgentId : '&paymentAgentId=' + - 1) +
        (param.paymentMethod ? '&paymentMethod=' + param.paymentMethod : '&paymentMethod=' + - 1) +
        (param.status ? '&status=' + param.status : '&status=' + - 1) +
        (param.type ? '&type=' + param.type : '&type=' + - 1) 

        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.hospitalBank.search + parameters, {}).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    },
    create(object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("post", constants.api.hospitalBank.create, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    update(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.hospitalBank.update + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    delete(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("delete", constants.api.hospitalBank.delete + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    getDetail(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.hospitalBank.getDetail + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
}   