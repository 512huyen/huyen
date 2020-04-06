import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Col, Row, Input, Select, Switch } from "antd";
import { connect } from "react-redux";
import actionForms from "@actions/forms";
import snackbarUtils from "@utils/snackbar-utils";
import dateUtils from "mainam-react-native-date-utils";
import { AdminPage, Panel } from "@admin/components/admin";
import DataContants from '@config/data-contants';
function index(props) {
  const id = props.match.params.id;

  useEffect(() => {
    if (id)
      props.loadFormsDetail(id).then(s => {
      }).catch(e => {
        props.history.replace("/admin/forms");
      });
    else {
      props.updateData({
        id: null,
        name: "",
        active: true,
        value: "",
      });
    }
  }, []);

  const onClose = () => () => {
    props.history.push("/admin/forms");
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.createOrEdit().then(s => {
          props.history.push("/admin/forms");
        });
      }
    });
  };
  const { getFieldDecorator } = props.form;

  return (
    <AdminPage className="mgr-forms">
      <Panel
        title={id ? "Chỉnh sửa biểu mẫu" : "Thêm mới biểu mẫu"}
        id={"mgr-forms"}
        allowClose={false}
        allowCollapse={false}
      >
        <Form layout="vertical" hideRequiredMark onSubmit={handleSubmit}>
          <div className="row">
            <div className="col">
              <Form.Item label="Mã biểu mẫu">
                {getFieldDecorator("value", {
                  rules: [
                    {
                      required: true,
                      message: "Nhập mã biểu mẫu"
                    }
                  ],
                  initialValue: props.value
                })(
                  <Input
                    onChange={e => {
                      props.updateData({ value: e.target.value });
                    }}
                    placeholder="Nhập mã biểu mẫu"
                  />
                )}
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Form.Item label="biểu mẫu">
                {getFieldDecorator("name", {
                  rules: [
                    {
                      required: true,
                      message: "Nhập biểu mẫu"
                    }
                  ],
                  initialValue: props.name
                })(
                  <Input
                    onChange={e => {
                      props.updateData({ name: e.target.value });
                    }}
                    placeholder="Nhập biểu mẫu"
                  />
                )}
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Form.Item label="Số cấp ký">
                {getFieldDecorator("signLevelTotal", {
                  initialValue: props.signLevelTotal
                })(
                  <Select
                    showSearch
                    onChange={e => {
                      props.updateData({
                        signLevelTotal: e
                      });
                    }}
                    value={props.signLevelTotal}
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {DataContants.signLevelTotal.map((item, index) => {
                      return (
                        <Option key={index} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Form.Item label="Kích hoạt">
                <Switch
                  checked={props.active ? true : false}
                  onChange={e => {
                    props.updateData({
                      active: e
                    });
                  }}
                />
              </Form.Item>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              borderTop: "1px solid #e9e9e9",
              padding: "16px 16px 0px",
              background: "#fff",
              textAlign: "right"
            }}
          >
            <Button onClick={onClose(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              {id ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </div>
        </Form>
      </Panel>
    </AdminPage>
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      name: state.forms.name,
      id: state.forms.id,
      active: state.forms.active,
      value: state.forms.value,
      signLevelTotal: state.forms.signLevelTotal
    };
  },
  {
    updateData: actionForms.updateData,
    loadFormsDetail: actionForms.loadFormsDetail,
    createOrEdit: actionForms.createOrEdit
  }
)(Form.create()(index));
