import constants from '../resources/strings';
import clientUtils from '../utils/client-utils';

export default {
    search(param) {
        let parameters =
            (param.page ? '?page=' + param.page : '&page=' + - 1) +
            (param.size ? '&size=' + param.size : '&size=' + - 1) +
            (param.number ? '&number=' + param.number : '') +
            (param.hospital ? '&hospital=' + param.hospital : '&hospital=' + -1) +
            (param.passport ? '&passport=' + param.passport : '') +
            (param.patientCode ? '&patientCode=' + param.patientCode : '') +
            (param.deleted ? '&deleted=' + param.deleted : '') +
            (param.code ? '&code=' + param.code : '') +
            (param.status ? '&status=' + param.status : '&status=' + -1) +
            (param.cancel ? '&cancel=' + param.cancel : '&cancel=' + -1)

        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.card.search + parameters, {}).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    },
    create(object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("post", constants.api.card.create, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    update(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.card.update + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    delete(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("delete", constants.api.card.delete + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    cancel(object) {
        console.log((object))
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("delete", constants.api.card.cancel, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    getDetail(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.card.getDetail + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    payIn(object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("post", constants.api.card.payIn, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
}   