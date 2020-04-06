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
  },
  getById(id) {
    let url = constants.api.users + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, name, fullName, selected, sort) {
    let url = constants.api.users + "?";
    url += "page=" + (page || 0) + "&";
    url += "size=" + (size || 10);
    if (name) url += "&name=" + name;
    if (fullName) url += "&fullName=" + fullName;
    // if (sort) url += "sort=" + sort;
    if (selected !== undefined) url += "&selected=" + (selected ? 1 : 0);
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.users + "/" + id;
    return client.requestApi("delete", url, {});
  },
  uploadImageSign(data) {
    let url = constants.api.users + "/sign-images";
    return client.uploadFile(url, data);
  },
  createOrEdit(id, name, fullName, signImage, serialNumber, privileges) {
    if (!id) {
      let url = constants.api.users;
      return client.requestApi("post", url, {
        name,
        fullName,
        signImage,
        serialNumber,
        privileges
      });
    } else {
      let url = constants.api.users + "/" + id;
      return client.requestApi("put", url, {
        name,
        fullName,
        signImage,
        serialNumber,
        privileges
      });
    }
  },
};
