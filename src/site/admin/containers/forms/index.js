import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Select, Tooltip } from "antd";
import { connect } from "react-redux";
import actionForms from "@actions/forms";
import signPrivileges from "@actions/signPrivileges";
import snackbarUtils from "@utils/snackbar-utils";
import dateUtils from "mainam-react-native-date-utils";
const { Option } = Select;
import Table from "@components/common/Table";
import Card from "@components/common/Card";
import SelectSize from "@components/common/SelectSize";
import Pagination from "@components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
import DataContants from '@config/data-contants';
import './style.scss'
function index(props) {
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
      col2: item.value,
      col3: item.name,
      col4: item,
      col5: item.signLevelTotal,
      col6: item,
      col7: item,
      col8: item,
      col9: item,
      col10: item,
    };
  });
  const handleRenderLevelPer = (data, key) => {
    const FinalComponent = (
      <div className="select-forms">
        <Select
          showSearch
          onChange={e => {
            props.updateData({
              ...data,
              [`signType${key}`]: e
            });
            props.createOrEdit().then(s => {
              props.history.push("/admin/forms");
            });
          }}
          value={data[`signType${key}`]}
          filterOption={(input, option) =>
            option.props.children
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
        >
          {DataContants.signPermission.map((item, index) => {
            return (
              <Option key={index} value={item.id}>
                {item.name}
              </Option>
            );
          })}
        </Select>
        <Select
          showSearch
          onChange={e => {
            props.updateData({
              [`signPrivilege${key}Id`]: e
            });
          }}
          value={data[`signPrivilege${key}Id`]}
          filterOption={(input, option) =>
            option.props.children
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
        >
          {props.dataSignPrivileges && props.dataSignPrivileges.length && props.dataSignPrivileges.map((item, index) => {
            return (
              <Option key={index} value={item.id}>
                {item.name}
              </Option>
            );
          })}
        </Select>
      </div>
    );
    if (key <= data.signLevelTotal) {
      return FinalComponent
    } else {
      return null;
    }
  };
  const create = () => {
    props.updateData({
      id: null,
      active: true,
      name: "",
      value: "",
      description: ""
    });
    props.history.push("/admin/forms/create");
  };

  const editItem = item => () => {
    props.updateData({
      id: item.id,
      active: item.active,
      name: item.name,
      description: item.description,
      value: item.value
    });
    props.history.push("/admin/forms/edit/" + item.id);
  };

  const onDeleteItem = item => () => {
    props.onDeleteItem(item);
  };
  const onChangeStatus = item => () => {
    props.changeStatus(item)
  }
  return (
    <AdminPage
      className="mgr-forms"
      icon="subheader-icon fal fa-window"
      header="Quản lý phân quyền biểu mẫu"
      subheader="Danh sách phân quyền biểu mẫu"
    >
      <Panel
        id={"mgr-forms"}
        allowClose={false}
        allowCollapse={false}
        toolbar={
          <div className="toolbar">
            <Button className="button" onClick={create}>
              Thêm mới
            </Button>
          </div>
        }
      >
        {/* <div className="body-header">
          <div className="toolbar">
            <Button className="button" onClick={create}>
              Thêm mới
            </Button>
          </div>
        </div> */}
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
                  <div className="title-box">Mã biểu mẫu</div>
                  <div className="addition-box">
                    <div className="search-box">
                      <img src={require("@images/icon/ic-search.png")} />
                      <input
                        value={props.searchValue}
                        onChange={e =>
                          props.onSearch(e.target.value, props.searchName)
                        }
                        placeholder="Tìm theo mã loại form"
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
                  <div className="title-box">Tên biểu mẫu</div>
                  <div className="addition-box">
                    <div className="search-box">
                      <img src={require("@images/icon/ic-search.png")} />
                      <input
                        value={props.searchName}
                        onChange={e =>
                          props.onSearch(props.searchValue, e.target.value)
                        }
                        placeholder="Tìm theo loại form"
                      />
                    </div>
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
                  <div className="title-box">Có hiệu lực</div>
                  <div className="addition-box"></div>
                </div>
              ),
              width: 200,
              dataIndex: "col4",
              key: "col4",
              render: item => {
                if (item.active)
                  return (
                    <label href="#" className="badge badge-success" onClick={onChangeStatus(item)}>
                      Active
                    </label>
                  );
                return (
                  <label href="#" className="badge badge-danger" onClick={onChangeStatus(item)}>
                    InActive
                  </label>
                );
              }
            },
            {
              title: (
                <div className="custome-header">
                  <div className="title-box">Số cấp kí</div>
                  <div className="addition-box"></div>
                </div>
              ),
              width: 200,
              dataIndex: "col5",
              key: "col5"
            },
            {
              title: (
                <div className="custome-header">
                  <div className="title-box">Quyền kí cấp 1</div>
                  <div className="addition-box"></div>
                </div>
              ),
              width: 200,
              dataIndex: "col6",
              key: "col6",
              render: item => {
                return (
                  <div>{handleRenderLevelPer(item, 1)}</div>
                )
              }
            },
            {
              title: (
                <div className="custome-header">
                  <div className="title-box">Quyền kí cấp 2</div>
                  <div className="addition-box"></div>
                </div>
              ),
              width: 200,
              dataIndex: "col7",
              key: "col7",
              render: item => {
                return (
                  <div>{handleRenderLevelPer(item, 2)}</div>
                )
              }
            },
            {
              title: (
                <div className="custome-header">
                  <div className="title-box">Quyền kí cấp 3</div>
                  <div className="addition-box"></div>
                </div>
              ),
              width: 200,
              dataIndex: "col8",
              key: "col8",
              render: item => {
                return (
                  <div>{handleRenderLevelPer(item, 3)}</div>
                )
              }
            },
            {
              title: (
                <div className="custome-header">
                  <div className="title-box">Quyền kí cấp 4</div>
                  <div className="addition-box"></div>
                </div>
              ),
              width: 200,
              dataIndex: "col9",
              key: "col9",
              render: item => {
                return (
                  <div>{handleRenderLevelPer(item, 4)}</div>
                )
              }
            },
            {
              title: (
                <div className="custome-header">
                  <div className="title-box"></div>
                  <div className="addition-box"></div>
                </div>
              ),
              key: "operation",
              fixed: "right",
              width: 100,
              render: item => {
                return (
                  <div className="col-action">
                    <Tooltip placement="topLeft" title={"Xóa"}>
                      <div>
                        <a
                          onClick={onDeleteItem(item)}
                          className="btn btn-info btn-icon waves-effect waves-themed"
                        >
                          <i className="fal fa-trash-alt"></i>
                        </a>
                      </div>
                    </Tooltip>
                    <Tooltip placement="topLeft" title={"Sửa"}>
                      <div>
                        <a
                          onClick={editItem(item)}
                          className="btn btn-info btn-icon waves-effect waves-themed"
                        >
                          <i className="fal fa-edit"></i>
                        </a>
                      </div>
                    </Tooltip>
                  </div>
                );
              },
              dataIndex: "col10",
              key: "col10"
            }
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
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      data: state.forms.data || [],
      size: state.forms.size || 10,
      page: state.forms.page || 1,
      total: state.forms.total || 0,
      searchName: state.forms.searchName,
      searchValue: state.forms.searchValue,
      dataSignPrivileges: state.signPrivileges.signPrivileges || []
    };
  },
  {
    updateData: actionForms.updateData,
    onSizeChange: actionForms.onSizeChange,
    gotoPage: actionForms.gotoPage,
    onSearch: actionForms.onSearch,
    onDeleteItem: actionForms.onDeleteItem,
    changeStatus: actionForms.changeStatus,
    loadListSignPrivileges: signPrivileges.loadListSignPrivileges,
    createOrEdit: actionForms.createOrEdit
  }
)(index);
