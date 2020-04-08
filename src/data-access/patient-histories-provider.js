import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.patientHistories + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, patientDocument, patientValue, patientName, selected) {
    let url = constants.api.patientHistories + "?";
    url += "page=" + (page || 0) + "&";
    url += "size=" + (size || 10);
    url += "&patientDocument=" + (patientDocument || "");
    url += "&patientValue=" + (patientValue || "");
    url += "&patientName=" + (patientName || "");
    if (selected !== undefined) url += "&selected=" + (selected ? 1 : 0);
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.patientHistories + "/" + id;
    return client.requestApi("delete", url, {});
  },
  createOrEdit(id, name, active, value) {
    if (!id) {
      let url = constants.api.patientHistories;
      return client.requestApi("post", url, {
        name,
        value,
        active: active ? 1 : 0
      });
    } else {
      let url = constants.api.patientHistories + "/" + id;
      return client.requestApi("put", url, {
        name,
        value,
        active: active ? 1 : 0
      });
    }
  }
};
