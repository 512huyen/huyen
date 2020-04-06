import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.forms + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, name, value, active, selected, sort) {
    let url = constants.api.forms + "?";
    url += "page=" + (page || 0) + "&";
    url += "size=" + (size || 10);
    if (name) url += "&name=" + name;
    if (value) url += "&value=" + value;
    // if (sort) url += "sort=" + sort;
    if (active !== undefined && active !== -1)
      url += "&active=" + (active ? 1 : 0);
    if (selected !== undefined) url += "&selected=" + (selected ? 1 : 0);
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.forms + "/" + id;
    return client.requestApi("delete", url, {});
  },
  createOrEdit(id, name, active, value, signLevelTotal, signType1, signPrivilege1Id, signType2, signPrivilege2Id, signType3, signPrivilege3Id, signType4, signPrivilege4Id) {
    if (!id) {
      let url = constants.api.forms;
      return client.requestApi("post", url, {
        name,
        value,
        active: active ? 1 : 0,
        signLevelTotal,
        signType1,
        signPrivilege1Id,
        signType2,
        signPrivilege2Id,
        signType3,
        signPrivilege3Id,
        signType4,
        signPrivilege4Id
      });
    } else {
      let url = constants.api.forms + "/" + id;
      return client.requestApi("put", url, {
        name,
        value,
        active: active ? 1 : 0,
        signLevelTotal,
        signType1,
        signPrivilege1Id,
        signType2,
        signPrivilege2Id,
        signType3,
        signPrivilege3Id,
        signType4,
        signPrivilege4Id
      });
    }
  }
};
