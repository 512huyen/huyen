import axios from 'axios';

// const server_url = "https://api.ykhoahanoi.vn"; 
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
    if (_this.endsWith(".jpg") || _this.endsWith(".png") || _this.endsWith(".JPG") || _this.endsWith(".PNG") || _this.endsWith(".gif")) {
        return server_url +  _this + "";
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
    // auth: "eyJhbGciOiJSUzI1NiJ9.eyJyb2xlIjoiaXNvZmhDYXJlIiwiY3JlYXRlZCI6MTU1MzA3MDc0Mzc4NiwidHlwZSI6MCwidXNlcklkIjo1NX0.k8B3Cm5M-22ckpKk3W1fhgHoHq7LGVdKIjhLZUl0abKES5nSCC5RhupsRXctTK6skQMvCZ8f-TuZGbDcNgdlsb_Kc0ogFmaPmGI4ao7MKrCb9nCr4fxztUN0ABWUERA1wnQNFljgVR9FIrNKnf2hx_aTHIrwS9Ol1JOaKJVnj83cK5vg2ExvN7ralb1yoyuHEZoODlDBVHCIxeG5X3oaJE6-BKfcafXau_cmYz-Ovg31VtZpu1lCffaOj2uLSefPBvqfL2d2U1sswiUrV95rankTjOomr31lP4xiCN71-7YX_6Hx7EraRFhmclmaOjGUWM83VB0fvY8hIEHiE8yB8w",
    auth: "",
    serverApi: server_url,
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
                // 'MobileMode': 'vendorPortal'
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
                // 'MobileMode': 'vendorPortal'
            }
        }
        return axios.post(url.getServiceUrl(), formData, config)
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
                    // 'MobileMode': 'vendorPortal'
                }, dataBody).then(s => {
                    // ;
                    s.json().then(val => {
                        console.log(val);
                        resolve(val);
                    }).catch(e => { reject(e) });
                }).catch(e => {
                    reject(e);
                });
        });
    },
    requestFetch(methodType, url, headers, body) {
        return new Promise((resolve, reject) => {
            console.log(body);
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
                console.log(e);
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