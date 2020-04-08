import patientHistoriesProvider from "@data-access/patient-histories-provider";
import snackbar from "@utils/snackbar-utils";
import stringUtils from "mainam-react-native-string-utils";
import moment from "moment";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "PATIENT-HISTORIES-UPDATE-DATA",
      data: data
    });
  };
}

function onSizeChange(size) {
  return (dispatch, getState) => {
    dispatch(
      updateData({
        size: size
      })
    );
    dispatch(gotoPage(0));
  };
}

function onSearch(patientDocument, patientValue, patientName) {
  return (dispatch, getState) => {
    if (patientDocument === undefined && patientValue === undefined && patientName === undefined) {
    } else {
      dispatch(
        updateData({
          searchPatientDocument: patientDocument,
          searchPatientValue: patientValue,
          searchPatientName: patientName
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().patientHistories.size || 10;
    let patientDocument = getState().patientHistories.searchPatientDocument;
    let patientValue = getState().patientHistories.searchPatientValue;
    let patientName = getState().patientHistories.searchPatientName;
    patientHistoriesProvider.search(page, size, patientDocument, patientValue, patientName, undefined).then(s => {
      dispatch(
        updateData({
          total: s.totalElements || size,
          data: s.data || []
        })
      );
    });
  };
}

function loadPatientHistoriesDetail(id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      patientHistoriesProvider
        .getById(id)
        .then(s => {
          if (s && s.code == 0 && s.data) {
            dispatch(
              updateData({
                id: s.data.id,
                name: s.data.name,
                fullName: s.data.fullName,
                serialNumber: s.data.serialNumber,
                signImage: s.data.signImage,
                privileges: s.data.privileges
              })
            );
            resolve(s.data);
            return;
          }
          snackbar.show("Không tìm thấy kết quả phù hợp", "danger");
          reject(s);
        })
        .catch(e => {
          snackbar.show(
            e && e.message ? e.message : "Xảy ra lỗi, vui lòng thử lại sau",
            "danger"
          );
          reject(e);
        });
    });
  };
}

function onSort(key, value) {
  return (dispatch, getState) => {
    dispatch(
      updateData({
        sort: {
          key,
          value
        }
      })
    );
    dispatch(gotoPage(0));
  };
}

function loadListPatientHistories() {
  return (dispatch, getState) => {
    patientHistoriesProvider.search(0, 1000, "", "").then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              patientHistories: s.data,
              total: s.totalElements
            })
          );
          break;
      }
    });
  };
}

function createOrEdit(item, action) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let id = getState().patientHistories.id;
      let name = getState().patientHistories.name;
      let fullName = getState().patientHistories.fullName;
      let signImage = action === "signImage" ? item : getState().patientHistories.signImage;
      let serialNumber = getState().patientHistories.serialNumber;
      let privileges = action === "privileges" ? item : getState().patientHistories.privileges;
      patientHistoriesProvider.createOrEdit(id, name, fullName, signImage, serialNumber, privileges).then(s => {
        if (s.code == 0) {
          dispatch(
            updateData({
              id: "",
              name: "",
              value: "",
              active: false,
              signImage: "",
              serialNumber: "",
              privileges: "",
              openChangeSerialNumber: false,
              openChangePrivileges: false
            })
          );
          if (!id) {
            snackbar.show("Thêm thành công", "success");
          } else {
            snackbar.show("Cập nhật thành công", "success");
          }
          dispatch(loadListPatientHistories());
          resolve(s.data);
        } else {
          if (!id) {
            snackbar.show(s.message || "Thêm không thành công", "danger");
          } else {
            snackbar.show(s.message || "Sửa không thành công", "danger");
          }
          reject();
        }
      }).catch(e => {
        snackbar.show("Thêm không thành công", "danger");
        reject();
      });
    });
  };
}

function onDeleteItem(item) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      confirm({
        title: "Xác nhận",
        content: `Bạn có muốn xóa lịch sử ký ${item.name}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          patientHistoriesProvider
            .delete(item.id)
            .then(s => {
              if (s.code == 0) {
                snackbar.show("Xóa thành công", "success");
                let data = getState().patientHistories.data || [];
                let index = data.findIndex(x => x.id == item.id);
                if (index != -1);
                data.splice(index, 1);
                dispatch(
                  updateData({
                    data: [...data]
                  })
                );
                dispatch(loadListPatientHistories());
                resolve();
              } else {
                snackbar.show("Xóa không thành công", "danger");
                reject();
              }
            })
            .catch(e => {
              snackbar.show("Xóa không thành công", "danger");
              reject();
            });
        },
        onCancel() {
          reject();
        }
      });
    });
  };
}

export default {
  loadListPatientHistories,
  createOrEdit,
  updateData,
  gotoPage,
  onSearch,
  onSizeChange,
  onSort,
  onDeleteItem,
  loadPatientHistoriesDetail
};
