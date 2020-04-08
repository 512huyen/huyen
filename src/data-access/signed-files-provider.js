import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  signedFiles(patientDocument, formId, formValue, recordId, userId) {
    let url = constants.api.signedFiles + "?";
    url += "patientDocument=" + (patientDocument || "");
    if (formId) url += "&formId=" + formId;
    if (formValue) url += "&formValue=" + formValue;
    if (recordId) url += "&recordId=" + recordId;
    if (userId) url += "&userId=" + userId;
    return client.requestApi("get", url, {});
  },
  subclinicalResult(patientDocument) {
    let url = constants.api.subclinicalResult + "?patientDocument=" + (patientDocument || "");
    return client.requestApi("get", url, {});
  },
};
