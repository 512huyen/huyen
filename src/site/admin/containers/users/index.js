import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Select, Tooltip, Modal, Input, Checkbox } from "antd";
import { connect } from "react-redux";
import actionUsers from "@actions/users";
import signPrivileges from "@actions/signPrivileges";
import dateUtils from "mainam-react-native-date-utils";
const { Option } = Select;
import Table from "@components/common/Table";
import SelectSize from "@components/common/SelectSize";
import Pagination from "@components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
import DataContants from '@config/data-contants';
import clientUtils from '../../../../utils/client-utils';
import './style.scss'
const initImage = {
  urlPreview: '',
  fileUpload: '',
  fileName: '',
};
function index(props) {
  const [uploadImage, setuploadImage] = useState(initImage);
  const [listPermission, setListPermission] = useState([]);
  const inputEl = useRef(null);
  const onSizeChange = size => {
    props.onSizeChange(size);
  };

  const onPageChange = page => {
    props.gotoPage(page);
  };

  useEffect(() => {
    props.onSearch("", "", -1);
    props.loadListSignPrivileges();
  }, []);

  let data = (props.data || []).map((item, index) => {
    return {
      key: index,
      col1: (props.page - 1) * props.size + index + 1,
      col2: item.name,
      col3: item.fullName,
      col4: item,
      col5: item,
      col6: item
    };
  });
  const onShowChangeSerialNumber = (data) => {
    props.updateData({
      ...data,
      openChangeSerialNumber: true
    });
  }
  const onShowChangePrivileges = (data) => {
    const listShow = props.dataSignPrivileges.reduce((finalList, item) => {
      if (item.active) {
        if (data.privileges && data.privileges.some(v => v.id === item.id)) {
          item.checkmark = true;
          finalList.push(item);
        } else {
          item.checkmark = false;
          finalList.push(item);
        }
      }
      return finalList;
    }, []);
    setListPermission(listShow)
    props.updateData({
      ...data,
      openChangePrivileges: true
    });
  }
  const handleListActive = id => () => {
    const refeshList = listPermission.reduce((listFinal, item) => {
      if (item.id === id) {
        item.checkmark = !item.checkmark;
      }
      listFinal.push(item);
      return listFinal;
    }, []);
    setListPermission(refeshList);
  };
  const handleUpdatePermission = () => {
    const listPermissionActive = listPermission.filter(item => {
      if (item.checkmark) {
        delete item.checkmark;
        return item;
      }
      return null;
    });
    props.createOrEdit(listPermissionActive, "privileges").then(s => {
      props.history.push("/users");
    })
  };
  const onShowSignImage = (data) => {
    props.updateData({
      ...data,
      openChangeSignImage: true,
      signImage: data.signImage,
      dataIndex: data
    });
  }
  const closeModal = () => {
    props.updateData({
      openChangeSerialNumber: false,
      openChangeSignImage: false,
      openChangePrivileges: false,
      signImage: ""
    });
  }
  const imgForShow = uploadImage.urlPreview || (props.signImage ? `${clientUtils.serverApi}/api/signer/v1/files/${props.signImage}` : '');
  const selectImage = e => {
    let fileUpload = '';
    let urlPreview = '';
    let fileName = '';
    urlPreview = URL.createObjectURL(e.target.files[0]);
    // eslint-disable-next-line prefer-destructuring
    fileUpload = e.target.files[0];
    fileName = fileUpload.name;
    setuploadImage({
      urlPreview,
      fileUpload,
      fileName,
    });
  };
  const onClickAddImage = e => {
    e.preventDefault();
    return inputEl.current.click();
  };
  const onUploadImage = e => {
    e.preventDefault();
    const { fileUpload } = uploadImage;
    if (fileUpload) {
      props.uploadImageSign({ file: fileUpload }).then(s => {
        if (s && s.code === 0 && s.data) {
          props.createOrEdit(s.data, "signImage").then(s => {
            props.history.push("/users");
          })
        }
      })
      setuploadImage(initImage);
    }
  };
  return (
    <>
      <AdminPage
        className="mgr-users"
        icon="subheader-icon fal fa-window"
        header="Quản lý phân quyền ký"
        subheader="Danh sách phân quyền ký"
      >
        <Panel
          id={"mgr-users"}
          allowClose={false}
          allowCollapse={false}
        >
          <Table
            scroll={{ x: 800, y: 500 }}
            style={{ marginLeft: -10, marginRight: -10 }}
            className="custom"
            columns={[
              {
                title: (
                  <div className="custome-header">
                    <div className="title-box">STT</div>
                    <div
                      className="addition-box"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#000"
                      }}
                    >
                      LỌC THEO
                  </div>
                  </div>
                ),
                width: 100,
                dataIndex: "col1",
                key: "col1"
              },
              {
                title: (
                  <div className="custome-header">
                    <div className="title-box">Tài khoản</div>
                    <div className="addition-box">
                      <div className="search-box">
                        <img src={require("@images/icon/ic-search.png")} />
                        <input
                          value={props.searchName}
                          onChange={e =>
                            props.onSearch(e.target.value, props.searchFullName)
                          }
                          placeholder="Tìm theo tài khoản"
                        />
                      </div>
                    </div>
                  </div>
                ),
                width: 200,
                dataIndex: "col2",
                key: "col2"
              },
              {
                title: (
                  <div className="custome-header">
                    <div className="title-box">Họ và tên</div>
                    <div className="addition-box">
                      {/* <div className="search-box">
                        <img src={require("@images/icon/ic-search.png")} />
                        <input
                          value={props.searchName}
                          onChange={e =>
                            props.onSearch(props.searchValue, e.target.value)
                          }
                          placeholder="Tìm theo họ và tên"
                        />
                      </div> */}
                    </div>
                  </div>
                ),
                width: 200,
                dataIndex: "col3",
                key: "col3",
              },
              {
                title: (
                  <div className="custome-header">
                    <div className="title-box">Chứng thư số</div>
                    <div className="addition-box"></div>
                  </div>
                ),
                width: 150,
                dataIndex: "col4",
                key: "col4",
                render: item => {
                  return (
                    <label href="#" className="change-serial-number" onClick={() => { onShowChangeSerialNumber(item) }}>
                      Chỉnh sửa
                    </label>
                  )
                }
              },
              {
                title: (
                  <div className="custome-header">
                    <div className="title-box">Quyền ký</div>
                    <div className="addition-box"></div>
                  </div>
                ),
                width: 400,
                dataIndex: "col5",
                key: "col5",
                render: item => {
                  return (
                    <div style={{ cursor: "pointer" }} onClick={() => onShowChangePrivileges(item)}>
                      <div className="detail">
                        <Button className="button-sign">+</Button>
                        {
                          item.privileges && item.privileges.length ? item.privileges.map((option, index) => {
                            return <span className="item" key={index}>{option.name}</span>
                          }) : null
                        }
                      </div>
                    </div>
                  )
                }
              },
              {
                title: (
                  <div className="custome-header">
                    <div className="title-box">Chữ ký mẫu</div>
                    <div className="addition-box"></div>
                  </div>
                ),
                width: 150,
                dataIndex: "col6",
                key: "col6",
                render: item => {
                  return (
                    <div style={{ cursor: "pointer" }}>
                      {item.signImage ?
                        <Checkbox
                          checked={true}
                          onClick={() => onShowSignImage(item)}
                        ><span style={{ color: "#E07D46", textDecoration: "underline", fontWeight: "bold" }}>Xem</span></Checkbox> :
                        <label href="#" className="change-serial-number" onClick={() => { onShowSignImage(item) }}>
                          Tải lên
                        </label>
                      }
                    </div>
                  )
                }
              },
            ]}
            dataSource={data}
          ></Table>
          <div className="footer">
            <SelectSize value={props.size} selectItem={onSizeChange} />
            <Pagination
              onPageChange={onPageChange}
              page={props.page}
              size={props.size}
              total={props.total}
              style={{ flex: 1, justifyContent: "flex-end" }}
            />
          </div>
        </Panel>
      </AdminPage>
      {
        props.openChangeSerialNumber ?
          <Modal
            width={500}
            title={"Chứng thư số"}
            visible={props.openChangeSerialNumber}
            cancelText={"Đóng"}
            onCancel={closeModal}
            footer={[
              <>
                {/* <Button onClick={onShowChangeSerialNumber} type="danger" key="back">Đóng</Button> */}
                <Button key="submit" type="primary" onClick={props.createOrEdit}>Lưu </Button>
              </>
            ]} >
            <Input
              placeholder="************"
              onChange={(event) => {
                props.updateData({
                  ...data,
                  serialNumber: event.target.value
                });
              }}
              type="password"
            />
          </Modal> : null
      }
      {
        props.openChangePrivileges ?
          <Modal
            width={650}
            title={"Quyền ký"}
            visible={props.openChangePrivileges}
            cancelText={"Đóng"}
            onCancel={closeModal}
            className="sign-image"
            footer={[
              <>
                {/* <Button onClick={onShowChangeSerialNumber} type="danger" key="back">Đóng</Button> */}
                <Button key="submit" type="primary" onClick={() => handleUpdatePermission()}>Lưu </Button>
              </>
            ]} >
            <div className="body-privileges row">
              {
                listPermission && listPermission.length ? listPermission.map((option, index) => {
                  return (
                    <div key={index} className="privileges-detail col-md-6">
                      <Checkbox
                        checked={option.checkmark}
                        onChange={handleListActive(option.id)}
                      ></Checkbox>
                      <span className="name">{option.name}</span>
                    </div>
                  )
                }) : null
              }
            </div>
          </Modal> : null
      }
      {
        props.openChangeSignImage ?
          <Modal
            width={520}
            title={"Chữ ký mẫu"}
            visible={props.openChangeSignImage}
            cancelText={"Đóng"}
            onCancel={closeModal}
            className="sign-image"
            footer={[
              <>
                <Button className="button-sign-image" onClick={onClickAddImage} >Tải lên</Button>
                <input
                  ref={inputEl}
                  onChange={selectImage}
                  type="file"
                  name="file"
                  id="file"
                  className="d-none"
                // accept="image/*"
                />
                <Button key="submit"
                  className="save-sign-image"
                  type="primary"
                  onClick={onUploadImage}>Lưu </Button>
              </>
            ]} >
            <div className="image-background">
              {imgForShow && <img src={imgForShow} alt="background" />}
            </div>
          </Modal> : null
      }
    </>
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      data: state.users.data || [],
      size: state.users.size || 10,
      page: state.users.page || 1,
      total: state.users.total || 0,
      signImage: state.users.signImage,
      searchName: state.users.searchName,
      searchValue: state.users.searchValue,
      dataSignPrivileges: state.signPrivileges.signPrivileges || [],
      openChangeSerialNumber: state.users.openChangeSerialNumber || false,
      openChangePrivileges: state.users.openChangePrivileges || false,
      openChangeSignImage: state.users.openChangeSignImage || false
    };
  },
  {
    updateData: actionUsers.updateData,
    onSizeChange: actionUsers.onSizeChange,
    gotoPage: actionUsers.gotoPage,
    onSearch: actionUsers.onSearch,
    loadListSignPrivileges: signPrivileges.loadListSignPrivileges,
    createOrEdit: actionUsers.createOrEdit,
    uploadImageSign: actionUsers.uploadImageSign
  }
)(index);
