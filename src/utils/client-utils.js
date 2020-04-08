import axios from 'axios';

// const server_url = "https://api.timesheet.isofh.vn";
// const server_url = "http://localhost:3000";

const getServerUrl = () => {
    const domain = global.origin;
    switch (domain) {
        case 'http://10.0.0.94:2141': // test 110
            return 'https://1103.test.isofh.vn';
        case 'http://localhost:3000': // dev
            return 'https://api.emr.test.isofh.vn';
        case 'http://localhost:3001': // dev
            return 'https://api.emr.test.isofh.vn';
        // return 'https://1103.test.isofh.vn';
        case 'http://172.17.50.163:2391': // dhy
            return 'http://172.17.50.163:8983';
        case 'http://172.17.50.164:2391': // dhy
            return 'http://172.17.50.164:8983';
        case 'http://172.17.50.160:2391': // dhy
            return 'http://172.17.50.160:8983';
        case 'http://192.168.55.163:2391': // dhy
            return 'http://192.168.55.163:8983';
        case 'http://192.168.55.164:2391': // dhy
            return 'http://192.168.55.164:8983';
        case 'http://192.168.55.160:2391': // dhy
            return 'http://192.168.55.160:8983';
        case 'https://signer.production.isofh.vn': // dhy
            return 'https://api.emr.production.isofh.vn';
        case 'http://10.0.0.94:2391': // stable
            return 'http://10.0.0.94:2301';
        case 'https://signer.stable.isofh.vn': // stable
            return 'https://api.emr.stable.isofh.vn';
        case 'https://signer.test.isofh.vn': // test
            return 'https://api.emr.test.isofh.vn';
        case 'http://10.0.0.94:2191': // test
            return 'http://10.0.0.94:2101';
        case 'https://signer.demo.isofh.vn': // test
            return 'https://api.emr.demo.isofh.vn';
        case 'http://10.0.0.94:2591': // demo
            return 'http://10.0.0.94:2501';
        case 'https://110.signer.test.isofh.vn': // test 110
            return 'https://110.api.emr.test.isofh.vn';
        // case 'http://localhost:3000': // dev 110
        //     return 'https://110.api.emr.test.isofh.vn';

        default:
            return 'https://api.emr.test.isofh.vn';
    }
}
const server_url = getServerUrl();

String.prototype.absoluteUrl = String.prototype.absolute || function (defaultValue) {
    var _this = this.toString();
    if (_this == "")
        if (defaultValue != undefined)
            return defaultValue;
        else
            return _this;
    if (_this.startsWith("http") || _this.startsWith("blob")) {
        return _this;
    }
    if (_this.endsWith(".jpg") || _this.endsWith(".png") || _this.endsWith(".JPG") || _this.endsWith(".PNG") || _this.endsWith(".gif")) {
        return (_this + "").resolveResource();
    }
    if (!_this.endsWith(".jpg") || !_this.endsWith(".png") || _this.endsWith(".JPG") || _this.endsWith(".PNG") || !_this.endsWith(".gif")) {
        return defaultValue;
    }
    if (_this.startsWith("jira.isofh.com.vn"))
        return "htts://" + _this + "";
    // if(this.startsWith("user"))
    //     return
    return server_url + _this + ""
}

String.prototype.getTicketUrl = String.prototype.getTicketUrl || function (defaultValue) {
    var _this = this.toString();
    if (_this == "")
        if (defaultValue != undefined)
            return defaultValue;
        else
            return _this;
    if (_this.startsWith("http") || _this.startsWith("blob")) {
        return _this;
    }
    if (_this.startsWith("jira.isofh.com.vn"))
        return "htts://" + _this + "";
    // if(this.startsWith("user"))
    //     return
    return "https://jira.isofh.com.vn/browse/" + _this + ""
}


String.prototype.absoluteFileUrl = String.prototype.absoluteFileUrl || function (defaultValue) {
    var _this = this.toString();
    if (_this == "")
        if (defaultValue != undefined)
            return defaultValue;
        else
            return _this;
    if (_this.startsWith("http") || _this.startsWith("blob")) {
        return _this;
    }
    return server_url + "/view-file/" + _this + ""
}

String.prototype.getServiceUrl = String.prototype.absolute || function (defaultValue) {
    if (this == "")
        if (defaultValue != undefined)
            return defaultValue;
        else
            return this;
    if (this.startsWith("http") || this.startsWith("blob")) {
        return this;
    }
    return server_url + this;
}

String.prototype.resolveResource = String.prototype.resolveResource || function (defaultValue) {
    if (this == "")
        if (defaultValue != undefined)
            return defaultValue;
        else
            return this;
    if (this.startsWith("http") || this.startsWith("blob")) {
        return this;
    }
    return server_url + "/view-image/" + this;
}


export default {
    auth: "",
    serverApi: server_url,
    EMR_SIGNER_SERVICE: `${getServerUrl()}/api/signer/v1/`,
    EMR_SERVICE: `${getServerUrl()}/api/emr/v1/`,
    SUBCLINICAL_RESULT: `${getServerUrl()}/api/subclinical-result/v1/`,
    uploadFile(url, file) {
        const formData = new FormData();
        formData.append('file', file)
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': this.auth,
            }
        }
        return axios.post(url.getServiceUrl(), formData, config)
    },
    requestApi(methodType, url, body) {
        return new Promise((resolve, reject) => {
            var dataBody = "";
            if (!body)
                body = {};
            dataBody = JSON.stringify(body);
            this.requestFetch(methodType, url && url.indexOf('http') == 0 ? url : (url),
                {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.auth,
                }, dataBody).then(s => {
                    s.json().then(val => {
                        if (val === 401){
                            window.location.href = '/login'
                        } else {
                            resolve(val);
                        }
                    }).catch(e => { reject(e) });
                }).catch(e => {
                    reject(e);
                });
        });
    },
    requestApiFiles(methodType, url, body) {
        return new Promise((resolve, reject) => {
            var dataBody = "";
            if (!body)
                body = {};
            dataBody = JSON.stringify(body);
            this.requestFetch(methodType, url && url.indexOf('http') == 0 ? url : (url),
                {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.auth,
                }, dataBody).then(s => {
                    resolve(s);
                }).catch(e => {
                    reject(e);
                });
        });
    },
    requestFetch(methodType, url, headers, body) {
        return new Promise((resolve, reject) => {
            let fetchParam = {
                method: methodType,
                headers,
            }

            if (methodType.toLowerCase() !== "get") {
                fetchParam.body = body;

            }
            return fetch(url.getServiceUrl(), fetchParam).then((json) => {
                if (!json.ok) {
                    reject(json);
                }
                else
                    resolve(json);
            }).catch((e) => {
                reject(e);
            });
        })
    },
    requestService(url) {
        return new Promise(function (resolve, reject) {
            axios.get(server_url + url)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                })
        });
    },
}