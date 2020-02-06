import axios from 'axios';

const server_url = "http://123.24.206.9:9483";


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
    if (!_this.startsWith("/")) {
        return server_url + "/" + _this;
    }
    if (_this.endsWith(".jpg") || _this.endsWith(".png") || _this.endsWith(".JPG") || _this.endsWith(".PNG") || _this.endsWith(".gif")) {
        return server_url + _this + "";
    }
    if (!_this.endsWith(".jpg") || !_this.endsWith(".png") || _this.endsWith(".JPG") || _this.endsWith(".PNG") || !_this.endsWith(".gif")) {
        return defaultValue;
    }
    // if(this.startsWith("user"))
    //     return
    return server_url + _this + ""
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


export default {
    auth: "",
    serverApi: server_url,
    serverApiDownload: server_url + "/file/download",
    response: {
        ok(data, message) {
            if (!message)
                message = "";
            return {
                success: true,
                data: data,
                message: message
            }
        },
        noOk(message) {
            if (!message)
                message = "";
            return {
                success: false,
                message: message
            }
        }
    },
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
    uploadImage(url, file) {
        const formData = new FormData();
        formData.append('image', file)
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': this.auth,
            }
        }
        return axios.post(url.getServiceUrl(), formData, config)
    },

    download(fileName, url) {
        return new Promise((resolve, reject) => {
            this.requestFetch("get", url + "/" + fileName,
                {
                    'Authorization': this.auth,
                }, "{}").then(s => {
                    s.blob().then(blob => {
                        let blobUrl = URL.createObjectURL(blob);
                        resolve(blobUrl);
                    });
                }).catch(e => {
                    reject(e);
                });
        });
    },
    requestApi(methodType, url, body) {
        return new Promise((resolve, reject) => {
            console.log("Request url " + url + " with token: " + this.auth);
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
                        resolve(val);
                    }).catch(e => { reject(e) });
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