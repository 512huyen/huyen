import signedFilesProvider from "@data-access/signed-files-provider";
import snackbar from "@utils/snackbar-utils";
import stringUtils from "mainam-react-native-string-utils";
import moment from "moment";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "SIGNER-FILES-UPDATE-DATA",
      data: data
    });
  };
}

function signedFiles(patientDocument) {
  return (dispatch, getState) => {
    dispatch(updateData({ patientDocument: patientDocument }));
    let formId = getState().signedFiles.formId;
    let formValue = getState().signedFiles.formValue;
    let recordId = getState().signedFiles.recordId;
    let userId = getState().signedFiles.userId;
    signedFilesProvider.signedFiles(patientDocument, formId, formValue, recordId, userId).then(s => {
      dispatch(
        updateData({
          data: s.data || []
        })
      );
    });
  };
}

export default {
  updateData,
  signedFiles,
};
