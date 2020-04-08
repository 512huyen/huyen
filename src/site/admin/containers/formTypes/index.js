import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Select, Tooltip } from "antd";
import { connect } from "react-redux";
import actionFormTypes from "@actions/formTypes";
import snackbarUtils from "@utils/snackbar-utils";
import dateUtils from "mainam-react-native-date-utils";
const { Option } = Select;
import Table from "@components/common/Table";
import Card from "@components/common/Card";
import SelectSize from "@components/common/SelectSize";
import Pagination from "@components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
function index(props) {
  const onSizeChange = size => {
    props.onSizeChange(size);
  };

  const onPageChange = page => {
    props.gotoPage(page);
  };

  useEffect(() => {
    props.onSearch("", "", -1);
  }, []);

  let data = (props.data || []).map((item, index) => {
    return {
      key: index,
      col1: (props.page - 1) * props.size + index + 1,
      col2: item.value,
      col3: item.name,
      col4: item.description,
      col5: item,
      col6: item
    };
  });

  const create = () => {
    props.updateData({
      id: null,
      active: true,
      name: "",
      value: "",
      description: ""
    });
    props.history.push("/form-types/create");
  };

  const editItem = item => () => {
    props.updateData({
      id: item.id,
      active: item.active,
      name: item.name,
      description: item.description,
      value: item.value
    });
    props.history.push("/form-types/edit/" + item.id);
  };

  const onDeleteItem = item => () => {
    props.onDeleteItem(item);
  };
  const onChangeStatus = item => () => {
    props.changeStatus(item)
  }
  return (
    <AdminPage
      className="mgr-form-types"
      icon="subheader-icon fal fa-window"
      header="Quản lý danh mục loại form"
      subheader="Danh sách danh mục loại form"
    >
      <Panel
        id={"mgr-form-types"}
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
                  <div className="title-box">Mã loại form</div>
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
                  <div className="title-box">Loại form</div>
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
                  <div className="title-box">Ý nghĩa</div>
                  <div className="addition-box"></div>
                </div>
              ),
              width: 300,
              dataIndex: "col4",
              key: "col4"
            },
            {
              title: (
                <div className="custome-header">
                  <div className="title-box">Có hiệu lực</div>
                  <div className="addition-box"></div>
                </div>
              ),
              width: 200,
              dataIndex: "col5",
              key: "col5",
              render: item => {
                if (item.active)
                  return (
                    <label href="#" style={{ cursor: 'pointer'}} className="badge badge-success" onClick={onChangeStatus(item)}>
                      Active
                    </label>
                  );
                return (
                  <label href="#" style={{ cursor: 'pointer'}} className="badge badge-danger" onClick={onChangeStatus(item)}>
                    InActive
                  </label>
                );
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
              width: 80,
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
              dataIndex: "col6",
              key: "col6"
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
      data: state.formTypes.data || [],
      size: state.formTypes.size || 10,
      page: state.formTypes.page || 1,
      total: state.formTypes.total || 0,
      searchName: state.formTypes.searchName,
      searchValue: state.formTypes.searchValue
    };
  },
  {
    updateData: actionFormTypes.updateData,
    onSizeChange: actionFormTypes.onSizeChange,
    gotoPage: actionFormTypes.gotoPage,
    onSearch: actionFormTypes.onSearch,
    onDeleteItem: actionFormTypes.onDeleteItem,
    changeStatus: actionFormTypes.changeStatus
  }
)(index);
