import constants from '../resources/strings';
import clientUtils from '../utils/client-utils';
import datacacheProvider from './datacache-provider';
export default {
    getAll(fromApi) {
        var data = datacacheProvider.read("", "DATA_BANK", []);
        return new Promise((resolve, reject) => {
            let data = datacacheProvider.read("", "DATA_BANK", [])
            if (!fromApi) {
                if (data && data.data && data.data.banks.length) {
                    resolve(data)
                } else {
                    this.getAll(true).then(s => {
                        resolve(s);
                    }).catch(e => {
                        resolve([]);
                    });
                }
            } else {
                clientUtils.requestApi("get", constants.api.bank.getAll, {}).then(x => {
                    if (x.code === 0) {
                        let bank = x.data.banks;
                        datacacheProvider.save("", "DATA_BANK", bank);
                        resolve(bank);
                    }
                    resolve([]);
                }).catch(e => {
                    resolve([]);
                })
            }
        })
    }   
}