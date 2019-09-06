import constants from '../resources/strings';
import clientUtils from '../utils/client-utils';

export default {
    search(param) {
        let parameters =
            (param.page ? '?page=' + param.page : '&page=' + - 1) +
            (param.size ? '&size=' + param.size : '&size=' + - 1) +
            (param.fromDate ? '&fromDate=' + param.fromDate : '') +
            (param.toDate ? '&toDate=' + param.toDate : '') + 
            (param.paymentAgentId ? '&paymentAgentId=' + param.paymentAgentId : '&paymentAgentId=' + -1) +
            (param.bankId ? '&bankId=' + param.bankId : '&bankId=' + -1) +
            (param.hospitalId ? '&hospitalId=' + param.hospitalId : '&hospitalId=' + -1) 
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.cardTransferHistory.search + parameters, {}).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    },
    create(object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("post", constants.api.cardTransferHistory.create, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    update(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.cardTransferHistory.update + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    delete(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("delete", constants.api.cardTransferHistory.delete + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
}   