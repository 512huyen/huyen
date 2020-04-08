import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Select, Tooltip, Modal, Input, Checkbox } from "antd";
import { connect } from "react-redux";
import actionPatientHistories from "@actions/patientHistories";
import signPrivileges from "@actions/signPrivileges";
import dateUtils from "mainam-react-native-date-utils";
const { Option } = Select;
import Table from "@components/common/Table";
import SelectSize from "@components/common/SelectSize";
import Pagination from "@components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
import DataContants from '@config/data-contants';
import dataCacheProvider from '@data-access/datacache-provider';
import "./style.scss";
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
    props.onSearch("", "", "");
  }, []);

  let data = (props.data || []).map((item, index) => {
    return {
      key: index,
      col1: (props.page - 1) * props.size + index + 1,
      col2: item.patientDocument,
      col3: item.patientValue,
      col4: item.patientName,
      col5: item.birthdayStr,
      col6: DataContants.gender[item.gender],
      col7: item.address
    };
  });
  const onClickRow = (data) => {
    props.history.push("/patient-histories/" + data.col2);
  }
  return (
    <AdminPage
      className="mgr-patient-histories"
      icon="subheader-icon fal fa-window"
      header="Quản lý lịch sử ký"
      subheader="Danh sách lịch sử ký"
    >
      <Panel
        id={"mgr-patient-histories"}
        allowClose={false}
        allowCollapse={false}
      >
        <Table
          onRow={(record, rowIndex) => {
            return {
              onClick: event => { onClickRow(record) }
            };
          }}
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
                  <div className="title-box">Mã HS</div>
                  <div className="addition-box">
                    <div className="search-box">
                      <img src={require("@images/icon/ic-search.png")} />
                      <input
                        value={props.searchPatientDocument}
                        onChange={e =>
                          props.onSearch(e.target.value, props.searchPatientValue, props.searchPatientName)
                        }
                        placeholder="Tìm theo mã HS"
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
                  <div className="title-box">Mã người bệnh</div>
                  <div className="addition-box">
                    <div className="search-box">
                      <img src={require("@images/icon/ic-search.png")} />
                      <input
                        value={props.searchPatientValue}
                        onChange={e =>
                          props.onSearch(props.searchPatientDocument, e.target.value, props.searchPatientName)
                        }
                        placeholder="Tìm theo mã người bệnh"
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
                  <div className="title-box">Họ và tên</div>
                  <div className="addition-box">
                    <div className="search-box">
                      <img src={require("@images/icon/ic-search.png")} />
                      <input
                        value={props.searchPatientName}
                        onChange={e =>
                          props.onSearch(props.searchPatientDocument, props.searchPatientValue, e.target.value)
                        }
                        placeholder="Tìm theo họ và tên"
                      />
                    </div>
                  </div>
                </div>
              ),
              width: 200,
              dataIndex: "col4",
              key: "col4"
            },
            {
              title: (
                <div className="custome-header">
                  <div className="title-box">Tuổi</div>
                  <div className="addition-box"></div>
                </div>
              ),
              width: 200,
              dataIndex: "col5",
              key: "col5",
            },
            {
              title: (
                <div className="custome-header">
                  <div className="title-box">Giới tính</div>
                  <div className="addition-box"></div>
                </div>
              ),
              width: 100,
              dataIndex: "col6",
              key: "col6",
            },
            {
              title: (
                <div className="custome-header">
                  <div className="title-box">Địa chỉ</div>
                  <div className="addition-box"></div>
                </div>
              ),
              width: 250,
              dataIndex: "col7",
              key: "col7",
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
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      data: state.patientHistories.data || [],
      size: state.patientHistories.size || 10,
      page: state.patientHistories.page || 1,
      total: state.patientHistories.total || 0,
      searchPatientDocument: state.patientHistories.searchPatientDocument,
      searchPatientValue: state.patientHistories.searchPatientValue,
      searchPatientName: state.patientHistories.patientHistories,
    };
  },
  {
    updateData: actionPatientHistories.updateData,
    onSizeChange: actionPatientHistories.onSizeChange,
    gotoPage: actionPatientHistories.gotoPage,
    onSearch: actionPatientHistories.onSearch,
  }
)(index);
