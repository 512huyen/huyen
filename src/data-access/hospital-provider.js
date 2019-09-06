import constants from '../resources/strings';
import clientUtils from '../utils/client-utils';
import datacacheProvider from './datacache-provider';

export default {
    search(param, fromApi) {
        let parameters =
            (param.page ? '?page=' + param.page : '?page=' + -1) +
            (param.size ? '&size=' + param.size : '&size=' + - 1) +
            (param.name ? '&name=' + param.name : '') +
            (param.paymentMethod ? '&paymentMethod=' + param.paymentMethod : '&paymentMethod=' + - 1) +
            (param.agentId ? '&agentId=' + param.agentId : '&agentId=' + - 1) +
            (param.status ? '&status=' + param.status : '&status=' + - 1)

        return new Promise((resolve, reject) => {
            let data = datacacheProvider.read("", "DATA_HOSPITAL", [])
            if (!fromApi) {
                if (data && data.data && data.data.data.length) {
                    if (param.size < data.data.total) {
                        this.search(param, true).then(s => {
                            resolve(s)
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
                clientUtils.requestApi("get", constants.api.hospital.search + parameters, {}).then(x => {
                    if (x.code === 0) {
                        let hospital = x
                        datacacheProvider.save("", "DATA_HOSPITAL", hospital)
                        if (param.size < x.data.total) {
                            param.size = x.data.total
                            this.search(param, true).then(s => {
                                resolve(s);
                            }).catch(e => {
                                resolve([])
                            })
                        } else {
                            resolve(hospital)
                        }
                    }
                    resolve([]);
                }).catch(e => {
                    resolve([]);
                })
            }
        })
    },
    create(object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("post", constants.api.hospital.create, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    update(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.hospital.update + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    delete(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("delete", constants.api.hospital.delete + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    getHisAccount(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.hospital.getHisAccount + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    getAgent(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.hospital.getAgent + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    getDetail(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.hospital.getDetail + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
}   