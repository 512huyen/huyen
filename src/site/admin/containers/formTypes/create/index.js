import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Col, Row, Input, Select, Switch } from "antd";
import { connect } from "react-redux";
import actionFormTypes from "@actions/formTypes";
import snackbarUtils from "@utils/snackbar-utils";
import dateUtils from "mainam-react-native-date-utils";
import { AdminPage, Panel } from "@admin/components/admin";
function index(props) {
  const id = props.match.params.id;

  useEffect(() => {
    if (id)
      props.loadFormTypesDetail(id).then(s => {
      }).catch(e => {
        props.history.replace("/form-types");
      });
    else {
      props.updateData({
        id: null,
        name: "",
        active: true,
        value: "",
        description: ''
      });
    }
  }, []);

  const onClose = () => () => {
    props.history.push("/form-types");
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.createOrEdit().then(s => {
          props.history.push("/form-types");
        });
      }
    });
  };
  const { getFieldDecorator } = props.form;

  return (
    <AdminPage className="mgr-form-types">
      <Panel
        title={id ? "Chỉnh sửa loại form" : "Thêm mới loại form"}
        id={"mgr-form-types"}
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
              <Form.Item label="Ý nghĩa">
                {getFieldDecorator("description", {
                  initialValue: props.description
                })(
                  <Input
                    onChange={e => {
                      props.updateData({ description: e.target.value });
                    }}
                    placeholder="Nhập ý nghĩa"
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
      name: state.formTypes.name,
      id: state.formTypes.id,
      active: state.formTypes.active,
      value: state.formTypes.value,
      description: state.formTypes.description
    };
  },
  {
    updateData: actionFormTypes.updateData,
    loadFormTypesDetail: actionFormTypes.loadFormTypesDetail,
    createOrEdit: actionFormTypes.createOrEdit
  }
)(Form.create()(index));
