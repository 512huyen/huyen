import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Col, Row, Input, Select, Switch } from "antd";
import { connect } from "react-redux";
import actionSignPrivileges from "@actions/signPrivileges";
import snackbarUtils from "@utils/snackbar-utils";
import dateUtils from "mainam-react-native-date-utils";
import { AdminPage, Panel } from "@admin/components/admin";
function index(props) {
  const id = props.match.params.id;

  useEffect(() => {
    if (id)
      props.loadSignPrivilegesDetail(id).then(s => {
      }).catch(e => {
        props.history.replace("/admin/sign-privileges");
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
    props.history.push("/admin/sign-privileges");
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.createOrEdit().then(s => {
          props.history.push("/admin/sign-privileges");
        });
      }
    });
  };
  const { getFieldDecorator } = props.form;

  return (
    <AdminPage className="mgr-sign-privileges">
      <Panel
        title={id ? "Chỉnh sửa loại form" : "Thêm mới loại form"}
        id={"mgr-sign-privileges"}
        allowClose={false}
        allowCollapse={false}
      >
        <Form layout="vertical" hideRequiredMark onSubmit={handleSubmit}>
          <div className="row">
            <div className="col">
              <Form.Item label="Mã loại form">
                {getFieldDecorator("value", {
                  rules: [
                    {
                      required: true,
                      message: "Nhập mã loại form"
                    }
                  ],
                  initialValue: props.value
                })(
                  <Input
                    onChange={e => {
                      props.updateData({ value: e.target.value });
                    }}
                    placeholder="Nhập mã loại form"
                  />
                )}
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Form.Item label="Loại form">
                {getFieldDecorator("name", {
                  rules: [
                    {
                      required: true,
                      message: "Nhập loại form"
                    }
                  ],
                  initialValue: props.name
                })(
                  <Input
                    onChange={e => {
                      props.updateData({ name: e.target.value });
                    }}
                    placeholder="Nhập loại form"
                  />
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
      name: state.signPrivileges.name,
      id: state.signPrivileges.id,
      active: state.signPrivileges.active,
      value: state.signPrivileges.value,
    };
  },
  {
    updateData: actionSignPrivileges.updateData,
    loadSignPrivilegesDetail: actionSignPrivileges.loadSignPrivilegesDetail,
    createOrEdit: actionSignPrivileges.createOrEdit
  }
)(Form.create()(index));
