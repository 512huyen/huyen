import constants from '../resources/strings';
import clientUtils from '../utils/client-utils';
import datacacheProvider from './datacache-provider';
export default {
    search(param, fromApi) {
        let parameters =
            (param.page ? '?page=' + param.page : '?page=' + -1) +
            (param.size ? '&size=' + param.size : '&size=' + - 1) +
            (param.name ? '&name=' + param.name : '') +
            (param.status ? '&status=' + param.status : '&status=' + - 1) +
            (param.sortNameAbb ? '&sortNameAbb=' + param.sortNameAbb : '&sortNameAbb=' + - 1) +
            (param.type ? '&type=' + param.type : '&type=' + - 1)

        return new Promise((resolve, reject) => {
            let data = datacacheProvider.read("", "DATA_PAYMENT_AGENT", [])
            if (!fromApi) {
                if (data && data.data && data.data.data.length) {
                    if (param.size < data.data.total) {
                        this.search(param, true).then(s => {
                            resolve(s);
                        }).catch(e => {
                            resolve([])
                        })
                    } else {
                        resolve(data)
                    }
                } else {
                    this.search(param, true).then(s => {
                        resolve(s);
                    }).catch(e => {
                        resolve([]);
                    });
                }
            } else {
                clientUtils.requestApi("get", constants.api.paymentAgent.search + parameters, {}).then(x => {
                    datacacheProvider.save("", "DATA_PAYMENT_AGENT", x);
                    if (param.size < x.data.total) {
                        param.size = x.data.total
                        this.search(param, true).then(s => {
                            resolve(s);
                        }).catch(e => {
                            resolve([])
                        })
                    } else {
                        resolve(x);
                    }
                }).catch(e => {
                    reject(e);
                })
            }

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
    groupByMethod(fromApi) {
        return new Promise((resolve, reject) => {
            let data = datacacheProvider.read("", "DATA_GROUP_BY_METHOD", [])
            if (!fromApi) {
                if (data && data.data && data.data.methods) {
                    resolve(data)
                } else {
                    this.groupByMethod(true).then(s => {
                        resolve(s);
                    }).catch(e => {
                        resolve([]);
                    });
                }
            } else {
                clientUtils.requestApi("get", constants.api.paymentAgent.groupByMethod).then(x => {
                    if (x.code === 0) {
                        let groupByMethod = x
                        datacacheProvider.save("", "DATA_GROUP_BY_METHOD", groupByMethod)
                        resolve(groupByMethod)
                    }
                    resolve([]);
                }).catch(e => {
                    resolve([]);
                })
            }
        });
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