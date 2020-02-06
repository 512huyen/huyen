import constants from '../resources/strings';
import clientUtils from '../utils/client-utils';
import datacacheProvider from './datacache-provider';
export default {
    search(param) {
        let parameters =
            (param.page ? '?page=' + param.page : '?page=' + -1) +
            (param.size ? '&size=' + param.size : '&size=' + - 1) +
            (param.name ? '&name=' + param.name : '') +
            (param.status ? '&status=' + param.status : '&status=' + - 1) +
            (param.sortNameAbb ? '&sortNameAbb=' + param.sortNameAbb : '&sortNameAbb=' + - 1) +
            (param.type ? '&type=' + param.type : '&type=' + - 1)

        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.paymentAgent.search + parameters, {}).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    },
    create(object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("post", constants.api.paymentAgent.create, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    update(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.paymentAgent.update + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    delete(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("delete", constants.api.paymentAgent.delete + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    getByHospital(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.paymentAgent.getByHospital + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    getDetail(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.paymentAgent.getDetail + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    groupByMethod() {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.paymentAgent.groupByMethod).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    },
    groupByMethodAgent(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.paymentAgent.groupByMethodAgent + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
}   