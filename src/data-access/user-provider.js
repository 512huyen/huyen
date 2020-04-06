import client from "../utils/client-utils";
import stringUtils from "mainam-react-native-string-utils";
import constants from "../resources/strings";
import datacacheProvider from "./datacache-provider";
import clientUtils from "../utils/client-utils";

export default {
  login(username, password) {
    let object = {
      usernameOrEmail: username,
      password: password,
    };
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi("post", constants.api.login, object)
        .then(x => {
          resolve(x);
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  getDetailUser() {
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi("get", constants.api.user.detail, {})
        .then(x => {
          resolve(x);
        })
        .catch(e => {
          reject(e);
        });
    });
  }
};
