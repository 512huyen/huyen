import signPrivilegesProvider from "@data-access/sign-privileges-provider";
import snackbar from "@utils/snackbar-utils";
import stringUtils from "mainam-react-native-string-utils";
import moment from "moment";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "SIGN-PRIVILEGES-UPDATE-DATA",
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
    let size = getState().signPrivileges.size || 10;
    let name = getState().signPrivileges.searchName;
    let value = getState().signPrivileges.searchValue;
    let sort = getState().signPrivileges.sort || {};
    let active = getState().signPrivileges.searchActive;
    signPrivilegesProvider.search(page, size, name, value, active, undefined, sort).then(s => {
      dispatch(
        updateData({
          total: s.totalElements || size,
          data: s.data || []
        })
      );
    });
  };
}

function loadSignPrivilegesDetail(id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      signPrivilegesProvider
        .getById(id)
        .then(s => {
          if (s && s.code == 0 && s.data) {
            dispatch(
              updateData({
                id: s.data.id,
                active: s.data.active,
                name: s.data.name,
                value: s.data.value,
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

function loadListSignPrivileges() {
  return (dispatch, getState) => {
    signPrivilegesProvider.search(0, 1000, "", "").then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              signPrivileges: s.data
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
      signPrivilegesProvider.createOrEdit(id, name, active, value).then(s => {
        if (s.code == 0) {
          dispatch(updateData({
            id: "",
            name: "",
            value: "",
            active: false
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
      let id = getState().signPrivileges.id;
      let name = getState().signPrivileges.name;
      let active = getState().signPrivileges.active;
      let value = getState().signPrivileges.value;
      signPrivilegesProvider
        .createOrEdit(id, name, active, value)
        .then(s => {
          if (s.code == 0) {
            dispatch(
              updateData({
                id: "",
                name: "",
                value: "",
                active: false
              })
            );
            if (!id) {
              snackbar.show("Thêm thành công", "success");
            } else {
              snackbar.show("Cập nhật thành công", "success");
            }
            dispatch(loadListSignPrivileges());
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
        content: `Bạn có muốn xóa quyền kí ${item.name}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          signPrivilegesProvider
            .delete(item.id)
            .then(s => {
              if (s.code == 0) {
                snackbar.show("Xóa thành công", "success");
                let data = getState().signPrivileges.data || [];
                let index = data.findIndex(x => x.id == item.id);
                if (index != -1);
                data.splice(index, 1);
                dispatch(
                  updateData({
                    data: [...data]
                  })
                );
                dispatch(loadListSignPrivileges());
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
  loadListSignPrivileges,
  createOrEdit,
  updateData,
  gotoPage,
  onSearch,
  onSizeChange,
  onSort,
  onDeleteItem,
  loadSignPrivilegesDetail,
  changeStatus
};
