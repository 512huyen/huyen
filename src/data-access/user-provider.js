import client from '../utils/client-utils';
import constants from '../resources/strings';
import datacacheProvider from './datacache-provider';
import clientUtils from '../utils/client-utils';

export default {
    getAccountStorage() {
        var user = datacacheProvider.read("", constants.key.storage.current_account);
        return user;
    },
    saveAccountStorage(account) {
        return datacacheProvider.save("", constants.key.storage.current_account, account);
    },
    xx() {
        client.serverApi = "";
    },
    login(username, password) {
        let object = {
            username,
            password: password.toString()
        }
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.user.login, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    logout(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.user.logout + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    search(param) {
        let parameters =
            (param.page ? '?page=' + param.page : '?page=' + -1) +
            (param.size ? '&size=' + param.size : '&size=' + - 1) +
            (param.text ? '&text=' + param.text : '') +
            (param.status ? '&status=' + param.status : '&status=' + - 1) +
            (param.type ? '&type=' + param.type : '&type=' + - 1) +
            (param.identification ? '&identification=' + param.identification : '') +
            (param.dob ? '&dob=' + param.dob : '')
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.user.search + parameters, {}).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
            // let data = datacacheProvider.read(param.type, "DATA_USER", [])
            // if (!fromApi) {
            //     if (data && data.data && data.data.data.length) {
            //         if (param.size < data.data.total){
            //             param.size = data.data.total
            //             this.search(param, true).then(s=>{
            //                 resolve(s)
            //             }).catch(e=>{
            //                 resolve([])
            //             })
            //         } else {
            //             resolve(data)
            //         }
            //     } else {
            //         this.search(param, true).then(s => {
            //             resolve(s)
            //         }).catch(e => {
            //             resolve([])
            //         })
            //     }
            // } else {
            //     clientUtils.requestApi("get", constants.api.user.search + parameters, {}).then(x => {
            //         datacacheProvider.save(param.type, "DATA_USER", x);
            //         if (x && x.data){
            //             if (param.size < x.data.total) {
            //                 param.size = x.data.total
            //                 this.search(param, true).then(s => {
            //                     resolve(s);
            //                 }).catch(e => {
            //                     resolve([])
            //                 })
            //             } else {
            //                 resolve(x);
            //             }
            //         } else {
            //             resolve([])
            //         }
            //     }).catch(e => {
            //         resolve([])
            //     })
            // }
        })
    },
    updatePassword(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.user.updatePassword + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    updateEmail(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.user.updateEmail + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    create(object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("post", constants.api.user.create, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    update(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.user.update + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    block(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.user.block + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    active(id, object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.user.active + "/" + id, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    reset(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("put", constants.api.user.reset + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    getDetail(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.user.detail + "/" + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
    userAccess(object) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("post", constants.api.user_access.create, object).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        });
    },
}   