import formsProvider from "@data-access/forms-provider";
import snackbar from "@utils/snackbar-utils";
import stringUtils from "mainam-react-native-string-utils";
import moment from "moment";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "FORMS-UPDATE-DATA",
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

function onSearch(value, name, active) {
  return (dispatch, getState) => {
    if (name === undefined && value === undefined) {
    } else {
      dispatch(
        updateData({
          searchName: name,
          searchValue: value,
          searchActive: active
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().forms.size || 10;
    let name = getState().forms.searchName;
    let value = getState().forms.searchValue;
    let sort = getState().forms.sort || {};
    let active = getState().forms.searchActive;
    formsProvider.search(page, size, name, value, active, undefined, sort).then(s => {
      dispatch(
        updateData({
          total: s.totalElements || size,
          data: s.data || []
        })
      );
    });
  };
}

function loadFormsDetail(id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      formsProvider
        .getById(id)
        .then(s => {
          if (s && s.code == 0 && s.data) {
            dispatch(
              updateData({
                id: s.data.id,
                active: s.data.active,
                name: s.data.name,
                value: s.data.value,
                signLevelTotal: s.data.signLevelTotal,
                signType1: s.data.signType1,
                signType2: s.data.signType2,
                signType3: s.data.signType3,
                signType4: s.data.signType4,
                signPrivilege1Id: s.data.signPrivilege1Id,
                signPrivilege2Id: s.data.signPrivilege2Id,
                signPrivilege3Id: s.data.signPrivilege3Id,
                signPrivilege4Id: s.data.signPrivilege4Id,
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

function loadListForms() {
  return (dispatch, getState) => {
    formsProvider.search(0, 1000, "", "").then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              forms: s.data,
              total: s.totalElements
            })
          );
          break;
      }
    });
  };
}

function changeStatus(item) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let id = item.id;
      let name = item.name;
      let active = !item.active;
      let value = item.value;
      let signLevelTotal = item.signLevelTotal;
      let signType1 = item.signType1;
      let signType2 = item.signType2;
      let signType3 = item.signType3;
      let signType4 = item.signType4;
      let signPrivilege1Id = item.signPrivilege1Id;
      let signPrivilege2Id = item.signPrivilege2Id;
      let signPrivilege3Id = item.signPrivilege3Id;
      let signPrivilege4Id = item.signPrivilege4Id;
      formsProvider.createOrEdit(id, name, active, value, signLevelTotal, signType1, signPrivilege1Id, signType2, signPrivilege2Id, signType3, signPrivilege3Id, signType4, signPrivilege4Id).then(s => {
        if (s.code == 0) {
          dispatch(updateData({
            id: "",
            name: "",
            value: "",
            active: false,
            signLevelTotal: "",
            signType1: "",
            signPrivilege1Id: "",
            signType2: "",
            signPrivilege2Id: "",
            signType3: "",
            signPrivilege3Id: "",
            signType4: "",
            signPrivilege4Id: ""
          }));
          snackbar.show("Cập nhật trạng thái thành công", "success");
          resolve(s.data);
          dispatch(gotoPage(0));
        } else {
          snackbar.show(s.message || "Cập nhật trạng thái không thành công", "danger");
          reject();
        }
      }).catch(e => {
        snackbar.show(s.message || "Cập nhật trạng thái không thành công", "danger");
        reject();
      });
    });
  }
}

function createOrEdit() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let id = getState().forms.id;
      let name = getState().forms.name;
      let active = getState().forms.active;
      let value = getState().forms.value;
      let signLevelTotal = getState().forms.signLevelTotal;
      let signType1 = getState().forms.signType1;
      let signType2 = getState().forms.signType2;
      let signType3 = getState().forms.signType3;
      let signType4 = getState().forms.signType4;
      let signPrivilege1Id = getState().forms.signPrivilege1Id;
      let signPrivilege2Id = getState().forms.signPrivilege2Id;
      let signPrivilege3Id = getState().forms.signPrivilege3Id;
      let signPrivilege4Id = getState().forms.signPrivilege4Id;
      formsProvider
        .createOrEdit(id, name, active, value, signLevelTotal, signType1, signPrivilege1Id, signType2, signPrivilege2Id, signType3, signPrivilege3Id, signType4, signPrivilege4Id)
        .then(s => {
          if (s.code == 0) {
            dispatch(
              updateData({
                id: "",
                name: "",
                value: "",
                active: false,
                signLevelTotal: "",
                signType1: "",
                signPrivilege1Id: "",
                signType2: "",
                signPrivilege2Id: "",
                signType3: "",
                signPrivilege3Id: "",
                signType4: "",
                signPrivilege4Id: ""
              })
            );
            if (!id) {
              snackbar.show("Thêm thành công", "success");
            } else {
              snackbar.show("Cập nhật thành công", "success");
            }
            dispatch(loadListForms());
            resolve(s.data);
          } else {
            if (!id) {
              snackbar.show(s.message || "Thêm không thành công", "danger");
            } else {
              snackbar.show(s.message || "Sửa không thành công", "danger");
            }
            reject();
          }
        })
        .catch(e => {
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
        content: `Bạn có muốn xóa loại form ${item.name}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          formsProvider
            .delete(item.id)
            .then(s => {
              if (s.code == 0) {
                snackbar.show("Xóa thành công", "success");
                let data = getState().forms.data || [];
                let index = data.findIndex(x => x.id == item.id);
                if (index != -1);
                data.splice(index, 1);
                dispatch(
                  updateData({
                    data: [...data]
                  })
                );
                dispatch(loadListForms());
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
  loadListForms,
  createOrEdit,
  updateData,
  gotoPage,
  onSearch,
  onSizeChange,
  onSort,
  onDeleteItem,
  loadFormsDetail,
  changeStatus
};
