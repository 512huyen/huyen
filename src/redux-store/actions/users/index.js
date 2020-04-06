import usersProvider from "@data-access/user-provider";
import snackbar from "@utils/snackbar-utils";
import stringUtils from "mainam-react-native-string-utils";
import moment from "moment";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "USERS-UPDATE-DATA",
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

function onSearch(name, fullName) {
  return (dispatch, getState) => {
    if (name === undefined && fullName === undefined) {
    } else {
      dispatch(
        updateData({
          searchName: name,
          searchFullName: fullName,
        })
      );
    }
    dispatch(gotoPage(0));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().users.size || 10;
    let name = getState().users.searchName;
    let fullName = getState().users.searchFullName;
    let sort = getState().users.sort || {};
    usersProvider.search(page, size, name, fullName, undefined, sort).then(s => {
      dispatch(
        updateData({
          total: s.totalElements || size,
          data: s.data || []
        })
      );
    });
  };
}

function loadUsersDetail(id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      usersProvider
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

function uploadImageSign(data) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      usersProvider.uploadImageSign(data.file).then(s => {
        if (s && s.data && s.data.code == 0) {
          dispatch(
            updateData({
              openChangeSignImage: false
            })
          );
          resolve(s.data);
          return;
        }
        snackbar.show("Lưu chữ ký thất bại!", "danger");
        reject(s);
      }).catch(e => {
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

function loadListUsers() {
  return (dispatch, getState) => {
    usersProvider.search(0, 1000, "", "").then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              users: s.data,
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
      let id = getState().users.id;
      let name = getState().users.name;
      let fullName = getState().users.fullName;
      let signImage = action === "signImage" ? item : getState().users.signImage;
      let serialNumber = getState().users.serialNumber;
      let privileges = action === "privileges" ? item : getState().users.privileges;
      usersProvider.createOrEdit(id, name, fullName, signImage, serialNumber, privileges).then(s => {
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
          dispatch(loadListUsers());
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
        content: `Bạn có muốn xóa biểu mẫu ${item.name}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          usersProvider
            .delete(item.id)
            .then(s => {
              if (s.code == 0) {
                snackbar.show("Xóa thành công", "success");
                let data = getState().users.data || [];
                let index = data.findIndex(x => x.id == item.id);
                if (index != -1);
                data.splice(index, 1);
                dispatch(
                  updateData({
                    data: [...data]
                  })
                );
                dispatch(loadListUsers());
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
  loadListUsers,
  createOrEdit,
  updateData,
  gotoPage,
  onSearch,
  onSizeChange,
  onSort,
  onDeleteItem,
  loadUsersDetail,
  uploadImageSign
};
