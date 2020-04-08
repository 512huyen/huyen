import signedFilesProvider from "@data-access/signed-files-provider";
import snackbar from "@utils/snackbar-utils";
import stringUtils from "mainam-react-native-string-utils";
import moment from "moment";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "SUBCLINICAL-RESULT-UPDATE-DATA",
      data: data
    });
  };
}

function subclinicalResult(patientDocument) {
  return (dispatch, getState) => {
    dispatch(updateData({ patientDocument: patientDocument }));
    signedFilesProvider.subclinicalResult(patientDocument).then(s => {
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
  subclinicalResult,
};
